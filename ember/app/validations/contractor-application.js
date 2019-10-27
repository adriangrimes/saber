/* eslint-disable no-unused-vars */

import {
  validatePresence,
  validateLength,
  validateConfirmation
} from 'ember-changeset-validations/validators';

export default {
  fullName: validatePresence({
    presence: true,
    on: [
      'pendingBroadcasterApplication',
      'pendingDeveloperApplication',
      'pendingAffiliateApplication'
    ]
  }),

  businessEntityType: [
    function(key, newValue, oldValue, changes, content) {
      if (
        changes.pendingBroadcasterApplication ||
        changes.pendingDeveloperApplication ||
        changes.pendingAffiliateApplication
      ) {
        return validatePresence({
          presence: true,
          on: ['businessName']
        })(...arguments);
      }
      return true;
    }
  ],

  businessEntityTypeOther: [
    function(key, newValue, oldValue, changes, content) {
      if (
        changes.businessEntityType &&
        changes.businessEntityType.toLowerCase() == 'other'
      ) {
        return validatePresence({
          presence: true,
          on: [
            'pendingBroadcasterApplication',
            'pendingDeveloperApplication',
            'pendingAffiliateApplication'
          ]
        })(...arguments);
      }
      return true;
    }
  ],

  payoutMethod: validatePresence({
    presence: true,
    on: [
      'pendingBroadcasterApplication',
      'pendingDeveloperApplication',
      'pendingAffiliateApplication'
    ]
  }),
  bitcoinAddress: [
    function(key, newValue, oldValue, changes, content) {
      if (
        changes.payoutMethod &&
        changes.payoutMethod.toLowerCase() == 'bitcoin'
      ) {
        return validatePresence({
          presence: true,
          on: [
            'pendingBroadcasterApplication',
            'pendingDeveloperApplication',
            'pendingAffiliateApplication'
          ]
        })(...arguments);
      }
      return true;
    }
  ],

  streetAddress: validatePresence({
    presence: true,
    on: [
      'pendingBroadcasterApplication',
      'pendingDeveloperApplication',
      'pendingAffiliateApplication'
    ]
  }),
  city: validatePresence({
    presence: true,
    on: [
      'pendingBroadcasterApplication',
      'pendingDeveloperApplication',
      'pendingAffiliateApplication'
    ]
  }),
  region: validatePresence({
    presence: true,
    on: [
      'pendingBroadcasterApplication',
      'pendingDeveloperApplication',
      'pendingAffiliateApplication'
    ],
    message: "State / Province / Region can't be blank"
  }),
  postalCode: validatePresence({
    presence: true,
    on: [
      'pendingBroadcasterApplication',
      'pendingDeveloperApplication',
      'pendingAffiliateApplication'
    ]
  }),
  country: validatePresence({
    presence: true,
    on: [
      'pendingBroadcasterApplication',
      'pendingDeveloperApplication',
      'pendingAffiliateApplication'
    ]
  }),

  businessIdentificationNumber: [
    function(key, newValue, oldValue, changes, content) {
      if (changes.country && changes.country === 'United States') {
        console.log('doin the validate bin thing');
        return validatePresence({
          presence: true,
          on: [
            'pendingBroadcasterApplication',
            'pendingDeveloperApplication',
            'pendingAffiliateApplication'
          ]
        })(...arguments);
      }
      return true;
    },
    function(key, newValue, oldValue, changes, content) {
      if (changes.country && changes.country === 'United States') {
        return validateLength({
          min: 8,
          on: [
            'pendingBroadcasterApplication',
            'pendingDeveloperApplication',
            'pendingAffiliateApplication'
          ]
        })(...arguments);
      }
      return true;
    }
  ],

  subjectToBackupWithholding: [
    function(key, newValue, oldValue, changes, content) {
      if (
        (changes.pendingBroadcasterApplication ||
          changes.pendingDeveloperApplication ||
          changes.pendingAffiliateApplication) &&
        changes.country &&
        changes.country.toLowerCase() === 'united states'
      ) {
        if (newValue === true || newValue === false) {
          return true;
        }
        return 'You must select whether or not you are subject to backup withholding';
      }
      return true;
    }
  ],

  // Broadcasters only
  verificationCount: [
    function(key, newValue, oldValue, changes, content) {
      if (changes.pendingBroadcasterApplication) {
        if (newValue < 1) {
          return 'You must upload both verification images';
        } else if (newValue < 2) {
          return 'You must upload the second verification image';
        }
        return true;
      }
      return true;
    }
  ],

  electronicSignature: [
    function(key, newValue, oldValue, changes, content) {
      if (
        changes.pendingBroadcasterApplication ||
        changes.pendingDeveloperApplication ||
        changes.pendingAffiliateApplication
      ) {
        if (newValue != content.fullName && newValue != changes.fullName) {
          return 'Your electronic signature is required';
        } else {
          return true;
        }
      }
      return true;
    }
  ],

  consentToStoreData: [
    function(key, newValue, oldValue, changes, content) {
      if (newValue === true) {
        return true;
      }
      return 'Your consent to store your data must be given to apply';
    }
  ]
};
