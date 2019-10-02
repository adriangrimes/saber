class UsersController < ApplicationController
  before_action :is_user_authorized?

  # Render Unauthorized 401 even when a record is not found
  rescue_from ActiveRecord::RecordNotFound, with: :render_unauthorized

  # GET /users/1
  def show
    render json: serialize_user(@authenticated_user), status: :ok
  end

  # PATCH/PUT /users/1
  def update
    # Save submitted params to user record
    # If current_password is present, update sensitive attributes.
    if passworded_user_params[:current_password]&.present?

      # Suspend account if user submitted an account deletion request
      if passworded_user_params[:pending_deletion_since]
        # Overwrite the value sent by the client with our server time
        params[:data][:attributes][:pending_deletion_since] = Date.now
        @authenticated_user.suspended_account = true
      end

      # Update user record with whitelisted params
      if @authenticated_user.update_with_password(passworded_user_params)
        puts 'update with password successful, rendering'
        render json: serialize_user(@authenticated_user),
               status: :ok
        if @authenticated_user.pending_deletion_since
          # Send a deletion email after successfully updating user
          UserMailer
            .with(user: @authenticated_user)
            .pending_account_deletion_email
            .deliver_later
        end
      else
        render json: ErrorSerializer.serialize(@authenticated_user.errors),
               status: :unprocessable_entity
      end
    # Else update attributes that don't require a password
    elsif @authenticated_user.update(nonpassworded_user_params)
      render json: serialize_user(@authenticated_user),
             status: :ok
    else
      p @authenticated_user.errors
      render json: ErrorSerializer.serialize(@authenticated_user.errors),
             status: :unprocessable_entity
    end
  end

  private

  def is_user_authorized?
    if token_is_authorized_for_id?(params[:id])
      return true
    else
      clean_up_and_render_unauthorized
      return false
    end
  end

  def serialize_user(user)
    UserSerializer
      .new(user)
      .serialized_json
  end

  def nonpassworded_user_params
    params.require(:data)
          .require(:attributes)
          .permit(nonpassworded_user_params_hash)
  end

  # Parameters that require a password to update
  def passworded_user_params
    hash = [
      # :username,
      :email,
      :password,
      :current_password,
      :security_questions,
      :suspended_account,
      :pending_deletion_since
      # :authentication_token,
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
    # Devise devise_parameter_sanitizer?
    hash = [
      :stream_key,

      ## Account data
      #:account_status,
      :pending_application,
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
