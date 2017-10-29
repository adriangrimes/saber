class User < ApplicationRecord
  acts_as_token_authenticatable

  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :trackable, :validatable,
         :confirmable, :lockable

  has_one :user_pref, dependent: :destroy

  attr_accessor :login
  #attr_accessor :password_confirmation
  validates :username, presence: true, :uniqueness => { :case_sensitive => false }
  validates_format_of :username, with: /^[a-zA-Z0-9_]*$/, :multiline => true
  validate :validate_username
  validates :email, presence: true #, :uniqueness => { :case_sensitive => false }
  validates :password, presence: true #, confirmation: true

  before_save :ensure_authentication_token

  def login=(login)
    @login = login
  end

  def login
    @login || self.username || self.email
  end

  def validate_username
    if User.where(email: username).exists?
      errors.add(:username, :invalid)
    end
  end

  def ensure_authentication_token
    if authentication_token.blank?
      self.authentication_token = generate_authentication_token
    end
  end

  def self.find_for_database_authentication(warden_conditions)
    puts "====find_for start======"
    conditions = warden_conditions.dup
    if login = conditions.delete(:login)
      puts "====find_for login conditions delete======"
      where(conditions.to_h).where(["lower(username) = :value OR lower(email) = :value", { :value => login.downcase }]).first
    end
  end

  private

    def generate_authentication_token
      loop do
        token = Devise.friendly_token
        break token unless User.where(authentication_token: token).first
      end
    end

end
