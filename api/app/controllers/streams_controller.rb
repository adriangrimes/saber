class StreamsController < ApplicationController
  require 'websocket-client-simple'
  require "net/http"

  # Called by nginx.
  # Sends stream-up to users watching, and returns redirect code to nginx to
  # internally redirect stream to the restricted hlsout app
  def start
    p 'stream starting'
    if params[:name]
      streaming_user = User.where('stream_key = ?', params[:name]).first
      if streaming_user
        async_set_and_confirm_stream_state(streaming_user)
        # Sending a redirect causes nginx rtmp module to redirect the stream
        # to the restricted hlsout application. This also effectively translates
        # the users stream key to their username for client use.
        redirect_to "rtmp://127.0.0.1/hlsout/" + streaming_user.username.downcase
      else
        render status: :not_found
      end
    else
      render status: :not_found
    end
  end

  # Called by nginx.
  # Sends stream-down to users watching stream
  def stop
    p 'stream stopping'
    if params[:name]
      streaming_user = User.where('stream_key = ?', params[:name]).first
      if streaming_user
        async_set_and_confirm_stream_state(streaming_user)
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
  def async_set_and_confirm_stream_state(streaming_user)
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
        p "code: " + res.code

        # If stream manifest is found, increment found_count and reset
        # not_found count. Otherwise, do the opposite
        if res.code == "200"
          p 'stream_found_count: ' + stream_found_count.to_s
          stream_found_count += 1
          stream_not_found_count = 0
        else
          p 'stream_not_found_count: ' + stream_not_found_count.to_s
          stream_not_found_count += 1
          stream_found_count = 0
        end

        if stream_found_count == confirmations
          p "stream confirmed - setting online status to true"
          streaming_user.user_public_datum.online_status = true
          if streaming_user.user_public_datum.save!
            puts 'saved, attempting to send streamstate stream-up'
            send_stream_state("stream-up", streaming_user)
            stream_state_confirmed = true
            break
          end
        elsif stream_not_found_count == confirmations
          p "stream unconfirmed - setting online status to false"
          streaming_user.user_public_datum.online_status = false
          if streaming_user.user_public_datum.save!
            puts 'saved, attempting to send streamstate stream-down'
            send_stream_state("stream-down", streaming_user)
            stream_state_confirmed = true
            break
          end
        end

        if retry_count >= retries
          p "retries exceeded, stream unstable - sending stream-down"
          streaming_user.user_public_datum.online_status = false
          if streaming_user.user_public_datum.save!
            puts 'saved online status, attempting to send streamstate stream-down'
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
    # TODO move Status-Auth header key to a credentials file
    WebSocket::Client::Simple.connect(
      Rails.configuration.x.saber.chat_server,
      headers: { "streamstate-auth": "muKl4S80Yi3gQA2v8o2AOPgI8l" }
    ) do |ws|
      ws.on :open do
        puts "connected - sending streamstate " + state
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
