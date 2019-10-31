import Controller from '@ember/controller';
import jQuery from 'jquery';
import RSVP from 'rsvp';

export default Controller.extend({
  gamesList: [
    'Game 1',
    'Game 2',
    'Game 3',
    'Game 4',
    'Game 5',
    'Game 6',
    'Game 7',
    'Game 8'
  ],

  tipToggled: false,
  isFavorite: false,
  tipAmountOptions: 10,
  tipToggleIcon: 'fa fa-bars',
  copyUrlBtnIcon: 'fa fa-link',

  videoPanel: 'col-12 col-sm-8 p-0 m-0 mb-2 order-1',
  chatPanel: 'col-12 col-sm-4 p-0 order-2',
  gamePanel: 'card-body order-3 p-1 pt-4',

  simpleTipForm: 'd-flex input-group-prepend',
  tipForm: ' d-none input-group-prepend',
  gameSuggestionPanel: 'd-none card-body p-1',
  gamePlayingPanel: 'd-none card-body p-1 ',
  gameOptionsPanel: 'd-none',
  viewProfileCollapse: 'collapse show',
  editProfileCollapse: 'collapse',

  init() {
    this._super(...arguments);
    this.tags = [];
  },

  actions: {
    addTag(tag) {
      console.log('tags length: ' + this.tags.length);
      if (this.tags.length < 15) {
        console.log('adding tag: ' + tag);
        this.tags.pushObject(tag);
      }
    },

    removeTagAtIndex(index) {
      this.tags.removeAt(index);
    },

    checkOtherSex() {
      jQuery('#inputSexOther')
        .prop('checked', true)
        .change();
    },

    submitProfileSettings() {
      this.store
        .queryRecord('user-public-datum', {
          username: this.get('session.data.authenticated.username')
        })
        .then(user => {
          // Get user public data record from the store and apply the currently
          // changed properties to the record.
          user.setProperties(this.model.userPublicDatum);
          // If gender selection is male or female, save that to profileSex,
          // otherwise set the custom gender textfield as the gender.
          if (
            this.tempSexSelection == 'Male' ||
            this.tempSexSelection == 'Female' ||
            this.tempSexSelection == 'Hide'
          ) {
            user.set('profileSex', this.tempSexSelection);
          } else {
            user.set('profileSex', this.tempSexText);
          }
          // Set tags to user record.
          user.set('userCustomTags', this.tags);
          // Submit record to store
          user
            .save()
            .then(() => {
              // If save success
              console.log('submitProfileSettings saved');
              // Clear errors
              this.currentUser.set('errorMessages', []);
              // Clear custom gender textfield if Male or Female was selected
              if (
                this.tempSexSelection == 'Male' ||
                this.tempSexSelection == 'Female'
              ) {
                this.set('tempSexText', '');
              }
              // Close profile edit panel

              jQuery('[id=viewProfileCollapse]').addClass('show');
              jQuery('[id=editProfileCollapse]').removeClass('show');
            })
            .catch(response => {
              // Save failed
              console.log('error saving user record:', response);
              this.currentUser.set(
                'errorMessages',
                response.errors || response
              );
            });
        })
        .catch(response => {
          // Record not found or other datastore error
          console.log('error finding user record:', response);
          this.currentUser.set('errorMessages', response.errors || response);
        });
    },

    cancelProfileChanges(userPublicDatum) {
      // Rollback model to original values pulled from the store
      userPublicDatum.rollbackAttributes();
      // Rollback gender selection
      this.set('tempSexText', '');
      if (userPublicDatum.profileSex == 'Male') {
        this.set('tempSexSelection', 'Male');
      } else if (userPublicDatum.profileSex == 'Female') {
        this.set('tempSexSelection', 'Female');
      } else if (userPublicDatum.profileSex == 'Hide') {
        this.set('tempSexSelection', 'Hide');
      }
      {
        this.set('tempSexSelection', 'Other');
        this.set('tempSexText', userPublicDatum.profileSex);
        this.set('checkOtherSex', true);
      }
      // Rollback tag selection
      this.set('tags', userPublicDatum.get('userCustomTags').split(','));
    },

    checkLength(text, select /*, event */) {
      if (select.searchText.length >= 3 && text.length < 3) {
        return '';
      } else {
        return text.length >= 3;
      }
    },

    streamStateChange(state) {
      console.log('stream state change called');
      console.log(state);
      // Set isStreaming true if state is "stream-up", false otherwise
      this.set('isStreaming', state === 'stream-up' ? true : false);
    },

    profileImageChanged() {
      console.log('profile image changed');
      RSVP.hash({
        userPublicDatum: this.store.queryRecord('user-public-datum', {
          username: this.get('session.data.authenticated.username')
        }),
        userPublicUploads: this.store.query('user-public-upload', {
          username: this.get('session.data.authenticated.username')
        })
      })
        .then(storeData => {
          this.set('model.userPublicDatum', storeData.userPublicDatum);
          this.set('model.userPublicUploads', storeData.userPublicUploads);
        })
        .catch(err => {
          console.log('error finding public user data:', err);
        });
    },

    setGame(game) {
      this.set('inputGame', game);
    },

    toggleFollow(/*user*/) {
      this.toggleProperty('isFollowed');
      console.log(this.get('isFollowed'));
    },

    endGame() {
      this.set('gamePlayingPanel', 'd-none card-body p-1');

      this.set('videoPanel', 'col-12 col-sm-8 p-0 m-0 mb-2 order-1');
      this.set('chatPanel', 'col-12 col-sm-4 p-0 order-2');
      this.set('gamePanel', 'card-body order-3 p-1 pt-4');
      this.set('gameOptionsPanel', 'd-none');

      jQuery('[id=video-panel]').height(406);

      var windowsize = jQuery(window).width();
      if (windowsize > 576) {
        jQuery('[id=chat-body]').height(344);
        jQuery('[id=users-body]').height(408);
      }
      this.send('cancelJoinGame');
    },

    sendMessage() {
      console.log('action sendMessage Triggered');
    },

    openSuggestionPanel() {
      this.set('gameSuggestionPanel', 'd-block card-body p-1');
    },
    closeSuggestionPanel() {
      this.set('gameSuggestionPanel', 'd-none card-body p-1');
    },

    tipToggle() {
      if (this.tipToggled) {
        this.set('tipToggleIcon', 'fa fa-bars');
        this.set('simpleTipForm', 'd-flex input-group-prepend');
        this.set('tipForm', 'd-none input-group-prepend');
        this.set('tipToggled', false);
      } else {
        this.set('tipToggleIcon', 'fa fa-chevron-right');
        this.set('simpleTipForm', 'd-none input-group-prepend');
        this.set('tipForm', 'd-flex input-group-prepend');
        this.set('tipToggled', true);
      }
    },

    sendTip(tipAmount) {
      tipAmount = Number.parseInt(tipAmount);
      if (
        this.get('session.isAuthenticated') &&
        Number.isInteger(tipAmount) &&
        tipAmount > 0
      ) {
        console.log('sending tip of', tipAmount);

        let creditTransfer = this.store.createRecord('credit-transfer', {
          fromUserId: this.get('session.data.authenticated.user_id'),
          toUserId: this.model.userPublicDatum.get('userId'),
          creditsTransferred: tipAmount,
          transferType: 'tip'
        });

        creditTransfer
          .save()
          .then(transfer => {
            console.log('tipped: ', transfer.creditsTransferred);
            this.currentUser.load();
          })
          .catch(err => {
            console.log('failed to tip', err);
          });
      } else {
        console.log('invalid tip');
      }
    },

    sendFollowerEmail() {
      console.log('send follower email confirmed');
    },

    copyUrlToClipboard() {
      /* Get the text field */
      var copyText = document.getElementById('urlDisplay');

      /* Select the text field */
      copyText.select();

      /* Copy the text inside the text field */
      document.execCommand('Copy');

      /* notify the user */
      this.set('copyUrlBtnIcon', 'fa fa-check');

      setTimeout(function() {
        this.set('copyUrlBtnIcon', 'fa fa-link');
      }, 1500);
    }
  }
});
