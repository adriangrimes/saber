import Controller from '@ember/controller';
import jQuery from 'jquery';
import config from '../config/environment';

export default Controller.extend({
  emailToResetPassword: '',

  actions: {
    submitEmail() {
      // POST to back-end with email parameter to start password reset process
      if (this.get('emailToResetPassword') != '') {
        let that = this;
        let data = { email: this.get('emailToResetPassword') };
        let jqxhr = jQuery
          .post(`${config.apiHost}/users/password`, data, function() {})
          .done(function() {
            that.currentUser.set('errorMessages', [
              {
                title: 'Password reset',
                detail:
                  'Your password has been reset, please check your email to complete the process.'
              }
            ]);
          })
          .fail(function() {
            console.log('get failed with ');
            for (let errorMessage of jqxhr.responseJSON.error) {
              console.log(errorMessage);
              that.currentUser.set('errorMessages', [
                { title: '', detail: errorMessage }
              ]);
            }
          })
          .always(function() {});
      } else {
        this.currentUser.set('errorMessages', [
          { title: 'Email is required', detail: 'The email field is required.' }
        ]);
      }
    }
  }
});
