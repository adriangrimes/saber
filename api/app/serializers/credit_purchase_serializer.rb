class CreditPurchaseSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id,
             :purchase_type,
             :purchase_amount,
             :payment_method,
             :credits_purchased
end
