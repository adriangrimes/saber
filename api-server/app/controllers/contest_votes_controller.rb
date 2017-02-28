class ContestVotesController < ApplicationController
  before_action :set_contest_vote, only: [:show, :update, :destroy]

  # GET /contest_votes
  def index
    @contest_votes = ContestVote.all

    render json: @contest_votes
  end

  # GET /contest_votes/1
  def show
    render json: @contest_vote
  end

  # POST /contest_votes
  def create
    @contest_vote = ContestVote.new(contest_vote_params)

    if @contest_vote.save
      render json: @contest_vote, status: :created, location: @contest_vote
    else
      render json: @contest_vote.errors, status: :unprocessable_entity
    end
  end

  # PATCH/PUT /contest_votes/1
  def update
    if @contest_vote.update(contest_vote_params)
      render json: @contest_vote
    else
      render json: @contest_vote.errors, status: :unprocessable_entity
    end
  end

  # DELETE /contest_votes/1
  def destroy
    @contest_vote.destroy
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_contest_vote
      @contest_vote = ContestVote.find(params[:id])
    end

    # Only allow a trusted parameter "white list" through.
    def contest_vote_params
      params.fetch(:contest_vote, {})
    end
end
