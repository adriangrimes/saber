require 'test_helper'

class HelpTopicsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @help_topic = help_topics(:one)
  end

  test "should get index" do
    get help_topics_url, as: :json
    assert_response :success
  end

  test "should create help_topic" do
    assert_difference('HelpTopic.count') do
      post help_topics_url, params: { help_topic: {  } }, as: :json
    end

    assert_response 201
  end

  test "should show help_topic" do
    get help_topic_url(@help_topic), as: :json
    assert_response :success
  end

  test "should update help_topic" do
    patch help_topic_url(@help_topic), params: { help_topic: {  } }, as: :json
    assert_response 200
  end

  test "should destroy help_topic" do
    assert_difference('HelpTopic.count', -1) do
      delete help_topic_url(@help_topic), as: :json
    end

    assert_response 204
  end
end
