import Ember from 'ember';

//Controller - application
export default Ember.Controller.extend({

  loginState: Ember.inject.service('login-state'),
  signupform: false,

  actions: {

    logout(){
      this.get('loginState').logOut();
      this.transitionToRoute('index');
    },
    openSignup(userType){
      var modal = Ember.$(".loginModal");
      modal.find('.signup-button').text('Sign up as a ' + userType);
      modal.find('.modal-title').text('Sign up as a ' + userType);
    },
    openlogin(){
      this.set('signupform', false);
    }

  }

});
