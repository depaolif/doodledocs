class Account < ApplicationRecord
  has_secure_password
  validates :username, presence: true, uniqueness: true, length: { minimum: 4 }
  validates :password, presence: true, length: { minimum: 8 }
  has_many :images
end
