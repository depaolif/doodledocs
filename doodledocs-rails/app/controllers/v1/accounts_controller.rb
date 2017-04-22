class V1::AccountsController < ApplicationController

  def create
    account = Account.new(account_params)
    if account.save
      token = Auth.issue({account_id: account.id})
      render json: {"token": token}
    else
      render json:"Error, could not validate account", status: 401
    end
  end

  def show
    if (request.headers["bearer"])
      id = Auth.decode(request.headers["bearer"])[0]["account_id"]
      account = Account.find(id)
      render json: account, serializer: AccountSerializer
    else
      render json: "Unauthorized request.", status: 401
    end
  end

  private
  def account_params
    params.require(:account).permit(:username, :password)
  end

end
