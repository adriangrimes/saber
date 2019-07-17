import DS from 'ember-data';

export default DS.Model.extend({
  fromUser: DS.attr('string'),
  toUser: DS.attr('string'),
  message: DS.attr('string'),
  messageRead: DS.attr('boolean'),
  timestamp: DS.attr('number')
});
