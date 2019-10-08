class UserMailer < Devise::Mailer
  # helper :application # gives access to all helpers defined within `application_helper`.
  include Devise::Controllers::UrlHelpers # Optional. eg. `confirmation_url`
  default template_path: 'devise/mailer' # to make sure that your mailer uses the devise views
  default from: '"Saber" <noreply@saber.tv>'

  def pending_account_deletion_email
    @user = params[:user]
    mail(to: @user.email, subject: 'Your account has been marked for deletion')
  end

  def account_deleted_email
    @user = params[:user]
    mail(to: @user[:email], subject: 'Your account has been closed and deleted')
  end

  def broadcaster_application_submitted
    @user = params[:user]
    mail(to: @user.email, subject: 'Your broadcaster application has been received')
  end

  # def confirmation_instructions(record, token, opts={})
  #   #headers["Custom-header"] = "Bar"
  #   super
  # end
end
