import Ember from 'ember';

//Controller - application
export default Ember.Controller.extend({


  actions: {

    logout(){
      this.get('loginState').logOut();
      this.transitionToRoute('index');
    },

  }

});
