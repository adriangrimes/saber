class ContractorApplication < ApplicationRecord

  belongs_to :user

  # Virtual attributes
  attribute :consent_to_store_data, type: :boolean
  attribute :pending_application_override, type: :boolean
  # Encrypt these attributes with symmetric-encryption gem
  attribute :full_name, :encrypted, type: :string
  attribute :birthdate, :encrypted, type: :datetime
  attribute :street_address, :encrypted, type: :string
  attribute :city, :encrypted, type: :string
  attribute :region, :encrypted, type: :string
  attribute :postal_code, :encrypted, type: :string
  attribute :country, :encrypted, type: :string
  attribute :business_name, :encrypted, type: :string
  attribute :business_entity_type, :encrypted, type: :string
  attribute :business_entity_type_other, :encrypted, type: :string
  attribute :business_identification_number, :encrypted, type: :string
  attribute :bitcoin_address, :encrypted, type: :string
  attribute :bank_account_number, :encrypted, type: :string
  attribute :bank_routing_number, :encrypted, type: :string
  attribute :subject_to_backup_withholding, :encrypted, type: :boolean

  # Validations
  # If user has a pending application, do not let them modify the record
  validate :no_pending_application
  validates :consent_to_store_data, :inclusion => { :in => [ true ],
    :message => "must be given to apply" }

  with_options if: :submitted_application? do |app|
    # app.validate :not_already_contractor_for_application
    app.validates :full_name, presence: true
    app.validates :business_name, presence: true,
      if: Proc.new { |u| u.business_entity_type.present? }
    app.validates :business_entity_type, presence: true,
      if: Proc.new { |u| u.business_name.present? }
    app.validates :business_entity_type_other, presence: true,
      if: Proc.new { |u|
        u.business_name.present? &&
        u.business_entity_type&.downcase&.include?('other') }
    app.validates :birthdate, presence: true
    app.validates :payout_method, presence: true
    app.validates :bitcoin_address, presence: true,
      if: Proc.new { |u| u.payout_method&.include?('bitcoin') }
    app.validates :street_address, presence: true
    app.validates :city, presence: true
    app.validates :region, presence: true
    app.validates :postal_code, presence: true
    app.validates :country, presence: true

    with_options if: :located_in_united_states? do |usa_app|
      usa_app.validate :business_identification_number_is_valid
      usa_app.validate :subject_to_backup_withholding_is_selected
    end

    with_options if: :submitted_broadcaster_application? do |broadcaster_app|
      broadcaster_app.validate :check_for_verification_uploads
    end
  end
  validates :broadcaster_percentage, numericality:
    { greater_than_or_equal_to: 0, less_than_or_equal_to: 100, only_integer: true }
  validates :developer_percentage, numericality:
    { greater_than_or_equal_to: 0, less_than_or_equal_to: 100, only_integer: true }

  before_create :timestamp_contractor_data_consent

  after_commit :auto_approve_developer_or_affiliate
  after_commit :send_broadcaster_application_emails,
    if: Proc.new { |u| u.pending_broadcaster_application }

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

  def timestamp_contractor_data_consent
    self.contractor_data_consent_given_at = DateTime.now
  end

  def submitted_application?
    p "did user submit an application?"
    # Return a boolean if at least one application is pending
    p pending_broadcaster_application == true || pending_developer_application == true || pending_affiliate_application == true
    pending_broadcaster_application == true || pending_developer_application == true || pending_affiliate_application == true
  end

  def submitted_broadcaster_application?
    p "did user submit a broadcaster application? " + (pending_broadcaster_application == true && pending_broadcaster_application_changed?).to_s
    pending_broadcaster_application_changed? && pending_broadcaster_application == true
  end

  def not_already_contractor_for_application
    if pending_broadcaster_application && self.user.broadcaster
      errors.add(:base, "You are already a broadcaster!")
    end
    if pending_developer_application && self.user.developer
      errors.add(:base, "You are already a developer!")
    end
    if pending_affiliate_application && self.user.affiliate
      errors.add(:base, "You are already an affiliate!")
    end
  end

  # Send a notification email to the user letting them know we got their
  # application
  def send_broadcaster_application_emails
    UserMailer
      .with(user: self.user)
      .broadcaster_application_submitted
      .deliver_later
    # Send us a notification to actually review it
    AdminMailer
      .with(user: self.user)
      .broadcaster_application_waiting_for_review
      .deliver_later
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

  def check_for_verification_uploads
    if user.user_verification_uploads.count < 1
      errors.add(:base, :verification_missing,
        message: "images must be provided")
    elsif user.user_verification_uploads.count < 2
      errors.add(:verification,
        message: "image two must be provided")
    end
  end

  def located_in_united_states?
    country&.downcase&.include?('united states')
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
      errors.add(:subject_to_backup_withholding,
        message: "must be determined")
    end
  end

end
