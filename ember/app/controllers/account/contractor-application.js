import Controller from '@ember/controller';
import { inject } from '@ember/service';
import { reject, resolve } from 'rsvp';

export default Controller.extend({
  notify: inject(),
  currentUser: inject(),

  actions: {
    submitApplication(changeset) {
      console.log(`controller submitting ${this.applicationType} Application`);
      changeset.set(`pending${this.applicationType}Application`, true);
      this.validateAndSaveChangeset(changeset)
        .then(() => {
          this.notify.success(
            'Success! Your application has been submitted and is awaiting verification.'
          );
        })
        .catch(function(e) {});
    },

    saveApplicationForLater(changeset) {
      console.log('controller saving for later');
      changeset.set(`pending${this.applicationType}Application`, false);
      this.validateAndSaveChangeset(changeset)
        .then(() => {
          this.notify.success(
            'Success! Your application has been saved for later.'
          );
        })
        .catch(function(e) {});
    },
    rollbackApplication(changeset) {
      console.log('controller rollback changeset');
      changeset.rollback();
    }
  },

  validateAndSaveChangeset(changeset) {
    console.log('validateAndSaveChangeset()');
    let snapshot = changeset.snapshot();
    return changeset
      .validate()
      .then(() => {
        console.log('validating ===========================================');
        if (changeset.get('isValid')) {
          return changeset
            .save()
            .then(changeset => {
              console.log('calling currentUser.load()');
              this.currentUser.load();
              // return resolve(changeset);
            })
            .catch(error => {
              console.log(error);
              this.notify.warning(
                'The server had a problem with the information you entered, please correct any errors before submitting.'
              );
              error.errors.forEach(({ attribute, message }) => {
                changeset.pushErrors(attribute, message);
              });
              console.log(changeset.get('errors'));
              return reject(changeset);
            });
        } else {
          this.notify.warning(
            'There was a problem with the data you entered, please correct any errors before submitting.'
          );
          return reject(changeset);
        }
      })
      .catch(err => {
        console.log(changeset.get('errors'));
        changeset.restore(snapshot);
        return reject(changeset);
      });
  }
});
