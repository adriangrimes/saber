class StaticGameDataController < ApplicationController
  before_action :set_static_game_datum, only: [:show, :update, :destroy]

  # GET /static_game_data
  def index
    @static_game_data = StaticGameDatum.all

    render json: @static_game_data
  end

  # GET /static_game_data/1
  def show
    render json: @static_game_datum
  end

  # POST /static_game_data
  def create
    @static_game_datum = StaticGameDatum.new(static_game_datum_params)

    if @static_game_datum.save
      render json: @static_game_datum, status: :created, location: @static_game_datum
    else
      render json: @static_game_datum.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /static_game_data/1
  def update
    if @static_game_datum.update(static_game_datum_params)
      render json: @static_game_datum
    else
      render json: @static_game_datum.errors, status: :unprocessable_entity
    end
  end

  # DELETE /static_game_data/1
  def destroy
    @static_game_datum.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_static_game_datum
    @static_game_datum = StaticGameDatum.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def static_game_datum_params
    params.fetch(:static_game_datum, {})
  end
end
