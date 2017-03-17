import Ember from 'ember';

export default Ember.Controller.extend({

  isFavorite: false,

  actions: {
    toggleFav(){
      this.toggleProperty('isFavorite');
    },

      setupController: function(controller, model) {
        controller.set('user', model);
      }
  }

});
