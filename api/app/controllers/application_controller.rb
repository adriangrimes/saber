class ApplicationController < ActionController::API
  # Used for authenticate_with_http_token
  include ActionController::HttpAuthentication::Token::ControllerMethods
  include ErrorSerializer

  def token_is_authorized_for_id?(user_id)
    p ">>> token_is_authorized_for_id? called"
    user_id = user_id.to_i
    @authenticated_user = nil
    # Extract token from Authentication header
    authenticate_with_http_token do |token, options|
      puts ">>> authentication token found, using id passed: ".concat(user_id.to_s)
      if @authenticated_user = User.find(user_id)
        puts ">>> user id found: ".concat(user_id.to_s)
        # Mitigate timing attacks with secure_compare
        if Devise.secure_compare(@authenticated_user.authentication_token, token)
          puts ">>> authentication token matches"
          # Execute set_user via sign_in and allow @authenticated_user to be used
          sign_in @authenticated_user, store: false
          return true
        else
          @authenticated_user = nil
          return false
        end
      else
        @authenticated_user = nil
        return false
      end
    end
    if @authenticated_user.nil?
      return false
    end
  end

  def token_exists_in_database?
    p '>>> token_exists_in_database? called'
    token_exists = false
    authenticate_with_http_token do |token, options|
      if found_user = User.find_by(authentication_token: token)
        p '>>> token exists'
        token_exists = true
      end
    end
    token_exists
  end

  def get_user_id_from_token
    p ">>> get_user_id_from_token called"
    @authenticated_user = nil
    # Extract token from Authentication header
    authenticate_with_http_token do |token, options|
      puts ">>> authentication token found"
      if @authenticated_user = User.find_by(authentication_token: token)
        puts ">>> user id found: ".concat(@authenticated_user.id.to_s)
        # Mitigate timing attacks with secure_compare
        if Devise.secure_compare(@authenticated_user.authentication_token, token)
          puts ">>> authentication token matches"
          # Execute set_user via sign_in and allow @authenticated_user to be used
          sign_in @authenticated_user, store: false
          return @authenticated_user.id
        else
          @authenticated_user = nil
          return 0
        end
      else
        @authenticated_user = nil
        return 0
      end
    end
    if @authenticated_user.nil?
      return 0
    end
  end

  def clean_up_and_render_unauthorized
    p ">>> rendering unauthorized"
    @authenticated_user = nil
    render status: :unauthorized
  end

  def clean_up_and_render_not_found
    p ">>> rendering not_found"
    @authenticated_user = nil
    render status: :not_found
  end
end
