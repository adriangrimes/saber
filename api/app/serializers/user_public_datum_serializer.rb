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
    :user_custom_tags

  attribute :profile_photo_path do |record|
    Rails.application.routes.default_url_options[:host] + record.profile_photo_path
  end

  attributes :profile_about_me,
    :profile_location,
    :profile_languages
  #:profile_platforms

end
