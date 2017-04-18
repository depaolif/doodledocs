class AddImagedataToImages < ActiveRecord::Migration[5.0]
  def change
    add_column :images, :image_data, :json
  end
end
