class Users::PasswordsController < Devise::PasswordsController
  # GET /resource/password/new
  # def new
  #   super
  # end

  # POST /resource/password
  def create
    self.resource = resource_class
                    .send_reset_password_instructions(email: params[:email])
    if successfully_sent?(resource)
      render status: :ok
    else
      render json: ErrorSerializer.serialize(resource.errors),
        status: :unprocessable_entity
    end
  end

  # GET /resource/password/edit?reset_password_token=abcdef
  def edit
    unless params[:reset_password_token].blank?
      if user = User.with_reset_password_token(params[:reset_password_token])
        if user.reset_password_period_valid?
          if params[:password] == params[:password_confirm]
            if user.reset_password(params[:password], params[:password_confirm])
              render json: { status: 'ok' }, status: :ok
            else
              render json: ErrorSerializer.serialize(user.errors),
                status: :unprocessable_entity
              return
            end
          else
            render json: { errors: [{
                attribute: :base,
                message: 'Password and password confirmation must match.'
              }]},
              status: :unprocessable_entity
            return
          end
        else
          render json: { errors: [{
              attribute: :base,
              message: 'This password reset link has expired. Please use the forgot password process again.'
            }]},
            status: :unprocessable_entity
          return
        end
      else
        render json: { errors: [{
            attribute: :base,
            message: 'This password reset link is invalid. Please use the forgot password process again.'
          }]},
          status: :unprocessable_entity
        return
      end
    else
      render json: { errors: [{
          attribute: :base,
          message: 'Token is missing. Please use the forgot password process again.'
        }]},
        status: :not_found
      return
    end
  end

  # PUT /resource/password
  # def update
  #   super
  # end

  # protected

  # def after_resetting_password_path_for(resource)
  #   super(resource)
  # end

  # The path used after sending reset password instructions
  # def after_sending_reset_password_instructions_path_for(resource_name)
  #   super(resource_name)
  # end
end
