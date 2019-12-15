module StreamKey
  def generate
    stream_key = ""
    possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    42.times do |i|
      stream_key += possible[(rand() * possible.length).floor];
    end

    stream_key
  end
end
