class GameLogsController < ApplicationController
  before_action :set_game_log, only: [:show, :update, :destroy]

  # GET /game_logs
  def index
    @game_logs = GameLog.all

    render json: @game_logs
  end

  # GET /game_logs/1
  def show
    render json: @game_log
  end

  # POST /game_logs
  def create
    @game_log = GameLog.new(game_log_params)

    if @game_log.save
      render json: @game_log, status: :created, location: @game_log
    else
      render json: @game_log.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /game_logs/1
  def update
    if @game_log.update(game_log_params)
      render json: @game_log
    else
      render json: @game_log.errors, status: :unprocessable_entity
    end
  end

  # DELETE /game_logs/1
  def destroy
    @game_log.destroy
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_game_log
    @game_log = GameLog.find(params[:id])
  end

  # Only allow a trusted parameter "white list" through.
  def game_log_params
    params.fetch(:game_log, {})
  end
end
