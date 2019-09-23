# frozen_string_literal: true

# Shrine configuration

require 'shrine'
require 'shrine/storage/file_system'

Shrine.plugin :activerecord
Shrine.plugin :cached_attachment_data # for retaining the cached file across form redisplays
Shrine.plugin :restore_cached_data # re-extract metadata when attaching a cached file
Shrine.plugin :determine_mime_type, analyzer: :marcel
Shrine.plugin :parsed_json
Shrine.plugin :upload_options, move: true
Shrine.plugin :validation_helpers

# Class for public uploads
class PublicUploader < Shrine
  PublicUploader.storages = {
    cache: Shrine::Storage::FileSystem.new('public', prefix: 'uploads/cache'), # temporary
    store: Shrine::Storage::FileSystem.new('public', prefix: 'uploads') # permanent
  }

  plugin :upload_endpoint, max_size: 5 * 1024 * 1024 # 5 MB
  Attacher.validate do
    validate_min_size 5 * 1024 # 5 KB
  end
end

# Class for verification uploads
class VerificationUploader < Shrine
  VerificationUploader.storages = {
    cache: Shrine::Storage::FileSystem.new('public', prefix: 'verification/cache'), # temporary
    store: Shrine::Storage::FileSystem.new('public', prefix: 'verification') # permanent
  }
  plugin :pretty_location, identifier: :user_id
  plugin :upload_endpoint, max_size: 20 * 1024 * 1024 # 20 MB
  Attacher.validate do
    validate_min_size 5 * 1024 # 5 KB
  end
end
