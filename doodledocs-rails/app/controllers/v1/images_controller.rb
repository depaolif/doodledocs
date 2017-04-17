class V1::ImagesController < ApplicationController

  def create
    image= Image.new(title: params[:title], user_id: user_id: "?")
  end

  def index
    images=Image.all
    render json: images
  end

  def show
    image= setImage
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
