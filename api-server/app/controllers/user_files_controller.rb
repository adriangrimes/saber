class UserFilesController < ApplicationController
  before_action :set_user_file, only: [:show, :update, :destroy]

  # GET /user_files
  def index
    @user_files = UserFile.all

    render json: @user_files
  end

  # GET /user_files/1
  def show
    render json: @user_file
  end

  # POST /user_files
  def create
    @user_file = UserFile.new(user_file_params)

    if @user_file.save
      render json: @user_file, status: :created, location: @user_file
    else
      render json: @user_file.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /user_files/1
  def update
    if @user_file.update(user_file_params)
      render json: @user_file
    else
      render json: @user_file.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_files/1
  def destroy
    @user_file.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_file
      @user_file = UserFile.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_file_params
      params.fetch(:user_file, {})
    end
end
