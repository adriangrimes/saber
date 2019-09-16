class UserPublicFileSerializer
  include FastJsonapi::ObjectSerializer

  attribute :signed_id
  attribute :filename

  attribute :file_url do |record, params|
    if params[:client_is_member] == false &&
    record.metadata &&
    record.metadata[:members_only]
      Rails.configuration.x.saber.members_only_placeholder_url
    else
      Rails.application.routes.url_helpers.url_for(record.blob)
    end
  end

  attribute :members_only do |record|
    if record.metadata[:members_only]
      record.metadata[:members_only]
    else
      false
    end
  end

  attribute :profile_image do |record, params|
    if Rails.application.routes.url_helpers.url_for(record.blob) == params[:current_profile_photo_path]
      true
    else
      false
    end
  end

end
