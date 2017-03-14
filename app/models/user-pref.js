import DS from 'ember-data';

export default DS.Model.extend({
  user: DS.belongsTo('user'),

  darkMode: DS.attr('boolean'),
  sendEmailFavoritesOnline: DS.attr('boolean'),
  sendEmailSiteNews: DS.attr('boolean'),

  profilePhotoId: DS.attr('number'),
  profileSex: DS.attr('string'),
  profileAboutMe: DS.attr('string'),
  profileAge: DS.attr('number'),
  profileLocation: DS.attr('string'),
  profileLanguages: DS.attr('string')
  //profilePlatforms: DS.attr('boolean')
});
