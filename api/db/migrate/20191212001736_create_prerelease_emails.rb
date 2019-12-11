class CreatePrereleaseEmails < ActiveRecord::Migration[5.2]
  def change
    create_table :prerelease_emails do |t|
      t.string :email, null: false

      t.timestamps
    end
    execute "ALTER TABLE prerelease_emails AUTO_INCREMENT = 2112543" # for MariaDB

    add_index :prerelease_emails, :email, unique: true
  end
end
