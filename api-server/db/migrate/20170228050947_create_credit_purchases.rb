class CreateCreditPurchases < ActiveRecord::Migration[5.0]
  def change
    create_table :credit_purchases do |t|
      t.references :user, foreign_key: true, null: false
      t.string :purchase_type, null: false
      t.integer :purchase_amount, precision: 10, scale: 2, null: false, unsigned: true
      t.string :payment_method, null: false
      t.boolean :cleared, default: false, null: false
      t.boolean :cancelled, default: false, null: false
      t.integer :credits_purchased, null: false, unsigned: true
      t.integer :credits_remaining, null: false, unsigned: true
      # t.string :ip
      # t.string :useragent

      t.timestamps
    end
  end
end
