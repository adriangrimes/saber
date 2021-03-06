class StreamsController < ApplicationController
  require 'websocket-client-simple'
  require "net/http"

  # Called by NGINX.
  # Sends stream-up over websockets to users watching, and returns redirect
  # response to nginx to internally redirect stream to the restricted hlsout RTMP app
  def start
    if params[:name]
      streaming_user = User.where('stream_key = ?', params[:name]).first
      if streaming_user
        async_confirm_and_set_stream_state(streaming_user)
        # Sending a redirect causes NGINX rtmp module to redirect the stream
        # to the restricted hlsout application. This also effectively translates
        # the users stream key to their username for client-side use.
        redirect_to "rtmp://127.0.0.1/hlsout/" + streaming_user.username.downcase
      else
        render status: :not_found
      end
    else
      render status: :not_found
    end
  end

  # Called by NGINX.
  # Sends stream-down over websockets to users watching stream
  def stop
    if params[:name]
      streaming_user = User.where('stream_key = ?', params[:name]).first
      if streaming_user
        async_confirm_and_set_stream_state(streaming_user)
        render status: :ok
      else
        render status: :not_found
      end
    else
      render status: :not_found
    end
  end

  private

  # Wait until HLS files are avaiable or unavailable for streaming before
  # setting online status
  def async_confirm_and_set_stream_state(streaming_user)
    Thread.new do
      stream_state_confirmed = false
      retries = 30
      retry_count = 0
      confirmations = 15
      confirmation_count = 0
      stream_found_count = 0
      stream_not_found_count = 0

      until stream_state_confirmed do
        # Check stream once per second
        sleep 1
        url = URI.parse(Rails.configuration.front_end_hostname +
          '/hls/' + streaming_user.username.downcase + '/index.m3u8')
        req = Net::HTTP.new(url.host, url.port)
        req.use_ssl = true
        res = req.request_head(url.path)

        # If stream manifest is found, increment found_count and reset
        # not_found count. Otherwise, do the opposite
        if res.code == "200"
          stream_found_count += 1
          stream_not_found_count = 0
        else
          stream_not_found_count += 1
          stream_found_count = 0
        end

        # If stream is confirmed, set status to true, and send a 'stream-up'
        # message to all users in the broadcasters chat room.
        if stream_found_count == confirmations
          streaming_user.user_public_datum.online_status = true
          if streaming_user.user_public_datum.save!
            send_stream_state("stream-up", streaming_user)
            stream_state_confirmed = true
            break
          end
        elsif stream_not_found_count == confirmations
          streaming_user.user_public_datum.online_status = false
          if streaming_user.user_public_datum.save!
            send_stream_state("stream-down", streaming_user)
            stream_state_confirmed = true
            break
          end
        end

        # If retries exceed the limit, the stream is either down or unstable.
        # Send 'stream-down' message to all chat room users.
        if retry_count >= retries
          streaming_user.user_public_datum.online_status = false
          if streaming_user.user_public_datum.save!
            send_stream_state("stream-down", streaming_user)
            stream_state_confirmed = true
          end
          break
        end

        retry_count += 1
      end
    end
  end

  # Send stream state over websocket to user channel
  def send_stream_state(state, streaming_user)
    WebSocket::Client::Simple.connect(
      Rails.configuration.x.saber.chat_server,
      headers: { "streamstate-auth": Rails.application.credentials.stream_state_auth }
    ) do |ws|
      ws.on :open do
        ws.send({
          type: "StreamState",
          data: {
            state: state,
            username: streaming_user.username.downcase
          }
        }.to_json)
        ws.close
      end
    end
  end
end
