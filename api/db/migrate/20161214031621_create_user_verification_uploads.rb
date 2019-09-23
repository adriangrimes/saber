class CreateUserVerificationUploads < ActiveRecord::Migration[5.2]
  def change
    create_table :user_verification_uploads do |t|
      t.references :user, index: true, null: false

      t.boolean :verified, null: false, default: false
      t.text :upload_data
      t.timestamps
    end

    add_foreign_key :user_verification_uploads, :users, column: :user_id
  end
end
