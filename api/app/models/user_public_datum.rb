class UserPublicDatum < ApplicationRecord
  belongs_to :user

  serialize :user_custom_tags, Array

  validates :user_id, allow_nil: false, presence: true
  validates :username, presence: true
  validates :broadcaster, inclusion: { in: [true, false] }
  validates :online_status, inclusion: { in: [true, false] }
  validate :valid_custom_tags

  def valid_custom_tags
    user_custom_tags.each do |tag|
      if tag.length > 20
        errors.add(:user_custom_tags, "cannot be longer than 20 characters")
        break
      end
      if tag.match(/\A[a-zA-Z0-9]*\z/).nil?
        errors.add(:user_custom_tags, "cannot contain special characters")
        break
      end
    end
  end
end
