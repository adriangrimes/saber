import Controller from '@ember/controller';
import $ from 'jquery';

export default Controller.extend({

  gamesList:[
    'Game 1',
    'Game 2',
    'Game 3',
    'Game 4',
    'Game 5',
    'Game 6',
    'Game 7',
    'Game 8',
  ],

  tipToggled:false,
  actions:{

    checkLength(text, select /*, event */) {
    if (select.searchText.length >= 3 && text.length < 3) {
      return '';
    } else {
      return text.length >= 3;
    }
  },


    setGame(game){
      this.set('inputGame', game);

    },





    toggleFav(/*user*/){
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
      if(this.tipToggled){

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
      if(this.tipToggled){

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



    confirmJoinGame(){
        // hide join game button
        $('[id=join-game-button]').addClass('d-none');
        $('[id=join-game-button]').removeClass('d-block');
        $('[id=join-game-button-sm]').removeClass('d-sm-block');
        $('[id=join-game-button-sm]').addClass('d-sm-none');

        $('[id=suggest-game-button]').removeClass('d-block');
        $('[id=suggest-game-button]').addClass('d-none');
        // Show Join Game Confirm Form
        $('[id=confirm-join-game-form]').removeClass('d-none');
        $('[id=confirm-join-game-form]').addClass('d-flex');
        $('[id=confirm-join-game-form-sm]').removeClass('d-sm-none');
        $('[id=confirm-join-game-form-sm]').addClass('d-sm-flex');
    },
    cancelJoinGame(){

      // Show join game button
      $('[id=join-game-button]').removeClass('d-none');
      $('[id=join-game-button]').addClass('d-block');
      $('[id=join-game-button-sm]').addClass('d-sm-block');
      $('[id=join-game-button-sm]').removeClass('d-sm-none');

      $('[id=suggest-game-button]').addClass('d-block');
      $('[id=suggest-game-button]').removeClass('d-none');
      // Hide Join Game Confirm Form
      $('[id=confirm-join-game-form]').addClass('d-none');
      $('[id=confirm-join-game-form]').removeClass('d-flex');
      $('[id=confirm-join-game-form-sm]').addClass('d-none');
      $('[id=confirm-join-game-form-sm]').removeClass('d-sm-flex');

    },
    joinGame(){

      $('[id=game-entry-panel]').addClass('d-none');
      $('[id=game-entry-panel]').removeClass('d-block');
      $('[id=game-playing-panel]').addClass('d-block');
      $('[id=game-playing-panel]').removeClass('d-none');

      $('[id=game-panel]').addClass('order-2');
      $('[id=chat-panel]').addClass('order-3');

      $('[id=game-panel]').removeClass('order-3');
      $('[id=chat-panel]').removeClass('order-2');

      $('[id=video-panel]').height(300);
      $('[id=chat-body]').height(200);
      $('[id=users-body]').height(200);

      $('[id=video-panel]').removeClass('col-sm-8');
      $('[id=video-panel]').addClass('col-sm-6');

      $('[id=chat-panel]').removeClass('col-sm-4');
      $('[id=chat-panel]').addClass('col-sm-6');

      $('[id=game-options-panel]').addClass('d-block');
      $('[id=game-options-panel]').removeClass('d-none');


    },
    endGame(){
      $('[id=game-entry-panel]').removeClass('d-none');
      $('[id=game-entry-panel]').addClass('d-block');
      $('[id=game-playing-panel]').removeClass('d-block');
      $('[id=game-playing-panel]').addClass('d-none');

      $('[id=game-panel]').addClass('order-3');
      $('[id=chat-panel]').addClass('order-2');

      $('[id=game-panel]').removeClass('order-2');
      $('[id=chat-panel]').removeClass('order-4');

      $('[id=video-panel]').addClass('col-sm-8');
      $('[id=video-panel]').removeClass('col-sm-6');

      $('[id=chat-panel]').addClass('col-sm-4');
      $('[id=chat-panel]').removeClass('col-sm-6');

      $('[id=game-options-panel]').removeClass('d-block');
      $('[id=game-options-panel]').addClass('d-none');

      $('[id=video-panel]').height(406);

      var windowsize = $(window).width();
        if (windowsize > 576) {
          $('[id=chat-body]').height(344);
          $('[id=users-body]').height(408);

        }

      this.send('cancelJoinGame');
    },

    sendMessage(){

    },

    openSuggestionPanel(){
      $('[id=game-entry-panel]').addClass('d-none');
      $('[id=game-entry-panel]').removeClass('d-block');
      $('[id=game-suggestion-panel]').addClass('d-block');
      $('[id=game-suggestion-panel]').removeClass('d-none');
    },
    closeSuggestionPanel(){
      $('[id=game-entry-panel]').removeClass('d-none');
      $('[id=game-entry-panel]').addClass('d-block');
      $('[id=game-suggestion-panel]').removeClass('d-block');
      $('[id=game-suggestion-panel]').addClass('d-none');
    },



    tipToggle(){

      if(this.tipToggled){
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
