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
      identification_upload_limit = 2 # TODO move to config file
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
    if passworded_user_params[:current_password]&.present?

      if passworded_user_params[:pending_deletion]
        @authenticated_user.suspended_account = true
      end

      # Update user record with whitelisted params
      if @authenticated_user.update_with_password(passworded_user_params)
        puts 'update with password successful, rendering'
        render json: @authenticated_user,
          status: :ok
        if @authenticated_user.pending_deletion
          # Send a deletion email after successfully updating user
          UserMailer
            .with(user: @authenticated_user)
            .deletion_email
            .deliver_later
        end
      else
        render json: ErrorSerializer.serialize(@authenticated_user.errors),
          status: :unprocessable_entity
      end
    # Else update attributes that don't require a password
    elsif @authenticated_user.update(nonpassworded_user_params)
        render json: @authenticated_user,
          status: :ok
    else
      render json: ErrorSerializer.serialize(@authenticated_user.errors),
        status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    # puts "start setting user to pending deletion"
    # if user_params[:current_password]&.present?
    #   if @authenticated_user.update_with_password(account_status: "PENDING DELETION")
    #     render json: @authenticated_user, status: :ok
    #     # TODO Send deletion confirmation email
    #   else
    #     render json: ErrorSerializer.serialize(@authenticated_user.errors),
    #       status: :unprocessable_entity
    #   end
    # else
    #   render json: ErrorSerializer.serialize(@authenticated_user.errors),
    #     status: :unprocessable_entity
    # end
    render status: :unprocessable_entity
  end

  # GET all /users
  def index
    render status: :unprocessable_entity
  end

  # POST /users
  def create
    #ERROR: posted to users controller create function - this probably shouldnt happen
    render status: :unprocessable_entity
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

    def nonpassworded_user_params
      params.require(:data)
        .require(:attributes)
        .permit(nonpassworded_user_params_hash)
    end

    # Parameters that require a password to update
    def passworded_user_params
      hash = [
        :username,
        :email,
        :password,
        :current_password,
        :security_questions,
        :suspended_account,
        :pending_deletion
        # :authentication_token,
        # :account_status,
        # :admin_status,
        # Exclude uploaded_identification for special processing
        # uploaded_identification: [[:signed_id, :delete]])
      ]
      # Merge nonpassworded attributes to build the full whitelist
      params.require(:data)
        .require(:attributes)
        .permit(hash + nonpassworded_user_params_hash)
    end

    def nonpassworded_user_params_hash
      # TODO There has GOT to be a better way to do these parameters
      # Devise devise_parameter_sanitizer?
      hash = [
        :stream_key,

        ## Account data
        #:broadcaster,
        #:developer,
        #:affiliate,

        ## Site settings
        :dark_mode,
        :send_email_followed_online,
        :send_email_site_news,
        :private_message_email_notifications,
        :private_user_notes,

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
        :subject_to_backup_withholding
      ]
    end
end
