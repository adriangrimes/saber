import Ember from 'ember';

export default Ember.Controller.extend({
  loggedIn: false,

  actions: {
    login(){
      console.log(this.get('loggedIn'));

      this.toggleProperty('loggedIn');
      console.log(this.get('loggedIn'));

    },
  }

});
