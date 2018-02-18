include ErrorSerializer

class SessionsController < Devise::SessionsController

  def create
    puts "==== session create start ===="
    self.resource = warden.authenticate!(auth_options)
    puts "==== after session warden authenticate ====="
    sign_in(resource_name, resource)
    puts "==== session yield ===="
    yield resource if block_given?

    respond_to do |format|
      format.json do
        puts "==== session created, responding ===="
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
