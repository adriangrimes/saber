class User < ApplicationRecord
  #acts_as_token_authenticatable

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
  # ID files uploaded for verification
  has_many_attached :uploaded_identification

  validates :username, :uniqueness => { :case_sensitive => false },
    format: { with: /^[a-zA-Z0-9_]*$/, :multiline => true },
    length: { minimum: 3, maximum: 26 }
  validates :full_name, presence: true, if: :is_contractor?

  #validates_associated :user_public_datum
  before_save :ensure_online_status
  before_save :ensure_authentication_token

  # Used as a virtual attribute for find_for_database_authentication
  def login
    @login || self.username || self.email
  end

  def ensure_online_status
    if self.broadcaster == true
      self.user_public_datum.online_status = [true, false, false, false].sample
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

end
