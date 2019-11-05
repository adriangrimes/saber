# bundle exec rails runner -e staging lib/passenger_boot.rb
require File.expand_path('../../config/environment', __FILE__)

# This script is meant to be run immediately after nginx/passenger has booted to
# reset the database to a good initial state
p "Running saber boot initialization:"

# Reset any online users to offline
if UserPublicDatum.update_all(online_status: false)
  p " - set all users offline"
end

if PublicUploader.storages[:cache].clear!(older_than: Time.now - 2*24*60*60) # delete cached files older than 2 days
  p ' - cleared old cached PublicUploader uploads'
end
if VerificationUploader.storages[:cache].clear!(older_than: Time.now - 2*24*60*60) # delete cached files older than 2 days
  p ' - cleared old cached VerificationUploader uploads'
end
