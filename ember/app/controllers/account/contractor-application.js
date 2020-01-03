import Controller from '@ember/controller';
import { inject as service } from '@ember/service';

export default Controller.extend({
  notify: service(),
  currentUser: service(),
  errorHandler: service(),

  actions: {
    submitApplication(changeset) {
      changeset.set(`pending${this.applicationType}Application`, true);
      this.validateAndSaveChangeset(changeset, this.applicationType, false);
    },

    saveApplicationForLater(changeset) {
      changeset.set(`pending${this.applicationType}Application`, false);
      this.validateAndSaveChangeset(changeset, this.applicationType, true);
    },

    rollbackApplication(changeset) {
      console.log('rolling back application');
      changeset.rollback();
      this.set('revertApplicationChanges', true);
    }
  },

  validateAndSaveChangeset(changeset, applicationType, savedForLater) {
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
              } else if (savedForLater) {
                this.notify.success(
                  'Saved. Your application has been saved for later but is not submitted.'
                );
              } else if (applicationType == 'Developer') {
                this.notify.success('Success! You are now a developer.');
              } else if (applicationType == 'Affiliate') {
                this.notify.success('Success! You are now an affiliate.');
              }
              console.log('calling currentUser.load()');
              this.currentUser.load();
            })
            .catch(err => {
              console.log(err);
              if (err.errors.firstObject && err.errors.firstObject.status) {
                this.errorHandler.handleWithNotification(err);
              } else {
                this.notify.warning(
                  'The server had a problem with the information you entered, please correct any errors before submitting.'
                );
                err.errors.forEach(({ attribute, message }) => {
                  changeset.pushErrors(attribute, message);
                });
                console.log(changeset.get('errors'));
              }
            });
        } else {
          this.notify.warning(
            'There was a problem with the information you entered, please correct any errors before submitting.'
          );
        }
      })
      .catch(err => {
        this.errorHandler.handleWithNotification(err);
        console.log(changeset.get('errors'));
        changeset.restore(snapshot);
      });
  }
});
