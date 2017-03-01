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

ActiveRecord::Schema.define(version: 20170228073509) do

  create_table "contest_votes", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "voted_for"
    t.integer  "contest_id"
    t.string   "ip_and_useragent"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "contests", force: :cascade do |t|
    t.string   "name"
    t.text     "description"
    t.text     "rules"
    t.integer  "credit_reward"
    t.datetime "start"
    t.datetime "end"
    t.datetime "created_at",    null: false
    t.datetime "updated_at",    null: false
  end

  create_table "credit_purchases", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "amount"
    t.string   "payment_method"
    t.string   "ip_and_useragent"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "credit_transfers", force: :cascade do |t|
    t.integer  "from_user_id"
    t.integer  "to_user_id"
    t.string   "type"
    t.integer  "amount"
    t.integer  "dev_id"
    t.integer  "dev_share_amount"
    t.datetime "created_at",       null: false
    t.datetime "updated_at",       null: false
  end

  create_table "game_logs", force: :cascade do |t|
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "private_messages", force: :cascade do |t|
    t.integer  "from_user_id"
    t.integer  "to_user_id"
    t.text     "message",      limit: 1024
    t.datetime "created_at",                null: false
    t.datetime "updated_at",                null: false
  end

  create_table "user_blocks", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "marked_as_blocked"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  create_table "user_favorites", force: :cascade do |t|
    t.integer  "user_id"
    t.integer  "marked_as_favorite"
    t.datetime "created_at",         null: false
    t.datetime "updated_at",         null: false
  end

  create_table "user_files", force: :cascade do |t|
    t.integer  "user_id"
    t.string   "user_file_name"
    t.string   "user_content_type"
    t.integer  "user_file_size"
    t.datetime "user_updated_at"
    t.boolean  "is_public"
    t.datetime "created_at",        null: false
    t.datetime "updated_at",        null: false
  end

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "username"
    t.string   "password"
    t.string   "first_name"
    t.string   "middle_name"
    t.string   "last_name"
    t.datetime "birthdate"
    t.string   "account_status"
    t.boolean  "admin",                                    default: false
    t.boolean  "broadcaster",                              default: false
    t.boolean  "developer",                                default: false
    t.string   "stream_key",                  limit: 64
    t.string   "address_line_1"
    t.string   "address_line_2"
    t.string   "address_line_3"
    t.string   "timezone"
    t.boolean  "dark_mode",                                default: false
    t.boolean  "send_email_favorites_online",              default: false
    t.boolean  "send_email_site_news",                     default: false
    t.integer  "profile_photo_id"
    t.string   "profile_sex",                 limit: 16
    t.text     "profile_about_me",            limit: 2048
    t.integer  "profile_age",                 limit: 3
    t.string   "profile_location",            limit: 32
    t.string   "profile_languages",           limit: 32
    t.datetime "created_at",                                               null: false
    t.datetime "updated_at",                                               null: false
  end

end
