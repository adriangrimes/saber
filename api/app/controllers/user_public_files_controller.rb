class UserPublicFilesController < ApplicationController
  #before action has token
  before_action :file_params, only: [:create, :update]

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
        render json: json, status: :created
      else
        render status: :internal_server_error
      end
    else
      render status: :internal_server_error
    end
  end

  def update
    p "UPDATE - public files route"

    blob = ActiveStorage::Blob.find(params[:id])
    blob_url = Rails.application.routes.url_helpers.url_for(blob)
    attachment = ActiveStorage::Attachment.find_by(blob_id: blob.id)
    user_public_datum = UserPublicDatum.find(attachment.record_id)
    p blob.inspect

    if file_params[:members_only] == true || file_params[:members_only] == false
      blob.metadata[:members_only] = file_params[:members_only]
      blob.save
    end
    if file_params[:profile_image] == true
      blob.metadata[:members_only] = false
      blob.save!
      user_public_datum.profile_photo_path = blob_url
      user_public_datum.save!
    end

    options = {}
    options[:is_collection] = false
    options[:params] = {
      client_is_member: token_exists_in_database?,
      current_profile_photo_path: user_public_datum.profile_photo_path
    }
    json = UserPublicFileSerializer
      .new(attachment, options)
      .serialized_json
    render json: json, status: :ok
  end

  def destroy
    p "DESTROY - public files route"

    # TODO moving this outside of each loop may improve performance in DB search
    # TODO :includes might save DB calls?
    blob = ActiveStorage::Blob.find(params[:id])
    blob_url = Rails.application.routes.url_helpers.url_for(blob)
    attachment = ActiveStorage::Attachment.find_by(blob_id: blob.id)
    user_public_datum = UserPublicDatum.find(attachment.record_id)

    blob_for_deletion = user_public_datum.profile_images
      .find(attachment.id)

    if blob_for_deletion.purge_later
      puts 'finished delete?'
      # If user is deleting the image that was set as their profile
      # image, set it to the first in line afterwards
      p user_public_datum.profile_images.count
      if user_public_datum.profile_images.count == 0
        p "setting profile path to nil"
        user_public_datum.profile_photo_path = nil
      elsif blob_url == user_public_datum.profile_photo_path
        user_public_datum.profile_photo_path =
          Rails.application.routes.url_helpers.url_for(user_public_datum.profile_images.first)
      end

      if user_public_datum.save!
        render status: :no_content
      else
        render status: :unprocessable_entity
      end
    else
      render status: :unprocessable_entity
    end

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
          :user_id,
          :members_only,
          :profile_image)
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
