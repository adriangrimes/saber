class Transaction
  attr_accessor :id,
    :timestamp,
    :transaction_type,
    :details,
    :cube_value,
    :dollar_value

    def self.get_transactions_for_user(user_id, page = 1)
      user_id = user_id.to_i
      page = page.to_i
      per_page = 10

      user = User.where('id = ?', user_id).first
      purchases = CubePurchase
        .where('user_id = ?', user_id)
      cube_transfers = CubeTransfer
        .where('to_user_id = ? OR from_user_id = ?', user_id, user_id)
      # Include all user record data to prevent a lookup per each user
      ActiveRecord::Associations::Preloader.new.preload(
        cube_transfers, [:to_user, :from_user]
      )
      payouts = Payout.where('user_id = ?', user_id)

      # Go through users purchase, transfers, and payouts, and normalize them
      # all into a transactions array
      transactions = []

      purchases.each do |purchase|
        transaction = Transaction.new
        transaction.transaction_type = 'purchase'
        transaction.timestamp = purchase.created_at.to_datetime.strftime("%Q")
        transaction.details = {
          purchase_type: purchase.purchase_type,
          payment_method: purchase.payment_method,
          cleared: purchase.cleared,
          cancelled: purchase.cancelled
        }
        transaction.cube_value = purchase.cubes_purchased
        transaction.dollar_value = purchase.purchase_amount
        if purchase.cleared == false || purchase.cancelled == true
          transaction.cube_value = 0
          trnasaction.dollar_value = 0
        end
        transactions.push(transaction)
      end

      total_cubes_made = 0
      cube_transfers.each do |transfer|
        transaction = Transaction.new
        transaction.transaction_type = 'transfer'
        transaction.timestamp = transfer.created_at.to_datetime.strftime("%Q")
        transaction.details = {
          transfer_type: transfer.transfer_type,
          transfer_description: transfer.transfer_description,
          from_user: transfer.from_user.username,
          to_user: transfer.to_user.username
        }
        transaction.cube_value = transfer.cubes_transferred
        if transfer.to_user_id = user_id
          total_cubes_made += transfer.cubes_transferred
        end
        transactions.push(transaction)
      end

      total_amount_already_paid = 0
      payouts.each do |payout|
        transaction = Transaction.new
        transaction.transaction_type = 'payout'
        transaction.timestamp = payout.created_at.to_datetime.strftime("%Q")
        transaction.details = {
          payment_method: payout.payment_method,
        }
        transaction.details[:bitcoin_address] = payout.bitcoin_address.last(5) if payout.bitcoin_address
        transaction.cube_value = payout.total_cubes
        transaction.dollar_value = payout.total_amount_paid
        total_amount_already_paid += payout.total_cubes
        transactions.push(transaction)
      end

      transactions = transactions.sort_by(&:timestamp)

      transactions.each_with_index do |transaction, index|
        transaction.id = index + 1
      end

      # Calculate pages and total transactions
      total_pages = (transactions.length.to_d / per_page.to_d).to_d.ceil
      page = total_pages if page > total_pages
      page = 1 if page.to_i < 1
      transaction_data = {
        transactions: transactions.paginate(:page => page, :per_page => per_page),
        total_transactions: transactions.length,
        total_pages: total_pages
      }
      if user.broadcaster
        if total_cubes_made >= total_amount_already_paid
          transaction_data[:remaining_cubes_to_payout] =
            total_cubes_made - total_amount_already_paid
        end
      end
      
      transaction_data
    end
end
