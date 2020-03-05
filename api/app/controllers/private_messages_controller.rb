class PrivateMessagesController < ApplicationController
  # before_action :set_private_message, only: [:show, :update, :destroy]

  # GET /private_messages?id=2&with=UserTester1&page=1
  def index
    user_id = params[:id].to_i
    if params[:with].present?
      with_user = User.where('username = ?', params[:with].to_s).first
    end
    if params[:page].present?
      page = params[:page].to_i
      page = 1 if page < 1
    else
      page = 1
    end

    if with_user.try(:id)
      if token_is_authorized_for_id?(user_id)

        @private_messages = PrivateMessage
          .includes(:to_user, :from_user)
          .where('(from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)',
                 user_id, with_user.id, with_user.id, user_id)
          .order(created_at: :desc)
          .paginate(page: page, per_page: 6)

        @private_messages = @private_messages.sort_by(&:created_at)

        # Collect usernames to pass to the serializer, so that it doesn't query
        # for each users username individually
        usernames = {}
        @private_messages.each do |message|
          if usernames[message.to_user_id].blank?
            usernames[message.to_user_id] = message.to_user.username
          end
          if usernames[message.from_user_id].blank?
            usernames[message.from_user_id] = message.from_user.username
          end
        end

        render json: PrivateMessageSerializer
          .new(@private_messages, params: { user_id: user_id, usernames: usernames })
          .serialized_json

        # Mark messages that were pulled as read, since they have appeared on
        # the users screen
        @private_messages.each do |message|
          if message.from_user_id != user_id && message.message_read != true
            message.message_read = true
            message.save!
          end
        end
      else
        render status: :not_found
      end
    end
  end

  # POST /private_messages
  def create
    raw_params = params[:data][:attributes]
    from_user = User.where('username = ?', raw_params[:from_user].to_s).first
    if token_is_authorized_for_id?(from_user.try(:id))
      to_user = User.where('username = ?', raw_params[:to_user].to_s).first
      @private_message = PrivateMessage.new(private_message_params)
      @private_message.to_user_id = to_user.try(:id) || 0
      @private_message.from_user_id = from_user.try(:id) || 0

      if @private_message.save
        render json: PrivateMessageSerializer
          .new(@private_message)
          .serialized_json, status: :created
      else
        render json: ErrorSerializer.serialize(@private_message.errors),
          status: :unprocessable_entity
      end
    else
      render status: :not_found
    end
  end

  # GET /private_messages/conversations?id=1
  def conversations
    user_id = params[:id].to_i
    if token_is_authorized_for_id?(user_id)
      private_messages_for_conversations = PrivateMessage
        .find_by_sql(['SELECT * FROM private_messages AS pm
          INNER JOIN (
            SELECT private_messages.to_user_id, private_messages.from_user_id, MAX(private_messages.created_at) AS MaxCreatedAt
            FROM private_messages
            GROUP BY private_messages.to_user_id, private_messages.from_user_id
          ) tm ON (pm.to_user_id = ? OR pm.from_user_id = ?)
              AND pm.created_at = tm.MaxCreatedAt
          WHERE pm.from_user_id = ? OR pm.to_user_id = ?
          ORDER BY pm.created_at DESC',
          user_id, user_id, user_id, user_id])

      # Include all user record data to prevent a lookup per each user
      ActiveRecord::Associations::Preloader.new.preload(
        private_messages_for_conversations, [:to_user, :from_user]
      )
      sanitized_where = PrivateMessage.sanitize_sql_for_assignment(
        'pm.to_user_id = ' + user_id.to_s + ' AND pm.message_read = false'
      )
      users_with_unread = ActiveRecord::Base.connection.exec_query(
        'SELECT pm.to_user_id, pm.from_user_id, COUNT(pm.message_read) AS unread_count
        FROM private_messages AS pm
        WHERE ' + sanitized_where + '
        GROUP BY pm.from_user_id'
      )

      # Build a hash with user ID as the key, and their username as the value
      conversation_hash_array = {}
      private_messages_for_conversations.each do |message|
        if message.to_user_id != user_id
          if conversation_hash_array[message.to_user_id].blank?
            conversation_hash_array[message.to_user_id] =
              { username: message.to_user.username }
          end
        elsif message.from_user_id != user_id
          if conversation_hash_array[message.from_user_id].blank?
            conversation_hash_array[message.from_user_id] =
              { username: message.from_user.username }
          end
        end
      end

      # Use the hash of conversations and create an array of Conversations
      # with the unread message count added
      conversations = []
      conversation_hash_array.each_with_index do |conversation, index|
        unread_count = 0
        users_with_unread.each do |row|
          if row['from_user_id'] == conversation[0]
            unread_count = row['unread_count']
          end
        end
        conversations.push(
          Conversation.new({
            id: index + 1,
            username: conversation[1][:username],
            unread: unread_count
          })
        )
      end

      render json: ConversationSerializer
        .new(conversations)
        .serialized_json,
             status: :ok
    else
      render status: :not_found
    end
  end

  private

    # Only allow a trusted parameter "white list" through.
    def private_message_params
      params.require(:data)
            .require(:attributes)
            .permit(:from_user_id,
                    :to_user_id,
                    :message)
    end

end
