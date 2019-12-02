class CreateUserBlocks < ActiveRecord::Migration[5.2]
  def change
    create_table :user_blocks do |t|
      t.integer :user_id
      t.integer :marked_as_blocked

      t.timestamps
    end

    execute "ALTER TABLE user_blocks AUTO_INCREMENT = 1724800" # for MariaDB

  end
end
