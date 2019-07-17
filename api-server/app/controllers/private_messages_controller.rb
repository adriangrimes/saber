class PrivateMessagesController < ApplicationController
  # before_action :set_private_message, only: [:show, :update, :destroy]

  # GET /private_messages
  def index
    user_id = params[:id].to_i
    if params[:with].present?
      with_user = User.where('lower(username) = ?', params[:with].to_s.downcase).first
    end
    if (with_user.try(:id) && user_id != with_user.id) || with_user.blank?
      if token_is_authorized_for_id?(user_id)
        # Build array of unique user ids to use in query
        conversation_list_sql = PrivateMessage
          .where('from_user_id = ? OR to_user_id = ?', user_id, user_id)
          .order('created_at DESC')
          .group(:from_user_id, :to_user_id)
          .to_sql

        p conversation_list_sql.inspect

        if with_user.try(:id)
          private_messages_sql = PrivateMessage
            .where('(from_user_id = ? AND to_user_id = ?) OR (from_user_id = ? AND to_user_id = ?)',
              user_id, with_user.id, with_user.id, user_id)
            .to_sql
          sql = PrivateMessage.connection.unprepared_statement {
            "(#{private_messages_sql} UNION #{conversation_list_sql}) AS private_messages"
          }
          @private_messages = PrivateMessage.from(sql).order('created_at ASC')
        else
          sql = PrivateMessage.connection.unprepared_statement {
            "(#{conversation_list_sql}) AS private_messages"
          }
          @private_messages = PrivateMessage.from(sql).order('created_at ASC')
        end

        usernames = {}
        @private_messages.each do |message|
          usernames[message.to_user_id] = User.find(message.to_user_id).username
          usernames[message.from_user_id] = User.find(message.from_user_id).username
        end
        p usernames

        render json: PrivateMessageSerializer
          .new(@private_messages, params: { user_id: user_id, usernames: usernames })
          .serialized_json

        @private_messages.each do |message|
          if message.from_user_id != user_id && message.message_read != true
            message.message_read = true
            message.save
          end
        end
      else
        render status: :unauthorized
      end
    else
      render json: { errors: "You cannot send messages to yourself" }, status: :unprocessable_entity
    end
  end

  # GET /private_messages/1
  def show
    render status: :not_found
  end

  # POST /private_messages
  def create
    raw_params = params[:data][:attributes]
    from_user = User.where('lower(username) = ?', raw_params[:from_user].to_s.downcase).first
    if token_is_authorized_for_id?(from_user.try(:id))
      to_user = User.where('lower(username) = ?', raw_params[:to_user].to_s.downcase).first
      @private_message = PrivateMessage.new(private_message_params)
      @private_message.to_user_id = to_user.try(:id) || 0
      @private_message.from_user_id = from_user.try(:id) || 0

      if @private_message.save
        render json: PrivateMessageSerializer
          .new(@private_message)
          .serialized_json, status: :created
      else
        render json: { errors: @private_message.errors.full_messages }, status: :unprocessable_entity
      end
    else
      render status: :unauthorized
    end
  end

  # PATCH/PUT /private_messages/1
  def update
    render status: :not_found
  end

  # DELETE /private_messages/1
  def destroy
    render status: :not_found
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    # def set_private_message
    #   @private_message = PrivateMessage.find(params[:id])
    # end

    # Only allow a trusted parameter "white list" through.
    def private_message_params
      params.require(:data)
        .require(:attributes)
        .permit(:from_user_id,
          :to_user_id,
          :message)
    end
end
