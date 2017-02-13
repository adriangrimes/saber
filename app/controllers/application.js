import Ember from 'ember';

//Controller - application
export default Ember.Controller.extend({
  loggedIn: true,
  userType: '',
  signupform: false,

  actions: {
    login() {
      console.log("controller logged em");
    },
    logout(){
      this.set('loggedIn', false);
    },
    openSignup(userType){
      var modal = Ember.$(".loginModal");
      modal.find('.signup-button').text('Sign up as a ' + userType);
      modal.find('.modal-title').text('Sign up as a ' + userType);
    },
    openlogin(){
      this.set('signupform', false);
    }
  },

});
