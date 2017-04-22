require "rails_helper"

RSpec.describe V1::AccountsController, :type => :controller do
  describe "GET #show" do
    it "returns an unauthorized status code" do
      get :show
      expect(response).to have_http_status(401)
    end
    it "retrives & decodes token and renders the corresponding account info" do
		get :show, {:bearer => "Token 123"}
		expect(response).to have_http_status(200)
    end
  end
 #  describe "GET show" do
	# context "has a valid username and password" do
	# 	it "retrieves & decodes token and renders the corresponding account info" do
	# 		Account.create!(username: 'tester459', password: '285425024')
	# 		Image.create!(account_id: 1)
	# 		Image.create!(account_id: 1)
	# 		Image.create!(account_id: 1)
	# 		get :show
	# 		expect(response).to have_http_status(200)
	# 	end
	# end
 #  end
end