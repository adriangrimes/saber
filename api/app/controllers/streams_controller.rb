class StreamsController < ApplicationController
  require 'websocket-client-simple'
  require "net/http"

  # Called to determine if stream key is valid and return 3XX code if valid
  def start
    p 'stream started'
    if params[:name]
      streaming_user = User.where('stream_key = ?', params[:name]).first
      if streaming_user
        set_and_async_confirm_stream_state("stream-up", streaming_user)
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
    p 'stream stopped'
    if params[:name]
      streaming_user = User.where('stream_key = ?', params[:name]).first
      if streaming_user
        set_and_async_confirm_stream_state("stream-down", streaming_user)
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
    def set_and_async_confirm_stream_state(state, streaming_user)
      Thread.new do
        # Accidental quick stream start-stop protection
        if (state == "stream-down" && streaming_user.user_public_datum.online_status == false) ||
          (state == "stream-up" && streaming_user.user_public_datum.online_status == true)
          sleep 15
          send_stream_state(state, streaming_user)
        else
          sleep 3 if state == "stream-up"
          sleep 1 if state == "stream-down"
        end

        stream_state_confirmed = false
        retries = 20
        retry_count = 0
        until stream_state_confirmed do
          url = URI.parse(Rails.configuration.front_end_hostname + '/hls/' + streaming_user.username.downcase + '/index.m3u8')
          req = Net::HTTP.new(url.host, url.port)
          req.use_ssl = true
          res = req.request_head(url.path)
          p res.code
          if (res.code == "200" && state == "stream-up") || (res.code != "200" && state != "stream-up")
            sleep 4 if state == "stream-up"
            streaming_user.user_public_datum.online_status = (state == "stream-up" ? true : false)
            if streaming_user.user_public_datum.save!
              puts 'saved, attempting to send streamstate'
              send_stream_state(state, streaming_user)
            end
            stream_state_confirmed = true
          end
          if retry_count >= retries && res.code == "404" && state == "stream-up"
            streaming_user.user_public_datum.online_status = false
            streaming_user.user_public_datum.save!
            send_stream_state("stream-down", streaming_user)
            break
          else
            break if retry_count >= retries
          end
          retry_count += 1
          sleep 1
        end
      end
    end

    # Send stream state over websocket to user channel
    def send_stream_state(state, streaming_user)
      # TODO move Status-Auth header key to a credentials file
      WebSocket::Client::Simple.connect(
        Rails.configuration.x.saber.chat_server,
        headers: {"streamstate-auth": "muKl4S80Yi3gQA2v8o2AOPgI8l"}
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
