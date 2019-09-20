class Conversation
  # Conversations are not a "real" model with a table
  include ActiveModel::Model

  attr_accessor :id, :username, :unread

end
