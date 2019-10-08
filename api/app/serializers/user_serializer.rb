class UserSerializer
  include FastJsonapi::ObjectSerializer

  has_one :user_public_datum

  attributes :id,
    ## Database authenticatable
    :username,
    :email
  attribute :password do nil end
  attribute :current_password do nil end

  ## Account data
  attributes :broadcaster,
    :developer,
    :affiliate
  # attribute :account_status do nil end
  attribute :pending_deletion_since do nil end
  attributes :security_questions,
    :stream_key
  attribute :credits_remaining do |user|
    credits_remaining = CreditPurchase
                        .select(:credits_remaining)
                        .where('user_id = ?', user.id)
                        .where('cleared = true')
                        .where('cancelled = false')
                        .sum(:credits_remaining)
    credits_remaining * 1
  end

  ## Site settings
  attributes :dark_mode,
    :send_email_followed_online,
    :send_email_site_news,
    :private_message_email_notifications,
    :private_user_notes

end
