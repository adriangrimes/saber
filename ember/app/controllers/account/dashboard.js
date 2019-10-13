import Controller from '@ember/controller';
import { inject } from '@ember/service';
import jQuery from 'jquery';

export default Controller.extend({
  store: inject(),
  session: inject(),
  streamKeyDisplay: '********************',
  streamKeyHidden: true,
  keyCopySuccess: 'd-none',
  newCopySuccess: 'd-none',
  streamSettingSubmitBtn: 'btn btn-primary',
  streamSettingSubmitText: 'Save',
  notesSubmitBtn: 'btn btn-primary',
  notesSubmitText: 'Save',

  actions: {
    showStreamKey() {
      if (this.streamKeyHidden) {
        jQuery('[id=streamKeyDisplayID]').val(this.model.user.streamKey);
        this.set('streamKeyHidden', false);
        jQuery('[id=showStreamKeyBtn]').text('Hide Stream Key');
      } else {
        this.set('streamKeyHidden', true);
        jQuery('[id=streamKeyDisplayID]').val('********************');

        jQuery('[id=showStreamKeyBtn]').text('Show Stream Key');
      }
    },
    resetStreamKey() {
      // Get current state of setting from page and set to a variable
      var newStreamKey = '';
      var possible =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

      for (var i = 0; i < 64; i++) {
        newStreamKey += possible.charAt(
          Math.floor(Math.random() * possible.length)
        );
      }
      if (this.streamKeyHidden == false) {
        jQuery('[id=streamKeyDisplayID]').val(newStreamKey);
      }

      this.set('streamKey', newStreamKey);
      this.store
        .findRecord('user', this.get('session.data.authenticated.user_id'))
        .then(user => {
          // Modify record pulled from db to variable
          user.set('streamKey', newStreamKey);
          // Save record to db
          user
            .save()
            .then(() => {
              console.log('newStreamKey saved');
            })
            .catch(reason => {
              console.log('error saving user record: ' + reason);
              this.set('errorMessage', reason.errors || reason);
            });
        })
        .catch(reason => {
          console.log('error finding user record: ' + reason);
          this.set('errorMessage', reason.errors || reason);
        });
      this.set('newCopySuccess', 'd-block');

      var thisParent = this;
      setTimeout(function() {
        thisParent.set('newCopySuccess', 'd-none');
      }, 3000);
    },
    copyStreamKeyToClipboard() {
      if (this.streamKeyHidden == false) {
        var copyText = document.getElementById('streamKeyDisplayID');

        copyText.select();

        document.execCommand('Copy');
        this.set('keyCopySuccess', 'd-block');

        var thisParent = this;
        setTimeout(function() {
          thisParent.set('keyCopySuccess', 'd-none');
        }, 3000);
      }
    },

    submitStreamSettings() {
      this.store
        .queryRecord('user-public-datum', {
          username: this.get('session.data.authenticated.username')
        })
        .then(userPublicDatum => {
          // Modify record pulled from db to variable
          userPublicDatum.setProperties(this.model.userPublicDatum);

          // Save record to db
          userPublicDatum
            .save()
            .then(() => {
              console.log('submitPayoutSettings saved');
              this.set('streamSettingSubmitText', '');
              this.set('streamSettingSubmitBtn', 'btn btn-primary fa fa-check');
            })
            .catch(reason => {
              console.log('error saving user record: ' + reason);
              this.set('errorMessage', reason.error || reason);
            });
        })
        .catch(reason => {
          console.log('error finding user record: ' + reason);
          this.set('errorMessage', reason.error || reason);
        });
    },

    submitUserNotes() {
      // Get current state of setting from page and set to a variable
      this.store
        .findRecord('user', this.get('session.data.authenticated.user_id'))
        .then(user => {
          // Modify record pulled from db to variable
          user.setProperties(this.model.user);

          // Save record to db
          user
            .save()
            .then(() => {
              console.log('notesSubmit saved');
              this.set('notesSubmitText', '');
              this.set('notesSubmitBtn', 'btn btn-primary fa fa-check');
            })
            .catch(reason => {
              console.log('error saving user record: ' + reason);
              this.set('errorMessage', reason.error || reason);
            });
        })
        .catch(reason => {
          console.log('error finding user record: ' + reason);
          this.set('errorMessage', reason.error || reason);
        });
    }
  }
});
