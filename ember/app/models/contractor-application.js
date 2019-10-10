import DS from 'ember-data';
import { or as computedOr } from '@ember/object/computed';

export default DS.Model.extend({
  consentGiven: DS.attr('boolean'),

  pendingBroadcasterApplication: DS.attr('boolean'),
  pendingDeveloperApplication: DS.attr('boolean'),
  pendingAffiliateApplication: DS.attr('boolean'),
  // Computed properties
  hasPendingApplication: computedOr(
    '{pendingBroadcasterApplication,pendingDeveloperApplication,pendingAffiliateApplication}'
  ),

  // Payment profile (These are encrypted on the back-end)
  fullName: DS.attr('string'),
  birthdate: DS.attr('date'),
  addressLine1: DS.attr('string'),
  addressLine2: DS.attr('string'),
  addressLine3: DS.attr('string'),
  businessName: DS.attr('string'),
  businessEntityType: DS.attr('string'),
  businessIdentificationNumber: DS.attr('string'),
  payoutMethod: DS.attr('string'),
  bitcoinAddress: DS.attr('string'),
  // bankAccountNumber: DS.attr('string'),
  // bankRoutingNumber: DS.attr('string'),
  subjectToBackupWithholding: DS.attr('boolean', { allowNull: true })
});
