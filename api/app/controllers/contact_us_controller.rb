class ContactUsController < ApplicationController
  require "uri"
  require "net/http"

  def send_email
    unless params[:captcha_token].to_s.blank? ||
           params[:contact_email].to_s.blank? ||
           params[:subject].to_s.blank? ||
           params[:message].to_s.blank? ||
           params[:message].to_s.length > 4000 ||
           params[:subject].to_s.length > 75

      message_params = {
        :captcha_token => params[:captcha_token].to_s,
        :contact_email => params[:contact_email].to_s,
        :topic => params[:topic].to_s,
        :subject => params[:subject].to_s,
        :message => params[:message].to_s
      }

      captcha_verify_params = {
        'secret' => '6Ld7w64UAAAAAJovUvbFab2gopseAMXov4G2UXB4',
        'response' => message_params[:captcha_token]
      }
      response = Net::HTTP.post_form(
        URI.parse(
          'https://www.google.com/recaptcha/api/siteverify'
        ),
        captcha_verify_params
      )
      if response.is_a?(Net::HTTPSuccess)
        captcha_verification = JSON.parse(response.body)
        if captcha_verification["success"] == true
          AdminMailer.with(message_params: message_params).contact_us_email.deliver_later
          render status: :ok
        else
          render json: { errors: [{
              attribute: :base,
              message: 'reCAPTCHA failed to verify. You may need to refresh the page and try again.'
            }]},
            status: :unprocessable_entity
        end
      else
        render json: { errors: [{
            attribute: :base,
            message: 'The reCAPTCHA service appears to be unavailable to verify the captcha.<br>Sorry, please try again later.'
          }]},
          status: :unprocessable_entity
      end
    else
      render json: { errors: [{
          attribute: :base,
          message: 'All fields except Topic are required.'
        }]},
        status: :unprocessable_entity
    end
  end
end
