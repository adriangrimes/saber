import Ember from 'ember';

export default Ember.Controller.extend({

  isFavorite: false,
  tags: ['dragons','dungeons','wednesday', 'cheeser','toodles'],

  actions: {
    toggleFav(){
      this.toggleProperty('isFavorite');
    },
    setupController: function(controller, model) {
      controller.set('user', model);
    }

  }

});
