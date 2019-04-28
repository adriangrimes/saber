import Controller from '@ember/controller';
//import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({

  isFavorite: false,

  init: function() {
    this._super(...arguments);

    this.tags = [];

  },

  actions: {
    addTag(tag) {
      if (this.tags.length < 15) {
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
      // Get current state of setting from page and set to a variable
      var updateaboutMe = this.get('inputaboutme');
      var updateAge = this.get('inputAge');
      var updateSex = this.get('inputSex');
      if (updateSex == "Other"){
        updateSex = this.get('otherSexText');
      }
      var updateLocation = this.get('inputlocation');
      var updateLanguages = this.get('inputLanguages');
      var updateTags = this.get('tags');
      this.get('store').queryRecord('user-public-datum',
        { user_id: this.get('session.data.authenticated.user_id') }).then((user) => {
        // Modify record pulled from db to variable
        user.set('profileAboutMe', updateaboutMe);
        user.set('profileSex', updateSex);
        user.set('profileAge', updateAge);
        user.set('profileLocation', updateLocation);
        user.set('profileLanguages', updateLanguages);
        user.set('userCustomTags', updateTags);
        // Save record to db
        user.save().then(() => {
          console.log('submitProfileSettings saved');
          $('[id=profileSettingSubmit]').text('');
          $('[id=profileSettingSubmit]').addClass('fa fa-check');
        }).catch((reason) => {
          console.log('error saving user record: ' + reason);
          this.set('errorMessage', reason.errors || reason);
        });
      }).catch((reason) => {
        console.log('error finding user record: ' + reason);
        this.set('errorMessage', reason.errors || reason);
      });
      setTimeout(function() {
        window.location.reload(true);
      }, 600);

    },

  },



});
