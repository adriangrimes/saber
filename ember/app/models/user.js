import DS from 'ember-data';
import { not as computedNot, or as computedOr } from '@ember/object/computed';

export default DS.Model.extend({
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
  broadcasterSignup: DS.attr('boolean'),
  developerSignup: DS.attr('boolean'),
  affiliateSignup: DS.attr('boolean'),
  //accountStatus: DS.attr('string'),
  //adminStatus: DS.attr('boolean'),
  pendingDeletionSince: DS.attr('date'),
  securityQuestions: DS.attr('string'), // Encrypted at the back-end level
  streamKey: DS.attr('string'),
  creditsRemaining: DS.attr('number'),

  // Site settings
  darkMode: DS.attr('boolean'),
  sendEmailFollowedOnline: DS.attr('boolean'),
  sendEmailSiteNews: DS.attr('boolean'),
  privateMessageEmailNotifications: DS.attr('boolean'),
  privateUserNotes: DS.attr('string'), // Encrypted at the back-end level

  // Computed properties
  isContracted: computedOr('{broadcaster,developer,affiliate}'),
  isPlayer: computedNot('isContracted')
});
