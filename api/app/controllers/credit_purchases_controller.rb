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
    if token_is_authorized_for_id?(credit_purchase_params[:user_id])
      @credit_purchase = CreditPurchase.new(credit_purchase_params)
      @credit_purchase.purchase_type = 'purchase'
      @credit_purchase.purchase_amount =
        Rails.application.config.x.saber
             .credit_denominations.key(credit_purchase_params[:credits_purchased])  
      @credit_purchase.payment_method = 'paypal'
             
      @credit_purchase.cleared = true
      @credit_purchase.cancelled = false
      @credit_purchase.credits_purchased = credit_purchase_params[:credits_purchased]
      @credit_purchase.credits_remaining = credit_purchase_params[:credits_purchased]

      if @credit_purchase.save
        render json: CreditPurchaseSerializer.new(@credit_purchase), status: :created
      else
        render json: @credit_purchase.errors, status: :unprocessable_entity
      end
    else
      render status: :unauthorized
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
    params.require(:data)
          .require(:attributes)
          .permit(:user_id,
                  :credits_purchased)
    # params.fetch(:credit_purchase, {})
  end
end
