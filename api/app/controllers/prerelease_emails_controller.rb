class PrereleaseEmailsController < ApplicationController

  # GET /prerelease_emails
  def index
    # @prerelease_emails = PrereleaseEmail.all
    #
    # render json: @prerelease_emails
  end

  # GET /prerelease_emails/1
  def show
    # render json: @prerelease_email
  end

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

  # PATCH/PUT /prerelease_emails/1
  def update
    # if @prerelease_email.update(prerelease_email_params)
    #   render json: @prerelease_email
    # else
    #   render json: @prerelease_email.errors, status: :unprocessable_entity
    # end
  end

  # DELETE /prerelease_emails/1
  def destroy
    # @prerelease_email.destroy
  end

  private

    # Only allow a trusted parameter "white list" through.
    def prerelease_email_params
      params.require(:data)
            .require(:attributes)
            .permit(:email)
    end
    
end
