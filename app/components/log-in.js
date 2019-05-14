import Component from '@ember/component';
import jQuery from 'jquery';

// log-in
export default Component.extend({

  signupform: false,

  didInsertElement() {
    // TODO Temporarily default login info
    this.set('inputusername', 'UserTester1');
    this.set('inputpassword', '12345671');

    // Focus username field when BootStrap modal is shown
    jQuery('#loginModal').on('shown.bs.modal', function() {
      jQuery('#username').trigger('focus');
    });
  },

  actions: {
    // Passes form fields as paramters to current-user.logIn function
    authenticate() {
      this.currentUser.logIn(this.inputusername, this.inputpassword)
    },

    toggleSignUp() {
      this.toggleProperty('signupform');
      // Clear errors and fields
      this.set('inputpassword','');
      this.set('currentUser.errorMessages', []);
    }
  }

});
