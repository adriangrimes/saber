class PrereleaseEmailsController < ApplicationController

  # POST /prerelease_emails
  def create
    already_present = PrereleaseEmail.find_by(email: prerelease_email_params[:email])
    unless already_present
      @prerelease_email = PrereleaseEmail.new(prerelease_email_params)

      if @prerelease_email.save
        render json: PrereleaseEmailSerializer.new(@prerelease_email).serialized_json, status: :created
      else
        render json: ErrorSerializer.serialize(@prerelease_email.errors), status: :unprocessable_entity
      end
    else
      render json: PrereleaseEmailSerializer.new(already_present).serialized_json, status: :created
    end
  end

  private

    # Only allow a trusted parameter "white list" through.
    def prerelease_email_params
      params.require(:data)
            .require(:attributes)
            .permit(:email)
    end

end
