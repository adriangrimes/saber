class CreatePrivateMessages < ActiveRecord::Migration[5.0]
  def change
    create_table :private_messages do |t|
      t.belongs_to :from_user, foreign_key: { to_table: :users }, index: true, null: false
      t.belongs_to :to_user, foreign_key: { to_table: :users }, index: true, null: false
      t.text :message, limit: 1024, null: false
      t.boolean :message_read, null: false, default: false

      t.timestamps index: true
    end
  end
end
