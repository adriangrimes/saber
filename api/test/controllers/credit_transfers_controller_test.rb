require 'test_helper'

class CreditTransfersControllerTest < ActionDispatch::IntegrationTest
  setup do
    @credit_transfer = credit_transfers(:one)
  end

  test "should get index" do
    get credit_transfers_url, as: :json
    assert_response :success
  end

  test "should create credit_transfer" do
    assert_difference('CreditTransfer.count') do
      post credit_transfers_url, params: { credit_transfer: {} }, as: :json
    end

    assert_response 201
  end

  test "should show credit_transfer" do
    get credit_transfer_url(@credit_transfer), as: :json
    assert_response :success
  end

  test "should update credit_transfer" do
    patch credit_transfer_url(@credit_transfer), params: { credit_transfer: {} }, as: :json
    assert_response 200
  end

  test "should destroy credit_transfer" do
    assert_difference('CreditTransfer.count', -1) do
      delete credit_transfer_url(@credit_transfer), as: :json
    end

    assert_response 204
  end
end
