class ApplicationController < ActionController::API
  include ActionController::MimeResponds

  #if Rails.env.production?
    rescue_from ActiveRecord::RecordNotFound, with: :render_404
  #end

  def render_404(exception)
    render jsonapi: exception, status: :not_found
  end
end
