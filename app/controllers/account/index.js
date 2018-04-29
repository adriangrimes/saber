import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({

  store: inject(),
  session: inject(),
  settingsSaved: false,

  actions: {

    submitEmailSettings() {

      // Get current state of setting from page and set to a variable
      var sEFO = this.get('sendEmailFavoritesOnline');
      var sESN = this.get('sendEmailSiteNews');

      this.get('store').findRecord('user', this.get('session.data.authenticated.user_id')).then(function(user) {

        // Modify record pulled from db to variable
        user.set('sendEmailFavoritesOnline', sEFO);
        user.set('sendEmailSiteNews', sESN);

        // Save record to db
        user.save().then(function() {
          console.log('submitEmailSettings saved');

        }).catch(function() {
          console.log('save failed');
        });
      }).catch((reason) => {
        console.log('error finding user record: ' + reason);
        this.set('errorMessage', reason.error || reason);
      });
    }

  }

});
