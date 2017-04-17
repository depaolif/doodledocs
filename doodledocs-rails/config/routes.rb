Rails.application.routes.draw do
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
    namespace :v1 do
      resources :accounts, only: [:create] do
        resources :images, only: [:create, :update, :show, :index, :destroy]
      end

      resources :sessions, only: [:create, :destroy]
    end

end
