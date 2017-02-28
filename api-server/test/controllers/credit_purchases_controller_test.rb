require 'test_helper'

class CreditPurchasesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @credit_purchase = credit_purchases(:one)
  end

  test "should get index" do
    get credit_purchases_url, as: :json
    assert_response :success
  end

  test "should create credit_purchase" do
    assert_difference('CreditPurchase.count') do
      post credit_purchases_url, params: { credit_purchase: {  } }, as: :json
    end

    assert_response 201
  end

  test "should show credit_purchase" do
    get credit_purchase_url(@credit_purchase), as: :json
    assert_response :success
  end

  test "should update credit_purchase" do
    patch credit_purchase_url(@credit_purchase), params: { credit_purchase: {  } }, as: :json
    assert_response 200
  end

  test "should destroy credit_purchase" do
    assert_difference('CreditPurchase.count', -1) do
      delete credit_purchase_url(@credit_purchase), as: :json
    end

    assert_response 204
  end
end
