import Ember from 'ember';

export default Ember.Controller.extend({


    isFavorite:false,
    isTipping:false,

    actions: {

      toggleTip(){
        var x = document.getElementById('tip-form');
          if (x.style.display === 'none') {
              x.style.display = 'table';
          } else {
              x.style.display = 'none';
          }
      },
      toggleFav(){
        this.toggleProperty('isFavorite');

      },


    }


});
