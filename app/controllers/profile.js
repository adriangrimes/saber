import Ember from 'ember';

export default Ember.Controller.extend({

  isFavorite: false,

  actions: {
    toggleFav(){
      this.toggleProperty('isFavorite');
    },
  }

});
