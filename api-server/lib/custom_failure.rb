class CustomFailure < Devise::FailureApp
  def respond
    if request.format == :json
      puts "==== failureapp to the rescue??? ===="
      puts request.format.inspect
      json_error_response
    else
      super
    end
  end

  def json_error_response
    self.status = 401
    self.content_type = "application/json"
    self.response_body = [ { detail: "Your login or password is incorrect."} ].to_json
  end
end
