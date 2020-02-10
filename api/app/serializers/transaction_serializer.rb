class TransactionSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id,
    :timestamp,
    :transaction_type,
    :details,
    :credit_value,
    :dollar_value

  # Use block form to serialize attributes when serializer doesn't have a model
  # to use.
  # attribute :id do |object| object.id end
  # attribute :from_user do |object| object.from_user_id end
  # attribute :to_user do |object| object.to_user_id end
  # attribute :credits_transferred do |object| object.credits_transferred end
  # attribute :transaction_type do |object| object.transfer_type end
  # attribute :purchase_amount do |object| object.purchase_amount end
  # attribute :payment_method do |object| object.payment_method end
  # attribute :cleared do |object| object.cleared end
  # attribute :cancelled do |object| object.cancelled end
  # attribute :credit_purchased do |object| object.credit_purchased end
end
