class V1::ImagesController < ApplicationController

  def create
    image_data = JSON.parse(request.raw_post)
    image = Image.new(title: image_data["title"], account_id: params[:account_id], image_data: image_data["image"], data_url: image_data["preview"])
    if image.save
      render json: {id: image.id}
    else
      render json: "Error - Unable to save image", status: 401
    end
  end

  def index
    if (params[:account_id])
      account = Account.find(params[:account_id])
      images = account.images
      render json: images, each_serializer: ImageIndexSerializer
    else
      if request.headers["bearer"]
        account = Account.find(Auth.decode(request.headers["bearer"])[0]["account_id"])
        images = Image.where('account_id != ?', account.id).order('created_at DESC').limit(10)
      else
        images = Image.all.order('created_at DESC').limit(10)
      end
      render json: images, each_serializer: ImageIndexSerializer
    end
  end

  def show
    image = Image.find(params[:id])
    render json: image, serializer: ImageSerializer
  end

  def update
    image_data = JSON.parse(request.raw_post)
    image = Image.find(params[:id])
    if image.update(image_data: image_data["image"], data_url: image_data["preview"], title: image_data["title"])
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
