class Image < ApplicationRecord
  belongs_to :account
  has_many :comments
end
