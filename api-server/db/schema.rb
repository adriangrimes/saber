# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 2019_05_20_223332) do

  create_table "active_storage_attachments", force: :cascade do |t|
    t.string "name", null: false
    t.string "record_type", null: false
    t.integer "record_id", null: false
    t.integer "blob_id", null: false
    t.datetime "created_at", null: false
    t.index ["blob_id"], name: "index_active_storage_attachments_on_blob_id"
    t.index ["record_type", "record_id", "name", "blob_id"], name: "index_active_storage_attachments_uniqueness", unique: true
  end

  create_table "active_storage_blobs", force: :cascade do |t|
    t.string "key", null: false
    t.string "filename", null: false
    t.string "content_type"
    t.text "metadata"
    t.bigint "byte_size", null: false
    t.string "checksum", null: false
    t.datetime "created_at", null: false
    t.index ["key"], name: "index_active_storage_blobs_on_key", unique: true
  end

  create_table "chat_tickets", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "user_ip", null: false
    t.string "username", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_chat_tickets_on_user_id"
  end

  create_table "contest_votes", force: :cascade do |t|
    t.integer "user_id"
    t.integer "voted_for"
    t.integer "contest_id"
    t.string "ip_and_useragent"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "contests", force: :cascade do |t|
    t.string "name"
    t.text "description"
    t.text "rules"
    t.integer "credit_reward"
    t.datetime "start"
    t.datetime "end"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "credit_purchases", force: :cascade do |t|
    t.integer "user_id", null: false
    t.string "purchase_type", null: false
    t.integer "purchase_amount", null: false
    t.string "payment_method", null: false
    t.boolean "cleared", default: false, null: false
    t.boolean "cancelled", default: false, null: false
    t.integer "credits_purchased", null: false
    t.integer "credits_remaining", null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_credit_purchases_on_user_id"
  end

  create_table "credit_transfers", force: :cascade do |t|
    t.integer "from_user_id", null: false
    t.integer "to_user_id", null: false
    t.integer "credits_transferred", default: 0, null: false
    t.string "transfer_type", limit: 255, null: false
    t.string "transfer_description", limit: 255
    t.integer "broadcaster_payout_percentage", limit: 1, default: 50, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["from_user_id"], name: "index_credit_transfers_on_from_user_id"
    t.index ["to_user_id"], name: "index_credit_transfers_on_to_user_id"
  end

  create_table "game_logs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "private_messages", force: :cascade do |t|
    t.integer "from_user_id", null: false
    t.integer "to_user_id", null: false
    t.text "message", limit: 1024, null: false
    t.boolean "message_read", default: false, null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["created_at"], name: "index_private_messages_on_created_at"
    t.index ["from_user_id"], name: "index_private_messages_on_from_user_id"
    t.index ["to_user_id"], name: "index_private_messages_on_to_user_id"
    t.index ["updated_at"], name: "index_private_messages_on_updated_at"
  end

  create_table "static_game_data", force: :cascade do |t|
    t.integer "user_id"
    t.string "title"
    t.integer "photo_id"
    t.string "description"
    t.integer "instructions"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_static_game_data_on_user_id", unique: true
  end

  create_table "user_blocks", force: :cascade do |t|
    t.integer "user_id"
    t.integer "marked_as_blocked"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_favorites", force: :cascade do |t|
    t.integer "user_id"
    t.integer "marked_as_favorite"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_files", force: :cascade do |t|
    t.integer "user_id"
    t.boolean "is_public"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "user_public_data", force: :cascade do |t|
    t.integer "user_id"
    t.string "username"
    t.boolean "broadcaster", null: false
    t.boolean "online_status"
    t.string "channel_topic"
    t.integer "current_game_id"
    t.string "streamnail_path"
    t.boolean "allow_tips"
    t.boolean "allow_suggested_games"
    t.string "timezone"
    t.string "user_custom_tags"
    t.string "profile_photo_path"
    t.string "profile_sex", limit: 16
    t.text "profile_about_me", limit: 2048
    t.integer "profile_age", limit: 3
    t.string "profile_location", limit: 32
    t.string "profile_languages", limit: 32
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["user_id"], name: "index_user_public_data_on_user_id", unique: true
    t.index ["username"], name: "index_user_public_data_on_username", unique: true
  end

  create_table "users", force: :cascade do |t|
    t.string "username", null: false
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "authentication_token", null: false
    t.boolean "broadcaster", default: false
    t.boolean "developer", default: false
    t.boolean "affiliate", default: false
    t.string "account_status"
    t.boolean "suspended_account", default: false
    t.boolean "admin_status", default: false
    t.boolean "pending_deletion", default: false
    t.string "security_questions"
    t.string "stream_key", limit: 64
    t.boolean "dark_mode", default: false
    t.boolean "send_email_followed_online", default: false
    t.boolean "send_email_site_news", default: false
    t.boolean "private_message_email_notifications", default: true
    t.text "private_user_notes", limit: 2048
    t.integer "broadcaster_percentage", limit: 1, default: 50
    t.integer "developer_percentage", limit: 1, default: 5
    t.string "full_name"
    t.datetime "birthdate"
    t.string "address_line1"
    t.string "address_line2"
    t.string "address_line3"
    t.string "business_name"
    t.string "business_entity_type"
    t.string "payout_method"
    t.string "bitcoin_address"
    t.string "bank_account_number"
    t.string "bank_routing_number"
    t.boolean "subject_to_backup_withholding", default: false, null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.string "confirmation_token"
    t.datetime "confirmed_at"
    t.datetime "confirmation_sent_at"
    t.string "unconfirmed_email"
    t.integer "failed_attempts", default: 0, null: false
    t.string "unlock_token"
    t.datetime "locked_at"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["authentication_token"], name: "index_users_on_authentication_token", unique: true
    t.index ["confirmation_token"], name: "index_users_on_confirmation_token", unique: true
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
    t.index ["unlock_token"], name: "index_users_on_unlock_token", unique: true
    t.index ["username"], name: "index_users_on_username", unique: true
  end

end
