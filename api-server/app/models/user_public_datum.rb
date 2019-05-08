class UserPublicDatum < ApplicationRecord
  belongs_to :user

  # Public profile photos and images
  # has_many_attached :profile_images

  validates :user_id, allow_nil: true, presence: true
  validates :username, presence: true
end
