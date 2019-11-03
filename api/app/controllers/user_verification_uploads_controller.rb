class UserVerificationUploadsController < ApplicationController

  before_action :verification_upload_params, only: %i[create update]
  before_action :is_user_authorized?

  def index
    p 'INDEX - listing verification uploads for user_id: ' + @authenticated_user.id.to_s
    verification_uploads = UserVerificationUpload
      .where('user_id = ?', @authenticated_user.id)
    unless verification_uploads.nil?
      render json: UserVerificationUploadSerializer
        .new(verification_uploads)
        .serialized_json,
        status: :ok
    else
      render status: :not_found
    end
  end

  def create
    p 'CREATE - user authorized to create verification upload'
    parsed_upload_json = JSON.parse(verification_upload_params[:upload_data_json])
    verification_upload_count = UserVerificationUpload
      .where('user_id = ?', @authenticated_user.id)
      .count
    if verification_upload_count < Rails.configuration.x.saber.verification_upload_limit
      verification_upload = UserVerificationUpload.new
      verification_upload.upload = parsed_upload_json
      # TODO: Get user id from token?
      verification_upload.user_id = @authenticated_user.id

      if verification_upload.save
        options = {}
        options[:is_collection] = false
        json = UserVerificationUploadSerializer
          .new(verification_upload, options)
          .serialized_json
        render json: json, status: :created
      else
        p '============== errros'
        p ErrorSerializer.serialize(verification_upload.errors)
        render json: ErrorSerializer.serialize(verification_upload.errors),
          status: :unprocessable_entity
      end
    else
      render json: {errors: ['maximum uploads reached']},
        status: :unprocessable_entity
    end
  end

  def destroy
    if params[:id].present?
      verification_upload = UserVerificationUpload.find(params[:id])
      if verification_upload.destroy
        render status: :no_content
      else
        render json: ErrorSerializer.serialize(verification_upload.errors),
          status: :unprocessable_entity
      end
    else
      render status: :not_found
    end
  end

  private

  def is_user_authorized?
    if get_user_id_from_token > 0
      return true
    else
      clean_up_and_render_not_found
      return false
    end
  end

  # Only allow a trusted parameter "white list" through.
  def verification_upload_params
    # TODO what the heck is this:
    params[:id] = params[:data][:attributes][:user_id] if params[:id].nil?

    params.require(:data)
          .require(:attributes)
          .permit(:user_id,
                  :upload_data_json)
  end

end
