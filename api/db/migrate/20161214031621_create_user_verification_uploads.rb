class CreateUserVerificationUploads < ActiveRecord::Migration[5.2]
  def change
    create_table :user_verification_uploads do |t|
      t.references :user, index: true, null: false

      t.boolean :verified, null: false, default: false
      t.text :upload_data
      t.timestamps
    end

    execute "ALTER TABLE user_verification_uploads AUTO_INCREMENT = 1385300" # for MariaDB

    add_foreign_key :user_verification_uploads, :users, column: :user_id
  end
end
