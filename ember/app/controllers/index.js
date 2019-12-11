import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
//import jQuery from 'jquery';

export default Controller.extend({
  errorHandler: service(),
  notify: service(),

  prereleaseEmail: '',

  actions: {
    submitPrereleaseEmail() {
      console.log('submitting email', this.prereleaseEmail);
      if (
        this.store
          .peekAll('prerelease-email')
          .findBy('email', this.prereleaseEmail) != undefined
      ) {
        this.notify.success("Submitted successfully. We'll be in touch soon!");
      } else {
        this.store
          .createRecord('prerelease-email', {
            email: this.prereleaseEmail
          })
          .save()
          .then(() => {
            this.notify.success(
              "Submitted successfully. We'll be in touch soon!"
            );
          })
          .catch(err => {
            this.errorHandler.handleWithNotification(err);
          });
      }
    }
  }
});
