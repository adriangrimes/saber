import Component from '@ember/component';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

// edit-verification-photos
export default Component.extend({
  session: service(),

  photoSubmitBtn: 'btn btn-primary',
  photoSubmitText: 'Save',

  // didInsertElement() {
  //   this._super(...arguments);
  // },

  actions: {
    onUploaded(successfulUploads) {
      let component = this;
      let recordsToSave = [];
      // Push all newly uploaded json data into a recordsToSave array
      for (var i = 0; i < successfulUploads.length; i++) {
        console.log('pusing record:', i);
        recordsToSave.push(
          this.store
            .createRecord('user-verification-upload', {
              userId: component.session.data.authenticated.user_id,
              uploadDataJson: JSON.stringify(successfulUploads[i].response.body)
            })
            .save()
        );
      }
      // When all records come back completed, reload the upload records from the api
      RSVP.all(recordsToSave)
        .then(records => {
          console.log('all verification uploads saved - records:', records);
          component.store
            .query('user-verification-upload', {
              id: component.session.data.authenticated.user_id
            })
            .then(uploads => {
              console.log('set model to current uploads:', uploads);
              component.set('model', uploads);
            });
        })
        .catch(err => {
          console.error('error getting uploads with ' + err);
          //component.model.rollbackAttributes();
        });
    },

    deleteFile(file) {
      console.log('deleting file', file.toString());
      file
        .destroyRecord()
        .then(() => {
          console.log('file deleted');
          if (file.profileImage) {
            this.onProfileImageChanged();
          }
        })
        .catch(err => {
          console.log('file failed to delete with error: ' + err);
          file.rollbackAttributes();
        });
    }
  }
});
