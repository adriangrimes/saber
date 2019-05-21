class CreateChatTickets < ActiveRecord::Migration[5.2]
  def change
    create_table :chat_tickets do |t|

      t.belongs_to :user, null: false, unique: true
      t.string :user_ip, null: false
      t.string :username, null: false
      t.timestamps

    end
  end
end
