import Ember from 'ember';



export default Ember.Component.extend({
      casterform: false,

        actions: {
          toggleSignUp() {
            this.toggleProperty('signupform');
          },

          signup(){
            document.cookie ="signedUp=Yes";
          },

          login(){
              this.set('loggedIn', true);
            },

        },
        click: function(){
          this.sendAction();
        }

});
