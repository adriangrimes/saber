class ContractorApplicationSerializer
  include FastJsonapi::ObjectSerializer

  attribute :consent_to_store_data do |user|
    user.contractor_data_consent_given_at.present?
  end
  attributes :pending_broadcaster_application,
    :pending_developer_application,
    :pending_affiliate_application,
    :full_name,
    :birthdate,
    :street_address,
    :city,
    :region,
    :postal_code,
    :country,
    :business_name,
    :business_entity_type
    :business_entity_type_other
  attribute :business_identification_number do |app|
    if app.business_identification_number.present?
      if app.business_identification_number.length >= 2
        business_identification_number =
          ('*' * (app.business_identification_number.length - 2)) +
            app.business_identification_number.last(2)
        business_identification_number
      else
        business_identification_number
      end
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
