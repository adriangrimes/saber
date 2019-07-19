class PrivateMessageSerializer
  include FastJsonapi::ObjectSerializer

  attribute :id
  attribute :from_user do |private_message, params|
    if params[:usernames]
      params[:usernames][private_message.from_user_id]
    else
      User.find(private_message.from_user_id).username
    end
  end
  attribute :to_user do |private_message, params|
    if params[:usernames]
      params[:usernames][private_message.to_user_id]
    else
      User.find(private_message.to_user_id).username
    end
  end
  attribute :message
  attribute :message_read do |private_message, params|
    if params[:user_id] == private_message.from_user_id
      true
    else
      private_message.message_read
    end
  end
  attribute :timestamp do |private_message|
    private_message.created_at.to_datetime.strftime("%Q")
  end
end
