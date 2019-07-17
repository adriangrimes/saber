class PrivateMessageSerializer
  include FastJsonapi::ObjectSerializer

  attribute :id
  attribute :from_user do |object, params|
    if params[:usernames]
      params[:usernames][object.from_user_id]
    else
      User.find(object.from_user_id).username
    end
  end
  attribute :to_user do |object, params|
    if params[:usernames]
      params[:usernames][object.to_user_id]
    else
      User.find(object.to_user_id).username
    end
  end
  attribute :message
  attribute :message_read do |object, params|
    if params[:user_id] == object.from_user_id
      true
    else
      object.message_read
    end
  end
  attribute :timestamp do |object|
    object.created_at.to_datetime.strftime("%Q")
  end
end
