class CreateImages < ActiveRecord::Migration[5.0]
  def change
    create_table :images do |t|
      t.string :title
      t.string :data_url
      t.integer :account_id

      t.timestamps
    end
  end
end
