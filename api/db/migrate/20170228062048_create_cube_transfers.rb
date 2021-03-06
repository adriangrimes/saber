class CreateCubeTransfers < ActiveRecord::Migration[5.2]
  def change
    create_table :cube_transfers do |t|
      t.belongs_to :from_user, foreign_key: { to_table: :users }, index: true, null: false
      t.belongs_to :to_user, foreign_key: { to_table: :users }, index: true, null: false
      t.integer :cubes_transferred, null: false, default: 0, unsigned: true
      t.string :transfer_type, limit: 255, null: false
      t.string :transfer_description, limit: 255
      t.integer :broadcaster_payout_percentage,
                limit: 1,
                null: false,
                default: Rails.application.config.x.saber.broadcaster_payout_percentage

      t.timestamps
    end

    execute "ALTER TABLE cube_transfers AUTO_INCREMENT = 1502100" # for MariaDB

  end
end
