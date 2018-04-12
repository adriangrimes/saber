class UsersController < ApplicationController
  before_action :set_user, only: [:index, :show, :create, :update, :destroy]

  respond_to :jsonapi

  # GET all /users
  def index
    #Add server latency
    #sleep 2

    #@user = User.find_by!(username: params[:username], password: params[:password])

    respond_to do |format|
      if @user
        format.jsonapi { render jsonapi: @user, status: :ok }
      else
        format.jsonapi { render jsonapi: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # GET /users/1
  def show
    @user = User.find(params[:id])

    respond_to do |format|
      if @user
        format.jsonapi { render jsonapi: @user, status: :ok }
      else
        format.jsonapi { render jsonapi: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # POST /users
  def create
    raise "ERROR: posted to users controller create function - this probably shouldnt happen"
    
    # puts "Going to create"
    # @user = User.new(user_params)
    #
    # #if @user.params[:password] and @user.params[:password] == @user.params[:password_confirmation]
    #
    #   respond_to do |format|
    #     if @user.save
    #       format.jsonapi { render jsonapi: @user, status: :created, location: @user }
    #     else
    #       format.jsonapi { render jsonapi: @user.errors, status: :unprocessable_entity }
    #     end
    #   end

    #else
    #  format.jsonapi { render jsonapi: @user.errors, status: :unprocessable_entity }
    #end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      puts "hey ur doin it live updating something"
      render json: @user, status: :ok
    else
      render json: @user.errors, status: :unprocessable_entity
    end
  end

  # DELETE /users/1
  def destroy
    @user.destroy
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_user
      #@user = User.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_params
       ActiveModelSerializers::Deserialization.jsonapi_parse!(params, only:
        [ :email,
          :username,
          :password,
          :password_confirmation,
          :first_name,
          :middle_name,
          :account_status,
          :admin_status,
          :broadcaster,
          :developer,
          :stream_key,
          :address_line1,
          :address_line2,
          :address_line3,
          :timezone,
          :last_name,
          :birthdate,
          :include,

          #userPrefs parameters
          :dark_mode,
          :send_email_favorites_online,
          :send_email_site_news,
          :profile_photo_id,
          :profile_sex,
          :profile_about_me,
          :profile_age,
          :profile_location,
          :profile_languages
          #:profile_platforms
        ]
      )
      #params.require(:data).permit(:attributes, :type, :email, :username, :password, :first_name, :last_name, :birthdate)
    end
end
