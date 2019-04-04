include ErrorSerializer

class SessionsController < Devise::SessionsController

  def create
    #sleep 2
    puts "CREATE SESSION"
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    yield resource if block_given?

    respond_to do |format|
      format.json do
        data = {
          user_id: resource.id,
          login: resource.login,
          token: resource.authentication_token,
          email: resource.email,
          username: resource.username
        }
        render json: data, status: 201
      end
    end
  end

end
