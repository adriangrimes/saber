class ApplicationController < ActionController::API
  # Used for authenticate_with_http_token
  include ActionController::HttpAuthentication::Token::ControllerMethods
  include ErrorSerializer

  before_action :prepare_exception_notifier

  def token_is_authorized_for_id?(user_id)
    @authenticated_user = nil
    # Extract token from Authentication header
    authenticate_with_http_token do |token, options|
      @authenticated_user = User.find(user_id.to_i)
      if @authenticated_user
        # Mitigate timing attacks with secure_compare
        if Devise.secure_compare(@authenticated_user.authentication_token, token)
          # Execute set_user via sign_in and allow @authenticated_user to be used
          sign_in @authenticated_user, store: false
          return true
        end
      end
    end
    @authenticated_user = nil
    return false
  end

  def token_exists_in_database?
    token_exists = false
    authenticate_with_http_token do |token, options|
      found_user = User.find_by(authentication_token: token)
      if found_user
        token_exists = true
      end
    end
    token_exists
  end

  def get_user_id_from_token
    @authenticated_user = nil
    # Extract token from Authentication header
    authenticate_with_http_token do |token, options|
      if @authenticated_user = User.find_by(authentication_token: token)
        # Mitigate timing attacks with secure_compare
        if Devise.secure_compare(@authenticated_user.authentication_token, token)
          # Execute set_user via sign_in and allow @authenticated_user to be used
          sign_in @authenticated_user, store: false
          return @authenticated_user.id
        end
      end
    end
    @authenticated_user = nil
    return 0
  end

  def clean_up_and_render_unauthorized
    @authenticated_user = nil
    render status: :unauthorized
  end

  def clean_up_and_render_not_found
    @authenticated_user = nil
    render status: :not_found
  end

  def current_user
    user = nil
    # Extract token from Authentication header
    authenticate_with_http_token do |token, options|
      query = User.find_by(authentication_token: token)
      if query
        # Mitigate timing attacks with secure_compare
        if Devise.secure_compare(query.authentication_token, token)
          user = query
        end
      end
    end
    user
  end

  private

    def prepare_exception_notifier
      request.env["exception_notifier.exception_data"] = {
        current_user: current_user
      }
    end
end
