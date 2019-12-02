class CreateContestVotes < ActiveRecord::Migration[5.2]
  def change
    create_table :contest_votes do |t|
      t.integer :user_id
      t.integer :voted_for
      t.integer :contest_id
      t.string :ip_and_useragent

      t.timestamps
    end

    execute "ALTER TABLE contest_votes AUTO_INCREMENT = 1835900" # for MariaDB

  end
end
