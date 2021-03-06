class CreateStaticGameData < ActiveRecord::Migration[5.2]
  def change
    create_table :static_game_data do |t|
      t.belongs_to :user, index: { unique: true }

      t.string :title
      t.integer :photo_id
      t.string :description
      t.integer :instructions
      # t.string :swf/game path?

      t.timestamps
    end

    execute "ALTER TABLE static_game_data AUTO_INCREMENT = 2157600" # for MariaDB

    add_foreign_key :static_game_data, :users
  end
end
