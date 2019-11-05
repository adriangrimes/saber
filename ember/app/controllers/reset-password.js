import Controller from '@ember/controller';
import jQuery from 'jquery';
import config from '../config/environment';
import { inject as service } from '@ember/service';

export default Controller.extend({
  notify: service(),
  errorHandler: service(),

  // Required to utilize the reset_password_token query parameter in the URL
  queryParams: ['reset_password_token'],

  actions: {
    resetPassword() {
      // Submit GET to back-end with email parameter to start password reset process
      if (
        this.get('changedPassword') != '' &&
        this.get('changedPasswordConfirm') != ''
      ) {
        if (this.get('changedPassword') == this.get('changedPasswordConfirm')) {
          let data = {
            password: this.get('changedPassword'),
            password_confirm: this.get('changedPasswordConfirm')
          };
          jQuery
            .get(
              `${
                config.apiHost
              }/users/password/edit?reset_password_token=${this.get(
                'resetPasswordToken'
              )}`,
              data
            )
            .done(() => {
              this.notify.success(
                'Your password has been changed, you may now log in.'
              );
            })
            .fail(err => {
              console.log('get failed with:', err);
              this.errorHandler.handleWithNotification(err.responseJSON);
            });
        } else {
          this.notify.error('The passwords must match.');
        }
      } else {
        this.notify.error('The password fields are required.');
      }
    }
  }
});
