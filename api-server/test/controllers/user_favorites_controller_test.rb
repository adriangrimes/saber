require 'test_helper'

class UserFavoritesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_favorite = user_favorites(:one)
  end

  test "should get index" do
    get user_favorites_url, as: :json
    assert_response :success
  end

  test "should create user_favorite" do
    assert_difference('UserFavorite.count') do
      post user_favorites_url, params: { user_favorite: {  } }, as: :json
    end

    assert_response 201
  end

  test "should show user_favorite" do
    get user_favorite_url(@user_favorite), as: :json
    assert_response :success
  end

  test "should update user_favorite" do
    patch user_favorite_url(@user_favorite), params: { user_favorite: {  } }, as: :json
    assert_response 200
  end

  test "should destroy user_favorite" do
    assert_difference('UserFavorite.count', -1) do
      delete user_favorite_url(@user_favorite), as: :json
    end

    assert_response 204
  end
end
