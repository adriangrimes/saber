require 'test_helper'

class PrereleaseEmailsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @prerelease_email = prerelease_emails(:one)
  end

  test "should get index" do
    get prerelease_emails_url, as: :json
    assert_response :success
  end

  test "should create prerelease_email" do
    assert_difference('PrereleaseEmail.count') do
      post prerelease_emails_url, params: { prerelease_email: {  } }, as: :json
    end

    assert_response 201
  end

  test "should show prerelease_email" do
    get prerelease_email_url(@prerelease_email), as: :json
    assert_response :success
  end

  test "should update prerelease_email" do
    patch prerelease_email_url(@prerelease_email), params: { prerelease_email: {  } }, as: :json
    assert_response 200
  end

  test "should destroy prerelease_email" do
    assert_difference('PrereleaseEmail.count', -1) do
      delete prerelease_email_url(@prerelease_email), as: :json
    end

    assert_response 204
  end
end
