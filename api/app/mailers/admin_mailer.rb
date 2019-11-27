class AdminMailer < ApplicationMailer
  def contact_us_email
    @message_params = params[:message_params]
    mail(to: Rails.configuration.x.admin_email_to,
         from: Rails.configuration.x.admin_email_from,
         subject: 'Contact Us Message from ' + @message_params[:contact_email])
  end

  def broadcaster_application_waiting_for_review
    @user = params[:user]
    mail(to: Rails.configuration.x.admin_email_to,
         from: Rails.configuration.x.admin_email_from,
         subject: 'New broadcaster application waiting for review ' + @user.email)
  end
end
