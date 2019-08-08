require 'test_helper'

class UserPrefsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_pref = user_prefs(:one)
  end

  test "should get index" do
    get user_prefs_url, as: :json
    assert_response :success
  end

  test "should create user_pref" do
    assert_difference('UserPref.count') do
      post user_prefs_url, params: { user_pref: {  } }, as: :json
    end

    assert_response 201
  end

  test "should show user_pref" do
    get user_pref_url(@user_pref), as: :json
    assert_response :success
  end

  test "should update user_pref" do
    patch user_pref_url(@user_pref), params: { user_pref: {  } }, as: :json
    assert_response 200
  end

  test "should destroy user_pref" do
    assert_difference('UserPref.count', -1) do
      delete user_pref_url(@user_pref), as: :json
    end

    assert_response 204
  end
end
