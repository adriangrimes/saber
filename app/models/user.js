import DS from 'ember-data';

export default DS.Model.extend({
  email: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  firstName: DS.attr('string'),
  lastName: DS.attr('string'),
  birthdate: DS.attr('date')
});
