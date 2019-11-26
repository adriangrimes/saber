import Route from '@ember/routing/route';
import jQuery from 'jquery';
import config from '../config/environment';
import { inject as service } from '@ember/service';
import UnauthenticatedRouteMixin from 'ember-simple-auth/mixins/unauthenticated-route-mixin';

export default Route.extend(UnauthenticatedRouteMixin, {
  notify: service(),
  errorHandler: service(),

  model(params) {
    // Confirm user with confirmation token in url
    if (params.unlock_token) {
      jQuery
        .get(
          `${config.apiHost}/users/unlock?unlock_token=` +
            params['unlock_token']
        )
        .done(() => {
          this.notify.success(
            'Your account has been unlocked. You can now log in.'
          );
        })
        .fail(err => {
          console.log('get failed with:', err);
          // this.errorHandler.handleWithNotification(err);
          if (err.status == '422') {
            this.notify.error(
              'An error occured while attempting to unlock your account. If you copied and pasted the link from the unlock email, make sure the whole link was copied correctly.<br>Otherwise, please contact us for support.'
            );
          }
        });
    }
  }
});
