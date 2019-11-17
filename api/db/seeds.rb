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
        section_title: 'How do I sign up?',
        section_body:
          'Visit <a href="/signup">Saber.tv/signup</a> to create an account.
          <br> Usernames can be between 3 and 26 characters long, and include alphanumeric characters and hyphens (-) and underscores (_).'
      },
      {
        section_title: 'Why do you need my email address?',
        section_body:
          'A verifiable email address is required for signup. This will not be published anywhere on the site, and is used solely for account management and your chosen notifications.
          <br> If you created an account with an email address you do not have access to, you will not be able to make another account with that username for two days.
            <br> Unconfirmed accounts will be deleted two days after their creation.'
      },
      {
        section_title: 'I forgot my password',
        section_body:
          'If you have forgotten your password, visit <a href="/forgot-password">Saber.tv/forgot-password</a> and follow the instructions to recover your account.'
      },
      {
        section_title: 'How do I become a Broadcaster?',
        section_body:
        'Visit <a href="/signup/broadcaster">Saber.tv/signup/broadcaster</a> to become a broadcaster.'
      },
      {
        section_title: 'How do I become a Developer?',
        section_body:
        'Visit <a href="/signup/developer">Saber.tv/signup/developer</a> to become a developer.'
      },
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
        section_title: 'Payout Day',
        section_body:
        'Payments will be sent on the 1st of every month'
      },
      {
        section_title: 'Payout Requirments',
        section_body:
        'Payments will be processed for all contractors who have earned more then the minimum of $20. If you earn less than $20 during a pay period the amount you have earned will carry over to the next pay period. '
      },
      {
        section_title: 'Payout Methods',
        section_body: 'We currently support the following methods for payouts: Mailed Check, Bitcoin
        <br>You can change or update your payout method in your <a href="/account">Account Settings</a>.'
      },
      {
        section_title: 'How much is a Credit worth?',
        section_body: 'Each credit costs the user between XXX and XXX. <br>
        Broadcasters will receive 50%, XXX per credit they receive.<br>
        Developers will receive 5%, XXX per credit spent on their games.<br>
        Affiliates will receive 5%, XXX per credit purchased from their affiliate link.<br>
        By default all contractors will receive a monthly payment of their earnings.'
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
        section_title: 'How much can I earn?',
        section_body: ' Earn XX% from every credit spent with you.'
      },
      {
        section_title: 'Can I stream with RTMP?',
        section_body: 'Yes!'
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
        section_title: 'How much can I earn?',
        section_body: 'Earn XX% of the entry fee every time your game is played on Saber.tv'
      },
      {
        section_title: 'Game Requirments',
        section_body: 'We currently only accept HTML5 Games.'
      },
      {
        section_title: 'API Documentation',
        section_body: 'Coming soon.'
      },
      {
        section_title: 'How do I become a developer?',
        section_body: 'Visit <a href="/signup/developer">Saber.tv/signup/developer</a> to create a developer account.'
      },
      {
        section_title: 'I am already a broadcaster, can I be a developer on the same account?',
        section_body: 'Yes! Visit <a href="/signup/developer">Saber.tv/signup/developer</a> to create a developer account. '
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
  include FakeUsernames # api/lib/fake_usernames.rb
  include StreamKey
  SymmetricEncryption.load!
  verification_uploader = VerificationUploader.new(:store)

  fake_usernames = FakeUsernames.usernames
  fake_usernames = fake_usernames.shuffle

  fake_tag_array = ['wow', 'yes', 'nice', 'drums',
                    'no', 'sun', 'praise', 'test', 'MMO', 'english',
                    'overwatch', 'slamdunk', 'multiplayer', 'PvE', 'raid', 'aaa', 'tes',
                    'testtest', 'testtesttest']

  fake_online_statuses = [true, false]
  payout_methods = ["check", "bitcoin"]

  # Set how many of each user type to seed
  test_user_count = 5
  test_broadcaster_count = 30
  test_developer_count = 5
  test_affiliate_count = 5

  # User for testing database defaults
  # Email, username, password, and a user_public_datum record are the minimum
  # required to save a user
  p "========================================="
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

  # BroadcasterTester1
  p "BroadcasterTester1 ========================================="
  age = rand(13..100)
  broadcaster1 = User.new(
    email: "broadcastertester1@email.com",
    username: "BroadcasterTester1",
    password: "12345671",
    dark_mode: false,
    send_email_followed_online: false,
    stream_key: StreamKey.generate()
  )
  broadcaster1.skip_confirmation!
  tags = fake_tag_array.sample(rand(0..3))
  puts tags.inspect
  broadcaster1.build_user_public_datum(
    username: broadcaster1.username,
    broadcaster: broadcaster1.broadcaster,
    online_status: false,
    channel_topic: "Channel topic for describing the topic of #{broadcaster1.username}'s channel",
    user_custom_tags: tags,
    profile_age: age,
    profile_about_me: "Hey, I'm new here. Also hello from the seeds.rb file!"
  )
  broadcaster1.is_being_seeded = true
  broadcaster1.save!
  broadcaster1.user_verification_uploads.create(
    user_id: broadcaster1.id,
    verified: true,
    upload_data: verification_uploader
      .upload(File.new(
        Rails.root.join("lib/seed_images/#{rand(1..6)}.jpg"))
      )
      .to_json
  )
  broadcaster1.user_verification_uploads.create(
    user_id: broadcaster1.id,
    verified: true,
    upload_data: verification_uploader
      .upload(File.new(
        Rails.root.join("lib/seed_images/#{rand(1..6)}.jpg"))
      )
      .to_json
  )
  broadcaster1.build_contractor_application(
    consent_to_store_data: true,
    pending_broadcaster_application: true,
    full_name: "Streamer1 C1 Aster1",
    birthdate: (age.years.ago - 1.day).to_date.strftime('%Y-%m-%dT%H:%M:%S.%LZ'),
    payout_method: 'bitcoin',
    bitcoin_address: "SDfjknsjkjh389f",
    street_address: "321 Nice St",
    city: "Townsville",
    region: "Virginia",
    postal_code: "90001",
    country: "United States",
    business_identification_number: "101-11-1111",
    subject_to_backup_withholding: true
  )
  broadcaster1.contractor_application.is_being_seeded = true
  broadcaster1.contractor_application.save!
  broadcaster1.contractor_application.pending_application_override = true
  broadcaster1.contractor_application.pending_broadcaster_application = false
  broadcaster1.contractor_application.save!
  broadcaster1.make_broadcaster
  broadcaster1.save!

  # Users used to check that password encryption is working correctly when
  # two users have the same password
  2.times do |j|
    p "========================================="
    samepass = User.new(
      email: "samepass#{j + 1}@email.com",
      username: "SamePass#{j + 1}",
      password: "password"
    )
    samepass.skip_confirmation!
    samepass.build_user_public_datum(
      username: samepass.username,
      broadcaster: false
    )
    samepass.save!
  end

  ###########################################
  # Test users
  p "========================================="
  test_user_count.times do |i|
    testuser = User.new(
      email: "usertester#{i + 1}@email.com",
      username: "UserTester#{i + 1}",
      password: "1234567#{i + 1}",
      dark_mode: true,
      send_email_followed_online: [true, false].sample
    )
    testuser.skip_confirmation!
    testuser.build_user_public_datum(
      username: testuser.username,
      broadcaster: false,
      profile_age: rand(13..100)
    )
    testuser.save!
  end

  ###########################################
  # Test broadcasters
  test_broadcaster_count.times do |i|
    p "test broadcaster ========================================="
    i += 1
    age = rand(13..100)
    testbroadcaster = User.new(
      email: "broadcastertester#{i + 1}@email.com",
      username: fake_usernames[i].capitalize,
      password: "asdfasdf",
      dark_mode: false,
      send_email_followed_online: false
      stream_key: StreamKey.generate()
    )
    testbroadcaster.is_being_seeded = true
    p "about to skip confirmation"
    testbroadcaster.skip_confirmation!
    onlinestatus = fake_online_statuses.sample # ~X% of users as online
    tags = fake_tag_array.sample(rand(0..15))
    puts tags.inspect
    game_id = 0
    if onlinestatus
      game_id = rand(1..10)
    end

    testbroadcaster.build_user_public_datum(
      username: testbroadcaster.username,
      broadcaster: testbroadcaster.broadcaster,
      online_status: onlinestatus,
      channel_topic: "Channel topic for describing the topic of #{testbroadcaster.username}'s channel",
      current_game_id: game_id,
      user_custom_tags: tags,
      profile_age: age,
      profile_about_me: "Hey, I'm #{testbroadcaster.username} and new here. Also hello from the seeds.rb file!"
    )

    testbroadcaster.save!
    testbroadcaster.user_verification_uploads.create(
      user_id: testbroadcaster.id,
      verified: true,
      upload_data: verification_uploader
        .upload(File.new(
          Rails.root.join("lib/seed_images/#{rand(1..6)}.jpg"))
        )
        .to_json
    )
    testbroadcaster.user_verification_uploads.create(
      user_id: testbroadcaster.id,
      verified: true,
      upload_data: verification_uploader
        .upload(File.new(
          Rails.root.join("lib/seed_images/#{rand(1..6)}.jpg"))
        )
        .to_json
    )
    attribs = {
      consent_to_store_data: true,
      pending_broadcaster_application: true,
      full_name: "Streamer#{i + 1} C#{i + 1} Aster#{i + 1}",
      birthdate: (age.years.ago - 1.day).to_date.strftime('%Y-%m-%dT%H:%M:%S.%LZ') ,
      payout_method: payout_methods.sample,
      street_address: "#{i + 1} Nice St",
      city: "Townsville",
      region: "Virginia",
      postal_code: "900#{i + 1}",
      country: "United States",
      business_identification_number: "#{i + 1}01-11-1111",
      subject_to_backup_withholding: [true, false].sample
    }
    attribs[:bitcoin_address] = "#{i + 1}SDfjknsjkjh389f" if attribs[:payout_method] == 'bitcoin'
    testbroadcaster.build_contractor_application(attribs)
    testbroadcaster.contractor_application.is_being_seeded = true
    testbroadcaster.contractor_application.save!
    testbroadcaster.contractor_application.pending_application_override = true
    testbroadcaster.contractor_application.pending_broadcaster_application = false
    testbroadcaster.contractor_application.save!
    testbroadcaster.make_broadcaster
    testbroadcaster.save!
  end

  ###########################################
  # Test developers
  test_developer_count.times do |i|
    p "========================================="
    age = rand(13..100)
    testdeveloper = User.new(
      email: "developertester#{i + 1}@email.com",
      username: "DeveloperTester#{i + 1}",
      password: "1234567#{i + 1}",
      dark_mode: false,
      send_email_followed_online: false
    )
    testdeveloper.skip_confirmation!
    testdeveloper.build_user_public_datum(
      username: testdeveloper.username,
      broadcaster: false,
      profile_age: age,
      profile_about_me: "just developin"
    )
    attribs = {
      consent_to_store_data: true,
      pending_developer_application: true,
      full_name: "Dev#{i + 1} E#{i + 1} Loper#{i + 1}",
      birthdate: (age.years.ago - 1.day).to_date.strftime('%Y-%m-%dT%H:%M:%S.%LZ') ,
      payout_method: payout_methods.sample,
      street_address: "#{i + 1} Nice St",
      city: "Townsville",
      region: "Virginia",
      postal_code: "900#{i + 1}",
      country: "United States",
      business_identification_number: "#{i + 1}02-22-2222",
      subject_to_backup_withholding: [true, false].sample
    }
    attribs[:bitcoin_address] = "#{i + 1}SDfjknsjkjh389f" if attribs[:payout_method] == 'bitcoin'
    testdeveloper.build_contractor_application(attribs)
    testdeveloper.contractor_application.save!
    testdeveloper.make_developer
    testdeveloper.save!
  end

  ###########################################
  # Test affiliates
  test_affiliate_count.times do |i|
    p "========================================="
    age = rand(13..100)
    testaffiliate = User.new(
      email: "affiliatetester#{i + 1}@email.com",
      username: "AffiliateTester#{i + 1}",
      password: "1234567#{i + 1}",
      dark_mode: false,
      send_email_followed_online: false
    )
    testaffiliate.skip_confirmation!
    testaffiliate.build_user_public_datum(
      username: testaffiliate.username,
      broadcaster: false,
      profile_age: age
    )
    attribs = {
      consent_to_store_data: true,
      pending_affiliate_application: true,
      full_name: "Aff#{i + 1} Ili#{i + 1} Ate#{i + 1}",
      birthdate: (age.years.ago - 1.day).to_date.strftime('%Y-%m-%dT%H:%M:%S.%LZ') ,
      payout_method: payout_methods.sample,
      street_address: "#{i + 1} Nice St",
      city: "Townsville",
      region: "Virginia",
      postal_code: "900#{i + 1}",
      country: "United States",
      business_identification_number: "#{i + 1}03-33-3333",
      subject_to_backup_withholding: [true, false].sample
    }
    attribs[:bitcoin_address] = "#{i + 1}SDfjknsjkjh389f" if attribs[:payout_method] == 'bitcoin'
    testaffiliate.build_contractor_application(attribs)
    testaffiliate.contractor_application.save!
    testaffiliate.make_affiliate
    testaffiliate.save!
  end

end
