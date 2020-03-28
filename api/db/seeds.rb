# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
SymmetricEncryption.load!

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
        'Coming Soon!'
      },
      {
        section_title: 'How do I become an Affiliate?',
        section_body:
        'Coming Soon!'
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
        'Payments will be processed for all contractors who have earned more then the minimum of $20.
        <br>If you earn less than $20 during a pay period the amount you have earned will carry over to the next pay period. '
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
        section_title: 'Can I stream with RTMP?',
        section_body: 'Yes! You will need RTMP streaming software such as <a href="https://obsproject.com/">OBS</a>.
        <br>Configuring OBS:
        <br>Open the Settings menu, and then the Stream tab. Set the service to "Custom" and then enter your private stream key and our stream server.
        <br>You can find your private stream key and server on your <a href="/account">Account Settings</a> page.
        <br>
        <br>Starting your stream:
        <br>To enter your chat room open your Saber.tv profile by clicking "Public Profile" in your  <a href="/account">Account Settings</a> page.
        <br>When you are ready to start your stream click "Start Streaming" in your RTMP software. It will take about 30 seconds for your stream to appear to the public, when you can see it on your profile it is available to everyone.
        <br>Once your stream is connected you will appear as "Online" on our homepage.
        <br>
        <br>Stopping your stream:
        <br>When you are done streaming, click "Stop Streaming" on your RTMP Software.
        <br>Once your stream is disconnected you will no longer appear as "Online".
        <br>To leave your chat room, close your Saber.tv profile or log out of Saber.tv.'
      }
    ]
  },
  {
    short_title: 'affiliateHelp',
    title: 'Affiliate Program',
    all_users: false,
    contractors_only: true,
    broadcasters_only: false,
    developers_only: false,

    help_sections: [
      {
        section_title: 'Affiliate Rules',
        section_body: 'Do Not repeatedly spam your referral links, or share them in communities where such advertising is not welcome.'
      },
      {
        section_title: 'How do I become an affiliate?',
        section_body: 'Visit <a href="/signup/affiliate">Saber.tv/signup/affiliate</a> to create a affiliate account.<br>
        If you are already a Broadcaster or Developer, congratulations! You are already an affiliate.'
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
        section_title: 'Game Requirments',
        section_body: 'We currently only accept HTML5 Games.
        <br> All games are subject to approval by site administrators. We reserve the right to remove any game for any reason.'
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
p "Created help"

admin_user = User.new(
  email: "user@gmail.com",
  username: "SaberAdmin",
  password: "87654321",
  admin_status: true
)
admin_user.skip_confirmation!
admin_user.build_user_public_datum(
  username: admin_user.username,
  broadcaster: false
)
admin_user.save!
p "Created admin user"

if Rails.env.production? == false
  include FakeUsernames # api/lib/fake_usernames.rb
  include StreamKey
  verification_uploader = VerificationUploader.new(:store)

  fake_usernames = FakeUsernames.usernames
  fake_usernames = fake_usernames.shuffle

  fake_tag_array = ['English', 'PvP', 'Multiplayer', 'Lets Play', 'Speedrun',
    'Hard Mode', 'Drops Enabled', 'Overwatch', 'Minecraft', 'Competitive',
    'Raiding', 'Ranked', 'Casual']

  fake_online_statuses = [true, false]
  payout_methods = ["paypal", "check", "bitcoin"]

  # Set how many of each user type to seed
  test_user_count = 10
  test_broadcaster_count = 5
  test_developer_count = 5
  test_affiliate_count = 5

  # User for testing database defaults
  # Email, username, password, and a user_public_datum record are the minimum
  # required to save a user
  p "Empty users"
  emptyuser = User.new(
    email: "emptyuser@email.com",
    username: "EmptyUser",
    password: "12345678"
  )
  emptyuser.skip_confirmation!
  emptyuser.build_user_public_datum(
    username: emptyuser.username,
    broadcaster: false
  )
  emptyuser.save!

  # BroadcasterTester1
  p "BroadcasterTester1"
  broadcaster1 = User.new(
    email: "broadcastertester1@email.com",
    username: "BroadcasterTester1",
    password: "12345678",
    dark_mode: false,
    send_email_followed_online: false,
    stream_key: StreamKey.generate()
  )
  broadcaster1.skip_confirmation!
  tags = fake_tag_array.sample(rand(0..3))
  broadcaster1.build_user_public_datum(
    username: broadcaster1.username,
    broadcaster: broadcaster1.broadcaster,
    online_status: false,
    channel_topic: "#{broadcaster1.username}'s channel topic",
    user_custom_tags: tags,
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
    birthdate: (30.years.ago - 1.day).to_date.strftime('%Y-%m-%dT%H:%M:%S.%LZ'),
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
    p "SamePass"
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
  cube_purchase_amount = 200
  donation_amount = 100
  broadcaster_payout_amount = ((donation_amount * test_user_count) * (broadcaster1.contractor_application.broadcaster_percentage.to_d / 100.0).to_d).to_d / 10.to_d

  test_user_count.times do |i|
    testuser = User.new(
      email: "usertester#{i + 1}@email.com",
      username: "UserTester#{i + 1}",
      password: "12345678",
      dark_mode: false,
      send_email_followed_online: [true, false].sample
    )
    testuser.skip_confirmation!
    testuser.build_user_public_datum(
      username: testuser.username,
      broadcaster: false
    )
    testuser.save!
    testuser.cube_purchases.create(
      user_id: testuser.id,
      purchase_type: 'purchase',
      purchase_amount: cube_purchase_amount / 10,
      payment_method: 'paypal',
      cleared: true,
      cubes_purchased: cube_purchase_amount,
      cubes_remaining: cube_purchase_amount - donation_amount
    )
    testuser.save!
    CubeTransfer.create(
      from_user: testuser,
      to_user: broadcaster1,
      cubes_transferred: donation_amount,
      transfer_type: 'donation',
      transfer_description: broadcaster1.username,
      broadcaster_payout_percentage: broadcaster1.contractor_application.broadcaster_percentage
    ).save!
    p "Created user: " + testuser.username
  end

  # Seed payout to BroadcasterTester1
  broadcaster1.payouts.create(
    user_id: broadcaster1.id,
    total_cubes: donation_amount * test_user_count,
    total_amount_paid: broadcaster_payout_amount,
    payment_method: "check",
    street_address: broadcaster1.contractor_application.street_address
  )
  broadcaster1.save!

  ###########################################
  # Test broadcasters
  p "========================================="
  test_broadcaster_count.times do |i|
    i += 1
    testbroadcaster = User.new(
      email: "broadcastertester#{i + 1}@email.com",
      username: fake_usernames[i].capitalize,
      password: "12345678",
      dark_mode: false,
      send_email_followed_online: false,
      stream_key: StreamKey.generate()
    )
    testbroadcaster.is_being_seeded = true
    testbroadcaster.skip_confirmation!
    onlinestatus = fake_online_statuses.sample # ~X% of users as online
    tags = fake_tag_array.sample(rand(0..3))
    game_id = 0
    if onlinestatus
      game_id = rand(1..10)
    end
    testbroadcaster.save!
    testbroadcaster.build_user_public_datum(
      username: testbroadcaster.username,
      broadcaster: testbroadcaster.broadcaster,
      online_status: onlinestatus,
      channel_topic: "#{testbroadcaster.username}'s channel topic",
      current_game_id: game_id,
      user_custom_tags: tags,
      profile_about_me: "Hey, I'm #{testbroadcaster.username} and new here. Also hello from the seeds.rb file!"
    )
    testbroadcaster.user_public_datum.save!
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
      birthdate: (30.years.ago - 1.day).to_date.strftime('%Y-%m-%dT%H:%M:%S.%LZ') ,
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
    p "Created broadcaster: " + testbroadcaster.username
  end

  ###########################################
  # Test developers
  p "========================================="
  test_developer_count.times do |i|
    testdeveloper = User.new(
      email: "developertester#{i + 1}@email.com",
      username: "DeveloperTester#{i + 1}",
      password: "12345678",
      dark_mode: false,
      send_email_followed_online: false
    )
    testdeveloper.skip_confirmation!
    testdeveloper.build_user_public_datum(
      username: testdeveloper.username,
      broadcaster: false,
      profile_about_me: "just developin"
    )
    attribs = {
      consent_to_store_data: true,
      pending_developer_application: true,
      full_name: "Dev#{i + 1} E#{i + 1} Loper#{i + 1}",
      birthdate: (30.years.ago - 1.day).to_date.strftime('%Y-%m-%dT%H:%M:%S.%LZ') ,
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
    p "Created developer: " + testdeveloper.username
  end

  ###########################################
  # Test affiliates
  p "========================================="
  test_affiliate_count.times do |i|
    testaffiliate = User.new(
      email: "affiliatetester#{i + 1}@email.com",
      username: "AffiliateTester#{i + 1}",
      password: "12345678",
      dark_mode: false,
      send_email_followed_online: false
    )
    testaffiliate.skip_confirmation!
    testaffiliate.build_user_public_datum(
      username: testaffiliate.username,
      broadcaster: false
    )
    attribs = {
      consent_to_store_data: true,
      pending_affiliate_application: true,
      full_name: "Aff#{i + 1} Ili#{i + 1} Ate#{i + 1}",
      birthdate: (30.years.ago - 1.day).to_date.strftime('%Y-%m-%dT%H:%M:%S.%LZ') ,
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
    p "Created affiliate: " + testaffiliate.username
  end

end
