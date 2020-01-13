class CreateUserPublicData < ActiveRecord::Migration[5.2]
  def change
    create_table :user_public_data do |t|
      t.belongs_to :user, index: { unique: true }

      ## Public profile
      t.string :username
      t.boolean :broadcaster, null: false
      t.boolean :online_status, null: false, default: false
      t.string :channel_topic
      t.integer :current_game_id
      t.string :streamnail_path, null: false, default: Rails.configuration.x.saber.no_profile_image_url
      t.boolean :allow_tips, default: true, null: false
      t.boolean :allow_suggested_games, default: false, null: false
      t.string :timezone
      t.string :user_custom_tags, default: nil, array: true
      t.string :profile_photo_path, null: false, default: Rails.configuration.x.saber.no_profile_image_url
      t.text :profile_about_me, limit: 2048
      t.string :profile_location, limit: 32
      t.string :profile_languages, limit: 32
      # t.text :profile_platforms, limit: 2048

      t.timestamps
    end

    execute "ALTER TABLE user_public_data AUTO_INCREMENT = 1163200" # for MariaDB

    add_foreign_key :user_public_data, :users
    add_index :user_public_data, :username, unique: true
  end
end
