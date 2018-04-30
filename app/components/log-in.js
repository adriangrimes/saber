import Component from '@ember/component';
import { inject } from '@ember/service';

// log-in
export default Component.extend({

  loginState: inject('login-state'),
  session: inject('session'),

  signupform: false,

  // Temporarily default login info
  didInsertElement() {
    this.set('inputusername', 'testuser0');
    this.set('inputpassword', '12345670');
  },

  actions: {

    // Passes form fields as paramters to login-state.logIn function
    authenticate() {
      let identification = this.get('inputusername');
      let password = this.get('inputpassword');
      this.get('loginState').logIn(identification, password);
    },

    // Passes form fields as parameters to login-state.signUp function
    signup(){
      if (this.get('session.isAuthenticated') === false) {
        const username = this.get('inputusername');
        const email = this.get('inputemailaddress');
        const pw = this.get('inputpassword');
        const pwconfirm = this.get('inputpasswordconfirm');

        console.log( this.get('inputusername')+this.get('inputemailaddress')+
          this.get('inputpassword')+this.get('inputpasswordconfirm'));
        this.get('loginState').signUp(username,email,pw,pwconfirm);
      }
    },

    toggleSignUp() {
      this.toggleProperty('signupform');
      // Clear errors and fields
      this.set('inputusername','');
      this.set('inputpassword','');
      this.set('loginState.errorMessage','');
    }
  }

});
