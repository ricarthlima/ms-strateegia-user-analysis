Rails.application.routes.draw do
  # For details on the DSL available within this file, see https://guides.rubyonrails.org/routing.html
  get 'tagcloud/:id/', to: 'tag_cloud#get_cloud', format: :svg
end
