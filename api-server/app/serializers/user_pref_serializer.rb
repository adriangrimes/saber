class UserPrefSerializer < ActiveModel::Serializer
  belongs_to :user
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
