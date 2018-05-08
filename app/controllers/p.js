import Controller from '@ember/controller';

export default Controller.extend({

  actions:{
    toggleFav(user){
      this.toggleProperty('isFavorite');
    },
    sendTip(){

    },
  }

});
