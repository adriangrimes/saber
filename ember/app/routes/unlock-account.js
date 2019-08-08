import Route from '@ember/routing/route';
import jQuery from 'jquery';
import config from '../config/environment';

export default Route.extend({
  model(params) {
    // Confirm user with confirmation token in url
    if (params.unlock_token) {
      let that = this;
      let jqxhr = jQuery
        .get(
          `${config.apiHost}/users/unlock?unlock_token=` +
            params['unlock_token'],
          function() {}
        )
        .done(function() {
          that.currentUser.set('errorMessages', [
            {
              title: 'Account unlocked',
              detail: 'Your account has been unlocked. You can now log in.'
            }
          ]);
        })
        .fail(function() {
          console.log('get failed with ' + jqxhr.status);
          if (jqxhr.status == '422') {
            that.currentUser.set('errorMessages', [
              {
                title: 'Account unlock failed',
                detail:
                  'An error occured while unlocking your account, or your account is already unlocked. Please contact us for support. If you copied and pasted the link from the email, make sure the whole link was copied correctly.'
              }
            ]);
            //that.transitionTo('index');
          }
        })
        .always(function() {});
    } else {
      this.transitionTo('index');
    }
  }
});
