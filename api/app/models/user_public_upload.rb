# frozen_string_literal: true

class UserPublicUpload < ApplicationRecord
  belongs_to :user

  include Shrine::Attachment.new(:upload)
end
