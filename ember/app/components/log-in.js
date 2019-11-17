import Component from '@ember/component';
import jQuery from 'jquery';

// log-in
export default Component.extend({
  signupform: false,

  didInsertElement() {
    this._super(...arguments);

    // TODO Temporarily default login info
    this.set('inputusername', 'UserTester1');
    this.set('inputpassword', '12345671');

    // Focus username field when Bootstrap modal is shown
    // jQuery('#loginModal').on('shown.bs.modal', function() {
    //   jQuery('#username').trigger('focus');
    // });
  },

  actions: {
    // Passes form fields as paramters to current-user.logIn function
    authenticate() {
      this.currentUser.logIn(this.inputusername, this.inputpassword);
    },

    closeModal() {
      jQuery('#loginModal').modal('hide');
    },

    toggleSignUp() {
      this.toggleProperty('signupform');
      // Clear fields
      this.set('inputpassword', '');
    }
  }
});
