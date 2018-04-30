import Controller from '@ember/controller';
import { inject } from '@ember/service';
import $ from 'jquery';

export default Controller.extend({

  store: inject(),
  session: inject(),
  themeChanger: inject(),
  settingsSaved: false,

  actions: {

    submitEmailSettings() {
      // Get current state of setting from page and set to a variable
      var sEFO = this.get('sendEmailFavoritesOnline');
      var sESN = this.get('sendEmailSiteNews');

      this.get('store').findRecord('user', this.get('session.data.authenticated.user_id')).then((user) => {

        // Modify record pulled from db to variable
        user.set('sendEmailFavoritesOnline', sEFO);
        user.set('sendEmailSiteNews', sESN);

        // Save record to db
        user.save().then(() => {
          console.log('submitEmailSettings saved');
          $('[name=settingsubmit]').text('');
          $('[name=settingsubmit]').addClass('fa fa-check');
        }).catch((reason) => {
          console.log('error saving user record: ' + reason);
          this.set('errorMessage', reason.error || reason);
        });
      }).catch((reason) => {
        console.log('error finding user record: ' + reason);
        this.set('errorMessage', reason.error || reason);
      });
    },

    submitDisplaySettings() {
      if (this.get('darkMode')) {
        this.get('themeChanger').set('theme', 'dark');
      } else {
        this.get('themeChanger').set('theme', 'default');
      }

      this.get('store').findRecord('user', this.get('session.data.authenticated.user_id')).then((user) => {

        // Modify record pulled from db to variable
        user.set('darkMode', this.get('darkMode'));

        // Save record to db
        user.save().then(() => {
          console.log('submitDisplaySettings saved');
          $('[name=settingsubmit]').text('');
          $('[name=settingsubmit]').addClass('fa fa-check');
        }).catch((reason) => {
          console.log('error saving user record: ' + reason);
          this.set('errorMessage', reason.error || reason);
        });
      }).catch((reason) => {
        console.log('error finding user record: ' + reason);
        this.set('errorMessage', reason.error || reason);
      });
    }

  }

});
