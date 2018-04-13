import Component from '@ember/component';

export default Component.extend({

  actions:{

    togglePM(){
      var x = document.getElementById('private-messenger-window');
      if (x.style.display === 'none'){
        x.style.display = 'block';
      }else{
        x.style.display = 'none';
      }
    }
    
  }

});
