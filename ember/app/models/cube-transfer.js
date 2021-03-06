import DS from 'ember-data';

export default DS.Model.extend({
  // fromUser: DS.attr('string'),
  fromUserId: DS.attr('number'),
  toUserId: DS.attr('number'),
  cubesTransferred: DS.attr('number'),
  transferType: DS.attr('string'),
  transferDescription: DS.attr('string'),
  broadcasterPayoutPercentage: DS.attr('string'),
  createdAt: DS.attr('ms-to-datetime')
});
