class UsersController < ApplicationController
  before_action :set_user, only: [:index, :show, :create, :update, :destroy]

  # GET /users
  def index
    #sleep 2 #Add server latency
    @user = User.find_by!(username: params[:username], password: params[:password])


    respond_to do |format|
      if @user
        format.jsonapi { render jsonapi: @user, include: 'user_pref' }
      else
        format.jsonapi { render jsonapi: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # GET /users/1
  def show
    @user = User.find(params[:id])

    render json: @user
  end

  # POST /users
  def create

    @user = User.new(user_params)

    respond_to do |format|
      if @user.save
        format.jsonapi { render jsonapi: @user, status: :created, location: @user }
      else
        format.jsonapi { render jsonapi: @user.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /users/1
  def update
    if @user.update(user_params)
      render json: @user
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
          :first_name,
          :middle_name,
          :account_status,
          :admin_status,
          :broadcaster,
          :developer,
          :stream_key,
          :address_line_1,
          :address_line_2,
          :address_line_3,
          :timezone,
          :last_name,
          :birthdate,
          :include,

          #userPrefs parameters
          :user_id,
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
