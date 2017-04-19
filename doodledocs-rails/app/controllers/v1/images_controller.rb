class V1::ImagesController < ApplicationController

  def create
    image_data = JSON.parse(request.raw_post)
    image = Image.new(title: "Test image", account_id: params[:account_id], image_data: image_data["image"], data_url: image_data["preview"])
    if image.save
      render json: {id: image.id}
    else
      render json: "Error - Unable to save image", status: 401
    end
  end

  def index
    account = Account.find(params[:account_id])
    images = Image.where(account_id: account.id)
    render json: images, each_serializer: ImageIndexSerializer
  end

  def show
    image = Image.find(params[:id])
    render json: image, serializer: ImageSerializer
  end

  def update
    image_data = JSON.parse(request.raw_post)
    image = Image.find(params[:id])
    if image.update(image_data: image_data["image"], data_url: image_data["preview"])
      render json: {id: image.id}
    else
      render json: "Error - Unable to update image", status: 401
    end
  end

  def destroy
    image = Image.find(params[:id])
    Image.destroy(image)
  end

end
