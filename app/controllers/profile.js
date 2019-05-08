import Controller from '@ember/controller';
import jQuery from 'jquery';

export default Controller.extend({

  isFavorite: false,

  init: function() {
    this._super(...arguments);
    this.tags = [];
  },

  actions: {
    addTag(tag) {
      console.log('tags length: ' + this.tags.length);
      if (this.tags.length < 15) {
        console.log('adding tag: '+ tag);
        this.tags.pushObject(tag);
      }
    },

    removeTagAtIndex(index) {
      this.tags.removeAt(index);
    },

    checkOtherSex() {
      jQuery("#inputSexOther").prop('checked', true).change();
    },

    submitProfileSettings() {
      this.store.queryRecord('user-public-datum',
        { user_id: this.get('session.data.authenticated.user_id') }).then((user) => {
        // Get user public data record from the store and apply the currently
        // changed properties to the record.
        user.setProperties(this.model);
        // If gender selection is male or female, save that to profileSex,
        // otherwise set the custom gender textfield as the gender.
        if (this.tempSexSelection == 'Male' || this.tempSexSelection == 'Female') {
          user.set('profileSex', this.tempSexSelection);
        } else {
          user.set('profileSex', this.tempSexText);
        }
        // Set tags to user record.
        user.set('userCustomTags', this.tags);
        // Submit record to store
        user.save().then(() => {
          // Save success
          console.log('submitProfileSettings saved');
          // Clear errors
          this.currentUser.set('errorMessages', []);
          // Clear custom gender textfield if Male or Female was selected
          if (this.tempSexSelection == 'Male' || this.tempSexSelection == 'Female') {
            this.set('tempSexText', '');
          }
          // Close profile edit panel
          jQuery('[id=viewProfileCollapse]').addClass('show');
          jQuery('[id=editProfileCollapse]').removeClass('show');
        }).catch((response) => {
          // Save failed
          console.log('error saving user record: ' + response);
          this.currentUser.set('errorMessages', response.errors || response);
        });
      }).catch((response) => {
        // Record not found or other store error
        console.log('error finding user record: ' + response);
        this.currentUser.set('errorMessages', response.errors || response);
      });
    },

    cancelProfileChanges() {
      // Rollback model to original values pulled from the store
      this.model.rollbackAttributes();
      // Rollback gender selection
      this.set('tempSexText', '');
      if (this.model.profileSex == 'Male') {
        this.set('tempSexSelection', 'Male');
      } else if (this.model.profileSex == 'Female') {
        this.set('tempSexSelection', 'Female');
      } else {
        this.set('tempSexSelection', 'Other');
        this.set('tempSexText', this.model.profileSex);
        this.set('checkOtherSex', true);
      }
      // Rollback tag selection
      this.set('tags', this.model.get('userCustomTags').split(","));
    }
  }

});
