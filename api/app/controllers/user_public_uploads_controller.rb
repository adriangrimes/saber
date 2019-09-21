# frozen_string_literal: true

class UserPublicUploadsController < ApplicationController
  # TODO: before action has token
  before_action :upload_params, only: %i[create update]

  def index
    p 'SHOW - public upload route'
    if params[:username].present?
      user_public_datum = UserPublicDatum
        .where('lower(username) = ?', params[:username].to_s.downcase)
        .first
      user_public_uploads = UserPublicUpload
        .where('user_id = ?', user_public_datum.id)
        .order('id ASC')

      if user_public_uploads.exists?
        render json: UserPublicUploadSerializer
          .new(
            user_public_uploads,
            params: {
              client_is_member: token_exists_in_database?,
              current_profile_photo_path: user_public_datum.profile_photo_path}
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
      p 'attached upload - starting serialization'
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
    if params[:id]
      user_public_upload = UserPublicUpload.find(params[:id])
      user_public_datum = UserPublicDatum.find(user_public_upload.user_id)

      user_public_upload.members_only = upload_params[:members_only]

      if upload_params[:profile_image] == true && user_public_upload.upload.mime_type.include?('image')
        user_public_datum.profile_photo_path =
          Rails.application.routes.default_url_options[:host] + user_public_upload.upload_url
        user_public_upload.members_only = false
      end

      if user_public_datum.save! && user_public_upload.save!
        p 'upload updated - serializing'
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
      else
        render status: :internal_server_error
      end
    else
      render status: :unprocessable_entity
    end
  end

  def destroy
    p 'DESTROY - public upload route'

    if params[:id]
      user_public_upload = UserPublicUpload.find(params[:id])
      user_public_datum = UserPublicDatum.find(user_public_upload.user_id)
      if user_public_upload.destroy

        # If user is deleting the image that was set as their profile
        # image, set it to the first in line afterwards
        uploads = UserPublicUpload.where('user_id = ?', user_public_upload.user_id)
        p uploads.count
        if uploads.count == 0
          p 'setting profile path to no image url'
          user_public_datum.profile_photo_path =
            Rails.configuration.x.saber.no_profile_image_url
        elsif Rails.application.routes.default_url_options[:host] + user_public_upload.upload_url ==
          user_public_datum.profile_photo_path
            p 'setting profile image to first in line'
            user_public_datum.profile_photo_path =
              Rails.application.routes.default_url_options[:host] + uploads.first.upload_url
        end

        if user_public_datum.save!
          render status: :no_content
        else
          render status: :internal_server_error
        end
      else
        render status: :internal_server_error
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

end
