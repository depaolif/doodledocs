class V1::AccountsController < ApplicationController

  def create
    account=  Account.new(username: params[username], password: params[password] )
      if account.save
        token= "?"
          render json: {"token": token}
      else
        render json:"Error, could not validate account", status: 401
      end
    end
  end


end
