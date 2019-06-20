import DS from 'ember-data';
import { not as computedNot, or as computedOr } from '@ember/object/computed';

export default DS.Model.extend({
  changeTracker: { auto: true, only: ['uploadedIdentification'] }, // settings for user models

  // Has one user account datum record
  userPublicDatum: DS.belongsTo('user-public-datum'),
  creditPurchases: DS.hasMany('credit-purchase'),
  creditTransfers: DS.hasMany('credit-transfer'),

  // Account data
  username: DS.attr('string'),
  email: DS.attr('string'),
  password: DS.attr('string'),
  currentPassword: DS.attr('string'),
  broadcaster: DS.attr('boolean'),
  developer: DS.attr('boolean'),
  affiliate: DS.attr('boolean'),
  //accountStatus: DS.attr('string'),
  //adminStatus: DS.attr('boolean'),
  pendingDeletion: DS.attr('boolean'),
  securityQuestions: DS.attr('string'), //TODO Not encrypted
  streamKey: DS.attr('string'),
  creditsRemaining: DS.attr('number'),

  // Site settings
  darkMode: DS.attr('boolean'),
  sendEmailFollowedOnline: DS.attr('boolean'),
  sendEmailSiteNews: DS.attr('boolean'),
  privateMessageEmailNotifications: DS.attr('boolean'),
  privateUserNotes: DS.attr('string'),

  // Payment profile  (TODO most of these are probably not safe in terms of
  // user security)
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
  subjectToBackupWithholding: DS.attr('boolean'),

  uploadedIdentification: DS.attr('activestorage'),

  // Computed properties
  isContracted: computedOr('{broadcaster,developer,affiliate}'),
  isPlayer: computedNot('isContracted')
});
