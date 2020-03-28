class TransactionSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id,
    :timestamp,
    :transaction_type,
    :details,
    :cube_value,
    :dollar_value
end
