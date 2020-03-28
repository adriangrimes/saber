class CubePurchasesController < ApplicationController

  before_action :set_cube_purchase, only: [:show, :update, :destroy]

  # GET /cube_purchases
  def index
    @cube_purchases = CubePurchase.all

    render json: @cube_purchases
  end

  # GET /cube_purchases/1
  def show
    render json: @cube_purchase
  end

  # POST /cube_purchases
  def create
    if token_is_authorized_for_id?(cube_purchase_params[:user_id])
      @cube_purchase = CubePurchase.new(cube_purchase_params)
      @cube_purchase.purchase_type = 'purchase'
      @cube_purchase.purchase_amount =
        Rails.application.config.x.saber
             .cube_denominations.key(cube_purchase_params[:cubes_purchased])
      @cube_purchase.payment_method = 'paypal'
      @cube_purchase.cleared = true
      @cube_purchase.cancelled = false
      @cube_purchase.cubes_purchased = cube_purchase_params[:cubes_purchased]
      @cube_purchase.cubes_remaining = cube_purchase_params[:cubes_purchased]

      if @cube_purchase.save
        render json: CubePurchaseSerializer.new(@cube_purchase),
          status: :created
      else
        render json: ErrorSerializer.serialize(@cube_purchase.errors),
          status: :unprocessable_entity
      end
    else
      render status: :not_found
    end
  end

  # PATCH/PUT /cube_purchases/1
  def update
    if @cube_purchase.update(cube_purchase_params)
      render json: @cube_purchase
    else
      render json: ErrorSerializer.serialize(@cube_purchase.errors),
        status: :unprocessable_entity
    end
  end

  # DELETE /cube_purchases/1
  def destroy
    @cube_purchase.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_cube_purchase
    @cube_purchase = CubePurchase.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def cube_purchase_params
    params.require(:data)
          .require(:attributes)
          .permit(:user_id,
                  :cubes_purchased)
  end
end
