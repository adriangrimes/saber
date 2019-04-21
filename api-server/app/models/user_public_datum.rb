class UserPublicDatum < ApplicationRecord
  belongs_to :user
  validates :user_id, presence: true
  validates :username, presence: true
end
