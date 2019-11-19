import Controller from '@ember/controller';
import jQuery from 'jquery';

export default Controller.extend({


  init: function() {
    this._super(...arguments);
    this.tags = [];
  },

  actions: {



    submitProfileSettings() {
      this.store.queryRecord('user-public-datum',
        { username: this.get('session.data.authenticated.username') }).then((user) => {
        // Get user public data record from the store and apply the currently
        // changed properties to the record.
        user.setProperties(this.model);
        // If gender selection is male or female, save that to profileGender,
        // otherwise set the custom gender textfield as the gender.
        if (this.tempGenderSelection == 'Male' || this.tempGenderSelection == 'Female') {
          user.set('profileGender', this.tempGenderSelection);
        } else {
          user.set('profileGender', this.tempGenderText);
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
          if (this.tempGenderSelection == 'Male' || this.tempGenderSelection == 'Female') {
            this.set('tempGenderText', '');
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
      this.set('tempGenderText', '');
      if (this.model.profileGender == 'Male') {
        this.set('tempGenderSelection', 'Male');
      } else if (this.model.profileGender == 'Female') {
        this.set('tempGenderSelection', 'Female');
      } else {
        this.set('tempGenderSelection', 'Other');
        this.set('tempGenderText', this.model.profileGender);
        this.set('checkOtherGender', true);
      }
      // Rollback tag selection
      this.set('tags', this.model.get('userCustomTags').split(","));
    }
  }

});
