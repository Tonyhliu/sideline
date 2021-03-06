# encoding: UTF-8
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

ActiveRecord::Schema.define(version: 20160708034629) do

  # These are extensions that must be enabled in order to support this database
  enable_extension "plpgsql"

  create_table "comments", force: :cascade do |t|
    t.string   "body",       default: "", null: false
    t.datetime "created_at",              null: false
    t.datetime "updated_at",              null: false
    t.integer  "story_id",                null: false
    t.integer  "user_id",    default: 2,  null: false
  end

  add_index "comments", ["story_id"], name: "index_comments_on_story_id", using: :btree
  add_index "comments", ["user_id"], name: "index_comments_on_user_id", using: :btree

  create_table "favorites", force: :cascade do |t|
    t.integer  "user_id",    null: false
    t.integer  "story_id",   null: false
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  add_index "favorites", ["story_id"], name: "index_favorites_on_story_id", using: :btree
  add_index "favorites", ["user_id", "story_id"], name: "index_favorites_on_user_id_and_story_id", unique: true, using: :btree
  add_index "favorites", ["user_id"], name: "index_favorites_on_user_id", using: :btree

  create_table "stories", force: :cascade do |t|
    t.integer  "user_id",                     null: false
    t.string   "title"
    t.text     "body",                        null: false
    t.boolean  "published",   default: false
    t.datetime "created_at",                  null: false
    t.datetime "updated_at",                  null: false
    t.string   "picture_url"
  end

  add_index "stories", ["title"], name: "index_stories_on_title", using: :btree
  add_index "stories", ["user_id"], name: "index_stories_on_user_id", using: :btree

  create_table "users", force: :cascade do |t|
    t.string   "username",                                                                                                                                 null: false
    t.string   "password_digest",                                                                                                                          null: false
    t.string   "session_token",                                                                                                                            null: false
    t.text     "description"
    t.datetime "created_at",                                                                                                                               null: false
    t.datetime "updated_at",                                                                                                                               null: false
    t.string   "avatar_url",      default: "http://res.cloudinary.com/dcbb8bnvk/image/upload/w_400,h_400,c_crop,g_face,r_max/w_200/profilepic_cty3ak.png", null: false
  end

  add_index "users", ["session_token"], name: "index_users_on_session_token", unique: true, using: :btree
  add_index "users", ["username"], name: "index_users_on_username", unique: true, using: :btree

end
