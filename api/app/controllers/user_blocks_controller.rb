class UserBlocksController < ApplicationController
  before_action :set_user_block, only: [:show, :update, :destroy]

  # GET /user_blocks
  def index
    @user_blocks = UserBlock.all

    render json: @user_blocks
  end

  # GET /user_blocks/1
  def show
    render json: @user_block
  end

  # POST /user_blocks
  def create
    @user_block = UserBlock.new(user_block_params)

    if @user_block.save
      render json: @user_block, status: :created, location: @user_block
    else
      render json: @user_block.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /user_blocks/1
  def update
    if @user_block.update(user_block_params)
      render json: @user_block
    else
      render json: @user_block.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_blocks/1
  def destroy
    @user_block.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_user_block
    @user_block = UserBlock.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def user_block_params
    params.fetch(:user_block, {})
  end
end
