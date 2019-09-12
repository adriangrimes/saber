class UserPublicFileSerializer
  include FastJsonapi::ObjectSerializer
  # include

  # file_url: (...)
  # filename: (...) # this should just be a timestamp or something
  # members_only: (...)
  # profile_image: (...)
  # signed_id:

  attributes :id

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

  attribute :profile_image do |record|
    if record.metadata[:profile_image]
      record.metadata[:profile_image]
    else
      false
    end
  end


end
