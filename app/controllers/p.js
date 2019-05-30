import Controller from '@ember/controller';
import jQuery from 'jquery';

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

  init: function() {
    this._super(...arguments);
    this.tags = [];
  },

  actions:{

    addTag(tag) {
      console.log('tags length: ' + this.tags.length);
      if (this.tags.length < 15) {
        console.log('adding tag: '+ tag);
        this.tags.pushObject(tag);
      }
    },
      removeTagAtIndex(index) {
        this.tags.removeAt(index);
      },

      checkOtherSex() {
        jQuery("#inputSexOther").prop('checked', true).change();
      },
      submitProfileSettings() {
        this.store.queryRecord('user-public-datum',
          { username: this.get('session.data.authenticated.username') }).then((user) => {
          // Get user public data record from the store and apply the currently
          // changed properties to the record.
          user.setProperties(this.model);
          // If gender selection is male or female, save that to profileSex,
          // otherwise set the custom gender textfield as the gender.
          if (this.tempSexSelection == 'Male' || this.tempSexSelection == 'Female') {
            user.set('profileSex', this.tempSexSelection);
          } else {
            user.set('profileSex', this.tempSexText);
          }
          // Set tags to user record.
          user.set('userCustomTags', this.tags);
          // Submit record to store
          user.save().then(() => {
            // Save success
            console.log('submitProfileSettings saved');
            // Clear errors
            this.currentUser.set('errorMessages', []);
            // Clear custom gender textfield if Male or Female was selected
            if (this.tempSexSelection == 'Male' || this.tempSexSelection == 'Female') {
              this.set('tempSexText', '');
            }
            // Close profile edit panel
            jQuery('[id=viewProfileCollapse]').addClass('show');
            jQuery('[id=editProfileCollapse]').removeClass('show');
          }).catch((response) => {
            // Save failed
            console.log('error saving user record: ' + response);
            this.currentUser.set('errorMessages', response.errors || response);
          });
        }).catch((response) => {
          // Record not found or other store error
          console.log('error finding user record: ' + response);
          this.currentUser.set('errorMessages', response.errors || response);
        });
      },

      cancelProfileChanges() {
        // Rollback model to original values pulled from the store
        this.model.rollbackAttributes();
        // Rollback gender selection
        this.set('tempSexText', '');
        if (this.model.profileSex == 'Male') {
          this.set('tempSexSelection', 'Male');
        } else if (this.model.profileSex == 'Female') {
          this.set('tempSexSelection', 'Female');
        } else {
          this.set('tempSexSelection', 'Other');
          this.set('tempSexText', this.model.profileSex);
          this.set('checkOtherSex', true);
        }
        // Rollback tag selection
        this.set('tags', this.model.get('userCustomTags').split(","));
      },


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





    toggleFollow(/*user*/){
      this.toggleProperty('isFollowed');
      console.log(this.get('isFollowed'));
    },
    confirmTip(){
        // hide tip forms
          jQuery('[id=tip-form]').removeClass('d-flex');
          jQuery('[id=tip-form]').addClass('d-none');
          jQuery('[id=simple-tip-form]').removeClass('d-flex');
          jQuery('[id=simple-tip-form]').addClass('d-none');
        // Show Tip Confirm Form

          jQuery('[id=confirm-tip-form]').removeClass('d-none');
          jQuery('[id=confirm-tip-form]').addClass('d-flex');

    },
    cancelTip(){

      //Hide Confirm Tip

      jQuery('[id=confirm-tip-form]').removeClass('d-flex');
      jQuery('[id=confirm-tip-form]').addClass('d-none');
      //Then Show the last tip form
      if(this.tipToggled){

          jQuery('[id=tip-form]').removeClass('d-none');
          jQuery('[id=tip-form]').addClass('d-flex');
          jQuery('[id=simple-tip-form]').removeClass('d-flex');
          jQuery('[id=simple-tip-form]').addClass('d-none');
          jQuery('[id=tip-toggle]').removeClass('fa-bars');
          jQuery('[id=tip-toggle]').addClass('fa-chevron-right');

          jQuery('[id=profileControls]').addClass('large-controls');
      }else{
        jQuery('[id=tip-form]').removeClass('d-flex');
        jQuery('[id=tip-form]').addClass('d-none');
        jQuery('[id=simple-tip-form]').removeClass('d-none');
        jQuery('[id=simple-tip-form]').addClass('d-flex');

        jQuery('[id=tip-toggle]').removeClass('fa-chevron-right');
        jQuery('[id=tip-toggle]').addClass('fa-bars');

        jQuery('[id=profileControls]').removeClass('large-controls');
      }
    },
    sendTip(){

      //Hide Confirm Tip

      jQuery('[id=confirm-tip-form]').removeClass('d-flex');
      jQuery('[id=confirm-tip-form]').addClass('d-none');
      //Then Show the last tip form
      if(this.tipToggled){

          jQuery('[id=tip-form]').removeClass('d-none');
          jQuery('[id=tip-form]').addClass('d-flex');
          jQuery('[id=simple-tip-form]').removeClass('d-flex');
          jQuery('[id=simple-tip-form]').addClass('d-none');
          jQuery('[id=tip-toggle]').removeClass('fa-bars');
          jQuery('[id=tip-toggle]').addClass('fa-chevron-right');

          jQuery('[id=profileControls]').addClass('large-controls');
      }else{
        jQuery('[id=tip-form]').removeClass('d-flex');
        jQuery('[id=tip-form]').addClass('d-none');
        jQuery('[id=simple-tip-form]').removeClass('d-none');
        jQuery('[id=simple-tip-form]').addClass('d-flex');

        jQuery('[id=tip-toggle]').removeClass('fa-chevron-right');
        jQuery('[id=tip-toggle]').addClass('fa-bars');

        jQuery('[id=profileControls]').removeClass('large-controls');

      }

    },



    confirmJoinGame(){
        // hide join game button
        jQuery('[id=join-game-button]').addClass('d-none');
        jQuery('[id=join-game-button]').removeClass('d-block');
        jQuery('[id=join-game-button-sm]').removeClass('d-sm-block');
        jQuery('[id=join-game-button-sm]').addClass('d-sm-none');

        jQuery('[id=suggest-game-button]').removeClass('d-block');
        jQuery('[id=suggest-game-button]').addClass('d-none');
        // Show Join Game Confirm Form
        jQuery('[id=confirm-join-game-form]').removeClass('d-none');
        jQuery('[id=confirm-join-game-form]').addClass('d-flex');
        jQuery('[id=confirm-join-game-form-sm]').removeClass('d-sm-none');
        jQuery('[id=confirm-join-game-form-sm]').addClass('d-sm-flex');
    },
    cancelJoinGame(){

      // Show join game button
      jQuery('[id=join-game-button]').removeClass('d-none');
      jQuery('[id=join-game-button]').addClass('d-block');
      jQuery('[id=join-game-button-sm]').addClass('d-sm-block');
      jQuery('[id=join-game-button-sm]').removeClass('d-sm-none');

      jQuery('[id=suggest-game-button]').addClass('d-block');
      jQuery('[id=suggest-game-button]').removeClass('d-none');
      // Hide Join Game Confirm Form
      jQuery('[id=confirm-join-game-form]').addClass('d-none');
      jQuery('[id=confirm-join-game-form]').removeClass('d-flex');
      jQuery('[id=confirm-join-game-form-sm]').addClass('d-none');
      jQuery('[id=confirm-join-game-form-sm]').removeClass('d-sm-flex');

    },
    joinGame(){

      jQuery('[id=game-entry-panel]').addClass('d-none');
      jQuery('[id=game-entry-panel]').removeClass('d-block');
      jQuery('[id=game-playing-panel]').addClass('d-block');
      jQuery('[id=game-playing-panel]').removeClass('d-none');

      jQuery('[id=game-panel]').addClass('order-2');
      jQuery('[id=chat-panel]').addClass('order-3');

      jQuery('[id=game-panel]').removeClass('order-3');
      jQuery('[id=chat-panel]').removeClass('order-2');

      jQuery('[id=video-panel]').height(300);
      jQuery('[id=chat-body]').height(200);
      jQuery('[id=users-body]').height(200);

      jQuery('[id=video-panel]').removeClass('col-sm-8');
      jQuery('[id=video-panel]').addClass('col-sm-6');

      jQuery('[id=chat-panel]').removeClass('col-sm-4');
      jQuery('[id=chat-panel]').addClass('col-sm-6');

      jQuery('[id=game-options-panel]').addClass('d-block');
      jQuery('[id=game-options-panel]').removeClass('d-none');


    },
    endGame(){
      jQuery('[id=game-entry-panel]').removeClass('d-none');
      jQuery('[id=game-entry-panel]').addClass('d-block');
      jQuery('[id=game-playing-panel]').removeClass('d-block');
      jQuery('[id=game-playing-panel]').addClass('d-none');

      jQuery('[id=game-panel]').addClass('order-3');
      jQuery('[id=chat-panel]').addClass('order-2');

      jQuery('[id=game-panel]').removeClass('order-2');
      jQuery('[id=chat-panel]').removeClass('order-4');

      jQuery('[id=video-panel]').addClass('col-sm-8');
      jQuery('[id=video-panel]').removeClass('col-sm-6');

      jQuery('[id=chat-panel]').addClass('col-sm-4');
      jQuery('[id=chat-panel]').removeClass('col-sm-6');

      jQuery('[id=game-options-panel]').removeClass('d-block');
      jQuery('[id=game-options-panel]').addClass('d-none');

      jQuery('[id=video-panel]').height(406);

      var windowsize = jQuery(window).width();
        if (windowsize > 576) {
          jQuery('[id=chat-body]').height(344);
          jQuery('[id=users-body]').height(408);

        }

      this.send('cancelJoinGame');
    },


    confirmJoinPrivate(){
        // hide join game button
        jQuery('[id=join-private-button]').addClass('d-none');
        jQuery('[id=join-private-button]').removeClass('d-flex');

        // Show Join Game Confirm Form
        jQuery('[id=confirm-join-private-form]').removeClass('d-none');
        jQuery('[id=confirm-join-private-form]').addClass('d-flex');
    },
    cancelJoinPrivate(){

      // hide join game button
      jQuery('[id=join-private-button]').removeClass('d-none');
      jQuery('[id=join-private-button]').addClass('d-flex');
      // Show Join Game Confirm Form
      jQuery('[id=confirm-join-private-form]').addClass('d-none');
      jQuery('[id=confirm-join-private-form]').removeClass('d-flex');

    },
    joinPrivate(){

    },

    sendMessage(){

    },

    openSuggestionPanel(){
      jQuery('[id=game-entry-panel]').addClass('d-none');
      jQuery('[id=game-entry-panel]').removeClass('d-block');
      jQuery('[id=game-suggestion-panel]').addClass('d-block');
      jQuery('[id=game-suggestion-panel]').removeClass('d-none');
    },
    closeSuggestionPanel(){
      jQuery('[id=game-entry-panel]').removeClass('d-none');
      jQuery('[id=game-entry-panel]').addClass('d-block');
      jQuery('[id=game-suggestion-panel]').removeClass('d-block');
      jQuery('[id=game-suggestion-panel]').addClass('d-none');
    },



    tipToggle(){

      if(this.tipToggled){
        jQuery('[id=tip-form]').removeClass('d-flex');
        jQuery('[id=simple-tip-form]').removeClass('d-none');
          jQuery('[id=tip-form]').addClass('d-none');
          jQuery('[id=simple-tip-form]').addClass('d-flex');

          jQuery('[id=tip-toggle]').removeClass('fa-chevron-right');
          jQuery('[id=tip-toggle]').addClass('fa-bars');

          jQuery('[id=profileControls]').removeClass('large-controls');


        this.set('tipToggled', false);
      }else{
        jQuery('[id=tip-form]').removeClass('d-none');
        jQuery('[id=simple-tip-form]').removeClass('d-flex');
          jQuery('[id=tip-form]').addClass('d-flex');
          jQuery('[id=simple-tip-form]').addClass('d-none');
          jQuery('[id=tip-toggle]').removeClass('fa-bars');
          jQuery('[id=tip-toggle]').addClass('fa-chevron-right');

          jQuery('[id=profileControls]').addClass('large-controls');

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

      jQuery('[id=copyUrlBtn]').removeClass('fa-link');
      jQuery('[id=copyUrlBtn]').addClass('fa-check');

      setTimeout(function() {
      jQuery('[id=copyUrlBtn]').removeClass('fa-check');
      jQuery('[id=copyUrlBtn]').addClass('fa-link');
      }, 3000);


    },
  }

});
