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
      t.boolean :admin, default: false
      t.boolean :broadcaster, default: false
      t.boolean :developer, default: false
      t.string :stream_key, default: nil, limit: 64

      t.string :address_line_1
      t.string :address_line_2
      t.string :address_line_3
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

      t.timestamps
    end
  end
end
