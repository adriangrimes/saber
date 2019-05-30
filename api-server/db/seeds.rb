# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

if Rails.env.development?
  # Set how many of each user type to seed
  usercount = 10

  # User for testing database defaults
  # Email, username, password, and a user_public_datum record are the minimum
  # required to save a user
  emptyuser = User.new(
    email: "emptyuser@email.com",
    username: "EmptyUser",
    password: "password"
  )
  emptyuser.skip_confirmation!
  emptyuser.build_user_public_datum(
    username: emptyuser.username,
    broadcaster: false
  )
  emptyuser.save!

  # Users for checking that password encryption is working correctly when two users
  # have the same password
  2.times do |i|
    samepass = User.new(
      email: "samepass#{i+1}@email.com",
      username: "SamePass#{i+1}",
      password: "password"
    )
    samepass.skip_confirmation!
    samepass.build_user_public_datum(
      username: samepass.username,
      broadcaster: false
    )
    samepass.save!
  end

  usercount.times do |i|
    # Test users
    testuser = User.new(
      email: "usertester#{i+1}@email.com",
      username: "UserTester#{i+1}",
      password: "1234567#{i+1}",
      full_name: "User#{i+1} K#{i+1} Basic#{i+1}",
      dark_mode: true,
      send_email_favorites_online: true
    )
    testuser.skip_confirmation!
    testuser.build_user_public_datum(
      username: testuser.username,
      broadcaster: false,
      profile_age: Random.new.rand(13..100)
    )
    testuser.save!

    # Test broadcasters
    testbroadcaster = User.new(
      email: "broadcastertester#{i+1}@email.com",
      username: "BroadcasterTester#{i+1}",
      password: "1234567#{i+1}",
      full_name: "Streamer#{i+1} C#{i+1} Aster#{i+1}",
      dark_mode: false,
      broadcaster: true,
      affiliate: true,
      send_email_favorites_online: false
    )
    testbroadcaster.skip_confirmation!
    onlinestatus = [true, false].sample # ~X% of users as online
    testbroadcaster.build_user_public_datum(
      username: testbroadcaster.username,
      broadcaster: testbroadcaster.broadcaster,
      online_status: onlinestatus,
      channel_topic: "Channel topic for describing the topic of BroadcasterTester#{i+1}'s channel",
      current_game_id: if onlinestatus then Random.new.rand(1..10) else 0 end,
      streamnail_path: if onlinestatus then "/streamnails/usericon.svg" else "/streamnails/404_streamnail.png" end,
      profile_age: Random.new.rand(13..100),
      profile_about_me: "Hey, I'm new here. Also hello from the seeds.rb file!"
    )
    testbroadcaster.save!

    # Test developers
    testdeveloper = User.new(
      email: "developertester#{i+1}@email.com",
      username: "DeveloperTester#{i+1}",
      password: "1234567#{i+1}",
      full_name: "Dev#{i+1} E#{i+1} Loper#{i+1}",
      dark_mode: false,
      developer: true,
      affiliate: true,
      send_email_favorites_online: false
    )
    testdeveloper.skip_confirmation!
    testdeveloper.build_user_public_datum(
      username: testdeveloper.username,
      broadcaster: false,
      profile_age: Random.new.rand(13..100),
      profile_about_me: "just developin"
    )
    testdeveloper.save!

    # Test affiliates
    testaffiliate = User.new(
      email: "affiliatetester#{i+1}@email.com",
      username: "AffiliateTester#{i+1}",
      password: "1234567#{i+1}",
      full_name: "Aff#{i+1} Ili#{i+1} Ate#{i+1}",
      dark_mode: false,
      affiliate: true,
      send_email_favorites_online: false
    )
    testaffiliate.skip_confirmation!
    testaffiliate.build_user_public_datum(
      username: testaffiliate.username,
      broadcaster: false,
      profile_age: Random.new.rand(13..100)
    )
    testaffiliate.save!
  end

end
