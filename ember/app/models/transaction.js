import DS from 'ember-data';

export default DS.Model.extend({
  fromUser: DS.attr('string'),
  toUser: DS.attr('string'),
  creditsTransferred: DS.attr('number'),
  type: DS.attr('string'),
  purchaseAmount: DS.attr('number'),
  paymentMethod: DS.attr('string'),
  cleared: DS.attr('boolean'),
  cancelled: DS.attr('boolean'),
  creditsPurchased: DS.attr('number')
});
