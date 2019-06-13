class UserPublicDataController < ApplicationController
  before_action :public_params, only: [:update]

  # GET /user_public_data
  def index
    puts params.inspect
    if params[:search]
      puts 'searching'
      puts params[:search]
      # make some search magic happen here
      # TODO only show relevant search/browse user data
      # TODO sanitize the hell out of search input
      # TODO limit results returned
      search_results = UserPublicDatum
        .where("username LIKE ? AND broadcaster = true", '%' + params[:search] + '%')
        .order(:username)
          render json: search_results, status: :ok
    # Else if the user_id param is present and an integer, render single record
    elsif params[:username] #= Integer(params[:user_id]) rescue false
      puts 'getting single user data'
      if @user_public_datum = UserPublicDatum
        .where("lower(username) = ?", params[:username].downcase)
        .first
          render json: @user_public_datum, status: :ok
      else
        render status: :not_found
      end
    else
      puts 'getting all data'
      # TODO limit how unqualified browsing of broadcasters is pulled and displayed
      public_data = UserPublicDatum
        .where('broadcaster = true')
        .order(:username)
      render json: public_data, status: :ok
      #render status: :not_found
    end
  end

  # PATCH/PUT /user_public_data/1
  def update
    if @user_public_datum = UserPublicDatum.find(params[:id])#user_id: params[:data][:attributes][:user_id])
      puts "found user id"
      puts @user_public_datum.user_id
      if token_is_authorized_for_id?(@user_public_datum.user_id)

        if @user_public_datum.update(public_params)
          render json: @user_public_datum, status: :ok
        else

          errors = ErrorSerializer.serialize(@user_public_datum.errors)
          puts errors
          render json: errors, status: :unprocessable_entity
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
      # params[:data][:attributes][:user_custom_tags] = JSON.parse(
      #   params[:data][:attributes][:user_custom_tags])
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
