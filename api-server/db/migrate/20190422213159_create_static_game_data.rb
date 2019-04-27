class CreateStaticGameData < ActiveRecord::Migration[5.2]
  def change
    create_table :static_game_data do |t|

      t.belongs_to :user, index: { unique: true }, foreign_key: true

      t.string :title
      t.integer :photo_id
      t.string :description
      t.integer :instructions
      #t.string :swf/game path?
      
      t.timestamps
    end
  end
end
