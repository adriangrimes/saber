# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)

samepass1 = User.new(
  email: "samepass1@email.com",
  username: "SamePass1",
  password: "password",
  full_name: "Sam1|E|Pas",
  dark_mode: true,
  profile_age: 30,
  send_email_favorites_online: true
)
samepass1.skip_confirmation!
samepass1.save!

samepass2 = User.new(
  email: "samepass2@email.com",
  username: "SamePass2",
  password: "password",
  full_name: "Sam2|E|Pas",
  dark_mode: true,
  profile_age: 30,
  send_email_favorites_online: false
)
samepass2.skip_confirmation!
samepass2.save!

5.times do |i|
  userseed = User.new(
    email: "testuser#{i+1}@email.com",
    username: "testuser#{i+1}",
    password: "1234567#{i+1}",
    full_name: "John#{i+1}|K#{i+1}|Der#{i+1}",
    dark_mode: true,
    profile_age: 28
  )
  userseed.skip_confirmation!
  userseed.save!

  broadcasterseed = User.new(
    email: "testbroadcaster#{i+1}@email.com",
    username: "testbroadcaster#{i+1}",
    password: "1234567#{i+1}",
    full_name: "Streamer#{i+1}|C#{i+1}|Aster#{i+1}",
    broadcaster: true,
    dark_mode: false,
    profile_age: 20
  )
  broadcasterseed.skip_confirmation!
  broadcasterseed.save!

  developerseed = User.new(
    email: "testdeveloper#{i+1}@email.com",
    username: "testdeveloper#{i+1}",
    password: "1234567#{i+1}",
    full_name: "Wert#{i+1}|C#{i+1}|Fort#{i+1}",
    developer: true,
    dark_mode: true,
    profile_age: 25
  )
  developerseed.skip_confirmation!
  developerseed.save!
end
