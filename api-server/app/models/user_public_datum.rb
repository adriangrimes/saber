class UserPublicDatum < ApplicationRecord
  belongs_to :user

  # excluded_columns = [
  #   'id',
  #   'user_id',
  #   'allow_tips',
  #   'allow_suggested_games',
  #   'timezone',
  #   'profile_about_me',
  #   'profile_age',
  #   'profile_location',
  #   'profile_languages'
  # ]
  #
  # scope :searchable, ->  {
  #   select( UserPublicDatum.attribute_names - excluded_columns )
  # }

  # def select_without columns
  #   select(column_names - columns.map(&:to_s))
  # end

  # Public profile photos and images
  # has_many_attached :profile_images

  validates :user_id, allow_nil: true, presence: true
  validates :username, presence: true
end
