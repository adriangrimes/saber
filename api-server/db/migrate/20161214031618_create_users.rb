class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|

      ## Database authenticatable
      t.string :username
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""
      t.string :authentication_token
      t.string :account_status
      t.boolean :admin_status, default: false
      t.string :stream_key, default: nil, limit: 64

      ## Profile
      t.string :first_name
      t.string :middle_name
      t.string :last_name
      t.datetime :birthdate

      t.boolean :broadcaster, default: false
      t.boolean :developer, default: false

      t.string :address_line1
      t.string :address_line2
      t.string :address_line3
      t.string :timezone

      t.boolean :dark_mode, default: false
      t.boolean :send_email_favorites_online, default: false
      t.boolean :send_email_site_news, default: false

      t.integer :profile_photo_id
      t.string :profile_sex, limit: 16
      t.text :profile_about_me, limit: 2048
      t.integer :profile_age, limit: 3
      t.string :profile_location, limit: 32
      t.string :profile_languages, limit: 32
      #t.text :profile_platforms, limit: 2048

      ## Recoverable
      t.string   :reset_password_token
      t.datetime :reset_password_sent_at

      ## Rememberable
      t.datetime :remember_created_at

      ## Trackable
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
    add_index :users, :reset_password_token, unique: true
    add_index :users, :confirmation_token,   unique: true
    add_index :users, :unlock_token,         unique: true

  end
end
