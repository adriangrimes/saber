require 'test_helper'

class GameLogsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @game_log = game_logs(:one)
  end

  test "should get index" do
    get game_logs_url, as: :json
    assert_response :success
  end

  test "should create game_log" do
    assert_difference('GameLog.count') do
      post game_logs_url, params: { game_log: {} }, as: :json
    end

    assert_response 201
  end

  test "should show game_log" do
    get game_log_url(@game_log), as: :json
    assert_response :success
  end

  test "should update game_log" do
    patch game_log_url(@game_log), params: { game_log: {} }, as: :json
    assert_response 200
  end

  test "should destroy game_log" do
    assert_difference('GameLog.count', -1) do
      delete game_log_url(@game_log), as: :json
    end

    assert_response 204
  end
end
