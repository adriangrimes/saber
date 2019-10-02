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

  # Attributes that should be encrypted with gem symmetric-encryption
  attribute :security_questions, :encrypted, compress: true, type: :string
  attribute :private_user_notes, :encrypted, compress: true, type: :string
  attribute :full_name, :encrypted, compress: true, type: :string
  attribute :birthdate, :encrypted, type: :date
  attribute :address_line1, :encrypted, compress: true, type: :string
  attribute :address_line2, :encrypted, compress: true, type: :string
  attribute :address_line3, :encrypted, compress: true, type: :string
  attribute :business_name, :encrypted, compress: true, type: :string
  attribute :business_entity_type, :encrypted, compress: true, type: :string
  attribute :bitcoin_address, :encrypted, type: :string
  attribute :bank_account_number, :encrypted, type: :string
  attribute :bank_routing_number, :encrypted, type: :string

  # Public profile data
  has_one :user_public_datum, dependent: :destroy # , autosave: true
  # Set verification uploads to dependent: :delete_all, which will remove them from
  # the database, but keep Shrine from deleting them off disk
  has_many :user_verification_uploads, dependent: :delete_all
  has_many :credit_purchases
  has_many :credit_transfers
  has_many :private_messages #TODO , dependent: :destroy ?

  validates :user_public_datum, :presence => true
  #validates_associated :user_public_datum
  validates :username,
    :uniqueness => { :case_sensitive => false },
    format: { with: /^[a-zA-Z0-9_]*$/, :multiline => true },
    length: { minimum: 3, maximum: 26 }
  validate :username_passes_misc_rules?
  validates :full_name, presence: true, if: :is_contractor?
  validates :broadcaster_percentage, numericality:
    { less_than_or_equal_to: 100, only_integer: true }
  validates :developer_percentage, numericality:
    { less_than_or_equal_to: 100, only_integer: true }

  with_options if: :submitted_broadcaster_application? do |user_object|
    user_object.validates :full_name, presence: true
    user_object.validates :business_name, presence: true,
      if: Proc.new { |u| u.business_entity_type.present? }
    user_object.validates :birthdate, presence: true
    user_object.validates :payout_method, presence: true
    user_object.validates :bitcoin_address, presence: true,
      if: Proc.new { |u| u.payout_method == 'bitcoin' }
    user_object.validates :address_line1, presence: true
    user_object.validate :address_is_valid?
    user_object.validate :has_uploaded_verification?
  end

  # If user has pending application, do not let them modify any of the application
  # attributes
  validate :has_pending_application?

  before_save :ensure_authentication_token
  before_save :ensure_stream_key, if: Proc.new { |u| u.broadcaster }
  before_save :regenerate_authentication_token, if: :encrypted_password_changed?
  before_save :send_drop_stream, if: :stream_key_changed?

  # Used as a virtual attribute for find_for_database_authentication
  attr_writer :login

  # Used as a virtual attribute for find_for_database_authentication
  def login
    @login || self.username || self.email
  end

  def submitted_broadcaster_application?
    p "broadcaster_state_should_change?"
    pending_application == true && pending_application_changed? == true
  end

  def has_pending_application?
    p "has_pending_application?"
    if pending_application == false && pending_application_changed? == true
      errors.add(:pending_application, "can not be changed once submitted")
    end
    if pending_application == true && pending_application_changed? == false
      if (full_name_changed? ||
        business_name_changed? ||
        business_entity_type_changed? ||
        birthdate_changed? ||
        payout_method_changed? ||
        bitcoin_address_changed? ||
        address_line1_changed? ||
        address_line3_changed?)
          errors.add(:base, "Sorry, you can't modify your application details after you have submitted your application. Please contact us if there is an issue.")
      end
    end
  end

  def is_contractor?
    if broadcaster == true ||
    developer == true ||
    affiliate == true
      return true
    else
      return false
    end
  end

  def address_is_valid?
    if address_line3.present?
      addresses = address_line3.split('|')
      if addresses[0].blank?
        errors.add(:base, :address_city,
          message: "City is required")
      end
      if addresses[1].blank?
        errors.add(:base, :address_region,
          message: "State / Province / Region is required")
      end
      if addresses[2].blank?
        errors.add(:base, :address_postal_code,
          message: "Zip / Postal Code is required")
      end
      if addresses[3].blank?
        errors.add(:base, :address_country,
          message: "Country is required")
      end
    else
      errors.add(:base, :address,
        message: "Your full address is required")
    end
  end

  def has_uploaded_verification?
    if user_verification_uploads.count < 1
      errors.add(:base, :verification_missing,
        message: "You must upload both verification images")
    elsif user_verification_uploads.count < 2
      errors.add(:base, :verification_missing,
        message: "You must upload the second verification image")
    end
  end

  def username_passes_misc_rules?
    if username.start_with?('_')
      errors.add(:username, :invalid)
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

  def ensure_stream_key
    if stream_key.blank?
      self.stream_key = generate_stream_key
    end
  end

  def ensure_authentication_token
    if authentication_token.blank?
      authentication_token = generate_authentication_token
    end
  end

  def self.find_for_database_authentication(warden_conditions)
    puts "====find login from passed params start======"
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      puts "=====find login from passed params if====="
      # TODO: MySQL users: the use of the SQL lower function below is most
      # likely unnecessary and will cause any index on the email column to be ignored.
      where(conditions.to_h)
        .where(["lower(username) = :value OR lower(email) = :value",
          { :value => login.downcase }])
        .first
    end
  end

  # Overrides Devise User Mail function send_devise_notification.
  # Delivers User registration email async instead of blocking all other requests
  def send_devise_notification(notification, *args)
    devise_mailer.send(notification, self, *args).deliver_later
  end

  def send_drop_stream
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

    def generate_stream_key
      p "generating stream_key"
      possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
      loop do
        key = ""
        64.times do |i|
          key += possible[(rand() * possible.length).floor];
        end
        break key unless User.where(stream_key: key).first
      end
    end
end
