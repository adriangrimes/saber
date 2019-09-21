require 'test_helper'

class StaticGameDataControllerTest < ActionDispatch::IntegrationTest
  setup do
    @static_game_datum = static_game_data(:one)
  end

  test "should get index" do
    get static_game_data_url, as: :json
    assert_response :success
  end

  test "should create static_game_datum" do
    assert_difference('StaticGameDatum.count') do
      post static_game_data_url, params: { static_game_datum: {} }, as: :json
    end

    assert_response 201
  end

  test "should show static_game_datum" do
    get static_game_datum_url(@static_game_datum), as: :json
    assert_response :success
  end

  test "should update static_game_datum" do
    patch static_game_datum_url(@static_game_datum), params: { static_game_datum: {} }, as: :json
    assert_response 200
  end

  test "should destroy static_game_datum" do
    assert_difference('StaticGameDatum.count', -1) do
      delete static_game_datum_url(@static_game_datum), as: :json
    end

    assert_response 204
  end
end
