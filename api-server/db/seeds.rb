# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: "Star Wars" }, { name: "Lord of the Rings" }])
#   Character.create(name: "Luke", movie: movies.first)


10.times do |i|
  User.create(email: "testuser#{i}@email.com", username: "testuser#{i}", password: "1234#{i}", first_name: "John#{i}", middle_name: "K#{i}", last_name: "Der#{i}")
  User.create(email: "testbroadcaster#{i}@email.com", username: "testbroadcaster#{i}", password: "1234#{i}", first_name: "Guy#{i}", middle_name: "M#{i}", last_name: "Smert#{i}", broadcaster: true)
  User.create(email: "testdeveloper#{i}@email.com", username: "testdeveloper#{i}", password: "1234#{i}", first_name: "Wert#{i}", middle_name: "V#{i}", last_name: "Kerdt#{i}", developer: true)
end
