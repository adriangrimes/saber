class User < ApplicationRecord

  devise :database_authenticatable,
    :registerable,
    :recoverable,
    :rememberable,
    #:trackable, # Workaround in sessions controller until Devise 5.0 is released
    :validatable, # Handles email and password validation
    :confirmable,
    :lockable

  # Used as a virtual attribute for find_for_database_authentication
  attr_writer :login

  # Public profile data
  has_one :user_public_datum, dependent: :delete#, autosave: true
    validates :user_public_datum, :presence => true
  has_many :credit_purchases
  has_many :credit_transfers
  # ID files uploaded for verification
  has_many_attached :uploaded_identification

  validates :username, :uniqueness => { :case_sensitive => false },
    format: { with: /^[a-zA-Z0-9_]*$/, :multiline => true },
    length: { minimum: 3, maximum: 26 }
  validate :username_passes_misc_rules?
  validates :full_name, presence: true, if: :is_contractor?
  validates :broadcaster_percentage, numericality: { less_than_or_equal_to: 100,  only_integer: true }
  validates :developer_percentage, numericality: { less_than_or_equal_to: 100,  only_integer: true }

  #validates_associated :user_public_datum
  before_save :ensure_online_status
  before_save :ensure_authentication_token
  before_save :regenerate_authentication_token, if: :encrypted_password_changed?

  # Used as a virtual attribute for find_for_database_authentication
  def login
    @login || self.username || self.email
  end

  def ensure_online_status
    # Only ensure status if broadcaster
    if self.broadcaster == true
      # If current online_status is not true or false, set to false
      if self.user_public_datum.online_status != false &&
        self.user_public_datum.online_status != true
          self.user_public_datum.online_status = false
      end
    end
  end

  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
    end
  end

  def self.find_for_database_authentication(warden_conditions)
    puts "====find login from passed params start======"
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      puts "=====find login from passed params if====="
      # TODO: MySQL users: the use of the SQL lower function below is most
      # likely unnecessary and will cause any index on the email column to be ignored.
      where(conditions.to_h).where(["lower(username) = :value OR lower(email) = :value",
        { :value => login.downcase }]).first
    end
  end

  def is_contractor?
    if self.broadcaster == true ||
      self.developer == true ||
      self.affiliate == true
        return true
    else
        return false
    end
  end

  def username_passes_misc_rules?
    if self.username.start_with?('_')
      errors.add(:username, :invalid)
    end
  end

  # Block authentication if account is pending deletion
  def active_for_authentication?
    super && !self.suspended_account
  end

  # Send an error message explaining why they are blocked from authenticating
  # See devise.en.yml to modify the messages
  def inactive_message
    # In order of priority
    if self.pending_deletion
      :pending_deletion
    elsif self.suspended_account
      :suspended
    else
      super
    end
  end

  # Overrides Devise User Mail function send_devise_notification.
  # Delivers User registration email async instead of blocking all other requests
  def send_devise_notification(notification, *args)
    devise_mailer.send(notification, self, *args).deliver_later
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
