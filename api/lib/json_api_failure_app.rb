class JsonApiFailureApp < Devise::FailureApp
  def respond
    if request.format == :json
      json_error_response
    else
      super
    end
  end

  def json_error_response
    puts "Executing FailureApp - converting 401 error to JSONAPI"
    self.status = 401
    self.content_type = "application/json"
    self.response_body = { errors: [{ attribute: :base, message: i18n_message }] }.to_json
    # self.response_body = [ { detail: "Your login or password is incorrect."} ].to_json
  end
end
