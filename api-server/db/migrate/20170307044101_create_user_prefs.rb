class CreateUserPrefs < ActiveRecord::Migration[5.0]
  def change
    create_table :user_prefs do |t|
      t.belongs_to :user, foreign_key: true
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
