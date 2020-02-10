require 'test_helper'

class PayoutsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @payout = payouts(:one)
  end

  test "should get index" do
    get payouts_url, as: :json
    assert_response :success
  end

  test "should create payout" do
    assert_difference('Payout.count') do
      post payouts_url, params: { payout: {  } }, as: :json
    end

    assert_response 201
  end

  test "should show payout" do
    get payout_url(@payout), as: :json
    assert_response :success
  end

  test "should update payout" do
    patch payout_url(@payout), params: { payout: {  } }, as: :json
    assert_response 200
  end

  test "should destroy payout" do
    assert_difference('Payout.count', -1) do
      delete payout_url(@payout), as: :json
    end

    assert_response 204
  end
end
