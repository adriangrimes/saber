class CreateUserPublicUploads < ActiveRecord::Migration[5.2]
  def change
    create_table :user_public_uploads do |t|
      t.references :user, index: true, null: false

      t.boolean :members_only, null: false, default: false
      t.text :upload_data
      t.timestamps
    end

    execute "ALTER TABLE user_public_uploads AUTO_INCREMENT = 1274200" # for MariaDB

    add_foreign_key :user_public_uploads, :users, column: :user_id
  end
end
