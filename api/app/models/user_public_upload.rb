class UserPublicUpload < ApplicationRecord
  belongs_to :user
  include PublicUploader::Attachment.new(:upload)
end
