class CreateHelp < ActiveRecord::Migration[5.2]
  def change
    create_table :help_topics do |t|
      t.string :short_title, unique: true, null: false, index: true
      t.string :title, null: false

      t.boolean :all_users, default: true, null: false
      t.boolean :contractors_only, default: false, null: false
      t.boolean :broadcasters_only, default: false, null: false
      t.boolean :developers_only, default: false, null: false

      t.timestamps
    end

    create_table :help_sections do |t|
      t.belongs_to :help_topic, index: true

      t.string :section_title
      t.text :section_body

      t.timestamps
    end
  end
end
