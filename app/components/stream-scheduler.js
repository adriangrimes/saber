import Ember from 'ember';

export default Ember.Component.extend({
actions:{

  displayDate(){
    var x = document.getElementById('selected-date-display');
    if (x.style.display === 'none'){
      x.style.display = 'block';
    }
  },

}

});
