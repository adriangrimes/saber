# Be sure to restart your server when you modify this file.

# Configure sensitive parameters which will be filtered from the log file.
Rails.application.config.filter_parameters += [
  :password,
  :private_user_notes,
  :security_questions,
  :upload_data,
  :full_name,
  :birthdate,
  :address_line1,
  :address_line2,
  :address_line3,
  :business_name,
  :business_entity_type,
  :business_identification_number,
  :bitcoin_address,
  :bank_account_number,
  :bank_routing_number
]
