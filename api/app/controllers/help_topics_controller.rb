class HelpTopicsController < ApplicationController
  before_action :set_help_topic, only: [:show]

  # GET /help_topics
  def index
    @help_topics = HelpTopic.all.includes(:help_sections)

    render json: HelpTopicSerializer.new(@help_topics).serialized_json, status: :ok
  end

  # GET /help_topics/1
  def show
    render json: @help_topic
  end

  private

    # Use callbacks to share common setup or constraints between actions.
    def set_help_topic
      @help_topic = HelpTopic.find(params[:id])
    end

end
