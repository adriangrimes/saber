# bundle exec rails runner -e staging lib/passenger_boot.rb

# This script is meant to be run immediately after nginx/passenger has booted to
# reset the database to a good initial state
p "Running saber boot initialization:"

# Reset any online users to offline
if UserPublicDatum.update_all(online_status: false)
  p " - set all users offline"
end
