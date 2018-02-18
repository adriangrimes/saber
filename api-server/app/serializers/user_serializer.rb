class UserSerializer < ActiveModel::Serializer

  attributes :id,
    # :email,
    # :username,
    # :authentication_token,
    :first_name,
    :middle_name,
    :last_name,
    :account_status,
    :admin_status,
    :broadcaster,
    :developer,
    :stream_key,
    :address_line1,
    :address_line2,
    :address_line3,
    :timezone,
    :birthdate,

    :dark_mode,
    :send_email_favorites_online,
    :send_email_site_news,
    :profile_photo_id,
    :profile_sex,
    :profile_about_me,
    :profile_age,
    :profile_location,
    :profile_languages
    #:profile_platforms

end
