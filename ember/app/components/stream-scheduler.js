import Component from '@ember/component';

export default Component.extend({
  
  actions:{

    displayDate(){
      var x = document.getElementById('selected-date-display');
      if (x.style.display === 'none'){
        x.style.display = 'block';
      }
    }

  }

});
