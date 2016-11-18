import Ember from 'ember';

export default Ember.Controller.extend({
  loggedIn: true,


  actions:{
      logout(){
        this.set('loggedIn', false);
        console.log(this.get('loggedIn'));

      },

    }

});
