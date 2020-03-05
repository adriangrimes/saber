class CreditTransfersController < ApplicationController
  # before_action :set_credit_transfer, only: [:show, :update, :destroy]
  before_action :is_user_authorized?

  # POST /credit_transfers
  def create
    @credit_transfer = CreditTransfer.new(credit_transfer_params)
    # If user is not tipping themselves and type equals 'tip'
    if @credit_transfer.from_user_id != @credit_transfer.to_user_id &&
      @credit_transfer.transfer_type == 'tip'

      sender = User.find(@credit_transfer.from_user_id)
      sender_credit_purchases = CreditPurchase
                                .where('user_id = ?', sender.id)
                                .where('cleared = true')
                                .where('cancelled = false')
                                .where('credits_remaining > 0')
                                .order('created_at ASC')
      sender_credits_remaining = sender_credit_purchases.sum(:credits_remaining) * 1
      if sender_credits_remaining >= @credit_transfer.credits_transferred
        credits_left_to_transfer = @credit_transfer.credits_transferred
        sender_credit_purchases.each do |purchase|
          if purchase.credits_remaining >= credits_left_to_transfer
            purchase.credits_remaining -= credits_left_to_transfer
            purchase.save
            credits_left_to_transfer = 0
            break
          else
            credits_left_to_transfer -= purchase.credits_remaining
            purchase.credits_remaining = 0
            purchase.save
          end
        end

        if credits_left_to_transfer == 0
          receiver = User.find(@credit_transfer.to_user_id)
          @credit_transfer.transfer_description =
            "#{sender.username} tipped #{@credit_transfer.credits_transferred} credits to #{receiver.username}"
          @credit_transfer.broadcaster_payout_percentage =
            receiver.contractor_application.broadcaster_percentage

          if @credit_transfer.save
            render json: CreditTransferSerializer.new(@credit_transfer),
              status: :created
          else
            render json: ErrorSerializer.serialize(@credit_transfer.errors),
              status: :unprocessable_entity
          end
        else
          render status: :internal_server_error
        end
      else
        render json: { errors: "Not enough credits" }, status: :unprocessable_entity
      end
    else
      render json: { errors: "You cannot tip yourself" }, status: :unprocessable_entity
    end
  end

  private

    def is_user_authorized?
      if token_is_authorized_for_id?(params[:data][:attributes][:from_user_id])
        return true
      else
        clean_up_and_render_not_found
        return false
      end
    end

    # Only allow a trusted parameter "white list" through.
    def credit_transfer_params
      params.require(:data)
            .require(:attributes)
            .permit(:from_user_id,
                    :to_user_id,
                    :credits_transferred,
                    :transfer_type)
    end

end
