class CreditPurchasesController < ApplicationController
  before_action :set_credit_purchase, only: [:show, :update, :destroy]

  # GET /credit_purchases
  def index
    @credit_purchases = CreditPurchase.all

    render json: @credit_purchases
  end

  # GET /credit_purchases/1
  def show
    render json: @credit_purchase
  end

  # POST /credit_purchases
  def create
    @credit_purchase = CreditPurchase.new(credit_purchase_params)

    if @credit_purchase.save
      render json: @credit_purchase, status: :created, location: @credit_purchase
    else
      render json: @credit_purchase.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /credit_purchases/1
  def update
    if @credit_purchase.update(credit_purchase_params)
      render json: @credit_purchase
    else
      render json: @credit_purchase.errors, status: :unprocessable_entity
    end
  end

  # DELETE /credit_purchases/1
  def destroy
    @credit_purchase.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_credit_purchase
      @credit_purchase = CreditPurchase.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def credit_purchase_params
      params.fetch(:credit_purchase, {})
    end
end
