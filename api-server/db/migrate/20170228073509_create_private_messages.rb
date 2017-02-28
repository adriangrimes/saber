class CreatePrivateMessages < ActiveRecord::Migration[5.0]
  def change
    create_table :private_messages do |t|
      t.integer :from_user_id
      t.integer :to_user_id
      t.text :message, limit: 1024

      t.timestamps
    end
  end
end
