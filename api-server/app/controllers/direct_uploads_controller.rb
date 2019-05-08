class DirectUploadsController < ActiveStorage::DirectUploadsController
  # Override the DirectUploadsController to bypass CSRF checks
  # TODO see if this is unsafe, re CSRF
  protect_from_forgery with: :exception
  skip_before_action :verify_authenticity_token
  # TODO add authentication checks before allowing upload or deletion
  # TODO See: https://github.com/algonauti/ember-active-storage#sending-authentication-headers
  def create
    super
    # add additional direct upload processing here
  end

end
