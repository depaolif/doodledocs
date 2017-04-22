require "rails_helper"

RSpec.describe Account, :type => :model do
  context "has a valid username and password" do
    it "should raise a username validation failure" do
      account = Account.new(username: 'tes', password: 'pass')
      account.valid?
      expect(account.errors.size).to eq(2)
    end
  end
  context "have only images belong to it" do
    it "should have only 2 images" do
      account = Account.create!(username: 'tester334', password: '123456789')
      account2 = Account.create!(username: 'tester931', password: '987654321')
      image1 = Image.create!(account_id: account.id)
      image2 = Image.create!(account_id: account.id)
      image3 = Image.create!(account_id: account2.id)
      expect(account.images.size).to eq(2)
    end
  end
end