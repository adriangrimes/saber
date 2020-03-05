class PrereleaseEmail < ApplicationRecord
  validates :email, uniqueness: { case_sensitive: false },
    format: { with: Regexp.new(/\A[^@\s]+@[^@\s]+\z/) }
end
