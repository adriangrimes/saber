class ConversationSerializer
  include FastJsonapi::ObjectSerializer
  attribute :id
  attribute :username
  attribute :unread
end
