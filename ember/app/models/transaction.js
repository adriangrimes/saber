import DS from 'ember-data';

export default DS.Model.extend({
  timestamp: DS.attr('number'),
  transactionType: DS.attr('string'),
  details: DS.attr(),
  cubeValue: DS.attr('number'),
  dollarValue: DS.attr('number')
});
