class UserSerializer < ActiveModel::Serializer

  attributes :id,

  ## Database authenticatable
  :username,
  :email,
  :encrypted_password,
  :authentication_token,
  :account_status,
  :admin_status,
  :stream_key,
  :security_questions,

  ## Account type (Account settings?)
  :broadcaster,
  :developer,
  :affiliate,
  :allow_tips,
  :allow_suggested_games,

  ## Profile
  :full_name,
  :birthdate,
  :address_line1,
  :address_line2,
  :address_line3,
  :timezone,

  ## Payment
  :business_name,
  :business_entity_type,
  :payout_method,
  :bitcoin_address,
  :bank_account_number,
  :bank_routing_number,
  :subject_to_backup_withholding,

  ## Site settings
  :dark_mode,
  :send_email_favorites_online,
  :send_email_site_news,
  :private_message_email_notifications,

  ## Public profile
  :user_custom_tags,
  :profile_photo_id,
  :profile_sex,
  :profile_about_me,
  :profile_age,
  :profile_location,
  :profile_languages
  #:profile_platforms
end
