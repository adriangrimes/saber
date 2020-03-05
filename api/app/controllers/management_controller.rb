class ManagementController < ApplicationController
  before_action :check_if_authorized_admin

  def index
    render status: :ok
  end

  protected

    def check_if_authorized_admin
      user = User.find(params[:id].to_i)
      if user.admin_status == true
        if token_is_authorized_for_id?(user.id)

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
