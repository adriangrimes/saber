import Route from '@ember/routing/route';
import jQuery from 'jquery';
import config from '../../config/environment';
import { inject as service } from '@ember/service';

export default Route.extend({
  notify: service(),

  model(params) {
    // Confirm user with confirmation token in url
    if (params.confirmation_token) {
      jQuery
        .get(
          `${config.apiHost}/users/confirmation?confirmation_token=` +
            params['confirmation_token']
        )
        .done(() => {
          this.notify.success(
            'Your account has been confirmed! You can now log in.'
          );
        })
        .fail(err => {
          console.log('get failed with:', err);
          if (err.status == '422') {
            this.notify.error(
              'An error occured while confirming your account, or your account is already confirmed. Please contact us for support. If you copied and pasted the link from the email, make sure the entire link was copied correctly.'
            );
          }
        });
    } else {
      this.transitionTo('index');
    }
  }
});
