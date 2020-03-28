class CreateContests < ActiveRecord::Migration[5.2]
  def change
    create_table :contests do |t|
      t.string :name
      t.text :description
      t.text :rules
      t.integer :cube_reward
      t.datetime :start
      t.datetime :end

      t.timestamps
    end

    execute "ALTER TABLE contests AUTO_INCREMENT = 1940700" # for MariaDB

  end
end
