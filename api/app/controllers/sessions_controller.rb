class SessionsController < Devise::SessionsController
  include ErrorSerializer

  def create
    self.resource = warden.authenticate!(auth_options)
    sign_in(resource_name, resource)
    yield resource if block_given?

    # Data object to send to ember-simple-auth for authentication
    data = {
      user_id: resource.id,
      login: resource.login,
      token: resource.authentication_token,
      email: resource.email,
      username: resource.username
    }

    # Workaround to make Devise only modify trackable fields on sign in and
    # session create instead of every User table call. Will be fixed in Devise 5.0
    datenow = DateTime.now
    unless resource.current_sign_in_at.nil?
      resource.last_sign_in_at = resource.current_sign_in_at
    end
    resource.current_sign_in_at = datenow
    resource.updated_at = datenow
    unless resource.current_sign_in_ip.nil?
      resource.last_sign_in_ip = resource.current_sign_in_ip
    end
    resource.current_sign_in_ip = request.remote_ip
    resource.sign_in_count += 1

    # Save to session if session is enabled, and render json to client
    if resource.save!
      render json: data, status: :created
    else
      render json: resource.errors, status: :internal_server_error
    end
  end

  def new
    render_unauthorized
  end
  def index
    render_unauthorized
  end
  def show
    render_unauthorized
  end
  def update
    render_unauthorized
  end
  def destroy
    render_unauthorized
  end
end
