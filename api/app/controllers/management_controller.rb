class ManagementController < ApplicationController
  before_action :check_if_authorized_admin

  def index
    p 'management index'
    render status: :ok
  end

  protected

    def check_if_authorized_admin
      user_id = params[:id].to_i
      user = User.find(user_id)
      if user.admin_status == true
        if token_is_authorized_for_id?(user_id)

          return true
        else
          render status: :not_found
          return false
        end
      else
        render status: :not_found
        return false
      end
    end

end
