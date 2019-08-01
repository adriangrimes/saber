class CreateUsers < ActiveRecord::Migration[5.2]
  def change
    create_table :users do |t|

      ## Database authenticatable
      t.string :username, null: false
      t.string :email, null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.string :authentication_token, null: false #TODO: encrypt

      ## Account data
      t.boolean :broadcaster, default: false #TODO maybe only let the backend change these, via successful signup or form submition from front end?
      t.boolean :developer, default: false
      t.boolean :affiliate, default: false
      t.string :account_status#, default: "UNVERIFIED"
      t.boolean :suspended_account, default: false
      t.boolean :admin_status, default: false
      t.boolean :pending_deletion, default: false
      t.string :security_questions
      t.string :stream_key, default: nil, limit: 64

      ## Site settings
      t.boolean :dark_mode, default: false
      t.boolean :send_email_followed_online, default: false
      t.boolean :send_email_site_news, default: false
      t.boolean :private_message_email_notifications, default: true
      t.text :private_user_notes, limit: 2048

      ## Payment profile (TODO most of these are probably not safe in terms of user security)
      t.integer :broadcaster_percentage,
        limit: 1,
        default: Rails.application.config.x.saber.broadcaster_payout_percentage
      t.integer :developer_percentage,
        limit: 1,
        default: Rails.application.config.x.saber.developer_payout_percentage
      t.string :full_name
      t.datetime :birthdate
      t.string :address_line1
      t.string :address_line2
      t.string :address_line3
      t.string :business_name
      t.string :business_entity_type
      t.string :payout_method
      t.string :bitcoin_address
      t.string :bank_account_number
      t.string :bank_routing_number
      t.boolean :subject_to_backup_withholding, default: false, null: false

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

    # start user ids at a random integer
    execute('ALTER TABLE users AUTO_INCREMENT = 2202840')

    add_index :users, :username,             unique: true
    add_index :users, :email,                unique: true
    add_index :users, :authentication_token, unique: true
    add_index :users, :reset_password_token, unique: true
    add_index :users, :confirmation_token,   unique: true
    add_index :users, :unlock_token,         unique: true

  end
end
