require_relative 'boot'

require "rails"
# Pick the frameworks you want:
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_view/railtie"
require "action_cable/engine"
# require "sprockets/railtie"
require "rails/test_unit/railtie"

# Require the gems listed in Gemfile, including any gems
# you've limited to :test, :development, or :production.
Bundler.require(*Rails.groups)

module ApiServer
  class Application < Rails::Application
    # Initialize configuration defaults for originally generated Rails version.
    config.load_defaults 5.1

    # Settings in config/environments/* take precedence over those specified here.
    # Application configuration should go into files in config/initializers
    # -- all .rb files in that directory are automatically loaded.

    # Only loads a smaller set of middleware suitable for API only apps.
    # Middleware like session, flash, cookies can be added back manually.
    # Skip views, helpers and assets when generating a new resource.
    config.api_only = true
    config.active_job.queue_adapter = :sucker_punch

    config.autoload_paths += %W(#{config.root}/lib)

    #config.active_record.sqlite3.represent_boolean_as_integer = true

    config.action_mailer.delivery_method = :mailjet
    config.action_mailer.default_url_options = { :host => "saber.tv" }
    config.to_prepare do
      DeviseController.respond_to :jsonapi
    end

    config.middleware.use ActionDispatch::Flash

    ##################################################
    # Saber configuration values

    # Payout percentages
    config.x.saber.broadcaster_payout_percentage = 50
    config.x.saber.developer_payout_percentage = 5
    config.x.saber.developer_bonus_payout_percentage = 25
    # config.saber.affiliate_payout_percentage = 5

    # Credit denominations
    # Dollar price => Credit quantity
    config.x.saber.credit_denominations = {
      10 => 100,
      25 => 250,
      50 => 500,
      75 => 750,
      100 => 1000
    }

    # Members Only file placeholder url
    config.x.saber.members_only_placeholder_url = "http://192.168.1.4:3000/membersonly.png"

    # Contests

    # Referral

    ##################################################

  end
end
