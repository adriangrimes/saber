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
      params.require(:data)
            .require(:attributes)
            .permit(:consent_to_store_data,
              :pending_broadcaster_application,
              :pending_developer_application,
              :pending_affiliate_application,
              :full_name,
              :birthdate,
              :street_address,
              :city,
              :region,
              :postal_code,
              :country,
              :business_name,
              :business_entity_type,
              :business_entity_type_other,
              :business_identification_number,
              :payout_method,
              :bitcoin_address,
              :subject_to_backup_withholding)
    end
end
