import Ember from 'ember';

export default Ember.Component.extend({

  actions:{

      togglePopup(){
       var x = document.getElementById('popup-alert-window');
       if (x.style.display === 'none'){
         x.style.display = 'block';
       }else{
         x.style.display = 'none';
       }

   },
  }
});
