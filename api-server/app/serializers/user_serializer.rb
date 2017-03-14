class UserSerializer < ActiveModel::Serializer
  has_one :user_pref, dependent: :destroy
  attributes :id,
    :email,
    :username,
    :password,
    :first_name,
    :middle_name,
    :account_status,
    :admin_status,
    :broadcaster,
    :developer,
    :stream_key,
    :address_line_1,
    :address_line_2,
    :address_line_3,
    :timezone,
    :last_name,
    :birthdate

    class UserPrefSerializer < ActiveModel::Serializer
      attributes :id,
        :user_id,
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
end
