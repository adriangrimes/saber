class CreateContractorApplications < ActiveRecord::Migration[5.2]
  def change
    create_table :contractor_applications do |t|
      t.belongs_to :user, index: { unique: true }

      t.boolean :pending_broadcaster_application, default: false, null: false
      t.boolean :pending_developer_application, default: false, null: false
      t.boolean :pending_affiliate_application, default: false, null: false

      ## Contractor application and payment profile
      ## (These are encrypted at the application level with the
      ## symmetric-encryption gem)
      t.text :full_name
      t.datetime :birthdate
      t.text :address_line1
      t.text :address_line2
      t.text :address_line3
      t.text :business_name
      t.text :business_entity_type
      t.string :business_identification_number
      t.string :payout_method
      t.text :bitcoin_address
      t.string :bank_account_number
      t.string :bank_routing_number
      t.boolean :subject_to_backup_withholding, default: nil

      ## Payout percentages
      t.integer :broadcaster_percentage,
        limit: 1, #byte
        default: Rails.application.config.x.saber.broadcaster_payout_percentage
      t.integer :developer_percentage,
        limit: 1, #byte
        default: Rails.application.config.x.saber.developer_payout_percentage

      t.datetime :contractor_data_consent_given_at, default: nil
      
      t.timestamps
    end

    add_foreign_key :contractor_applications, :users

  end
end
