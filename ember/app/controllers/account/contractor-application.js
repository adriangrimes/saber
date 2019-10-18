import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  notify: inject(),
  currentUser: inject(),

  actions: {
    submitApplication(changeset) {
      console.log(`controller submitting ${this.applicationType} Application`);
      changeset.set(`pending${this.applicationType}Application`, true);
      console.log(this.model.userVerificationUploads.length);
      changeset.set(
        'verificationCount',
        this.model.userVerificationUploads.length
      );
      this.validateAndSaveChangeset(changeset);
    },
    saveApplicationForLater(changeset) {
      console.log('controller saving for later');
      changeset.set(`pending${this.applicationType}Application`, false);
      this.validateAndSaveChangeset(changeset);
    },
    rollbackApplication(changeset) {
      console.log('controller rollback changeset');
      changeset.rollback();
    }
  },

  validateAndSaveChangeset(changeset) {
    let snapshot = changeset.snapshot();
    changeset
      .validate()
      .then(() => {
        console.log(changeset.get('errors'));
        if (changeset.get('isValid')) {
          changeset
            .save()
            .then(() => {
              console.log('calling currentUser.load()');
              this.notify.success(
                'Success! Your application has been submitted and is awaiting verification.'
              );
              this.currentUser.load();
            })
            .catch(error => {
              this.notify.warning(
                'There was a problem with the information you entered, please correct any errors before submitting.'
              );
              error.errors.forEach(({ attribute, message }) => {
                changeset.pushErrors(attribute, message);
              });
              console.log(changeset.get('errors'));
            });
        } else {
          this.notify.warning(
            'There was a problem with the data you entered, please correct any errors before submitting.'
          );
        }
      })
      .catch(() => {
        changeset.restore(snapshot);
      });
  }
});
