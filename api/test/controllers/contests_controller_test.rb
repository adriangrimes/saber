require 'test_helper'

class ContestsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @contest = contests(:one)
  end

  test "should get index" do
    get contests_url, as: :json
    assert_response :success
  end

  test "should create contest" do
    assert_difference('Contest.count') do
      post contests_url, params: { contest: {} }, as: :json
    end

    assert_response 201
  end

  test "should show contest" do
    get contest_url(@contest), as: :json
    assert_response :success
  end

  test "should update contest" do
    patch contest_url(@contest), params: { contest: {} }, as: :json
    assert_response 200
  end

  test "should destroy contest" do
    assert_difference('Contest.count', -1) do
      delete contest_url(@contest), as: :json
    end

    assert_response 204
  end
end
