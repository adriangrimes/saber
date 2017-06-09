class UserSerializer < ActiveModel::Serializer

  has_one :user_pref, dependent: :destroy

  attributes :id,
    :email,
    :username,
    :authentication_token,
    :first_name,
    :middle_name,
    :account_status,
    :admin_status,
    :broadcaster,
    :developer,
    :stream_key,
    :address_line_1,
    :address_line_2,
    :address_line_3,
    :timezone,
    :last_name,
    :birthdate
end
