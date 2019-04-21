class ApplicationController < ActionController::API
  # Used for authenticate_with_http_token
  include ActionController::HttpAuthentication::Token::ControllerMethods

  #if Rails.env.production?
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  #end

  def authenticate_user_from_token(user_id)
    #TODO: encrypt authentication token
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
          render_unauthorized and return false
        end
      else
        render_unauthorized and return false
      end
    end
    unless @authenticated_user
      render_unauthorized and return false
    end
  end

  def render_unauthorized
    @authenticated_user = nil
    render status: :unauthorized
  end

  def render_not_found(exception)
    render json: exception, status: :not_found
  end
end
