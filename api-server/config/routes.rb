Rails.application.routes.draw do

  devise_for :users,
    controllers: {
      sessions: 'sessions',
      registrations: 'users/registrations'
    }
  # TODO: If your application has many RESTful routes, using :only and :except to
  # generate only the routes that you actually need can cut down on memory use
  # and speed up the routing process.
  resources :private_messages
  resources :contests
  resources :contest_votes
  resources :user_blocks
  resources :user_favorites
  resources :game_logs
  resources :credit_transfers
  resources :credit_purchases
  resources :user_files
  resources :users
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
