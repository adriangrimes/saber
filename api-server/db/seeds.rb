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
  first_name: "Sam1",
  middle_name: "E",
  last_name: "Pas",
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
  first_name: "Sam2",
  middle_name: "E",
  last_name: "Pas",
  dark_mode: true,
  profile_age: 30,
  send_email_favorites_online: false
)
samepass2.skip_confirmation!
samepass2.save!

10.times do |i|
  userseed = User.new(
    email: "testuser#{i}@email.com",
    username: "testuser#{i}",
    password: "1234567#{i}",
    first_name: "John#{i}",
    middle_name: "K#{i}",
    last_name: "Der#{i}",
    dark_mode: true,
    profile_age: 28
  )
  userseed.skip_confirmation!
  userseed.save!

  broadcasterseed = User.new(
    email: "testbroadcaster#{i}@email.com",
    username: "testbroadcaster#{i}",
    password: "1234567#{i}",
    first_name: "Girl#{i}",
    middle_name: "M#{i}",
    last_name: "Smert#{i}",
    broadcaster: true,
    dark_mode: false,
    profile_age: 18
  )
  broadcasterseed.skip_confirmation!
  broadcasterseed.save!

  developerseed = User.new(
    email: "testdeveloper#{i}@email.com",
    username: "testdeveloper#{i}",
    password: "1234567#{i}",
    first_name: "Wert#{i}",
    middle_name: "V#{i}",
    last_name: "Kerdt#{i}",
    developer: true,
    dark_mode: true,
    profile_age: 25
  )
  developerseed.skip_confirmation!
  developerseed.save!
end
