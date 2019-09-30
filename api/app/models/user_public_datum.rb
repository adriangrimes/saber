class UserPublicDatum < ApplicationRecord
  belongs_to :user

  serialize :user_custom_tags, Array

  validates :user_id, allow_nil: false, presence: true
  validates :username, presence: true
  validates :broadcaster, inclusion: { in: [true, false] }
  validates :online_status, inclusion: { in: [true, false] }
end
