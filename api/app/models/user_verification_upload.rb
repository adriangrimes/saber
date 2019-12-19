class UserVerificationUpload < ApplicationRecord
  belongs_to :user

  include VerificationUploader::Attachment.new(:upload)

  before_destroy :part_of_pending_application?, prepend: true
  before_destroy :is_verified?, prepend: true

  def part_of_pending_application?
    p "part_of_pending_application?"
    app = ContractorApplication.find_by(user_id: self.user_id)
    if app && app.pending_broadcaster_application == true
      p "yes"
      errors[:base] << 'Can\'t delete verification uploads while your application is pending approval'
      throw(:abort)
    end
  end

  def is_verified?
    p "is_verified?"
    if verified == true
      p "yes"
      errors[:base] << 'Can\'t delete a verified upload'
      throw(:abort)
    end
  end

end
