require "rails_helper"

RSpec.describe Image, :type => :model do
  context "has a correct belongs to relationship" do
    it "should belong to only one account" do
      account1 = Account.create!(username: 'tester493', password: '1402682485')
      account2 = Account.create!(username: 'tester210', password: '0295824011')
      image = Image.create!(account_id: account1.id)
      expect(image.account).to eq(account1)
    end
  end
end