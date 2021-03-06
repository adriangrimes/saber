class CreatePrivateMessages < ActiveRecord::Migration[5.2]
  def change
    create_table :private_messages do |t|
      t.references :from_user, index: true, null: false
      t.references :to_user, index: true, null: false
      t.text :message, limit: 2048, null: false
      t.boolean :message_read, null: false, default: false

      t.timestamps index: true
    end

    execute "ALTER TABLE private_messages AUTO_INCREMENT = 2042500" # for MariaDB

    add_foreign_key :private_messages, :users, column: :from_user_id
    add_foreign_key :private_messages, :users, column: :to_user_id
  end
end
