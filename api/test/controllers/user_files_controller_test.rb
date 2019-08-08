require 'test_helper'

class UserFilesControllerTest < ActionDispatch::IntegrationTest
  setup do
    @user_file = user_files(:one)
  end

  test "should get index" do
    get user_files_url, as: :json
    assert_response :success
  end

  test "should create user_file" do
    assert_difference('UserFile.count') do
      post user_files_url, params: { user_file: {  } }, as: :json
    end

    assert_response 201
  end

  test "should show user_file" do
    get user_file_url(@user_file), as: :json
    assert_response :success
  end

  test "should update user_file" do
    patch user_file_url(@user_file), params: { user_file: {  } }, as: :json
    assert_response 200
  end

  test "should destroy user_file" do
    assert_difference('UserFile.count', -1) do
      delete user_file_url(@user_file), as: :json
    end

    assert_response 204
  end
end
