import Ember from 'ember';

export default Ember.Component.extend({
      signupform: false,
        actions: {
          toggleSignUp() {
            this.toggleProperty('signupform');
          },

          signup(){
            document.cookie ="signedUp=Yes";
          },

        },
        click: function(){
          this.sendAction();
        }

});
