import Component from '@ember/component';

// log-in
export default Component.extend({
  signupform: false,

  didInsertElement() {
    this._super(...arguments);

    this.set('inputusername', 'UserTester1');
    this.set('inputpassword', '12345678');
  },

  actions: {
    // Passes form fields as paramters to current-user.logIn function
    authenticate() {
      this.currentUser.logIn(this.inputusername, this.inputpassword);
    },

    toggleSignUp() {
      this.toggleProperty('signupform');
      // Clear fields
      this.set('inputpassword', '');
    }
  }
});
