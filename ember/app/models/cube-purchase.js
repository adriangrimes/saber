import DS from 'ember-data';

export default DS.Model.extend({
  // Belongs to one user
  user: DS.belongsTo('user'),

  userId: DS.attr('number'),
  purchaseType: DS.attr('string'),
  purchaseAmount: DS.attr('number'),
  paymentMethod: DS.attr('string'),
  // cleared: DS.attr('boolean'),
  // cancelled: DS.attr('boolean'),
  cubesPurchased: DS.attr('number')
});
