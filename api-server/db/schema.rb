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

ActiveRecord::Schema.define(version: 20161214031618) do

  create_table "users", force: :cascade do |t|
    t.string   "email"
    t.string   "username"
    t.string   "password"
    t.string   "first_name"
    t.string   "middle_name"
    t.string   "last_name"
    t.boolean  "admin",                                    default: false
    t.boolean  "broadcaster",                              default: false
    t.boolean  "developer",                                default: false
    t.datetime "birthdate"
    t.string   "address_line_1"
    t.string   "address_line_2"
    t.string   "address_line_3"
    t.boolean  "dark_mode",                                default: false
    t.boolean  "send_email_favorites_online",              default: false
    t.boolean  "send_email_site_news",                     default: false
    t.integer  "profile_photo_id"
    t.string   "profile_sex",                 limit: 16
    t.text     "profile_about_me",            limit: 2048
    t.integer  "profile_age",                 limit: 3
    t.string   "profile_location",            limit: 32
    t.string   "profile_languages",           limit: 32
    t.text     "profile_platforms",           limit: 2048
    t.datetime "created_at",                                               null: false
    t.datetime "updated_at",                                               null: false
  end

end
