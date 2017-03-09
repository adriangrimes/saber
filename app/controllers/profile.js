import Ember from 'ember';

export default Ember.Controller.extend({

  loginState: Ember.inject.service('login-state'),

    isFavorite:false,

    actions: {


      toggleFav(){
        this.toggleProperty('isFavorite');

      },
    

}

});
