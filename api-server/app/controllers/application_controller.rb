class ApplicationController < ActionController::API
  # Used for authenticate_with_http_token
  include ActionController::HttpAuthentication::Token::ControllerMethods
  include ErrorSerializer
  #if Rails.env.production?
    rescue_from ActiveRecord::RecordNotFound, with: :render_not_found
  #end

  def token_is_authorized_for_id?(user_id)
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

  def clean_up_and_render_unauthorized
    @authenticated_user = nil
    render json: ErrorSerializer.serialize(errors), status: :unauthorized
  end

  def render_not_found(exception)
    render json: ErrorSerializer.serialize(exception), status: :not_found
  end
end
