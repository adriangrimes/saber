# frozen_string_literal: true

class UserPublicUploadSerializer
  include FastJsonapi::ObjectSerializer

  attribute :file_url do |record, params|
    if params[:client_is_member] == false && record[:members_only]
      Rails.configuration.x.saber.members_only_placeholder_url
    else
      Rails.application.routes.default_url_options[:host] + record.upload_url
    end
  end

  attribute :profile_image do |record, params|
    record.upload_url == params[:current_profile_photo_path]
  end

  attribute :members_only
end
