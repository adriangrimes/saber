import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { set, get } from '@ember/object';

// edit-photos
export default Component.extend({
  userFileManager: service(),

  photoSubmitBtn: 'btn btn-primary',
  photoSubmitText: 'Save',

  init() {
    // Selects the photo that matches the profile photo path
    this._super(...arguments);
    let that = this;
    this.get('model.profileImages').forEach(function(image) {
      if (image.profile_image == true) {
        that.set('selectedImage', image);
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
          that.get('model.profileImages').forEach(function(image) {
            if (image.profile_image == true) {
              that.set('selectedImage', image);
            }
          });
        })
        .catch(() => {
          console.log('model failed to save');
        });
    },

    setImageAsProfileImage(image) {
      this.get('model.profileImages').forEach(function(profileimage) {
        set(profileimage, 'profile_image', false);
      });
      // Set profile_image to true and persist to back-end
      set(image, 'profile_image', true);
      this.model
        .save()
        .then(() => {
          console.log('model saved');
        })
        .catch(() => {
          console.log('model failed to save');
        });
    },

    setMembersOnlyPropertyOnImage(image, state) {
      // console.log(state);
      // // Set members_only to true and persist to back-end
      // set(image, 'members_only', image.members_only);
      this.model
        .save()
        .then(() => {
          console.log('model saved');
        })
        .catch(() => {
          console.log('model failed to save');
        });
    }
  }
});
