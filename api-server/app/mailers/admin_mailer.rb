class AdminMailer < ApplicationMailer

  def contact_us_email
    @message_params = params[:message_params]
    p @message_params
    mail(to: 'admin@saber.tv',
      from: 'site@saber.tv',
      subject: 'Contact Us Message from ' + @message_params[:contact_email])
  end

end
