class ContractorApplication < ApplicationRecord

  belongs_to :user

  # Virtual attributes
  attribute :consent_given, type: :boolean
  attribute :pending_application_override, type: :boolean
  # Encrypt these attributes with symmetric-encryption gem
  attribute :full_name, :encrypted, type: :string
  attribute :birthdate, :encrypted, type: :datetime
  attribute :address_line1, :encrypted, type: :string
  attribute :address_line2, :encrypted, type: :string
  attribute :address_line3, :encrypted, type: :string
  attribute :business_name, :encrypted, type: :string
  attribute :business_entity_type, :encrypted, type: :string
  attribute :business_identification_number, :encrypted, type: :string
  attribute :bitcoin_address, :encrypted, type: :string
  attribute :bank_account_number, :encrypted, type: :string
  attribute :bank_routing_number, :encrypted, type: :string
  attribute :subject_to_backup_withholding, :encrypted, type: :boolean

  # Validations
  # If user has a pending application, do not let them modify the record
  validate :no_pending_application
  validate :consent_was_given
  with_options if: :submitted_application? do |app|
    app.validates :full_name, presence: true
    app.validates :business_name, presence: true,
      if: Proc.new { |u| u.business_entity_type.present? }
    app.validates :business_entity_type, presence: true,
      if: Proc.new { |u| u.business_name.present? }
    app.validates :birthdate, presence: true
    app.validates :payout_method, presence: true
    app.validates :bitcoin_address, presence: true,
      if: Proc.new { |u| if u.payout_method
        u.payout_method.include?('bitcoin')
      end }
    app.validates :address_line1, presence: true
    app.validate :address_line3_is_valid
    with_options if: :located_in_united_states? do |us_app|
      us_app.validate :business_identification_number_is_valid
      us_app.validate :subject_to_backup_withholding_is_selected
    end
    with_options if: :submitted_broadcaster_application? do |broadcaster_app|
      broadcaster_app.validate :has_uploaded_verification?
    end
  end
  validates :broadcaster_percentage, numericality:
    { greater_than_or_equal_to: 0, less_than_or_equal_to: 100, only_integer: true }
  validates :developer_percentage, numericality:
    { greater_than_or_equal_to: 0, less_than_or_equal_to: 100, only_integer: true }

  before_create :timestamp_contractor_data_consent

  after_commit :auto_approve_developer_or_affiliate

  ## Functions
  
  def auto_approve_developer_or_affiliate
    if pending_developer_application || pending_affiliate_application
      if pending_developer_application
        self.pending_developer_application = false
        self.user.make_developer
      end
      if pending_affiliate_application
        self.pending_affiliate_application = false
        self.user.make_affiliate
      end
      self.pending_application_override = true
      self.user.save!
      self.save!
    end
  end

  def consent_was_given
    unless consent_given
      errors.add(:base, "You must give consent for Saber to process your data")
    end
  end

  def timestamp_contractor_data_consent
    self.contractor_data_consent_given_at = DateTime.now
  end

  def submitted_application?
    p "did user submit an application?"
    # Return a boolean if at least one application is pending
    pending_broadcaster_application == true || pending_developer_application == true || pending_affiliate_application == true
  end

  def submitted_broadcaster_application?
    p "did user submit a broadcaster application? " + (pending_broadcaster_application == true && pending_broadcaster_application_changed?).to_s
    pending_broadcaster_application_changed? && pending_broadcaster_application == true
  end

  def no_pending_application
    p "no_pending_application"
    if self.pending_application_override != true
      if pending_broadcaster_application_in_database ||
        pending_developer_application_in_database ||
        pending_affiliate_application_in_database
          p self.changed_attributes
          errors.add(:base, "Sorry, you can't modify your application while it is pending approval. Contact us below if there is an issue.")
      end
    end
  end

  def address_line3_is_valid
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
    if user.user_verification_uploads.count < 1
      errors.add(:base, :verification_missing,
        message: "You must upload both verification images")
    elsif user.user_verification_uploads.count < 2
      errors.add(:base, :verification_missing,
        message: "You must upload the second verification image")
    end
  end

  def located_in_united_states?
    if address_line3
      address_line3.downcase.include?('united states')
    end
  end

  def business_identification_number_is_valid
    if business_identification_number.blank?
      errors.add(:base, :business_identification_number,
        message: "Your SSN, EIN, or ITIN is required for tax reporting purposes if you live in the United States")
    elsif business_identification_number.length < 8
      errors.add(:base, :business_identification_number,
        message: "Please enter a valid SSN, EIN, or ITIN, including dashes")
    end
    if business_identification_number && business_identification_number.include?('***')
      p "found obfuscated BIN, reverting to original value"
      self.business_identification_number = business_identification_number_in_database
    end
  end

  def subject_to_backup_withholding_is_selected
    unless subject_to_backup_withholding.in? [true, false]
      errors.add(:base, :subject_to_backup_withholding,
        message: "You must select whether or not you are subject to backup withholding")
    end
  end

end
