class HelpTopicsController < ApplicationController
  before_action :set_help_topic, only: [:show, :update, :destroy]

  # GET /help_topics
  def index
    @help_topics = HelpTopic.all.includes(:help_sections)

    render json: HelpTopicSerializer.new(@help_topics).serialized_json, status: :ok
  end

  # GET /help_topics/1
  def show
    render json: @help_topic
  end

  # GET /help_sections
  def help_sections
  end

  # POST /help_topics
  def create
    render status: :not_found
  end

  # PATCH/PUT /help_topics/1
  def update
    render status: :not_found
  end

  # DELETE /help_topics/1
  def destroy
    render status: :not_found
  end

  private

  # Use callbacks to share common setup or constraints between actions.
  def set_help_topic
    @help_topic = HelpTopic.find(params[:id])
  end
end
