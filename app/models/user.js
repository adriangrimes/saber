import DS from 'ember-data';

export default DS.Model.extend({

  email: DS.attr('string'),
  username: DS.attr('string'),
  password: DS.attr('string'),
  firstName: DS.attr('string'),
  middleName: DS.attr('string'),
  lastName: DS.attr('string'),
  birthdate: DS.attr('date'),

  accountStatus: DS.attr('string'),
  adminStatus: DS.attr('boolean'),
  broadcaster: DS.attr('boolean'),
  developer: DS.attr('boolean'),
  streamKey: DS.attr('string'),

  addressLine1: DS.attr('string'),
  addressLine2: DS.attr('string'),
  addressLine3: DS.attr('string'),
  timezone: DS.attr('string'),

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
