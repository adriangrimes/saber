# frozen_string_literal: true

class UserPublicUploadsController < ApplicationController
  # TODO: before action has token
  before_action :upload_params, only: %i[create update]

  def index
    p 'SHOW - public upload route'
    if params[:username].present?
      p params[:username]
      # Use with_attached_profile_images to load all images in one DB call
      user_public_datum = UserPublicDatum
                          .where('lower(username) = ?', params[:username].to_s.downcase)
                          .first

      user_public_uploads = UserPublicUpload.where('user_id = ?', user_public_datum.id).order('id ASC')
      if user_public_uploads.exists?
        render json: UserPublicUploadSerializer
          .new(
            user_public_uploads,
            params: {
              client_is_member: token_exists_in_database?
            }
          )
          .serialized_json,
               status: :ok
      else
        render json: { data: [] }, status: :ok
      end
    else
      render status: :not_found
    end
  end

  def create
    p 'CREATE - public upload route'

    user_public_datum = UserPublicDatum.find_by(user_id: upload_params[:user_id])
    upload_data_json = JSON.parse(upload_params[:upload_data_json])
    user_public_upload = UserPublicUpload.new
    user_public_upload.upload = upload_data_json
    # TODO: Get user id from token
    user_public_upload.user_id = upload_params[:user_id]

    p user_public_upload.upload_url

    if user_public_upload.save!
      puts 'attached upload'
      p 'starting serialization'
      p user_public_upload.upload_url
      options = {}
      options[:is_collection] = false
      options[:params] = {
        client_is_member: token_exists_in_database?,

        current_profile_photo_path: user_public_datum.profile_photo_path
      }
      json = UserPublicUploadSerializer
             .new(user_public_upload, options)
             .serialized_json
      render json: json, status: :created
    else
      render json: ErrorSerializer.serialize(user_public_upload.errors), status: :unprocessable_entity
    end
  end

  def update
    p 'UPDATE - public upload route'

    user_public_upload = UserPublicUpload.find(params[:id])
    user_public_datum = UserPublicDatum.find(user_public_upload.user_id)

    if upload_params[:members_only] == true || upload_params[:members_only] == false
      user_public_upload.members_only = upload_params[:members_only]
      user_public_upload.save!
    end
    if upload_params[:profile_image] == true && user_public_upload.upload.mime_type.include?('image')
      user_public_upload.members_only = false
      user_public_upload.save!
      user_public_datum.profile_photo_path =
        Rails.application.routes.default_url_options[:host] + user_public_upload.upload_url
      user_public_datum.save!
    end

    options = {}
    options[:is_collection] = false
    options[:params] = {
      client_is_member: token_exists_in_database?,
      current_profile_photo_path: user_public_datum.profile_photo_path
    }
    json = UserPublicUploadSerializer
           .new(user_public_upload, options)
           .serialized_json
    render json: json, status: :ok
  end

  def destroy
    p 'DESTROY - public upload route'

    # TODO: moving this outside of each loop may improve performance in DB search
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
        p 'setting profile path to nil'
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
  def upload_params
    params.require(:data)
          .require(:attributes)
          .permit(:user_id,
                  :profile_image,
                  :members_only,
                  :upload_data_json)
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
