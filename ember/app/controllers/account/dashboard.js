import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import jQuery from 'jquery';

export default Controller.extend({
  store: service(),
  session: service(),
  errorHandler: service(),

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
        this.set('streamKeyHidden', false);
        jQuery('[id=streamKeyDisplayID]').val(this.model.user.streamKey);
        jQuery('[id=showStreamKeyBtn]').text('Hide Stream Key');
      } else {
        this.set('streamKeyHidden', true);
        jQuery('[id=streamKeyDisplayID]').val('********************');
        jQuery('[id=showStreamKeyBtn]').text('Show Stream Key');
      }
    },

    copyStreamKeyToClipboard() {
      if (this.streamKeyHidden == false) {
        var copyText = document.getElementById('streamKeyDisplayID');
        copyText.select();
        document.execCommand('Copy');
        this.set('keyCopySuccess', 'd-block');
        setTimeout(() => {
          this.set('keyCopySuccess', 'd-none');
        }, 3000);
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
      this.model.user.set('streamKey', newStreamKey);
      // Save record to db
      this.model.user
        .save()
        .then(() => {
          console.log('newStreamKey saved');
        })
        .catch(err => {
          console.log('error saving user record:', err);
          this.errorHandler.handleWithNotification(err);
        });
      this.set('newCopySuccess', 'd-block');
      setTimeout(() => {
        this.set('newCopySuccess', 'd-none');
      }, 3000);
    },

    submitStreamSettings() {
      // Save record to db
      this.model.userPublicDatum
        .save()
        .then(() => {
          console.log('submitPayoutSettings saved');
          this.set('streamSettingSubmitText', '');
          this.set('streamSettingSubmitBtn', 'btn btn-primary fa fa-check');
        })
        .catch(err => {
          console.log('error saving userPublicDatum record:', err);
          this.errorHandler.handleWithNotification(err);
        });
    },

    submitUserNotes() {
      // Save record to db
      this.model.user
        .save()
        .then(() => {
          console.log('notesSubmit saved');
          this.set('notesSubmitText', '');
          this.set('notesSubmitBtn', 'btn btn-primary fa fa-check');
        })
        .catch(err => {
          console.log('error saving user record:', err);
          this.errorHandler.handleWithNotification(err);
        });
    }
  }
});
