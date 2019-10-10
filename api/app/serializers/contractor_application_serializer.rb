class ContractorApplicationSerializer
  include FastJsonapi::ObjectSerializer

  attribute :consent_given do |user|
    user.contractor_data_consent_given_at.present?
  end
  attributes :pending_broadcaster_application,
    :pending_developer_application,
    :pending_affiliate_application,
    :full_name,
    :birthdate,
    :address_line1,
    :address_line2,
    :address_line3,
    :business_name,
    :business_entity_type
  attribute :business_identification_number do |app|
    if app.business_identification_number.present?
      business_identification_number =
        ('*' * (app.business_identification_number.length - 2)) + app.business_identification_number.last(2)
      business_identification_number
    else
      nil
    end
  end
  attributes :payout_method,
    :bitcoin_address,
    # :bank_account_number,
    # :bank_routing_number,
    :subject_to_backup_withholding
end
