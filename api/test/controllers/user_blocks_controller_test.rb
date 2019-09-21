require 'test_helper'

class UserBlocksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_block = user_blocks(:one)
  end

  test "should get index" do
    get user_blocks_url, as: :json
    assert_response :success
  end

  test "should create user_block" do
    assert_difference('UserBlock.count') do
      post user_blocks_url, params: { user_block: {} }, as: :json
    end

    assert_response 201
  end

  test "should show user_block" do
    get user_block_url(@user_block), as: :json
    assert_response :success
  end

  test "should update user_block" do
    patch user_block_url(@user_block), params: { user_block: {} }, as: :json
    assert_response 200
  end

  test "should destroy user_block" do
    assert_difference('UserBlock.count', -1) do
      delete user_block_url(@user_block), as: :json
    end

    assert_response 204
  end
end
