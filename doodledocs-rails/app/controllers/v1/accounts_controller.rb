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
    account = Account.find(1)
    render json: account, serializer: AccountSerializer
  end

  private
  def account_params
    params.require(:account).permit(:username, :password)
  end

end
