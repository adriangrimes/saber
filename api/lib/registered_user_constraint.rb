# Only allow registered users (users with a valid authentication_token) to pass
# this constraint
class RegisteredUserConstraint

  def initialize
    p 'RegisteredUserConstraint initialized'
  end

  def matches?(request)
    is_user_registered = false
    # Extract token from Authentication header
    if request.headers["Token"]
      query = User.find_by(authentication_token: request.headers["Token"].to_s)
      if query
        # Mitigate timing attacks with secure_compare
        if Devise.secure_compare(query.authentication_token, request.headers["Token"].to_s)
          is_user_registered = true
        end
      end
    end
    is_user_registered
  end
end
