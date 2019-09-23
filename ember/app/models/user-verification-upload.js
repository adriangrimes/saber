import DS from 'ember-data';

export default DS.Model.extend({
  userId: DS.attr('string'),
  fileUrl: DS.attr('string'),
  uploadDataJson: DS.attr('string')
});
