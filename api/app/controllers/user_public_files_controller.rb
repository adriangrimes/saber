class UserPublicFilesController < ApplicationController
  #before action has token
  before_action :file_params, only: [:create, :update, :destroy]

  def index
    p "SHOW - public files route"
    if params[:username].present?
      p params[:username]
      # Use with_attached_profile_images to load all images in one DB call
      user_public_datum = UserPublicDatum
        .where("lower(username) = ?", params[:username].to_s.downcase)
        .with_attached_profile_images
        .first

      if user_public_datum&.profile_images&.attached?
        render json: UserPublicFileSerializer
          .new(
            user_public_datum.profile_images,
            params: {
              client_is_member: token_exists_in_database?,
              current_profile_photo_path: user_public_datum.profile_photo_path
            }
          )
          .serialized_json,
          status: :ok
      else
        render json: {data: []}, status: :ok
      end
    else
      render status: :not_found
    end
  end

  def create
    p "CREATE - public files route"
    user_public_datum = UserPublicDatum.find(file_params[:user_id])
    # TODO moving this outside of each loop may improve performance in DB search
    blob = ActiveStorage::Blob.find_signed(file_params[:signed_id])
    # If blob isn't attached to any user, attach to current user
    # TODO moving this outside of each loop may improve performance in DB search
    attachment = ActiveStorage::Attachment.find_by(blob_id: blob.id)
    if attachment.nil?
      puts 'attaching blob'
      user_public_datum.profile_images.attach(file_params[:signed_id])
      if user_public_datum.save!
        p "saved - starting serialization"
        options = {}
        options[:is_collection] = false
        options[:params] = {
          client_is_member: token_exists_in_database?,
          current_profile_photo_path: user_public_datum.profile_photo_path
        }
        attachment = ActiveStorage::Attachment.find_by(blob_id: blob.id)
        json = UserPublicFileSerializer
          .new(attachment, options)
          .serialized_json
        render json: json, status: :ok
      else
        render status: :internal_server_error
      end
    else
      render status: :internal_server_error
    end
  end

  def update
    p "UPDATE - public files route"
  end

  def destroy
    p "DESTROY - public files route"
  end

  private

    # Only allow a trusted parameter "white list" through.
    def file_params
      ## Public profile
      # params[:data][:attributes][:user_custom_tags] = JSON.parse(
      #   params[:data][:attributes][:user_custom_tags])
      params.require(:data)
        .require(:attributes)
        .permit(:signed_id,
          :user_id)
    end

    # def serialize_public_files(public_files, search_only = false)
    #   # If search_only is true, only serialize specific attributes to display
    #   # search results
    #   if search_only
    #     UserPublicDatumSerializer
    #       .new(public_data, {fields: { user_public_datum: [
    #         :username,
    #         :online_status,
    #         :channel_topic,
    #         :current_game_id,
    #         :streamnail_path,
    #         :user_custom_tags,
    #         :profile_photo_path] } })
    #       .serialized_json
    #   # Else return all columns
    #   else
    #     # Pass is_member boolean to serializer to determine whether or not to display
    #     # images marked as Member Only
    #     UserPublicDatumSerializer
    #       .new(public_data, params: {is_member: token_exists_in_database?})
    #       .serialized_json
    #   end
    # end

end
