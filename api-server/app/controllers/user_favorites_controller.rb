class UserFavoritesController < ApplicationController
  before_action :set_user_favorite, only: [:show, :update, :destroy]

  # GET /user_favorites
  def index
    @user_favorites = UserFavorite.all

    render json: @user_favorites
  end

  # GET /user_favorites/1
  def show
    render json: @user_favorite
  end

  # POST /user_favorites
  def create
    @user_favorite = UserFavorite.new(user_favorite_params)

    if @user_favorite.save
      render json: @user_favorite, status: :created, location: @user_favorite
    else
      render json: @user_favorite.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /user_favorites/1
  def update
    if @user_favorite.update(user_favorite_params)
      render json: @user_favorite
    else
      render json: @user_favorite.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_favorites/1
  def destroy
    @user_favorite.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_favorite
      @user_favorite = UserFavorite.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_favorite_params
      params.fetch(:user_favorite, {})
    end
end
