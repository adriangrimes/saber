# Load the Rails application.
require_relative 'application'

ActionMailer::Base.delivery_method = :smtp
ActionMailer::Base.smtp_settings = {
  :tls => true,
  :address => "in-v3.mailjet.com",
  :port => 587,
  :domain => "saber.tv",
  :authentication => :login,
  :user_name => "",
  :password => ""
}

# Initialize the Rails application.
Rails.application.initialize!
