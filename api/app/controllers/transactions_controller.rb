class TransactionsController < ApplicationController

  before_action :is_user_authorized?

  def index
    transaction_data = Transaction.get_transactions_for_user(params[:id], params[:page])
    options = {}
    options[:meta] = {
      totalTransactions: transaction_data[:total_transactions],
      totalPages: transaction_data[:total_pages],
      remainingCreditsToPayout: transaction_data[:remaining_credits_to_payout]
    }
    render json: TransactionSerializer
      .new(transaction_data[:transactions], options)
      .serialized_json,
     status: :ok
  end

  private

    def is_user_authorized?
      if token_is_authorized_for_id?(params[:id])
        puts 'authorized'
        return true
      else
        clean_up_and_render_not_found
        return false
      end
    end

end
