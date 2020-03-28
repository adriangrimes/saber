class CreateCubePurchases < ActiveRecord::Migration[5.2]
  def change
    create_table :cube_purchases do |t|
      t.references :user, foreign_key: true, null: false
      t.string :purchase_type, null: false
      t.integer :purchase_amount, precision: 10, scale: 2, null: false, unsigned: true
      t.string :payment_method, null: false
      t.boolean :cleared, default: false, null: false
      t.boolean :cancelled, default: false, null: false
      t.integer :cubes_purchased, null: false, unsigned: true
      t.integer :cubes_remaining, null: false, unsigned: true
      # t.string :ip
      # t.string :useragent

      t.timestamps
    end

    execute "ALTER TABLE cube_purchases AUTO_INCREMENT = 1492400" # for MariaDB

  end
end
