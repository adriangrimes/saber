class ApplicationController < ActionController::API
  include ActionController::MimeResponds
  include ActionController::HttpAuthentication::Token::ControllerMethods

  acts_as_token_authentication_handler_for User

  before_action :authenticate_user_from_token!
  # Enter the normal Devise authentication path,
  # using the token authenticated user if available
  before_action :authenticate_user!

  protected

  def authenticate_user_from_token!
    puts "======authenticate_user_from_token======"
    authenticate_with_http_token do |token, options|
      puts options.inspect
      puts "======AUFT EMAIL PRESENCE======".concat(token)
      puts "email: ".concat(options[:email])
      user_email = options[:email].presence #this may always return true??? unsafe
      user = user_email && User.find_by_email(user_email)

      if user && Devise.secure_compare(user.authentication_token, token)
        puts "==== authenticate_user_from_token  sign in user ===="
        sign_in user, store: false
      end
    end
  end


end
