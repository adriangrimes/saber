import {
  validatePresence,
  validateLength
  // validateConfirmation,
  // validateFormat
} from 'ember-changeset-validations/validators';

export default {
  fullName: [validatePresence(true), validateLength({ min: 4 })]
};
