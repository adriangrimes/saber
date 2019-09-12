class UserPublicFilesController < ApplicationController
  include Rails.application.routes.url_helpers

  def index
    p "SHOW - public files route"
    if params[:username].present?
      p params[:username]
      # Use with_attached_profile_images to load all images in one DB call
      user_public_datum = UserPublicDatum
        .where("lower(username) = ?", params[:username].to_s.downcase)
        .with_attached_profile_images
        .first
      # image_array = nil
      # if user.profile_images.attached?
      #   puts 'serializer id photos attached'
      #   image_array = []
      #   user.profile_images.each do |image|
      #     # If image is Members Only and the user is not logged into an account,
      #     # do not add the image to the response
      #     p 'is_member: ' + params[:is_member].to_s
      #     file_url = Rails.application.routes.url_helpers.url_for(image)
      #     is_profile_image = false
      #     if user.profile_photo_path == file_url
      #       is_profile_image = true
      #     end
      #     if image.metadata[:members_only] == true && params[:is_member] == false
      #       next
      #     else
      #       image_array.push({
      #         signed_id: image.signed_id,
      #         file_url: file_url,
      #         filename: image.filename,
      #         delete: false,
      #         members_only: image.metadata[:members_only],
      #         profile_image: is_profile_image
      #         #filetype: image.filetype
      #       })
      #     end
      #   end
      # end
      # image_array

      if user_public_datum&.profile_images&.attached?


        # profile_images = []
        # client_is_member = token_exists_in_database?
        # user_public_datum.profile_images.each do |image|
        #   p "doing image"
        #   if client_is_member
        #     profile_images.push(image)
        #   else
        #     profile_images.push(image) if image.metadata[:members_only] == false
        #   end
        # end
        # user_public_datum.profile_images.delete_if {
        #   |image| image.metadata[:members_only] == true
        # }
        if token_exists_in_database?
          client_is_member = true

          render json: UserPublicFileSerializer
            .new(
              user_public_datum.profile_images,
              params: {client_is_member: client_is_member}
            )
            .serialized_json,
            status: :ok
        end
      else
        render json: {data: []}, status: :ok
      end
    else
      render status: :not_found
    end
  end

  def create
    p "CREATE - public files route"
  end

  def update
    p "UPDATE - public files route"
  end

  def destroy
    p "DESTROY - public files route"
  end

  private

    def serialize_public_files(public_files, search_only = false)
      # If search_only is true, only serialize specific attributes to display
      # search results
      if search_only
        UserPublicDatumSerializer
          .new(public_data, {fields: { user_public_datum: [
            :username,
            :online_status,
            :channel_topic,
            :current_game_id,
            :streamnail_path,
            :user_custom_tags,
            :profile_photo_path] } })
          .serialized_json
      # Else return all columns
      else
        # Pass is_member boolean to serializer to determine whether or not to display
        # images marked as Member Only
        UserPublicDatumSerializer
          .new(public_data, params: {is_member: token_exists_in_database?})
          .serialized_json
      end
    end

end
