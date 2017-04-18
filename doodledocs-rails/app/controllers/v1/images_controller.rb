class V1::ImagesController < ApplicationController

  def create
    image_data = request.raw_post
    image = Image.new(title: "Test image", account_id: 1, image_data: image_data)
    if image.save
      render json: "Nice"
    else
      render json: "Error - Unable to save image", status: 401
    end
  end

  def index
    images=Image.all
    render json: images
  end

  def show
    image = setImage
    render json: image
  end

  def update
    image=setImage
    image.update(params)
  end

  def destroy
    image=setImage
    Image.destroy(image)
  end

  private

  def setImage
    Image.find(params[:id])
  end



end
