import Controller from '@ember/controller';
import { alias } from '@ember/object/computed';
//import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({

  isFavorite: false,

  init: function() {
    this._super(...arguments);
    this.tags = [];
    this.temporaryTags = [];
  },

  actions: {
    addTag(tag) {
      console.log('tag length:');
      console.log(this.tags.length);
      if (this.get('tagCount') < 15) {
        console.log('adding tag: '+ tag);
        this.tags.pushObject(tag);
      }
    },

    removeTagAtIndex(index) {
      this.tags.removeAt(index);
    },

    checkOtherSex() {
      $("#inputSexOther").prop('checked', true).change();
    },

    submitProfileSettings() {
      this.get('store').queryRecord('user-public-datum',
        { user_id: this.get('session.data.authenticated.user_id') }).then((user) => {
        // Modify record pulled from db to variable
        // Get current state of setting from page and set to a variable
        user.setProperties(this.get('model'));

        if (this.get('tempSexSelection') == 'Male' || this.get('tempSexSelection') == 'Female') {
          user.set('profileSex', this.get('tempSexSelection'));
        } else {
          user.set('profileSex', this.get('tempSexText'));
        }

        user.set('userCustomTags', this.tags);

        // Save record to db
        user.save().then(() => {
          console.log('submitProfileSettings saved');
          if (this.get('tempSexSelection') == 'Male' || this.get('tempSexSelection') == 'Female') {
            this.set('tempSexText', '');
          }
          this.currentUser.set('errorMessages', []);
          $('[id=viewProfileCollapse]').addClass('show');
          $('[id=editProfileCollapse]').removeClass('show');
        }).catch((response) => {
          console.log('error saving user record: ' + response);
          this.currentUser.set('errorMessages', response.errors || response);
        });
      }).catch((response) => {
        console.log('error finding user record: ' + response);
        this.currentUser.set('errorMessages', response.errors || response);
      });
    },

    cancelProfileChanges() {
      this.get('model').rollbackAttributes();
    }
  }

});
