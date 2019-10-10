class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|
      ## Database authenticatable
      t.string :username, null: false
      t.string :email, null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.string :authentication_token, null: false # TODO ENCRYPT maybe?

      ## Account data
      t.boolean :broadcaster, default: false, null: false
      t.boolean :developer, default: false, null: false
      t.boolean :affiliate, default: false, null: false

      # t.string :account_status, default: "Created"
      t.boolean :suspended_account, default: false, null: false
      t.boolean :admin_status, default: false
      t.datetime :pending_deletion_since, default: nil
      t.text :security_questions
      t.string :stream_key, default: nil, limit: 64

      ## Site settings
      t.boolean :dark_mode, default: false, null: false
      t.boolean :send_email_followed_online, default: false, null: false
      t.boolean :send_email_site_news, default: false, null: false
      t.boolean :private_message_email_notifications, default: true, null: false
      t.text :private_user_notes, limit: 65500

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable # Currently using a workaround in sessions controller to prevent
      # unneccessary sign_in_count increments until Devise 5.0
      t.integer  :sign_in_count, default: 0, null: false
      t.datetime :current_sign_in_at
      t.datetime :last_sign_in_at
      t.string   :current_sign_in_ip
      t.string   :last_sign_in_ip

      ## Confirmable
      t.string   :confirmation_token
      t.datetime :confirmed_at
      t.datetime :confirmation_sent_at
      t.string   :unconfirmed_email # Only if using reconfirmable

      ## Lockable
      t.integer  :failed_attempts, default: 0, null: false # Only if lock strategy is :failed_attempts
      t.string   :unlock_token # Only if unlock strategy is :email or :both
      t.datetime :locked_at

      t.timestamps
    end

    add_index :users, :username,             unique: true
    add_index :users, :email,                unique: true
    add_index :users, :authentication_token, unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :confirmation_token,   unique: true
    add_index :users, :unlock_token,         unique: true
  end
end
