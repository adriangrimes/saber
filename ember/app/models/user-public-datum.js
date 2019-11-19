import DS from 'ember-data';

export default DS.Model.extend({
  // Belongs to one user
  user: DS.belongsTo('user'),

  // Public profile
  userId: DS.attr('number'),
  username: DS.attr('string'),
  broadcaster: DS.attr('boolean'),
  onlineStatus: DS.attr('boolean'),
  channelTopic: DS.attr('string'),
  currentGameId: DS.attr('number'),
  streamnailPath: DS.attr('string'),
  allowTips: DS.attr('boolean'),
  allowSuggestedGames: DS.attr('boolean'),
  timezone: DS.attr('string'),
  userCustomTags: DS.attr(),
  profilePhotoPath: DS.attr('string'),
  profileGender: DS.attr('string'),
  profileAboutMe: DS.attr('string'),
  profileAge: DS.attr('number'),
  profileLocation: DS.attr('string'),
  profileLanguages: DS.attr('string')
  //profilePlatforms: DS.attr('string')
});
