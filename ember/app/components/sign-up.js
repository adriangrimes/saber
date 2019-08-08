import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  signUpType: computed('params.[]', function() {
    return this.params[0];
  }),
  contractorSignup: computed('signUpType', function() {
    if (
      this.signUpType === 'broadcaster' ||
      this.signUpType === 'developer' ||
      this.signUpType === 'affiliate'
    ) {
      return true;
    } else {
      return false;
    }
  }),

  actions: {
    // Passes form fields as parameters to current-user.signUp function
    signUp() {
      console.log(this.contractorSignup);
      if (this.get('session.isAuthenticated') === false) {
        this.get('currentUser').signUp(
          this.get('inputusername'),
          this.get('inputemailaddress'),
          this.get('inputpassword'),
          this.get('inputFullName'),
          this.get('signUpType')
        );
      }
    }
  }
}).reopenClass({
  positionalParams: 'params'
});
