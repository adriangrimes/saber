require 'test_helper'

class UsersControllerTest < ActionDispatch::IntegrationTest

  setup do
    @user = users(:one)
  end

  teardown do
    Rails.cache.clear
  end

  test "should show user" do
    get user_url(@user),
      headers: { "Authorization" => "Token token=\"#{@user.authentication_token}\", email=\"#{@user.email}\""},
      as: :json
    assert_response 200
  end

  test "should respond unauthorized" do
    get user_url(@user),
      headers: { "Authorization" => "Token token=\"987654123\", email=\"#{@user.email}\""},
      as: :json
    assert_response 401
  end

  test "should update non-sensitive user fields" do
    assert_equal false, @user.send_email_followed_online
    patch user_url(@user),
      headers: { "Authorization" => "Token token=\"#{@user.authentication_token}\", email=\"#{@user.email}\""},
      params: { data: { attributes: {
        send_email_followed_online: true
      }}},
      as: :json
    assert_response 200
    @user.reload
    assert_equal true, @user.send_email_followed_online
  end

  test "should update user email" do
    assert_equal "user1@test.com", @user.email
    patch user_url(@user),
      headers: { "Authorization" => "Token token=\"#{@user.authentication_token}\", email=\"#{@user.email}\""},
      params: { data: { attributes: {
        current_password: 12345678,
        email: "newuser1@test.com"
      }}},
      as: :json
    assert_response 200
    @user.reload
    @user.confirm
    assert_equal "newuser1@test.com", @user.email
  end

  test "should create user" do
    skip "User creation handled by registrations_controller"
  end

  test "should destroy user" do
    skip "User deletion handled by rake task"
  end
end
