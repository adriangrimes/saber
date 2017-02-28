class CreateCreditTransfers < ActiveRecord::Migration[5.0]
  def change
    create_table :credit_transfers do |t|
      t.integer :from_user_id
      t.integer :to_user_id
      t.string :type
      t.integer :amount
      t.integer :dev_id
      t.integer :dev_share_amount

      t.timestamps
    end
  end
end
