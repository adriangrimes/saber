class CreateUserBlocks < ActiveRecord::Migration[5.0]
  def change
    create_table :user_blocks do |t|
      t.integer :user_id
      t.integer :marked_as_blocked

      t.timestamps
    end
  end
end
