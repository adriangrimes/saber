class ContractorApplicationsController < ApplicationController

  def index
    user_id = get_user_id_from_token
    if user_id > 0
      app = ContractorApplication.find_by(user_id: user_id)
      if app
        render json: ContractorApplicationSerializer
            .new(app)
            .serialized_json,
          status: :ok
      else
        render status: :not_found
      end
    else
      render status: :not_found
    end
  end

  def create
    user_id = get_user_id_from_token
    if user_id > 0
      @authenticated_user.build_contractor_application(contractor_application_params)
      if @authenticated_user.contractor_application.save
        render json: ContractorApplicationSerializer
            .new(@authenticated_user.contractor_application)
            .serialized_json,
          status: :ok

        if @authenticated_user.contractor_application.pending_broadcaster_application
          # Send a notification email to the user letting them know we got their
          # application
          UserMailer
            .with(user: @authenticated_user)
            .broadcaster_application_submitted
            .deliver_later
          # Send us a notification to actually review it
          AdminMailer
            .with(user: @authenticated_user)
            .broadcaster_application_waiting_for_review
            .deliver_later
        end
      else
        p @authenticated_user.contractor_application.errors
        render json: ErrorSerializer.serialize(@authenticated_user.contractor_application.errors),
               status: :unprocessable_entity
      end
    else
      render status: :not_found
    end
  end

  def update
    user_id = get_user_id_from_token
    if user_id > 0
      app = ContractorApplication.find_by(user_id: user_id)
      if app
        if app.update(contractor_application_params)
          render json: ContractorApplicationSerializer
              .new(app)
              .serialized_json,
            status: :ok
        else
          p app.errors
          render json: ErrorSerializer.serialize(app.errors),
                 status: :unprocessable_entity
        end
      else
        render status: :not_found
      end
    else
      render status: :not_found
    end
  end

  private

    def contractor_application_params
      ## Payment profile
      params.require(:data)
            .require(:attributes)
            .permit(:consent_given,
              :pending_broadcaster_application,
              :pending_developer_application,
              :pending_affiliate_application,
              :full_name,
              :birthdate,
              :address_line1,
              :address_line2,
              :address_line3,
              :business_name,
              :business_entity_type,
              :business_identification_number,
              :payout_method,
              :bitcoin_address,
              :bank_account_number,
              :bank_routing_number,
              :subject_to_backup_withholding)
    end
end
