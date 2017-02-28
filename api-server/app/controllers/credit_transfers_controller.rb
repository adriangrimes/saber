class CreditTransfersController < ApplicationController
  before_action :set_credit_transfer, only: [:show, :update, :destroy]

  # GET /credit_transfers
  def index
    @credit_transfers = CreditTransfer.all

    render json: @credit_transfers
  end

  # GET /credit_transfers/1
  def show
    render json: @credit_transfer
  end

  # POST /credit_transfers
  def create
    @credit_transfer = CreditTransfer.new(credit_transfer_params)

    if @credit_transfer.save
      render json: @credit_transfer, status: :created, location: @credit_transfer
    else
      render json: @credit_transfer.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /credit_transfers/1
  def update
    if @credit_transfer.update(credit_transfer_params)
      render json: @credit_transfer
    else
      render json: @credit_transfer.errors, status: :unprocessable_entity
    end
  end

  # DELETE /credit_transfers/1
  def destroy
    @credit_transfer.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_credit_transfer
      @credit_transfer = CreditTransfer.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def credit_transfer_params
      params.fetch(:credit_transfer, {})
    end
end
