import Component from '@ember/component';
import { inject } from '@ember/service';

// log-in
export default Component.extend({

  signupform: false,

  didInsertElement() {
    // TODO Temporarily default login info
    this.set('inputusername', 'UserTester1');
    this.set('inputpassword', '12345671');
    // $('#loginModal').on('shown.bs.modal', function() {
    //   $('#username').trigger('focus');
    // });
  },

  actions: {
    // Passes form fields as paramters to current-user.logIn function
    authenticate() {
      this.currentUser.logIn(
        this.get('inputusername'),
        this.get('inputpassword'))
    },

    toggleSignUp() {
      this.toggleProperty('signupform');
      // Clear errors and fields
      this.set('inputusername','');
      this.set('inputpassword','');
      this.set('currentUser.errorMessages', []);
      // $('#loginModal').on('shown.bs.modal', function() {
      //   $('#username').trigger('focus');
      // });
    }
  }

});
