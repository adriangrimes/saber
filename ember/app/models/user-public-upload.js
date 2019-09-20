import DS from 'ember-data';

export default DS.Model.extend({
  userId: DS.attr('string'),
  fileUrl: DS.attr('string'),
  profileImage: DS.attr('boolean'),
  membersOnly: DS.attr('boolean'),
  uploadDataJson: DS.attr('string')
});
