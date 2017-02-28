class CreateContests < ActiveRecord::Migration[5.0]
  def change
    create_table :contests do |t|
      t.string :name
      t.text :description
      t.text :rules
      t.integer :credit_reward
      t.datetime :start
      t.datetime :end

      t.timestamps
    end
  end
end
