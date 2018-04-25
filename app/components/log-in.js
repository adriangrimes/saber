import Component from '@ember/component';
import { inject } from '@ember/service';

// log-in
export default Component.extend({

  signupform: false,

  loginState: inject('login-state'),
  session: inject('session'),
  inputUsername: '',
  inputPassword: '',

  actions: {
    authenticate() {
      this.set('loginState.errorMessage','');

      let identification = this.get('inputusername');
      let password = this.get('inputpassword');

      this.get('loginState').logIn(identification, password);
    },

    signup(){
      this.set('loginState.errorMessage','');
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
      //clear errors and fields
      this.set('inputusername','');
      this.set('inputpassword','');
      this.set('loginState.errorMessage','');
    }
  }

});
