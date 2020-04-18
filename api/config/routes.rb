# frozen_string_literal: true

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
  get '/resend_unlock', to: 'resend_unlock#index'
  # :users :create is handled by devise registrations controller
  # :users :destroy is handled by a runner that deletes marked accounts after a time period
  resources :users, only: %i[show update]
  resources :user_public_data, only: %i[index update]
  resources :user_verification_uploads, only: %i[index create destroy]
  resources :user_public_uploads, only: %i[index create update destroy]
  resources :private_messages
  get '/conversations', to: 'private_messages#conversations'
  resources :user_favorites
  resources :user_blocks
  resources :game_logs

  # Credit purchase and transfer data
  resources :credit_transfers
  resources :credit_purchases
  get '/transactions', to: 'transactions#index'

  resources :contractor_applications, only: %i[index create update]

  resources :prerelease_emails

  # Controller for chat authentication
  resources :chat_tickets

  # Stream control
  get '/stream/start', to: 'streams#start'
  get '/stream/stop', to: 'streams#stop'

  # Shrine attachment upload endpoints
  # See initializers/shrine.rb for configuration
  mount PublicUploader.upload_endpoint(:cache) => '/upload'
  mount VerificationUploader.upload_endpoint(:cache) => '/verification_upload'

  # Site data
  post '/send_contact_us', to: 'contact_us#send_email'
  get '/help_sections', to: 'help_topics#help_sections'
  resources :contests
  resources :contest_votes
  resources :help_topics
  resources :static_game_data

  # status info for uptime checking
  get '/up', to: 'status#up'

end
