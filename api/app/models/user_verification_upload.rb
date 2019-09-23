class UserVerificationUpload < ApplicationRecord
  belongs_to :user

  include VerificationUploader::Attachment.new(:upload)
end
