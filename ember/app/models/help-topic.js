import DS from 'ember-data';

export default DS.Model.extend({
  shortTitle: DS.attr('string'),
  title: DS.attr('string'),
  allUsers: DS.attr('boolean'),
  contractorsOnly: DS.attr('boolean'),
  broadcastersOnly: DS.attr('boolean'),
  developersOnly: DS.attr('boolean'),
  helpSections: DS.attr()
});
