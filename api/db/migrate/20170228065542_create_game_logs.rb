class CreateGameLogs < ActiveRecord::Migration[5.2]
  def change
    create_table :game_logs do |t|
      t.timestamps
    end

    execute "ALTER TABLE game_logs AUTO_INCREMENT = 1502100" # for MariaDB

  end
end
