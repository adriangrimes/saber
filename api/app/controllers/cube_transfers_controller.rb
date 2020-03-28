class CubeTransfersController < ApplicationController
  # before_action :set_cube_transfer, only: [:show, :update, :destroy]
  before_action :is_user_authorized?

  # POST /cube_transfers
  def create
    @cube_transfer = CubeTransfer.new(cube_transfer_params)
    # If user is not donating to themselves and type equals 'donation'
    if @cube_transfer.from_user_id != @cube_transfer.to_user_id &&
      @cube_transfer.transfer_type == 'donation'

      sender = User.find(@cube_transfer.from_user_id)
      sender_cube_purchases = CubePurchase
                                .where('user_id = ?', sender.id)
                                .where('cleared = true')
                                .where('cancelled = false')
                                .where('cubes_remaining > 0')
                                .order('created_at ASC')
      sender_cubes_remaining = sender_cube_purchases.sum(:cubes_remaining) * 1
      if sender_cubes_remaining >= @cube_transfer.cubes_transferred
        cubes_left_to_transfer = @cube_transfer.cubes_transferred
        sender_cube_purchases.each do |purchase|
          if purchase.cubes_remaining >= cubes_left_to_transfer
            purchase.cubes_remaining -= cubes_left_to_transfer
            purchase.save
            cubes_left_to_transfer = 0
            break
          else
            cubes_left_to_transfer -= purchase.cubes_remaining
            purchase.cubes_remaining = 0
            purchase.save
          end
        end

        if cubes_left_to_transfer == 0
          receiver = User.find(@cube_transfer.to_user_id)
          @cube_transfer.transfer_description =
            "#{sender.username} donated #{@cube_transfer.cubes_transferred} cubes to #{receiver.username}"
          @cube_transfer.broadcaster_payout_percentage =
            receiver.contractor_application.broadcaster_percentage

          if @cube_transfer.save
            render json: CubeTransferSerializer.new(@cube_transfer),
              status: :created
          else
            render json: ErrorSerializer.serialize(@cube_transfer.errors),
              status: :unprocessable_entity
          end
        else
          render status: :internal_server_error
        end
      else
        render json: { errors: "Not enough cubes" }, status: :unprocessable_entity
      end
    else
      render json: { errors: "You cannot donate to yourself" }, status: :unprocessable_entity
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
    def cube_transfer_params
      params.require(:data)
            .require(:attributes)
            .permit(:from_user_id,
                    :to_user_id,
                    :cubes_transferred,
                    :transfer_type)
    end

end
