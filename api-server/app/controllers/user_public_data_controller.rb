class UserPublicDataController < ApplicationController
  before_action :public_params, only: [:update]

  # GET /user_public_data
  def index
    # If no user_id param is present, render all public records
    if params[:user_id].nil?
      # make some search magic happen here
      @user_public_data = UserPublicDatum.all
      render json: @user_public_data, status: :ok
    # Else if the user_id param is present and an integer, render single record
    elsif params[:user_id] = Integer(params[:user_id]) rescue false
      if @user_public_datum = UserPublicDatum.find_by(user_id: params[:user_id])
        render json: @user_public_datum, status: :ok
      else
        render json: @user_public_datum.errors, status: :unprocessable_entity
      end
    else
      render status: :not_found
    end
  end

  # PATCH/PUT /user_public_data/1
  def update
    if @user_public_datum = UserPublicDatum.find_by(user_id: params[:data][:attributes][:user_id])
      if authenticate_user_from_token(@user_public_datum.user_id)
        if @user_public_datum.update(public_params)
          render json: @user_public_datum, status: :ok
        else
          render json: @user_public_datum.errors, status: :unprocessable_entity
        end
      else
        render status: :unauthorized
      end
    else
      render status: :not_found
    end
  end

  # GET /user_public_data/1
  def show
    render status: :unauthorized
  end

  # POST /user_public_data
  def create
    render status: :unauthorized
  end

  # DELETE /user_public_data/1
  def destroy
    #@user_public_datum.destroy
    render status: :unauthorized
  end

  private

    # Only allow a trusted parameter "white list" through.
    def public_params
      ## Public profile
      params.require(:data)
        .require(:attributes)
        .permit(:username,
        :online_status,
        :channel_topic,
        :current_game_id,
        :streamnail_path,
        :allow_tips,
        :allow_suggested_games,
        :timezone,
        :user_custom_tags,
        :profile_photo_id,
        :profile_sex,
        :profile_about_me,
        :profile_age,
        :profile_location,
        :profile_languages)
        #:profile_platforms
    end
end
