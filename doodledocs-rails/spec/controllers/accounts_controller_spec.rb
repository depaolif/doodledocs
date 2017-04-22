require "rails_helper"

RSpec.describe V1::AccountsController, :type => :controller do
  describe "GET #show" do
    it "returns an unauthorized status code with an invalid token" do
    	token = Auth.issue({account_id: 'pizza'})
    	request.headers["bearer"] = token	
		get :show, nil, {"bearer": token}
		expect(response).to have_http_status(401)
    end
    it "retrives & decodes token and renders the corresponding account info" do
    	account = Account.create!(username: 'tester542', password: '442542459')
    	token = Auth.issue({account_id: account.id})
    	request.headers["bearer"] = token
		get :show, nil, {"bearer": token}
		expect(response).to have_http_status(200)
    end
  end
end