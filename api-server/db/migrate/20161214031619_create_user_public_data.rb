class CreateUserPublicData < ActiveRecord::Migration[5.2]
  def change
    create_table :user_public_data do |t|

      t.belongs_to :user, index: { unique: true }, foreign_key: true

      ## Public profile
      t.string :username
      t.boolean :broadcaster, null: false
      t.boolean :online_status
      t.string :channel_topic
      t.integer :current_game_id
      t.string :streamnail_path
      t.boolean :allow_tips
      t.boolean :allow_suggested_games
      t.string :timezone
      t.string :user_custom_tags, default: nil, array: true
      t.string :profile_photo_path
      t.string :profile_sex, limit: 16
      t.text :profile_about_me, limit: 2048
      t.integer :profile_age, limit: 3
      t.string :profile_location, limit: 32
      t.string :profile_languages, limit: 32
      #t.text :profile_platforms, limit: 2048

      t.timestamps
    end

    add_index :user_public_data, :username, unique: true

  end
end
