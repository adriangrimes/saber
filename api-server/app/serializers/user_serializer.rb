class UserSerializer
  include FastJsonapi::ObjectSerializer
  include Rails.application.routes.url_helpers

  has_one :user_public_datum

  attributes :id,

  ## Database authenticatable
  :username,
  :email
  attribute :password do |object|
    nil
  end
  attribute :current_password do |object|
    nil
  end
  #:encrypted_password,
  #:authentication_token,

  ## Account data
  attributes :broadcaster,
  :developer,
  :affiliate
  #:account_status, # def below to return nil
  #:admin_status,
  attribute :pending_deletion do |object|
    false
  end
  attributes :security_questions,
  :stream_key,

  ## Site settings
  :dark_mode,
  :send_email_followed_online,
  :send_email_site_news,
  :private_message_email_notifications,
  :private_user_notes,

  ## Payment profile (TODO most of these are probably not safe in terms of user security)
  :full_name,
  :birthdate,
  :address_line1,
  :address_line2,
  :address_line3,
  :business_name,
  :business_entity_type,
  :payout_method,
  :bitcoin_address,
  :bank_account_number,
  :bank_routing_number,
  :subject_to_backup_withholding

  attribute :uploaded_identification do |object, params|
    identification_array = nil
    if params[:user].uploaded_identification.attached?
      puts 'serializer id photos attached'
      identification_array = []
      params[:user].uploaded_identification.each do |image|
        identification_array.push({
          signed_id: image.signed_id,
          file_url: Rails.application.routes.url_helpers.url_for(image),
          filename: image.filename,
          delete: false
          #filetype: image.filetype
        })
      end
    end
    identification_array
  end

  # def password
  #   nil
  # end
  #
  # def current_password
  #   nil
  # end
  #
  # def pending_deletion
  #   nil
  # end

  # def uploaded_identification
  #   # uploaded_identification.each do |image|
  #   if object.uploaded_identification.attached?
  #     array = []
  #     object.uploaded_identification.each do |image|
  #       array.push({
  #         signed_id: image.signed_id,
  #         file_url: url_for(image),
  #         filename: image.filename,
  #         delete: false
  #         #filetype: image.filetype
  #       })
  #     end
  #     array
  #   end
  # end

end
