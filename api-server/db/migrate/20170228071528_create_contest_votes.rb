class CreateContestVotes < ActiveRecord::Migration[5.0]
  def change
    create_table :contest_votes do |t|
      t.integer :user_id
      t.integer :voted_for
      t.integer :contest_id
      t.string :ip_and_useragent

      t.timestamps
    end
  end
end
