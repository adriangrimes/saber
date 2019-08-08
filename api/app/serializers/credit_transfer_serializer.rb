class CreditTransferSerializer
  include FastJsonapi::ObjectSerializer

  attribute :id
  # attribute :from_user do |record, params|
  #   if params && params[:transactions] == true
  #     puts User.find(record.from_user_id).username
  #     User.find(record.from_user_id).username
  #   else
  #     nil
  #   end
  # end
  # :to_user_id,
  attributes :credits_transferred,
  :transfer_type,
  :transfer_description
  attribute :broadcaster_payout_percentage, if: Proc.new { |record, params|
    params && params[:transactions] == true
  }
  attribute :created_at do |record, params|
    if params && params[:transactions] == true
      # Convert date time to be friendlier to read
      # record.created_at.strftime("%B %e, %Y %-I:%M%p")
      # Return milliseconds since epoch
      record.created_at.to_datetime.strftime("%Q")
    end
  end
end
