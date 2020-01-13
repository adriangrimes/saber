class User < ApplicationRecord
  require "uri"
  require "net/http"
  include StreamKey

  devise :database_authenticatable,
         :registerable,
         :recoverable,
         :rememberable,
         #:trackable, # Workaround in sessions controller until Devise 5.0 is released
         :validatable, # Handles email and password validation
         :confirmable,
         :lockable

  # Public profile data
  has_one :user_public_datum #, autosave: true
  has_one :contractor_application
  # Set user_verification_uploads to dependent: :delete_all, which will remove them
  # from the database, but keep Shrine from deleting them off disk
  has_many :user_verification_uploads, dependent: :delete_all
  has_many :credit_purchases
  has_many :credit_transfers
  has_many :private_messages

  # Attributes that will be encrypted with symmetric-encryption gem
  attribute :security_questions, :encrypted, compress: true, type: :string
  attribute :private_user_notes, :encrypted, compress: true, type: :string

  attribute :is_being_seeded, type: :boolean

  validates :user_public_datum, :presence => true
  #validates_associated :user_public_datum
  validates :username,
    :uniqueness => { :case_sensitive => false },
    format: { with: /\A[a-zA-Z0-9_]*\z/, :multiline => true },
    length: { minimum: 3, maximum: 26 }
  validate :username_passes_misc_rules?
  # Email and password are validated by devise
  validates :private_user_notes, length: { maximum: 60000 }

  before_save :ensure_authentication_token
  before_save :ensure_stream_key, if: Proc.new { |u| u.broadcaster }
  before_save :regenerate_authentication_token, if: :encrypted_password_changed?
  before_save :send_drop_stream, if: :stream_key_changed?
  before_save :generate_stream_key, if: :stream_key_changed?
  before_save :suspend_account, if: :pending_deletion_since_changed?

  after_commit :update_public_data_record

  # Used as a virtual attribute for find_for_database_authentication
  attr_writer :login
  def login
    @login || self.username || self.email
  end

  def username_passes_misc_rules?
    if username.start_with?('_')
      errors.add(:username, :invalid)
    end
  end

  def update_public_data_record
    p "after commit"
    p broadcaster
    if broadcaster_in_database
      user_public_datum = self.user_public_datum
      if user_public_datum.broadcaster != self.broadcaster
        p "updating public record to reflect user broadcaster change"
        user_public_datum.update_attributes(:broadcaster => self.broadcaster)
      end
    end
  end

  # Send an error message explaining why they are blocked from authenticating
  # See devise.en.yml to modify the messages
  def inactive_message
    # In order of priority
    if pending_deletion_since
      :pending_deletion
    elsif suspended_account
      :suspended
    else
      super
    end
  end

  # Block authentication if account is pending deletion
  def active_for_authentication?
    super && !suspended_account
  end

  def generate_stream_key
    p "generating stream_key"
    self.stream_key = StreamKey.generate
  end

  def ensure_stream_key
    if stream_key.blank?
      self.stream_key = StreamKey.generate
    end
  end

  def ensure_authentication_token
    if authentication_token.blank?
      authentication_token = generate_authentication_token
    end
  end

  def self.find_for_database_authentication(warden_conditions)
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      where(conditions.to_hash).where(["username = :value OR email = :value", { :value => login.downcase }]).first
    elsif conditions.has_key?(:username) || conditions.has_key?(:email)
      where(conditions.to_hash).first
    end
  end

  # Overrides Devise User Mail function send_devise_notification.
  # Delivers User registration email async instead of blocking all other requests
  def send_devise_notification(notification, *args)
    devise_mailer.send(notification, self, *args).deliver_later
  end

  def send_drop_stream
    unless self.is_being_seeded || Rails.env.development?
      puts stream_key_was
      puts 'dropping stream'
      params = {
        'app' => 'stream',
        'name' => stream_key_was
      }
      x = Net::HTTP.post_form(
        URI.parse(
          Rails.configuration.x.saber.stream_rtmp_control_url
        ),
        params
      )
      puts x.body
    end
  end

  def suspend_account
    # Suspend account if user submitted an account deletion request (by submitting
    # a datetime in the pending_deletion_since attribute)
    if pending_deletion_since
      p "Suspending account and resetting authentication token"
      # Overwrite the value sent by the client with our server time
      self.pending_deletion_since = DateTime.now
      self.suspended_account = true
      regenerate_authentication_token
    end
  end

  def make_broadcaster
    self.broadcaster = true
    self.affiliate = true
  end

  def make_developer
    self.developer = true
    self.affiliate = true
  end

  def make_affiliate
    self.affiliate = true
  end

  private

    # Loop ensures in the unlikely event a token is generated that matches
    # another user, it will continue generating until a unique one is found
    def generate_authentication_token
      loop do
        token = Devise.friendly_token
        break token unless User.where(authentication_token: token).first
      end
    end

    def regenerate_authentication_token
      self.authentication_token = generate_authentication_token
    end
end
