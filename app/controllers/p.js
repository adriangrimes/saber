import Controller from '@ember/controller';

export default Controller.extend({

  tipToggled:false,
  actions:{
    toggleFav(user){
      this.toggleProperty('isFavorite');
    },
    confirmTip(){
        // hide tip forms
          $('[id=tip-form]').removeClass('d-flex');
          $('[id=tip-form]').addClass('d-none');
          $('[id=simple-tip-form]').removeClass('d-flex');
          $('[id=simple-tip-form]').addClass('d-none');
        // Show Tip Confirm Form

          $('[id=confirm-tip-form]').removeClass('d-none');
          $('[id=confirm-tip-form]').addClass('d-flex');

    },
    cancelTip(){

      //Hide Confirm Tip

      $('[id=confirm-tip-form]').removeClass('d-flex');
      $('[id=confirm-tip-form]').addClass('d-none');
      //Then Show the last tip form
      if(this.get('tipToggled')){

          $('[id=tip-form]').removeClass('d-none');
          $('[id=tip-form]').addClass('d-flex');
          $('[id=simple-tip-form]').removeClass('d-flex');
          $('[id=simple-tip-form]').addClass('d-none');
          $('[id=tip-toggle]').removeClass('fa-bars');
          $('[id=tip-toggle]').addClass('fa-chevron-right');

          $('[id=profileControls]').addClass('large-controls');
      }else{
        $('[id=tip-form]').removeClass('d-flex');
        $('[id=tip-form]').addClass('d-none');
        $('[id=simple-tip-form]').removeClass('d-none');
        $('[id=simple-tip-form]').addClass('d-flex');

        $('[id=tip-toggle]').removeClass('fa-chevron-right');
        $('[id=tip-toggle]').addClass('fa-bars');

        $('[id=profileControls]').removeClass('large-controls');
      }
    },
    sendTip(){

      //Hide Confirm Tip

      $('[id=confirm-tip-form]').removeClass('d-flex');
      $('[id=confirm-tip-form]').addClass('d-none');
      //Then Show the last tip form
      if(this.get('tipToggled')){

          $('[id=tip-form]').removeClass('d-none');
          $('[id=tip-form]').addClass('d-flex');
          $('[id=simple-tip-form]').removeClass('d-flex');
          $('[id=simple-tip-form]').addClass('d-none');
          $('[id=tip-toggle]').removeClass('fa-bars');
          $('[id=tip-toggle]').addClass('fa-chevron-right');

          $('[id=profileControls]').addClass('large-controls');
      }else{
        $('[id=tip-form]').removeClass('d-flex');
        $('[id=tip-form]').addClass('d-none');
        $('[id=simple-tip-form]').removeClass('d-none');
        $('[id=simple-tip-form]').addClass('d-flex');

        $('[id=tip-toggle]').removeClass('fa-chevron-right');
        $('[id=tip-toggle]').addClass('fa-bars');

        $('[id=profileControls]').removeClass('large-controls');

      }

    },
    sendMessage(){

    },
    joinGame(){

    },
    tipToggle(){

      if(this.get('tipToggled')){
        $('[id=tip-form]').removeClass('d-flex');
        $('[id=simple-tip-form]').removeClass('d-none');
          $('[id=tip-form]').addClass('d-none');
          $('[id=simple-tip-form]').addClass('d-flex');

          $('[id=tip-toggle]').removeClass('fa-chevron-right');
          $('[id=tip-toggle]').addClass('fa-bars');

          $('[id=profileControls]').removeClass('large-controls');


        this.set('tipToggled', false);
      }else{
        $('[id=tip-form]').removeClass('d-none');
        $('[id=simple-tip-form]').removeClass('d-flex');
          $('[id=tip-form]').addClass('d-flex');
          $('[id=simple-tip-form]').addClass('d-none');
          $('[id=tip-toggle]').removeClass('fa-bars');
          $('[id=tip-toggle]').addClass('fa-chevron-right');

          $('[id=profileControls]').addClass('large-controls');

        this.set('tipToggled', true);
      }


    },
    copyUrlToClipboard(){
      /* Get the text field */
      var copyText =document.getElementById("urlDisplay");

      /* Select the text field */
      copyText.select();

      /* Copy the text inside the text field */
      document.execCommand("Copy");

      /* notify the user */

      $('[id=copyUrlBtn]').removeClass('fa-link');
      $('[id=copyUrlBtn]').addClass('fa-check');

      setTimeout(function() {
      $('[id=copyUrlBtn]').removeClass('fa-check');
      $('[id=copyUrlBtn]').addClass('fa-link');
      }, 3000);


    },
  }

});
