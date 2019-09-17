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

    console.log(this.get('model'));
    console.log(this.photos);
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

    setImageAsProfileImage(profileImage) {
      // this.get('model').forEach(function(image) {
      //   if (image.profileImage == true) {
      //     set(image, 'profileImage', false);
      //   }
      // });
      // Set profile_image to true and persist to back-end
      set(profileImage, 'profileImage', true);
      profileImage
        .save()
        .then(() => {
          this.store
            .query('user-public-file', {
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
          profileImage.rollbackAttributes();
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

    onUploaded(blob) {
      console.log('file uploaded hello from edit photos');
      //console.log(blob);

      this.store
        .createRecord('user-public-file', {
          signedId: blob.signedId,
          userId: this.session.data.authenticated.user_id
        })
        .save()
        .then(record => {
          console.log(this.session.data.authenticated.username);
          this.store
            .query('user-public-file', {
              username: this.session.data.authenticated.username
            })
            .then(files => {
              this.set('model', files);
              console.log('got public files');
            });
          console.log('saved record: ' + record);
        })
        .catch(err => {
          console.log('error saving record with ' + err);
          this.model.rollbackAttributes();
        });
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
