import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  isOver18: false,

  signUpType: computed('params.[]', function() {
    return this.params[0];
  }),
  contractorSignup: computed('signUpType', function() {
    if (this.get('signUpType') === 'broadcaster' ||
      this.get('signUpType') === 'developer' ||
      this.get('signUpType') === 'affiliate') {
        return true;
    } else {
      return false;
    }
  }),

  actions: {
    // Passes form fields as parameters to current-user.signUp function
    signUp() {
      console.log(this.get('contractorSignup'));
      if (this.get('session.isAuthenticated') === false) {
        this.get('currentUser').signUp(
          this.get('inputusername'),
          this.get('inputemailaddress'),
          this.get('inputpassword'),
          this.get('inputFullName'),
          this.get('signUpType'))
      }
    }
  }

}).reopenClass({
  positionalParams: 'params'
});
