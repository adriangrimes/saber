class TransactionSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id,
    :timestamp,
    :transaction_type,
    :details,
    :credit_value,
    :dollar_value
end
