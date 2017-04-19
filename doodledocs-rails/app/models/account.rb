class Account < ApplicationRecord
  has_secure_password
  has_many :images
  has_many :comments
end
