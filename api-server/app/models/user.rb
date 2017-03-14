class User < ApplicationRecord
  has_one :user_pref, dependent: :destroy
end
