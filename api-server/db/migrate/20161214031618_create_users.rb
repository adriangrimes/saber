class CreateUsers < ActiveRecord::Migration[5.0]
  def change
    create_table :users do |t|
      t.string :email
      t.string :username
      t.string :password
      t.string :first_name
      t.string :last_name
      t.datetime :birthdate

      t.timestamps
    end
  end
end
