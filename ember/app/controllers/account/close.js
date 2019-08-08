import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

export default Controller.extend({
  currentUser: service(),
  accountCloseConfirmationPhrase: 'close my account permanently',

  actions: {
    closeAccount() {
      console.log('hello');
      if (
        this.get('inputCloseAccount') === this.accountCloseConfirmationPhrase &&
        this.inputCurrentPassword
      ) {
        let that = this;
        this.store
          .findRecord('user', this.get('session.data.authenticated.user_id'), {
            reload: true
          })
          .then(function(userRecord) {
            console.log('found record, saving status');

            userRecord.set('currentPassword', that.inputCurrentPassword);
            userRecord.set('pendingDeletion', true);
            console.log(userRecord);
            userRecord
              .save()
              .then(function() {
                console.log('user set to be deleted');
                that.currentUser.set('errorMessages', [
                  {
                    title: 'Account closed',
                    detail:
                      'Your account has been marked for deletion, and will be deleted in 24 hours.'
                  }
                ]);
                later(
                  that,
                  function() {
                    this.session.invalidate();
                  },
                  5000
                );
              })
              .catch(err => {
                userRecord.rollbackAttributes();
                that.currentUser.set('errorMessages', err.errors || err);
              });
          })
          .catch(err => {
            that.currentUser.set('errorMessages', err.errors || err);
          });
      } else {
        console.log('fail');
        this.currentUser.set('errorMessages', [
          {
            title: 'Missing Info',
            detail:
              'Please enter your password, and the phrase below exactly to confirm deleting your account'
          }
        ]);
      }
    }
  }
});
