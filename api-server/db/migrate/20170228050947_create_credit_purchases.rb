class CreateCreditPurchases < ActiveRecord::Migration[5.0]
  def change
    create_table :credit_purchases do |t|
      t.integer :user_id
      t.integer :amount
      t.string :payment_method
      t.string :ip_and_useragent

      t.timestamps
    end
  end
end
