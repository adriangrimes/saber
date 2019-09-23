class UserPublicDatumSerializer
  include FastJsonapi::ObjectSerializer

  ## Public profile
  attributes :id,
             :user_id,
             :username,
             :broadcaster,
             :online_status,
             :channel_topic,
             :current_game_id,
             :streamnail_path,
             :allow_tips,
             :allow_suggested_games,
             :timezone,
             :user_custom_tags,
             :profile_photo_path,
             :profile_sex,
             :profile_about_me,
             :profile_age,
             :profile_location,
             :profile_languages
  #:profile_platforms

end
