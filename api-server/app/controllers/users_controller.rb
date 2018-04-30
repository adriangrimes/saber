class UsersController < ApplicationController

  respond_to :jsonapi
  

  # GET all /users
  def index
    #Add server latency

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
    # request.headers['Authorization'])

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
  end

  # PATCH/PUT /users/1
  def update
    puts "USER PARAMS -----V to hash"
    @user = User.find(user_params[:data][:id])

    respond_to do |format|
      if @user.update(user_params[:data][:attributes])
        puts "hey ur doin it live updating something"
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

    # Use callbacks to share common setup or constraints between actions.
    def set_user
      #@user = User.find(params[:id])
    end

    def user_params
      puts "parameters"
      #devise_parameter_sanitizer
      params.permit(
        data: [
          :id,
          :type,
          attributes: [
            #:username,
            #:email,
            #:password,
            #:password_confirmation,
            :first_name,
            :middle_name,
            #:account_status,
            #:admin_status,
            :broadcaster,
            :developer,
            :stream_key,
            :address_line1,
            :address_line2,
            :address_line3,
            :timezone,
            :last_name,
            :birthdate,

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
        ]
      )
    end
end
