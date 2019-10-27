import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  notify: inject(),
  currentUser: inject(),

  actions: {
    submitApplication(changeset) {
      console.log(`controller submitting ${this.applicationType} Application`);
      changeset.set(`pending${this.applicationType}Application`, true);
      console.log(`controller submitting ${this.applicationType} Application`);
      this.validateAndSaveChangeset(changeset);
    },

    saveApplicationForLater(changeset) {
      console.log(
        `controller saving ${this.applicationType} Application for later`
      );
      changeset.set(`pending${this.applicationType}Application`, false);
      this.validateAndSaveChangeset(changeset);
    },

    rollbackApplication(changeset) {
      console.log('controller rollback changeset');
      changeset.rollback();
    }
  },

  validateAndSaveChangeset(changeset) {
    console.log('validateChangeset()');
    // Rollback any errors given from the back-end
    changeset.rollbackProperty('base');
    let snapshot = changeset.snapshot();
    changeset
      .validate()
      .then(() => {
        console.log('validated ===========================================');
        if (changeset.get('isValid')) {
          changeset
            .save()
            .then(changeset => {
              console.log('saved ===========================================');
              if (changeset.pendingBroadcasterApplication) {
                this.notify.success(
                  'Success! Your application has been submitted and is awaiting verification.'
                );
              } else {
                this.notify.success(
                  'Saved. Your application has been saved for later but is not submitted.'
                );
              }
              console.log('calling currentUser.load()');
              this.currentUser.load();
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
            });
        } else {
          this.notify.warning(
            'There was a problem with the information you entered, please correct any errors before submitting.'
          );
        }
      })
      .catch(() => {
        console.log(changeset.get('errors'));
        changeset.restore(snapshot);
      });
  }
});
