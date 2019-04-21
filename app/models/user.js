import DS from 'ember-data';

export default DS.Model.extend({
  // Has one user account datum record
  userPublicDatum: DS.belongsTo('user-public-datum'),

  // Account data
  username: DS.attr('string'),
  email: DS.attr('string'),

  broadcaster: DS.attr('boolean'),
  developer: DS.attr('boolean'),
  affiliate: DS.attr('boolean'),
  accountStatus: DS.attr('string'),
  adminStatus: DS.attr('boolean'),
  securityQuestions: DS.attr('string'), //TODO Not encrypted
  streamKey: DS.attr('string'),

  // Site settings
  spendsCredits: DS.attr('boolean'),
  darkMode: DS.attr('boolean'),
  sendEmailFavoritesOnline: DS.attr('boolean'),
  sendEmailSiteNews: DS.attr('boolean'),
  privateMessageEmailNotifications: DS.attr('boolean'),

  // Payment profile  (TODO most of these are probably not safe in terms of user security)
  fullName: DS.attr('string'),
  birthdate: DS.attr('date'),
  addressLine1: DS.attr('string'),
  addressLine2: DS.attr('string'),
  addressLine3: DS.attr('string'),
  businessName: DS.attr('string'),
  businessEntityType: DS.attr('string'),
  payoutMethod: DS.attr('string'),
  bitcoinAddress: DS.attr('string'),
  bankAccountNumber: DS.attr('string'),
  bankRoutingNumber: DS.attr('string'),
  subjectToBackupWithholding: DS.attr('boolean')
});
