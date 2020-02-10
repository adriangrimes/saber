class CreatePayouts < ActiveRecord::Migration[5.2]
  def change
    create_table :payouts do |t|
      t.references :user, foreign_key: true, null: false
      t.integer :total_credits, null: false, unsigned: true
      t.integer :total_amount_paid, precision: 10, scale: 2, null: false, unsigned: true
      t.string :payment_method, null: false
      t.string :transaction_id
      t.string :bitcoin_address
      t.text :street_address
      t.text :city
      t.text :region
      t.text :postal_code
      t.text :country

      t.timestamps
    end

    execute "ALTER TABLE payouts AUTO_INCREMENT = 914700" # for MariaDB

  end
end
