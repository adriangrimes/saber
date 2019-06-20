# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
if Rails.env.development?
  include FakeUsernames # api-server/lib/fake_usernames.rb
  fake_usernames = FakeUsernames.usernames
  fake_usernames = fake_usernames.shuffle

  fake_tag_array = ['wow', 'yes', 'nice', 'drums', 'no', 'wee', 'sun', 'praise', 'test', 'sauce', 'MMO', 'english',
    'overwatch', 'slamdunk', 'multiplayer', 'PvE', 'raid', 'aaa', 'tes',
    'testtest', 'testtesttest']

  fake_online_statuses = [true, false]

  # Set how many of each user type to seed
  usercount = 5
  broadcastercount = 5
  developercount = 5
  affiliatecount = 5

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

  broadcaster = User.new(
    email: "broadcastertester1@email.com",
    username: "BroadcasterTester1",
    password: "12345671",
    full_name: "Streamer1 C1 Aster1",
    dark_mode: false,
    broadcaster: true,
    affiliate: true,
    send_email_followed_online: false
  )
  broadcaster.skip_confirmation!
  onlinestatus = true # ~X% of users as online
  tags = fake_tag_array.sample(Random.new.rand(0..3))
  puts tags.inspect
  game_id = 0
  if onlinestatus
    game_id = Random.new.rand(1..10)
  end
  broadcaster.build_user_public_datum(
    username: broadcaster.username,
    broadcaster: broadcaster.broadcaster,
    online_status: onlinestatus,
    channel_topic: "Channel topic for describing the topic of #{broadcaster.username}'s channel",
    current_game_id: game_id,
    user_custom_tags: tags,
    profile_age: Random.new.rand(13..100),
    profile_about_me: "Hey, I'm new here. Also hello from the seeds.rb file!"
  )
  broadcaster.save!

  # Users for checking that password encryption is working correctly when two users
  # have the same password
  2.times do |j|
    samepass = User.new(
      email: "samepass#{j+1}@email.com",
      username: "SamePass#{j+1}",
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
    ###########################################
    # Test users
    testuser = User.new(
      email: "usertester#{i+1}@email.com",
      username: "UserTester#{i+1}",
      password: "1234567#{i+1}",
      full_name: "User#{i+1} K#{i+1} Basic#{i+1}",
      dark_mode: true,
      send_email_followed_online: true
    )
    testuser.skip_confirmation!
    testuser.build_user_public_datum(
      username: testuser.username,
      broadcaster: false,
      profile_age: Random.new.rand(13..100)
    )
    testuser.save!
  end

  broadcastercount.times do |i|
    ###########################################
    # Test broadcasters
    i += 1
    testbroadcaster = User.new(
      email: "broadcastertester#{i+1}@email.com",
      username: fake_usernames[i].capitalize,
      password: "1234567#{i+1}",
      full_name: "Streamer#{i+1} C#{i+1} Aster#{i+1}",
      dark_mode: false,
      broadcaster: true,
      affiliate: true,
      send_email_followed_online: false
    )
    testbroadcaster.skip_confirmation!
    onlinestatus = fake_online_statuses.sample # ~X% of users as online
    tags = fake_tag_array.sample(Random.new.rand(0..3))
    puts tags.inspect
    game_id = 0
    if onlinestatus
      game_id = Random.new.rand(1..10)
    end

    testbroadcaster.build_user_public_datum(
      username: testbroadcaster.username,
      broadcaster: testbroadcaster.broadcaster,
      online_status: onlinestatus,
      channel_topic: "Channel topic for describing the topic of #{testbroadcaster.username}'s channel",
      current_game_id: game_id,
      user_custom_tags: tags,
      profile_age: Random.new.rand(13..100),
      profile_about_me: "Hey, I'm #{testbroadcaster.username} and new here. Also hello from the seeds.rb file!"
    )

    testbroadcaster.save!
  end

  developercount.times do |i|
    ###########################################
    # Test developers
    testdeveloper = User.new(
      email: "developertester#{i+1}@email.com",
      username: "DeveloperTester#{i+1}",
      password: "1234567#{i+1}",
      full_name: "Dev#{i+1} E#{i+1} Loper#{i+1}",
      dark_mode: false,
      developer: true,
      affiliate: true,
      send_email_followed_online: false
    )
    testdeveloper.skip_confirmation!
    testdeveloper.build_user_public_datum(
      username: testdeveloper.username,
      broadcaster: false,
      profile_age: Random.new.rand(13..100),
      profile_about_me: "just developin"
    )
    testdeveloper.save!
  end

  affiliatecount.times do |i|
    ###########################################
    # Test affiliates
    testaffiliate = User.new(
      email: "affiliatetester#{i+1}@email.com",
      username: "AffiliateTester#{i+1}",
      password: "1234567#{i+1}",
      full_name: "Aff#{i+1} Ili#{i+1} Ate#{i+1}",
      dark_mode: false,
      affiliate: true,
      send_email_followed_online: false
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
