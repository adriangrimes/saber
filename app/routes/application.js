import Ember from 'ember';

export default Ember.Route.extend({

  model () {
    //return admin user
    return this.store.find('user', 1);
  }

});
