require 'test_helper'

class ContestVotesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @contest_vote = contest_votes(:one)
  end

  test "should get index" do
    get contest_votes_url, as: :json
    assert_response :success
  end

  test "should create contest_vote" do
    assert_difference('ContestVote.count') do
      post contest_votes_url, params: { contest_vote: {  } }, as: :json
    end

    assert_response 201
  end

  test "should show contest_vote" do
    get contest_vote_url(@contest_vote), as: :json
    assert_response :success
  end

  test "should update contest_vote" do
    patch contest_vote_url(@contest_vote), params: { contest_vote: {  } }, as: :json
    assert_response 200
  end

  test "should destroy contest_vote" do
    assert_difference('ContestVote.count', -1) do
      delete contest_vote_url(@contest_vote), as: :json
    end

    assert_response 204
  end
end
