class CubePurchaseSerializer
  include FastJsonapi::ObjectSerializer

  attributes :id,
             :purchase_type,
             :purchase_amount,
             :payment_method,
             :cubes_purchased
end
