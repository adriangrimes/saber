class UserPublicDatumSerializer
  include FastJsonapi::ObjectSerializer
  include Rails.application.routes.url_helpers

  #belongs_to :user

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

  # attribute :profile_images do |user, params|
  #   image_array = nil
  #   if user.profile_images.attached?
  #     puts 'serializer id photos attached'
  #     image_array = []
  #     user.profile_images.each do |image|
  #       # If image is Members Only and the user is not logged into an account,
  #       # do not add the image to the response
  #       p 'is_member: ' + params[:is_member].to_s
  #       file_url = Rails.application.routes.url_helpers.url_for(image)
  #       is_profile_image = false
  #       if user.profile_photo_path == file_url
  #         is_profile_image = true
  #       end
  #       if image.metadata[:members_only] == true && params[:is_member] == false
  #         next
  #       else
  #         image_array.push({
  #           signed_id: image.signed_id,
  #           file_url: file_url,
  #           filename: image.filename,
  #           delete: false,
  #           members_only: image.metadata[:members_only],
  #           profile_image: is_profile_image
  #           #filetype: image.filetype
  #         })
  #       end
  #     end
  #   end
  #   image_array
  # end

end
