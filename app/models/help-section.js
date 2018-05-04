import DS from 'ember-data';


export default DS.Model.extend({

  helpTopic: DS.belongsTo('help-topic'),
  sectionTitle: DS.attr('string'),
  sectionBody: DS.attr('string'),

});
