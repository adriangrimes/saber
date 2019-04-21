class UserSerializer < ActiveModel::Serializer

  has_one :user_public_datum

  attributes :id,

  ## Database authenticatable
  :username,
  :email,
  #:encrypted_password,
  #:authentication_token,

  ## Account data
  :broadcaster,
  :developer,
  :affiliate,
  #:account_status,
  #:admin_status,
  :security_questions,
  :stream_key,

  ## Site settings
  :dark_mode,
  :send_email_favorites_online,
  :send_email_site_news,
  :private_message_email_notifications,

  ## Payment profile (TODO most of these are probably not safe in terms of user security)
  :full_name,
  :birthdate,
  :address_line1,
  :address_line2,
  :address_line3,
  :business_name,
  :business_entity_type,
  :payout_method,
  :bitcoin_address,
  :bank_account_number,
  :bank_routing_number,
  :subject_to_backup_withholding
end
