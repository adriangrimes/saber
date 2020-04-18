# Be sure to restart your server when you modify this file.

# Configure sensitive parameters which will be filtered from the log file.
Rails.application.config.filter_parameters += [
  :password,
  :session, :warden, :secret, :salt, :cookie, :csrf,
  :private_user_notes,
  :security_questions,
  :upload_data,
  :full_name,
  :birthdate,
  :street_address,
  :city,
  :region,
  :postal_code,
  :country,
  :business_name,
  :business_entity_type,
  :business_entity_type_other,
  :business_identification_number,
  :bitcoin_address,
  :bank_account_number,
  :bank_routing_number
]
