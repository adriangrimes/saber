import Ember from 'ember';



export default Ember.Controller.extend({
  loggedIn: true,
  userType: '',
  signupform: true,




  actions:{
      logout(){
        this.set('loggedIn', false);

      },
      openSignup(userType){
          var modal = Ember.$(".loginModal");
          modal.find('.signup-button').text('Sign up as a ' + userType);
          modal.find('.modal-title').text('Sign up as a ' + userType);
        },
      openlogin(userType){
        this.set('signupform', false);

      }


    }



});
