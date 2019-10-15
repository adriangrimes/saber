import Component from '@ember/component';
import { inject as service } from '@ember/service';
import RSVP from 'rsvp';

// edit-photos
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
        var publicUpload = this.store
          .createRecord('user-public-upload', {
            userId: component.session.data.authenticated.user_id,
            uploadDataJson: JSON.stringify(successfulUploads[i].response.body)
          })
          .save();
        component.get('model.content').pushObject(publicUpload.get('content'));
        recordsToSave.push(publicUpload);
      }
      // When all records come back completed, reload the upload records from the api
      RSVP.all(recordsToSave)
        .then(records => {
          console.log('all uploads saved - records:', records);
          component.store
            .query('user-public-upload', {
              username: component.session.data.authenticated.username
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

    setImageAsProfileImage(imageRecord) {
      // Set profile_image to true and persist to back-end
      imageRecord.set('profileImage', true);
      imageRecord
        .save()
        .then(() => {
          this.onProfileImageChanged();
          console.log('profileImage saved');
        })
        .catch(() => {
          console.log('profileImage failed to save');
          imageRecord.rollbackAttributes();
        });
    },

    setMembersOnlyPropertyOnFile(file) {
      // Persist file changes to back-end
      file
        .save()
        .then(() => {
          console.log('members only saved');
        })
        .catch(() => {
          console.log('members only failed to save');
          file.rollbackAttributes();
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
