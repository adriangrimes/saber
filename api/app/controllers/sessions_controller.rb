class SessionsController < Devise::SessionsController
  include ErrorSerializer

  def create
    p "session create"
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
    # Session store is disabled, so this should always succeed
    if resource.save!
      render json: data, status: :created
    else
      p "session controller save error"
      render status: :internal_server_error
    end
  end

  def new
    clean_up_and_render_not_found
  end

  def index
    clean_up_and_render_not_found
  end

  def show
    clean_up_and_render_not_found
  end

  def update
    clean_up_and_render_not_found
  end

  def destroy
    clean_up_and_render_not_found
  end
end
