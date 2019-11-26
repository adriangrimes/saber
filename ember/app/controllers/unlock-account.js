import Controller from '@ember/controller';
import jQuery from 'jquery';
import config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  notify: service(),

  queryParams: ['unlock_token'],

  actions: {
    submitEmail() {
      jQuery
        .get(`${config.apiHost}/resend_unlock?email=` + this.emailToUnlock)
        .done(() => {
          this.notify.success(
            'If your account was locked, a new account unlock email has been sent.'
          );
        })
        .fail(err => {
          console.log('get failed with:', err);
          // this.errorHandler.handleWithNotification(err);
          if (err.status == '500') {
            this.notify.error(
              'An error occured while resending the unlock email. Please contact us for assistance.'
            );
          }
        });
    }
  }
});
