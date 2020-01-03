class Users::RegistrationsController < Devise::RegistrationsController
  require "uri"
  require "net/http"

  before_action :sign_up_params, only: [:create]

  # GET /resource/sign_up
  # def new
  #   super
  # end

  # POST /resource
  def create
    captcha_response = Net::HTTP.post_form(
      URI.parse(
        'https://www.google.com/recaptcha/api/siteverify'
      ),
      {
        'secret' => Rails.application.credentials.captcha_secret_key,
        'response' => params[:data][:attributes][:captcha_response].to_s
      }
    )
    if captcha_response.is_a?(Net::HTTPSuccess)
      captcha_verification = JSON.parse(captcha_response.body)
      if captcha_verification["success"] == true
        @user = User.new(sign_up_params)
        @user.build_user_public_datum(username: sign_up_params[:username], broadcaster: false)
        if @user.save
          render json: UserSerializer.new(@user).serialized_json,
            status: :created
        else
          puts @user.errors.inspect
          render json: ErrorSerializer.serialize(@user.errors),
            status: :unprocessable_entity
        end
      else
        render json: { errors: [{
            attribute: :base,
            message: 'reCAPTCHA failed to verify. You may need to refresh the page and try again.'
          }]},
          status: :unprocessable_entity
      end
    else
      render json: { errors: [{
          attribute: :base,
          message: 'The reCAPTCHA service appears to be unavailable to verify the captcha.<br>Sorry, please try again later.'
        }]},
        status: :unprocessable_entity
    end
  end

  # GET /resource/edit
  # def edit
  #   super
  # end

  # PUT /resource
  # def update
  #   super
  # end

  # DELETE /resource
  # def destroy
  #   super
  # end

  # GET /resource/cancel
  # Forces the session data which is usually expired after sign
  # in to be expired now. This is useful if the user wants to
  # cancel oauth signing in/up in the middle of the process,
  # removing all OAuth session data.
  # def cancel
  #   super
  # end

  protected

  # If you have extra params to permit, append them to the sanitizer.
  def sign_up_params
    params.require(:data)
          .require(:attributes)
          .permit(:login,
            :username,
            :email,
            :password,
            :broadcaster_signup,
            :developer_signup,
            :affiliate_signup)
  end

  # If you have extra params to permit, append them to the sanitizer.
  # def configure_account_update_params
  #   devise_parameter_sanitizer.permit(:account_update, keys: [:attribute])
  # end

  # The path used after sign up.
  # def after_sign_up_path_for(resource)
  #   super(resource)
  # end

  # The path used after sign up for inactive accounts.
  # def after_inactive_sign_up_path_for(resource)
  #   super(resource)
  # end
end
