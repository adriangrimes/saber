class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :email
      t.string :username
      t.string :password
      t.string :first_name
      t.string :middle_name
      t.string :last_name
      t.datetime :birthdate

      t.string :account_status
      t.boolean :admin_status, default: false
      t.boolean :broadcaster, default: false
      t.boolean :developer, default: false
      t.string :stream_key, default: nil, limit: 64

      t.string :address_line_1
      t.string :address_line_2
      t.string :address_line_3
      t.string :timezone

      t.timestamps
    end
  end
end
