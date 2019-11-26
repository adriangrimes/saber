class PrivateMessage < ApplicationRecord
  belongs_to :from_user, :class_name => 'User'
  belongs_to :to_user, :class_name => 'User'

  attribute :message, :encrypted, type: :string

  validates :from_user, presence: true
  validates :to_user, presence: true
  validates :message, presence: true, length: { maximum: 1024 }
  validate :user_messaging_self?

  def user_messaging_self?
    if self.to_user_id == self.from_user_id
      errors.add(:base, "You cannot message yourself")
    end
  end
end
