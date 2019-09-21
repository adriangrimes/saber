import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';
import { once } from '@ember/runloop';
import RSVP from 'rsvp';

// edit-photos
export default Component.extend({
  userFileManager: service(),
  session: service(),

  photoSubmitBtn: 'btn btn-primary',
  photoSubmitText: 'Save',

  didInsertElement() {
    this._super(...arguments);

    console.log('this.model:', this.get('model'));
    console.log('this.photos:', this.photos);
    // console.log(this.model.userPublicFiles);

    // Selects the photo that matches the profile photo path
    // let that = this;
    // this.model.forEach(function(file) {
    //   if (file.profileImage == true) {
    //     that.set('selectedImage', file);
    //   }
    // });
  },

  actions: {
    submitPhotoSettings() {
      let that = this;

      this.set('selectedImage.profile_image', true);
      this.model
        .save()
        .then(() => {
          console.log('submit photo settings saved');
          that.set('photoSubmitText', '');
          that.set('photoSubmitBtn', 'btn btn-primary fa fa-check');
          that.get('model').forEach(function(file) {
            if (file.profileImage == true) {
              that.set('selectedImage', file);
            }
          });
        })
        .catch(() => {
          console.log('model failed to save');
        });
    },

    setImageAsProfileImage(imageRecord) {
      // this.get('model').forEach(function(image) {
      //   if (image.profileImage == true) {
      //     set(image, 'profileImage', false);
      //   }
      // });
      // Set profile_image to true and persist to back-end
      set(imageRecord, 'profileImage', true);
      imageRecord
        .save()
        .then(() => {
          this.store
            .query('user-public-upload', {
              username: this.session.data.authenticated.username
            })
            .then(files => {
              this.set('model', files);
              this.onProfileImageChanged();
              console.log('got public files');
            });
          console.log('model saved');
        })
        .catch(() => {
          console.log('model failed to save');
          imageRecord.rollbackAttributes();
        });
    },

    setMembersOnlyPropertyOnFile(file) {
      // Persist file changes to back-end
      file
        .save()
        .then(() => {
          this.store
            .query('user-public-file', {
              username: this.session.data.authenticated.username
            })
            .then(files => {
              this.set('model', files);
              console.log('got public files');
            });
          console.log('members only saved');
        })
        .catch(() => {
          console.log('model failed to save');
          file.rollbackAttributes();
        });
    },

    onUploaded(successfulUploads) {
      console.log('file uploaded hello from edit photos');
      console.log(successfulUploads);
      console.log(successfulUploads.length);

      let component = this;
      let recordsToSave = [];
      for (var i = 0; i < successfulUploads.length; i++) {
        recordsToSave.push(
          this.store
            .createRecord('user-public-upload', {
              userId: component.session.data.authenticated.user_id,
              uploadDataJson: JSON.stringify(successfulUploads[i].response.body)
            })
            .save()
        );
      }
      RSVP.hash({
        recordsToSave
      })
        .then(records => {
          console.log('all uploads saved');
          console.log('saved records:', records);
          component.store
            .query('user-public-upload', {
              username: component.session.data.authenticated.username
            })
            .then(uploads => {
              component.set('model', uploads);
              console.log('got public uploads');
            });
        })
        .catch(err => {
          console.error('error saving record with ' + err);
          //component.model.rollbackAttributes();
        });
      // successfulUploads.forEach(function(upload) {
      //   console.log(upload);
      // component.store
      // .createRecord('user-public-upload', {
      //   userId: component.session.data.authenticated.user_id,
      //   uploadDataJson: JSON.stringify(upload.response.body)
      // })
      //   .save()
      // .then(record => {
      //   console.log(component.session.data.authenticated.username);
      //   component.store
      //     .query('user-public-upload', {
      //       username: component.session.data.authenticated.username
      //     })
      //     .then(files => {
      //       component.set('model', files);
      //       console.log('got public files');
      //     });
      //   console.log('saved record: ' + record);
      // })
      // .catch(err => {
      //   console.log('error saving record with ' + err);
      //   component.model.rollbackAttributes();
      // });
      // });
    },

    deleteFile(file) {
      console.log('deleting file');
      console.log('deleting ' + file.toString());
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
