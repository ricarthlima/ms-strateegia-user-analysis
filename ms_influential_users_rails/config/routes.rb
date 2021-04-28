Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get 'influential_users/:id', to: "influential_users#getInfluentialUsers"
end
