# bundle exec rails runner -e staging lib/passenger_boot.rb

if UserPublicDatum.update_all(online_status: false)
  p "set all users offline for boot"
end
