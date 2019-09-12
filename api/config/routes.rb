Rails.application.routes.draw do

  # TODO: If your application has many RESTful routes, using :only and :except to
  # generate only the routes that you actually need can cut down on memory use
  # and speed up the routing process.
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  # User data
  devise_for :users, controllers: {
    sessions: 'sessions',
    registrations: 'users/registrations',
    passwords: 'users/passwords'
  }
  # :users :create is handled by devise registrations controller
  resources :users, only: [:show, :update, :destroy]
  resources :user_public_data
  resources :user_public_files, only: [:index, :create, :update, :destroy]
  resources :user_favorites
  resources :user_blocks
  resources :game_logs

  resources :private_messages
  get '/conversations', to: 'private_messages#conversations'

  # Credit purchase and transfer data
  resources :credit_transfers
  resources :credit_purchases
  get '/transactions', to: 'transactions#index'

  # Site data
  post '/send_contact_us', to: 'contact_us#send_email'
  get '/help_sections', to: 'help_topics#help_sections'
  resources :contests
  resources :contest_votes
  resources :help_topics
  resources :static_game_data

  # Controller for chat authentication
  resources :chat_tickets

  # Stream control
  get '/stream/start', to: 'streams#start'
  get '/stream/stop', to: 'streams#stop'

  # DirectUploadsController is overriden to bypass CSRF and cross origin security
  # TODO Determine if bypass CSRF is safe
  post '/rails/active_storage/direct_uploads' => 'direct_uploads#create'

end
