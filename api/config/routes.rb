Rails.application.routes.draw do

  # TODO: If your application has many RESTful routes, using :only and :except to
  # generate only the routes that you actually need can cut down on memory use
  # and speed up the routing process.
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html

  devise_for :users,
    controllers: {
      sessions: 'sessions',
      registrations: 'users/registrations',
      passwords: 'users/passwords'
    }
  resources :users, only: [:show, :update, :destroy]
  resources :user_public_data
  resources :user_files
  resources :private_messages
  get '/conversations', to: 'private_messages#conversations'
  resources :contests
  resources :contest_votes
  resources :user_blocks
  resources :user_favorites
  resources :game_logs
  resources :credit_transfers
  resources :credit_purchases
  get '/transactions', to: 'transactions#index'
  resources :chat_tickets

  # Stream control
  get '/stream/start', to: 'streams#start'
  get '/stream/stop', to: 'streams#stop'

  post '/send_contact_us', to: 'contact_us#send_email'

  resources :help_topics
  get '/help_sections', to: 'help_topics#help_sections'
  resources :static_game_data

  # DirectUploadsController is overriden to bypass CSRF and cross origin security
  # TODO Determine if bypass CSRF is safe
  post '/rails/active_storage/direct_uploads' => 'direct_uploads#create'

end
