import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({

  store: inject.service(),
  session: inject.service(),

  actions: {

    submitEmailSettings() {
      console.log('Function: submitEmailSettings()');

      console.log(this.get('sendEmailFavoritesOnlineCB'));


      this.get('store').findRecord('user', this.get('session.data.authenticated.user_id')).then(function(user) {
        console.log('in find record');
        user.set('sendEmailFavoritesOnline', true);
        console.log('after set sEFO');
        user.save().then(function() {
          console.log('submitEmailSettings saved?');
        }).catch(function() {
          console.log('save failed');
        });
      }).catch((reason) => {
        console.log('error finding user record: ' + reason);
        this.set('errorMessage', reason.error || reason);

        //.then(function() {
          //console.log('submitEmailSettings saved?');
        //});
      });

    }
  }
});
