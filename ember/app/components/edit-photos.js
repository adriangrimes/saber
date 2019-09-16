import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { set } from '@ember/object';

// edit-photos
export default Component.extend({
  userFileManager: service(),
  session: service(),

  photoSubmitBtn: 'btn btn-primary',
  photoSubmitText: 'Save',

  didInsertElement() {
    this._super(...arguments);

    // Selects the photo that matches the profile photo path
    let that = this;
    this.model.forEach(function(file) {
      if (file.profileImage == true) {
        that.set('selectedImage', file);
      }
    });
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

    setImageAsProfileImage(profileImage) {
      this.get('model').forEach(function(image) {
        if (image.profileImage == true) {
          set(image, 'profileImage', false);
        }
      });
      // Set profile_image to true and persist to back-end
      set(profileImage, 'profileImage', true);
      this.model
        .save()
        .then(() => {
          console.log('model saved');
        })
        .catch(() => {
          console.log('model failed to save');
        });
    },

    setMembersOnlyPropertyOnFile(file) {
      // Persist file changes to back-end
      file
        .save()
        .then(() => {
          console.log('model saved');
        })
        .catch(() => {
          console.log('model failed to save');
        });
    },

    onUploaded(blob) {
      console.log('file uploaded hello from edit photos');
      //console.log(blob);

      let that = this;
      this.store
        .createRecord('user-public-file', {
          signedId: blob.signedId,
          userId: this.session.data.authenticated.user_id
        })
        .save()
        .then(() => {
          console.log('saved record');
          //that.store.peekAll('user-public-file');
        })
        .catch(err => {
          console.log('error saving record with ' + err);
        });
    },

    deleteFile(file) {
      console.log('deleting file');
      console.log('deleting ' + file.toString());
      file
        .deleteRecord()
        .then(() => {
          console.log('file deleted');
        })
        .catch(err => {
          console.log('file failed to delete with error: ' + err);
        });
    }
  }
});
