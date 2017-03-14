class UserPrefsController < ApplicationController
  before_action :set_user_pref, only: [:show, :update, :destroy]

  # GET /user_prefs
  def index
    @user_prefs = UserPref.all

    render json: @user_prefs
  end

  # GET /user_prefs/1
  def show
    render json: @user_pref
  end

  # POST /user_prefs
  def create
    @user_pref = UserPref.new(user_pref_params)

    if @user_pref.save
      render json: @user_pref, status: :created, location: @user_pref
    else
      render json: @user_pref.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /user_prefs/1
  def update
    if @user_pref.update(user_pref_params)
      render json: @user_pref
    else
      render json: @user_pref.errors, status: :unprocessable_entity
    end
  end

  # DELETE /user_prefs/1
  def destroy
    @user_pref.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_user_pref
      @user_pref = UserPref.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def user_pref_params
      params.fetch(:user_pref, {})
    end
end
