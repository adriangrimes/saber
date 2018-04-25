class CreateUserFiles < ActiveRecord::Migration[5.0]
  def change
    create_table :user_files do |t|
      t.integer :user_id
      #t.has_attached_file :user
      t.boolean :is_public

      t.timestamps
    end
  end
end
