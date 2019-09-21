require 'ipaddr'

class ChatTicketsController < ApplicationController
  before_action :is_user_authorized?, only: [:create]

  # GET /chat_tickets
  def index
    if params[:identifier].present?
      ip = IPAddr.new(params[:identifier]).native.to_s # TODO might need ipv6 support?
      @chat_ticket = ChatTicket.where("updated_at >= ? AND user_ip = ?", 1.minute.ago, ip).first
      if @chat_ticket
        render json: {
          username: @chat_ticket.username,
          ip: @chat_ticket.user_ip
        },
               status: :ok
        @chat_ticket.destroy
      else
        puts 'no ticket'
        render status: :not_found
      end
    else
      puts 'nothing here'
      render status: :unprocessable_entity
    end
  end

  # POST /chat_tickets
  def create
    # TODO: add scheduled job to remove old chat tickets (every 24hrs?)
    @chat_ticket = ChatTicket.find_by(user_id: @authenticated_user[:id])
    if @chat_ticket
      @chat_ticket.user_ip = request.remote_ip
      @chat_ticket.touch
      if @chat_ticket.save
        render json: { status: 'ok' }, status: :ok
      else
        render status: :unprocessable_entity
      end
    else
      @chat_ticket = ChatTicket.new({
                                      user_id: @authenticated_user[:id],
                                      user_ip: request.remote_ip,
                                      username: @authenticated_user[:username]
                                    })
      if @chat_ticket.save
        render json: { status: 'ok' }, status: :ok
      else
        render status: :unprocessable_entity
      end
    end
  end

  # GET /chat_tickets/1
  def show
    render status :not_found
  end

  # PATCH/PUT /chat_tickets/1
  def update
    render status :not_found
  end

  # DELETE /chat_tickets/1
  def destroy
    render status :not_found
  end

  private

  def is_user_authorized?
    if token_is_authorized_for_id?(params[:id])
      return true
    else
      clean_up_and_render_unauthorized
      return false
    end
  end
end
