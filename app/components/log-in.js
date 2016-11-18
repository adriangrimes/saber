import Ember from 'ember';

export default Ember.Component.extend({
      casterform: false,
  signupform: false,

        actions: {
          toggleSignUp() {
            this.toggleProperty('signupform');
          },

          toggleCasterSignup(){
            this.toggleProperty('casterform');
          },


          signup(){
            document.cookie ="signedUp=Yes";
          },

          login(){
              this.set('loggedIn', true);
              console.log(this.get('loggedIn'));

            },


        },
        click: function(){
          this.sendAction();
        }

});
