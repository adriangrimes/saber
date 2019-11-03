class UserPublicDataController < ApplicationController
  before_action :public_params, only: [:update]

  # GET /user_public_data?search=asdf
  # GET /user_public_data?username=UserTester1
  # GET /user_public_data
  def index
    # If search parameter is specified
    if params[:search]
      search_results = search_broadcasters(params[:search])
      render json: serialize_public_data(search_results, true), status: :ok
    # Else if the username parameter is present, render single record
    elsif params[:username]
      puts 'getting single user data'
      user_public_datum = UserPublicDatum
                          .where("username = ?", params[:username])
                          .first
      if user_public_datum
        render json: serialize_public_data(user_public_datum), status: :ok
      else
        render status: :not_found
      end
    # Else display front page browse results
    else
      puts 'getting all data'
      # TODO limit how unqualified browsing of broadcasters is pulled and displayed
      browse_data = UserPublicDatum
                    .where('broadcaster = true')
                    .order(online_status: :desc, username: :asc)
                    # .limit(25)
      render json: serialize_public_data(browse_data, true), status: :ok
    end
  end

  # PATCH/PUT /user_public_data/1
  def update
    if @user_public_datum = UserPublicDatum.find(params[:id]) # user_id: params[:data][:attributes][:user_id])
      puts "found user id"
      puts @user_public_datum.user_id
      if token_is_authorized_for_id?(@user_public_datum.user_id)
        if @user_public_datum.update(public_params)
          render json: serialize_public_data(@user_public_datum), status: :ok
        else
          errors = ErrorSerializer.serialize(@user_public_datum.errors)
          render json: errors, status: :unprocessable_entity
        end
      else
        render status: :not_found
      end
    else
      render status: :not_found
    end
  end

  private

  def serialize_public_data(public_data, search_only = false)
    # If search_only is true, only serialize specific attributes to display
    # search results
    if search_only
      UserPublicDatumSerializer
        .new(public_data, { fields: { user_public_datum: [
               :username,
               :online_status,
               :channel_topic,
               :current_game_id,
               :streamnail_path,
               :user_custom_tags,
               :profile_photo_path
             ] } })
        .serialized_json
    # Else return all columns
    else
      # Pass is_member boolean to serializer to determine whether or not to display
      # images marked as Member Only
      UserPublicDatumSerializer
        .new(public_data, params: { is_member: token_exists_in_database? })
        .serialized_json
    end
  end

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
                  :profile_photo_id,
                  :profile_sex,
                  :profile_about_me,
                  :profile_age,
                  :profile_location,
                  :profile_languages,
                  :user_custom_tags => [])
    #:profile_platforms
  end

  def search_broadcasters(search_string = '')
    p search_string
    # TODO limit results returned

    # Remove any special non-alphanumeric characters
    search_string = search_string.gsub(/[^0-9a-z_ ]/i, '')
    # Escape _
    escaped_characters = {
      "_" => "#_"
    }
    matcher = /#{escaped_characters.keys.join('|')}/
    search_string = search_string.gsub(matcher) do |m|
      escaped_characters[m] || m
    end

    search_string = search_string.downcase
    # Sanitize
    search_string = UserPublicDatum.sanitize_sql_for_conditions(search_string)
    unless search_string.nil?
      regexp = /#{search_string}/i;
      online_user_search_results = UserPublicDatum
        .where("broadcaster = true AND online_status = true AND username LIKE ? ESCAPE '#'", '%' + search_string + '%')
      online_user_search_results =
        online_user_search_results.sort_by { |u| u.username =~ regexp }

      offline_user_search_results = UserPublicDatum
        .where("broadcaster = true AND online_status = false AND username LIKE ? ESCAPE '#'", '%' + search_string + '%')
      offline_user_search_results =
        offline_user_search_results.sort_by { |u| u.username =~ regexp }

      online_tag_search_results = []
      offline_tag_search_results = []
      UserPublicDatum
        .where("broadcaster = true AND user_custom_tags IS NOT NULL")
        .each do |broadcaster|
          if broadcaster.online_status
            broadcaster.user_custom_tags.each do |tag|
              # If tag either matches or partial matches, add the user to the results
              # and then break the tag loop to stop adding duplicate results
              if tag.downcase == search_string
                online_tag_search_results.push(broadcaster)
                break
              end
              if tag.downcase.include?(search_string)
                online_tag_search_results.push(broadcaster)
                break
              end
            end
          else
            broadcaster.user_custom_tags.each do |tag|
              # If tag either matches or partial matches, add the user to the results
              # and then break the tag loop to stop adding duplicate results
              if tag.downcase == search_string
                offline_tag_search_results.push(broadcaster)
                break
              end
              if tag.downcase.include?(search_string)
                offline_tag_search_results.push(broadcaster)
                break
              end
            end
          end
        end

      current_results = online_user_search_results + offline_user_search_results
      # Remove duplicate users from lower priority search results
      online_tag_search_results.each do |tagresult|
        current_results.each do |userresult|
          if userresult.username.include?(tagresult.username)
            online_tag_search_results.delete(tagresult)
          end
        end
      end
      offline_tag_search_results.each do |tagresult|
        current_results.each do |userresult|
          if userresult.username.include?(tagresult.username)
            offline_tag_search_results.delete(tagresult)
          end
        end
      end

      # Return concatenated record array in order of search priority
      online_user_search_results + online_tag_search_results + offline_user_search_results + offline_tag_search_results
    else
      []
    end
  end
end
