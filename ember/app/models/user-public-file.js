import DS from 'ember-data';

export default DS.Model.extend({
  signedId: DS.attr('string'),
  filename: DS.attr('string'),
  fileUrl: DS.attr('string'),
  membersOnly: DS.attr('boolean'),
  profileImage: DS.attr('boolean'),
  userId: DS.attr('string')
});
