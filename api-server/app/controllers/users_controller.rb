class UsersController < ApplicationController
  before_action :is_user_authorized?

  # Render Unauthorized 401 even when a record is not found
  rescue_from ActiveRecord::RecordNotFound, with: :render_unauthorized

  # GET /users/1
  def show
    render json: @authenticated_user, include: ['user_public_datum'], status: :ok
  end

  # PATCH/PUT /users/1
  def update

    # Process to attach already directly uploaded files to the user record
    unless params[:data][:attributes][:uploaded_identification].blank?
      identification_upload_limit = 2
      params[:data][:attributes][:uploaded_identification].each do |blob|
        # TODO moving this outside of each loop may improve performance in DB search
        blob_id = ActiveStorage::Blob.find_signed(blob[:signed_id]).id
        # If blob isn't attached to any user, and user has less than 2 attachments,
        # attach to current user
        # TODO moving this outside of each loop may improve performance in DB search
        if ActiveStorage::Attachment.find_by(blob_id: blob_id).nil?
          if @authenticated_user.uploaded_identification.count < identification_upload_limit
            puts 'attaching blob'
            @authenticated_user.uploaded_identification.attach(blob[:signed_id])
          else
            # TODO delete unattachable blob or some other method of not letting
            # people litter the server with unattached file uploads
            puts 'purging unattachable blob'
            ActiveStorage::Blob.find_signed(blob[:signed_id]).purge_later
          end
        # Else if blob is marked for deletion
        elsif blob[:delete]
          # TODO moving this outside of each loop may improve performance in DB search
          current_blob_attachment =
            @authenticated_user.uploaded_identification.find_by(blob_id: blob_id)
          # Make sure user is allowed to delete image
          # TODO this check could probably be simplified just to the blob_for_deletion
          # line since only the users own images would show up for deletion anyway
          if current_blob_attachment[:record_type] == "User" &&
            current_blob_attachment[:record_id] == @authenticated_user.id
              puts 'deleting blob'
              blob_for_deletion = @authenticated_user.uploaded_identification
                .find(current_blob_attachment.id)
              blob_for_deletion.purge_later
              puts 'finished delete?'
          else
            puts 'unauthenticated blob deletion'
            # render status: :unauthorized and return
          end
        else
          puts 'blob already attached! or too many blobs'
        end
      end
    end

    # Save submitted params to user record
    # If current_password is present, update sensitive attributes.
    if user_params[:current_password]&.present?
      if @authenticated_user.update_with_password(user_params)
        render json: @authenticated_user,
          status: :ok
      else
        render json: ErrorSerializer.serialize(@authenticated_user.errors),
          status: :unprocessable_entity
      end
    # Else update attributes that don't require a password. Exclude sensitive
    # attributes.
    elsif @authenticated_user.update(user_params
      .except("password", "current_password", "email", "security_questions"))
        render json: @authenticated_user,
          status: :ok
    else
      render json: ErrorSerializer.serialize(@authenticated_user.errors),
        status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    if @authenticated_user.destroy
      render json: @authenticated_user, status: :ok
    else
      render json: ErrorSerializer.serialize(@authenticated_user.errors),
        status: :unprocessable_entity
    end
  end

  # GET all /users
  def index
    puts params
    render status: :ok
  end

  # POST /users
  def create
    #ERROR: posted to users controller create function - this probably shouldnt happen
    render status: :internal_server_error
  end

  private

    # before_actions

    def is_user_authorized?
      if token_is_authorized_for_id?(params[:id])
        return true
      else
        clean_up_and_render_unauthorized
        return false
      end
    end

    def user_params
      # Devise devise_parameter_sanitizer?
      params.require(:data)
        .require(:attributes)
        .permit(:username,
          :email,
          :password,
          :current_password,
          #:authentication_token
          #:account_status,
          #:admin_status,
          :stream_key,
          :security_questions,

          ## Account data
          :broadcaster,
          :developer,
          :affiliate,

          ## Site settings
          :dark_mode,
          :send_email_favorites_online,
          :send_email_site_news,
          :private_message_email_notifications,

          ## Payment profile
          :full_name,
          :birthdate,
          :address_line1,
          :address_line2,
          :address_line3,
          :business_name,
          :business_entity_type,
          :payout_method,
          :bitcoin_address,
          :bank_account_number,
          :bank_routing_number,
          :subject_to_backup_withholding)
          # Exclude uploaded_identification for special processing
          # uploaded_identification: [[:signed_id, :delete]])
    end
end
