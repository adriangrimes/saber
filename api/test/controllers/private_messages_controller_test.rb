require 'test_helper'

class PrivateMessagesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @private_message = private_messages(:one)
  end

  test "should get index" do
    get private_messages_url, as: :json
    assert_response :success
  end

  test "should create private_message" do
    assert_difference('PrivateMessage.count') do
      post private_messages_url, params: { private_message: {  } }, as: :json
    end

    assert_response 201
  end

  test "should show private_message" do
    get private_message_url(@private_message), as: :json
    assert_response :success
  end

  test "should update private_message" do
    patch private_message_url(@private_message), params: { private_message: {  } }, as: :json
    assert_response 200
  end

  test "should destroy private_message" do
    assert_difference('PrivateMessage.count', -1) do
      delete private_message_url(@private_message), as: :json
    end

    assert_response 204
  end
end
