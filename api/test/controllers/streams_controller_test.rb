require 'test_helper'

class StreamsControllerTest < ActionDispatch::IntegrationTest

  test "stream start redirects to correct username" do
    get stream_start_url, params: { name: users(:one).stream_key }
    assert_redirected_to "rtmp://127.0.0.1/hlsout/" + users(:one).username.downcase
  end

  test "stream start responds :not_found with incorrect stream key" do
    get stream_start_url, params: { name: "0123456789" }
    assert_response :not_found
  end

  test "stream stop responds :ok" do
    get stream_stop_url, params: { name: users(:one).stream_key }
    assert_response :ok
  end

  test "stream stop responds :not_found with incorrect stream key" do
    get stream_stop_url, params: { name: "0123456789" }
    assert_response :not_found
  end

end
