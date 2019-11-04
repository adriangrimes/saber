import Controller from '@ember/controller';
import jQuery from 'jquery';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';

export default Controller.extend({
  notify: service(),
  errorHandler: service(),

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

    checkLength(text, select /*, event */) {
      if (select.searchText.length >= 3 && text.length < 3) {
        return '';
      } else {
        return text.length >= 3;
      }
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
      }, 1000);
    },

    streamStateChange(state) {
      console.log('stream state change called');
      console.log(state);
      // Set isStreaming true if state is "stream-up", false otherwise
      this.set('isStreaming', state === 'stream-up' ? true : false);
    },

    submitProfileSettings() {
      // If gender selection is male or female, save that to profileSex,
      // otherwise set the custom gender textfield as the gender.
      if (
        this.tempSexSelection == 'Male' ||
        this.tempSexSelection == 'Female' ||
        this.tempSexSelection == 'Hide'
      ) {
        this.model.userPublicDatum.set('profileSex', this.tempSexSelection);
      } else {
        this.model.userPublicDatum.set('profileSex', this.tempSexText);
      }
      // Set tags to user record.
      this.model.userPublicDatum.set('userCustomTags', this.tags);
      // Submit record to store
      this.model.userPublicDatum
        .save()
        .then(() => {
          console.log('submitProfileSettings saved');
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
        .catch(err => {
          // Save failed
          console.log('error saving user record:', err);
          this.errorHandler.handleWithNotification(err);
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
      } else {
        this.set('tempSexSelection', 'Other');
        this.set('tempSexText', userPublicDatum.profileSex);
        this.set('checkOtherSex', true);
      }

      // Rollback tag selection
      // TODO below tag rollback doesnt work
      // TODO probably use changesets
      // this.set('tags', this.model.userPublicDatum.get('userCustomTags'));
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

    sendTip(tipAmount) {
      tipAmount = Number.parseInt(tipAmount);
      if (
        this.get('session.isAuthenticated') &&
        Number.isInteger(tipAmount) &&
        tipAmount > 0
      ) {
        console.log('sending tip of', tipAmount);

        let creditTransfer = this.store.createRecord('credit-transfer', {
          fromUserId: this.session.data.authenticated.user_id,
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
            this.errorHandler.handleWithNotification(err);
          });
      } else {
        console.log('invalid tip');
        this.notify.error('Something about your tip is invalid.');
      }
    }
  }
});
