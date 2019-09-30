# frozen_string_literal: true

class UserVerificationUploadSerializer
  include FastJsonapi::ObjectSerializer

  attribute :file_url do |record|
    if record.verified
      nil
    else
      Rails.application.routes.default_url_options[:host] + record.upload_url
    end
  end
end
