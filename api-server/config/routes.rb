Rails.application.routes.draw do

  devise_for :users,
    controllers: {
      sessions: 'sessions',
      registrations: 'users/registrations'
    }

  # TODO: If your application has many RESTful routes, using :only and :except to
  # generate only the routes that you actually need can cut down on memory use
  # and speed up the routing process.
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
  resources :users, only: [:show, :update, :destroy]
  resources :user_public_data
  resources :user_files
  resources :private_messages
  resources :contests
  resources :contest_votes
  resources :user_blocks
  resources :user_favorites
  resources :game_logs
  resources :credit_transfers
  resources :credit_purchases

  resources :static_game_data

  # DirectUploadsController is overriden to bypass CSRF and cross origin security
  # TODO Determine if this is safe
  post '/rails/active_storage/direct_uploads' => 'direct_uploads#create'

end
