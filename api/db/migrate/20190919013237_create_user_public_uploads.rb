class CreateUserPublicUploads < ActiveRecord::Migration[5.2]
  def change
    create_table :user_public_uploads do |t|
      t.references :user, index: true, null: false

      t.boolean :members_only, null: false, default: false
      t.text :upload_data
      t.timestamps
    end

    add_foreign_key :user_public_uploads, :users, column: :user_id
  end
end
