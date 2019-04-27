# Load the Rails application.
require_relative 'application'

#ActionMailer::Base.delivery_method = :smtp
ActionMailer::Base.smtp_settings = {
   :tls => true,
   :address => "in-v3.mailjet.com",
   :port => 587,
   :domain => "saber.tv",
   :authentication => :login,
   :user_name => "26c6be7bbb1d5cf4f6898e7cd60937f6",
   :password => "e2f43ae6d231802e3868b27b3110e6a0"
 }

# Initialize the Rails application.
Rails.application.initialize!
