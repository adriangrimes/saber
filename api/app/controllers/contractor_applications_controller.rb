class ContractorApplicationsController < ApplicationController

  def show

  end

  def create
    if @authenticated_user.pending_broadcaster_application
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
  end

  def update

  end

  def destroy

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
