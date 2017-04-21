class ImageSerializer < ActiveModel::Serializer
	attributes :id, :title, :image_data, :account_id
end