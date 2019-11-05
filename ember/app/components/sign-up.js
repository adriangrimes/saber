import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Component.extend({
  notify: service(),

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
        this.currentUser.signUp(
          this.inputusername,
          this.inputemailaddress,
          this.inputpassword,
          this.inputFullName,
          this.signUpType
        );
    }
  }
}).reopenClass({
  positionalParams: 'params'
});
