# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).

help_topics = [
  {
    short_title: 'accountSignupHelp',
    title: 'Account and Sign Up',
    all_users: true,
    contractors_only: false,
    broadcasters_only: false,
    developers_only: false,

    help_sections: [
      {
        section_title: 'Where do I sign up?',
        section_body:
          'Right <br><a href="/signup">here</a> why thanks for asking!'
      },
      {
        section_title: 'How do you use my email address?',
        section_body:
          'A verifiable email address is required for signup. This will not be shown anywhere on the site, and is used solely for account management and your chosen notifications. If you created an account with an email address you do not have access to, you will not be able to make another account with that username for two days. Unconfirmed accounts will be deleted two days after their creation.'
      },
      {
        section_title: 'Username Rules',
        section_body:
          ' Usernames can be between 3 and 26 characters long, and include alphanumeric characters and hyphens (-) and underscores (_).'
      },
      {
        section_title: 'Forgotten Password',
        section_body:
          'If you have forgotten your password, visit the <A TAG NEEDED>forgot your password page</a> to recover your account.'
      }
    ]
  },
  {
    short_title: 'payoutHelp',
    title: 'Getting Paid',
    all_users: false,
    contractors_only: true,
    broadcasters_only: false,
    developers_only: false,

    help_sections: [
      {
        section_title: 'This should be visible by Devs and Broadcasters',
        section_body: 'Lots of ways! Check'
      },
      {
        section_title: 'Payout Requirments',
        section_body:
          'You need at least $XX.XX in your account when payments are processed to be receive payment.'
      },
      {
        section_title: 'Payroll Day',
        section_body:
          'Payments are processed on the XX and the XX of every month.'
      }
    ]
  },
  {
    short_title: 'devHelp',
    title: 'Game Development',
    all_users: false,
    contractors_only: false,
    broadcasters_only: false,
    developers_only: true,

    help_sections: [
      {
        section_title: 'How can I API? This should be visible by Developers',
        section_body: 'Lots of ways! Check 123 testing'
      },
      {
        section_title: 'Game Requirments',
        section_body: 'HTML5 or Flash pls.'
      },
      {
        section_title: 'Where do documentations live?',
        section_body: 'Right over here:'
      }
    ]
  },
  {
    short_title: 'streamHelp',
    title: 'Live Streaming',
    all_users: false,
    contractors_only: false,
    broadcasters_only: true,
    developers_only: false,

    help_sections: [
      {
        section_title: 'How can I RTMP? This should be visible by Broadcasters',
        section_body: 'Ya need some software m8'
      },
      {
        section_title: 'But no software pls.',
        section_body: 'Fine do a quick stream from your browser'
      },
      {
        section_title: 'What settings should I use?',
        section_body: 'Good question'
      }
    ]
  }
]

help_topics.each do |help_topic|
  topic_to_save = HelpTopic.new(
    short_title: help_topic[:short_title],
    title: help_topic[:title],
    all_users: help_topic[:all_users],
    contractors_only: help_topic[:contractors_only],
    broadcasters_only: help_topic[:broadcasters_only],
    developers_only: help_topic[:developers_only],
  )
  help_topic[:help_sections].each do |help_section|
    topic_to_save.help_sections.build(
      section_title: help_section[:section_title],
      section_body: help_section[:section_body]
    )
  end
  topic_to_save.save!
end

if Rails.env.production? == false
  include FakeUsernames # api-server/lib/fake_usernames.rb
  fake_usernames = FakeUsernames.usernames
  fake_usernames = fake_usernames.shuffle

  fake_tag_array = ['wow', 'yes', 'nice', 'drums',
    'no', 'wee', 'sun', 'praise', 'test', 'sauce', 'MMO', 'english',
    'overwatch', 'slamdunk', 'multiplayer', 'PvE', 'raid', 'aaa', 'tes',
    'testtest', 'testtesttest']

  fake_online_statuses = [true, false]

  # Set how many of each user type to seed
  usercount = 5
  broadcastercount = 10
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
      password: "asdfasdf",
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
