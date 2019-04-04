class UsersController < ApplicationController
  include ActionController::HttpAuthentication::Token::ControllerMethods

  before_action :authenticate_user_from_token!
  respond_to :jsonapi

  # GET all /users
  def index
    @user = User.all

    if @user
      render jsonapi: @user, status: :ok
    else
      render jsonapi: @user.errors, status: :unprocessable_entity
    end
  end

  # GET /users/1
  def show
    puts "Authorization header:"
    puts request.headers['Authorization']
    @user = User.find(params[:id])
    if @user
      render jsonapi: @user, status: :ok
    else
      render jsonapi: @user.errors, status: :unprocessable_entity
    end
  end

  # POST /users
  def create
    puts ""
    puts "==========================================="
    raise "ERROR: posted to users controller create function - this probably shouldnt happen"
  end

  # PATCH/PUT /users/1
  def update
    puts ""
    puts "USER PARAMS -----V to hash"
    puts ""
    @user = User.find(user_params[:data][:id])

    respond_to do |format|
      if @user.update(user_params[:data][:attributes])
        puts ""
        puts "hey ur doin it live updating something"
        puts ""
        format.jsonapi { render jsonapi: @user, status: :ok }
      else
        format.jsonapi { render jsonapi: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
  end

  private

    def authenticate_user_from_token!
      puts "======authenticate_user_from_token======"
      authenticate_with_http_token do |token, options|
        puts options.inspect
        puts "======AUFT EMAIL PRESENCE======".concat(token)
        puts "email: ".concat(options[:email])
        user_email = options[:email].presence #this may always return true??? unsafe
        user = user_email && User.find_by_email(user_email)

        if user && Devise.secure_compare(user.authentication_token, token)
          puts "==== authenticate_user_from_token  sign in user ===="
          sign_in user, store: false
        end
      end
    end

    # Use callbacks to share common setup or constraints between actions.
    def set_user
      #@user = User.find(params[:id])
    end

    def user_params
      puts ""
      puts "parameters"
      puts ""
      #devise_parameter_sanitizer
      params.permit(
        data: [
          :id,
          :type,
          attributes: [
            ## Database authenticatable
            #:username
            #:email
            #:encrypted_password
            #:authentication_token
            :account_status,
            :admin_status,
            :stream_key,
            :security_questions,

            ## Account type (Account settings?)
            :broadcaster,
            :developer,
            :affiliate,
            :allow_tips,
            :allow_suggested_games,

            ## Profile
            :full_name,
            :birthdate,
            :address_line1,
            :address_line2,
            :address_line3,
            :timezone,

            ## Payment
            :business_name,
            :business_entity_type,
            :payout_method,
            :bitcoin_address,
            :bank_account_number,
            :bank_routing_number,
            :subject_to_backup_withholding,

            ## Site settings
            :dark_mode,
            :send_email_favorites_online,
            :send_email_site_news,
            :private_message_email_notifications,

            ## Public profile
            :user_custom_tags,
            :profile_photo_id,
            :profile_sex,
            :profile_about_me,
            :profile_age,
            :profile_location,
            :profile_languages
            #:profile_platforms
          ]
        ]
      )
    end
end
