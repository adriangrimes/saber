import Controller from '@ember/controller';
import { inject } from '@ember/service';
import ContractorApplicationValidations from '../../validations/contractor-application';

export default Controller.extend({
  notify: inject(),

  ContractorApplicationValidations,

  broadcasterVerifySubmitBtn: 'btn btn-primary',
  broadcasterVerifySubmitText: 'Submit Verification',
  broadcasterSaveForLaterBtn: 'btn btn-outline-dark',
  broadcasterSaveForLaterText: 'Save for Later',

  validateAndSaveChangeset(changeset) {
    let snapshot = changeset.snapshot();
    changeset
      .validate()
      .then(() => {
        console.log(changeset.get('data'));
        console.log(changeset.get('errors'));
        if (changeset.get('isValid')) {
          changeset
            .save()
            .then(() => {
              /* ... */
            })
            .catch(error => {
              console.log(error);
              error.errors.forEach(({ attribute, message }) => {
                changeset.pushErrors(attribute, message);
              });
              console.log(changeset.get('errors'));
            });
        }
      })
      .catch(() => {
        changeset.restore(snapshot);
      });
  },

  actions: {
    submitApplication(changeset) {
      console.log('contractorApplication controller submitting application');

      // TODO fix this to work for all contractor types
      changeset.set(`pending${this.applicationType}Application`, true);

      this.validateAndSaveChangeset(changeset);
    },
    saveApplicationForLater(changeset) {
      console.log('contractorApplication controller saving for later');
      this.validateAndSaveChangeset(changeset);
    },
    rollbackApplication(changeset) {
      console.log('contractorApplication controller rollback changeset');
    },

    checkLength(text, select /*, event */) {
      if (select.searchText.length >= 3 && text.length < 3) {
        return '';
      } else {
        return text.length >= 3;
      }
    },

    setCountry(country) {
      this.changeset.set('country', country);
    },

    checkThis(toBeChecked) {
      jQuery('#' + toBeChecked)
        .prop('checked', true)
        .change();
      if (toBeChecked == 'inputPayoutBitcoin') {
        this.set('payoutIsBitcoin', true);
      } else if (toBeChecked == 'inputPayoutCheck') {
        this.set('payoutIsBitcoin', false);
      }
    }
  }
});
