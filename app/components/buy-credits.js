import Ember from 'ember';

//Component - log-in
export default Ember.Component.extend({
  casterform: false,
  loginState: Ember.inject.service('login-state'),
  inputusername:'',
  inputpassword: '',

  actions: {
    login() {
      if (this.get('loginState.loggedIn') === false) {
        const username = this.get('inputusername');
        const pw = this.get('inputpassword');

        this.get('loginState').logIn(username,pw);
      }

      //clear fields for reasons
      this.set('inputusername','');
      this.set('inputpassword','');
    },
    signup(){
      if (this.get('loginState.loggedIn') === false) {
        const username = this.get('inputusername');
        const email = this.get('inputemailaddress');
        const pw = this.get('inputpassword');
        const pwconfirm = this.get('inputpasswordconfirm');

        this.get('loginState').signUp(username,email,pw,pwconfirm);
        document.cookie ="signedUp=Yes;path=/";
      }
    },
    toggleSignUp() {
      this.toggleProperty('signupform');
    }
  }

});
