import Ember from 'ember';

//Component - log-in
export default Ember.Component.extend({
  casterform: false,

  actions: {
    toggleSignUp() {
      this.toggleProperty('signupform');
    },
    signup(){
      this.sendAction('signup')
      document.cookie ="signedUp=Yes";
    },
    login() {
      this.sendAction('login');
    }
  }

});
