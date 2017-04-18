class AccountSerializer < ActiveModel::Serializer
	attributes :id, :username
	has_many :images, serializer: ImageIndexSerializer
end