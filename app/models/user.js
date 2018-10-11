import DS from 'ember-data';

export default DS.Model.extend({

  username: DS.attr('string'),
  email: DS.attr('string'),
  accountStatus: DS.attr('string'),
  adminStatus: DS.attr('boolean'),
  streamKey: DS.attr('string'),
  securityQuestions: DS.attr('string'), //TODO Not encrypted

  // Account type (Account settings?)
  broadcaster: DS.attr('boolean'),
  developer: DS.attr('boolean'),
  affiliate: DS.attr('boolean'),
  spendsCredits: DS.attr('boolean'),
  allowTips: DS.attr('boolean'),
  allowSuggestedGames: DS.attr('boolean'),

  // Profile
  fullName: DS.attr('string'),
  birthdate: DS.attr('date'),
  addressLine1: DS.attr('string'),
  addressLine2: DS.attr('string'),
  addressLine3: DS.attr('string'),
  timezone: DS.attr('string'),

  // Payment (TODO most of these are probably not safe in terms of user security)
  businessName: DS.attr('string'),
  businessEntityType: DS.attr('string'),
  payoutMethod: DS.attr('string'),
  bitcoinAddress: DS.attr('string'),
  bankAccountNumber: DS.attr('string'),
  bankRoutingNumber: DS.attr('string'),
  subjectToBackupWithholding: DS.attr('boolean'),

  // Site settings
  darkMode: DS.attr('boolean'),
  sendEmailFavoritesOnline: DS.attr('boolean'),
  sendEmailSiteNews: DS.attr('boolean'),
  privateMessageEmailNotifications: DS.attr('boolean'),

  // Public profile
  userCustomTags: DS.attr('string'),
  profilePhotoId: DS.attr('number'),
  profileSex: DS.attr('string'),
  profileAboutMe: DS.attr('string'),
  profileAge: DS.attr('number'),
  profileLocation: DS.attr('string'),
  profileLanguages: DS.attr('string')
  //profilePlatforms: DS.attr('boolean')

});
