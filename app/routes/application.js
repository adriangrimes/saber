import Ember from 'ember';

export default Ember.Route.extend({

  loginState: Ember.inject.service('login-state'),
  
  model () {
    //eventually have some actual auth here. probably some jazz with login pages
    //return admin user
    //return this.store.find('user', 1);
  }

});
