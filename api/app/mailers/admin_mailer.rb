class AdminMailer < ApplicationMailer
  def contact_us_email
    @message_params = params[:message_params]
    p @message_params
    mail(to: 'user@gmail.com',
         from: 'site@saber.tv',
         subject: 'Contact Us Message from ' + @message_params[:contact_email])
  end

  def broadcaster_application_waiting_for_review
    @user = params[:user]
    p @user
    mail(to: 'user@gmail.com',
         from: 'site@saber.tv',
         subject: 'New broadcaster application waiting for review ' + @user.email)
  end
end
