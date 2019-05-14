import Controller from '@ember/controller';
import jQuery from 'jquery';

export default Controller.extend({

  queryParams: ['reset_password_token'],

  actions: {
    resetPassword() {
      // POST to back-end with email parameter to start password reset process
      if (this.get('changedPassword') != '' &&
        this.get('changedPasswordConfirm') != '') {
          if (this.get('changedPassword') == this.get('changedPasswordConfirm')) {
            let that = this;
            let data = { password: this.get('changedPassword'),
              password_confirm: this.get('changedPasswordConfirm')};
            let jqxhr = jQuery.get(
              'http://localhost:3000/users/password/edit?reset_password_token=' +
                this.get('resetPasswordToken'), data, function() {
            })
            .done(function() {
              that.currentUser.set('errorMessages',
                [{ title: 'Password reset',
                detail: 'Your password has been changed, you may now log in.' }]);
            })
            .fail(function() {
              console.log('get failed with ');
              for (let errorMessage of jqxhr.responseJSON.error) {
                console.log(errorMessage);
                that.currentUser.set('errorMessages',
                  [{ title: '', detail: errorMessage }]
                );

              }
              // if (jqxhr.status == '422') {
                //that.transitionTo('index');
              //}
            })
            .always(function() {

            });
          } else {
            this.currentUser.set('errorMessages',
              [{ title: 'Passwords must match',
              detail: 'The passwords must match.' }]);
          }
      } else {
        this.currentUser.set('errorMessages',
          [{ title: 'Password fields are required',
          detail: 'The password fields are required.' }]);
      }
    }
  }
});
