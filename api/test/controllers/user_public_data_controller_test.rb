require 'test_helper'

class UserPublicDataControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_public_datum = user_public_data(:one)
  end

  test "should get index" do
    get user_public_data_url, as: :json
    assert_response :success
  end

  test "should create user_public_datum" do
    assert_difference('UserPublicDatum.count') do
      post user_public_data_url, params: { user_public_datum: {} }, as: :json
    end

    assert_response 201
  end

  test "should show user_public_datum" do
    get user_public_datum_url(@user_public_datum), as: :json
    assert_response :success
  end

  test "should update user_public_datum" do
    patch user_public_datum_url(@user_public_datum), params: { user_public_datum: {} }, as: :json
    assert_response 200
  end

  test "should destroy user_public_datum" do
    assert_difference('UserPublicDatum.count', -1) do
      delete user_public_datum_url(@user_public_datum), as: :json
    end

    assert_response 204
  end
end
