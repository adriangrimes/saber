import Ember from 'ember';

//Component - log-in
export default Ember.Component.extend({


  signupform: false,

  loginState: Ember.inject.service('login-state'),
  session: Ember.inject.service('session'),
  inputUsername: '',
  inputPassword: '',

  actions: {
    authenticate() {
      let identification = this.get('inputUsername');
      let password = this.get('inputPassword');

      console.log(this.get('session.isAuthenticated'));
      console.log('component log in inputUsername: ' + identification);

      if (this.get('session.isAuthenticated') === false) {
        this.$('#loginModal > div > div > form > div > button > div').addClass('spinner');
        this.$("#loginModal > div > div > form > div > button > div").contents().filter(function () {
          return this.nodeType === 3; // Text nodes only
        }).remove();

        this.get('loginState').logIn(identification, password);
      }
      if (this.get('session.isAuthenticated') === true) {
        //clear fields for reasons
        this.set('inputusername','');
        this.set('inputpassword','');
      }
    },
    signup(){
      if (this.get('session.isAuthenticated') === false) {
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
