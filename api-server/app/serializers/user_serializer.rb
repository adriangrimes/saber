class UserSerializer < ActiveModel::Serializer
  attributes :id, :email, :username, :password, :first_name, :last_name, :birthdate
end
