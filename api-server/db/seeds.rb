# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

samepass1 = User.new(email: "samepass1@email.com", username: "SamePass1", password: "password")
samepass1.skip_confirmation!
samepass1.save!

samepass2 = User.new(email: "samepass2@email.com", username: "SamePass2", password: "password")
samepass2.skip_confirmation!
samepass2.save!

10.times do |i|
  userseed = User.new(email: "testuser#{i}@email.com", username: "testuser#{i}", password: "1234567#{i}", first_name: "John#{i}", middle_name: "K#{i}", last_name: "Der#{i}")
  userseed.skip_confirmation!
  userseed.create_user_pref(dark_mode: true, profile_age: 28)
  userseed.save!

  broadcasterseed = User.new(email: "testbroadcaster#{i}@email.com", username: "testbroadcaster#{i}", password: "1234567#{i}", first_name: "Guy#{i}", middle_name: "M#{i}", last_name: "Smert#{i}", broadcaster: true)
  broadcasterseed.skip_confirmation!
  broadcasterseed.create_user_pref(dark_mode: false, profile_age: 18)
  broadcasterseed.save!

  developerseed = User.new(email: "testdeveloper#{i}@email.com", username: "testdeveloper#{i}", password: "1234567#{i}", first_name: "Wert#{i}", middle_name: "V#{i}", last_name: "Kerdt#{i}", developer: true)
  developerseed.skip_confirmation!
  developerseed.create_user_pref(dark_mode: true, profile_age: 25)
  developerseed.save!
end
