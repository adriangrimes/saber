class TransactionsController < ApplicationController
  before_action :is_user_authorized?

  def index

    # transactions = ActiveRecord::Base.connection.execute(
    #   "SELECT *
    #     FROM credit_transfers
    #   UNION
    #   SELECT purchase_type, purchase_amount, payment_method, cleared, cancelled, credits_purchased, credits_remaining
    #     FROM credit_purchases"
    # )

    @credit_transfers = CreditTransfer
      .where('to_user_id = ?', params[:id])
      .order('created_at ASC')
    #
    # puts @credit_transfers.inspect
    # transactions = []
    # @credit_transfers.each do |transfer|
    #   transaction = OpenStruct.new
    #   transaction.transaction_type = transfer.transfer_type
    #   # transaction.type = transfer.transfer_type
    #   transactions.push(transaction)
    # end

    render json: CreditTransferSerializer.new(@credit_transfers, { params: {transactions: true} }).serialized_json, status: :ok
  end

  private

    def is_user_authorized?
      if token_is_authorized_for_id?(params[:id])
        puts 'authorized'
        return true
      else
        clean_up_and_render_unauthorized
        return false
      end
    end

end
