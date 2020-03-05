class ResendUnlockController < ApplicationController
  def index
    user = User.find_by(email: params[:email].to_s)
    if user
      user.resend_unlock_instructions
    end
    render status: :ok
  end
end
