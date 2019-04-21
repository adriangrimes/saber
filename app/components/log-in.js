import Component from '@ember/component';
import { inject } from '@ember/service';

// log-in
export default Component.extend({

  session: inject('session'),

  signupform: false,

  didInsertElement() {
    // Temporarily default login info
    this.set('inputusername', 'UserTester1');
    this.set('inputpassword', '12345671');
  },

  actions: {

    // Passes form fields as paramters to current-user.logIn function
    authenticate() {
      let identification = this.get('inputusername');
      let password = this.get('inputpassword');
      this.get('currentUser').logIn(identification, password);
    },

    // Passes form fields as parameters to current-user.signUp function
    signup(){
      if (this.get('session.isAuthenticated') === false) {
        const username = this.get('inputusername');
        const email = this.get('inputemailaddress');
        const pw = this.get('inputpassword');
        const pwconfirm = this.get('inputpasswordconfirm');

        console.log( this.get('inputusername')+this.get('inputemailaddress')+
          this.get('inputpassword')+this.get('inputpasswordconfirm'));
        this.get('currentUser').signUp(username,email,pw,pwconfirm);
      }
    },

    toggleSignUp() {
      this.toggleProperty('signupform');
      // Clear errors and fields
      this.set('inputusername','');
      this.set('inputpassword','');
      this.set('currentUser.errorMessage','');
    }
  }

});
