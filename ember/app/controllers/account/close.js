import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default Controller.extend({
  currentUser: service(),
  notify: service(),
  errorHandler: service(),

  accountCloseConfirmationPhrase: 'close my account permanently',

  actions: {
    closeAccount() {
      console.log('hello');
      if (
        this.get('inputCloseAccount') === this.accountCloseConfirmationPhrase &&
        this.inputCurrentPassword
      ) {
        this.model.set('currentPassword', this.inputCurrentPassword);
        this.model.set('pendingDeletionSince', new Date());
        this.model
          .save()
          .then(() => {
            console.log('user set to be deleted');
            this.notify.success(
              'Your account has been marked for deletion, and will be deleted in 48 hours.'
            );
            later(
              this,
              function() {
                this.session.invalidate();
              },
              5000
            );
          })
          .catch(err => {
            this.errorHandler.handleWithNotification(err);
            this.model.rollbackAttributes();
          });
      } else {
        console.log('fail');
        this.notify.error(
          'Please enter your password, and the phrase below exactly to confirm deleting your account'
        );
      }
    }
  }
});
