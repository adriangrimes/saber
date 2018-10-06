class UserSerializer < ActiveModel::Serializer

  attributes :id,

    ## Database authenticatable
    :username,
    :email,
    :account_status,
    :admin_status,
    :stream_key,

    ## Account type
    :broadcaster,
    :developer,
    :affiliate,

    ## Profile
    :full_name,
    :birthdate,
    :address_line1,
    :address_line2,
    :address_line3,
    :timezone,
    :business_name,
    :business_entity_type,
    :subject_to_backup_withholding,

    ## Site settings
    :dark_mode,
    :send_email_favorites_online,
    :send_email_site_news,
    :private_message_email_notifications,

    ## Public profile
    :profile_photo_id,
    :profile_sex,
    :profile_about_me,
    :profile_age,
    :profile_location,
    :profile_languages
    #:profile_platforms

end
