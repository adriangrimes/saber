require 'test_helper'

class ChatTicketsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @chat_ticket = chat_tickets(:one)
  end

  test "should get index" do
    get chat_tickets_url, as: :json
    assert_response :success
  end

  test "should create chat_ticket" do
    assert_difference('ChatTicket.count') do
      post chat_tickets_url, params: { chat_ticket: {  } }, as: :json
    end

    assert_response 201
  end

  test "should show chat_ticket" do
    get chat_ticket_url(@chat_ticket), as: :json
    assert_response :success
  end

  test "should update chat_ticket" do
    patch chat_ticket_url(@chat_ticket), params: { chat_ticket: {  } }, as: :json
    assert_response 200
  end

  test "should destroy chat_ticket" do
    assert_difference('ChatTicket.count', -1) do
      delete chat_ticket_url(@chat_ticket), as: :json
    end

    assert_response 204
  end
end
