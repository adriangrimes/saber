class PayoutsController < ApplicationController
  before_action :set_payout, only: [:show, :update, :destroy]

  # # GET /payouts
  # def index
  #   @payouts = Payout.all
  #
  #   render json: @payouts
  # end
  #
  # # GET /payouts/1
  # def show
  #   render json: @payout
  # end

  # # POST /payouts
  # def create
  #   @payout = Payout.new(payout_params)
  #
  #   if @payout.save
  #     render json: @payout, status: :created, location: @payout
  #   else
  #     render json: @payout.errors, status: :unprocessable_entity
  #   end
  # end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_payout
      @payout = Payout.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def payout_params
      params.fetch(:payout, {})
    end
end
