class CreateUserFavorites < ActiveRecord::Migration[5.2]
  def change
    create_table :user_favorites do |t|
      t.integer :user_id
      t.integer :marked_as_favorite

      t.timestamps
    end

    execute "ALTER TABLE user_favorites AUTO_INCREMENT = 1613400" # for MariaDB

  end
end
