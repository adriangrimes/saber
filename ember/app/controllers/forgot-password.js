import Controller from '@ember/controller';
import jQuery from 'jquery';
import config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  notify: service(),
  errorHandler: service(),

  emailToResetPassword: '',

  actions: {
    submitEmail() {
      // POST to back-end with email parameter to start password reset process
      if (this.get('emailToResetPassword') != '') {
        let data = { email: this.get('emailToResetPassword') };
        jQuery
          .post(`${config.apiHost}/users/password`, data)
          .done(() => {
            this.notify.success(
              'A password reset link has been sent to the email below. Please check your email to complete the reset process.'
            );
          })
          .fail(err => {
            console.log('post failed with', err);
            this.errorHandler.handleWithNotification(err.responseJSON);
          });
      } else {
        this.notify.error('The email field is required.');
      }
    }
  }
});
