class StreamsController < ApplicationController

  # Called to determine if stream key is valid and return 3XX code if valid
  def start
    puts params[:name]
    p 'stream started'
    if params[:name]
      streaming_user = User.where('stream_key = ?', params[:name]).first
      if streaming_user
        streaming_user.user_public_datum.online_status = true
        streaming_user.user_public_datum.save!
        # Sending redirect causes nginx rtmp module to redirect the stream
        # to the restricted hlsout application
        redirect_to "rtmp://127.0.0.1/hlsout/" + streaming_user.username.downcase
      else
        render status: :not_found
      end
    else
      render status: :not_found
    end
  end

  def stop
    puts params[:name]
    p 'stream stopped'
    if params[:name]
      streaming_user = User.where('stream_key = ?', params[:name]).first
      if streaming_user
        streaming_user.user_public_datum.online_status = false
        streaming_user.user_public_datum.save!
        render status: :ok
      else
        render status: :not_found
      end
    else
      render status: :not_found
    end
  end

end
