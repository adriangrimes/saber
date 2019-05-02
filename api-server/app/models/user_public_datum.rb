class UserPublicDatum < ApplicationRecord
  belongs_to :user
  
  validates :user_id, allow_nil: true, presence: true
  validates :username, presence: true
end
