class UserSerializer < ActiveModel::Serializer
  include Rails.application.routes.url_helpers

  has_one :user_public_datum

  attributes :id,

  ## Database authenticatable
  :username,
  :email,
  :password, # def below to return nil
  :current_password, # def below to return nil
  #:encrypted_password,
  #:authentication_token,

  ## Account data
  :broadcaster,
  :developer,
  :affiliate,
  #:account_status, # def below to return nil
  #:admin_status,
  :pending_deletion, # def below to return nil
  :security_questions,
  :stream_key,

  ## Site settings
  :dark_mode,
  :send_email_favorites_online,
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
  :subject_to_backup_withholding,
  :uploaded_identification

  def password
    nil
  end

  def current_password
    nil
  end

  def pending_deletion
    nil
  end

  def uploaded_identification
    # uploaded_identification.each do |image|
    if object.uploaded_identification.attached?
      array = []
      object.uploaded_identification.each do |image|
        array.push({
          signed_id: image.signed_id,
          file_url: url_for(image),
          filename: image.filename,
          delete: false
          #filetype: image.filetype
        })
      end
      array
    end
  end

end
