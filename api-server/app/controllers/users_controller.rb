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
    if @authenticated_user.update(user_params)
      render json: @authenticated_user, status: :ok
    else
      render json: ErrorSerializer.serialize(@authenticated_user.errors), status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    if @authenticated_user.destroy
      render json: @authenticated_user, status: :ok
    else
      render json: ErrorSerializer.serialize(@authenticated_user.errors), status: :unprocessable_entity
    end
  end

  # GET all /users
  def index
    render_not_authenticated
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

    # def user_id
    #   params.require(:data).require(:id)
    # end

    def user_params
      params.require(:data)
        .require(:attributes)
        .permit(:username,
          :email,
          #:encrypted_password
          #:authentication_token
          #:account_status,
          #:admin_status,
          :stream_key,
          :security_questions,

          ## Account data
          :broadcaster,
          :developer,
          :affiliate,
          :security_questions,
          :stream_key,

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

      #devise_parameter_sanitizer
      # params.permit(
      #   data: {
      #     :id,
      #     :type,
      #     :user,
      #     attributes: [
      #       ## Database authenticatable
      #       :username,
      #       :email,
      #       #:encrypted_password
      #       #:authentication_token
      #       #:account_status,
      #       #:admin_status,
      #       :stream_key,
      #       :security_questions,
      #
      #       ## Account data
      #       :broadcaster,
      #       :developer,
      #       :affiliate,
      #       #:account_status,
      #       #:admin_status,
      #       :security_questions,
      #       :stream_key,
      #
      #       ## Site settings
      #       :dark_mode,
      #       :send_email_favorites_online,
      #       :send_email_site_news,
      #       :private_message_email_notifications,
      #
      #       ## Payment profile
      #       :full_name,
      #       :birthdate,
      #       :address_line1,
      #       :address_line2,
      #       :address_line3,
      #       :business_name,
      #       :business_entity_type,
      #       :payout_method,
      #       :bitcoin_address,
      #       :bank_account_number,
      #       :bank_routing_number,
      #       :subject_to_backup_withholding
      #     ]
      #   }
      # )
    end
end
