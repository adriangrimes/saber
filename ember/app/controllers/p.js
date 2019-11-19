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

  copiedNotification: false,
  isFavorite: false,
  gameIsActive: true,
  tipMenuOpen: false,
  tipAmountOptions: 10,

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

    checkOtherGender() {
      jQuery('#inputGenderOther')
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
      this.set('gameSuggestionPanelOpen', true);
    },
    closeSuggestionPanel() {
      this.set('gameSuggestionPanelOpen', false);
    },

    tipMenuToggle() {
      this.toggleProperty('tipMenuOpen');
    },

    sendFollowerEmail() {
      console.log('send follower email confirmed');
    },

    copyUrlToClipboard() {
      var copyText = document.getElementById('urlDisplay');
      copyText.select();
      document.execCommand('Copy');

      // notify the user
      this.set('copiedNotification', true);
      setTimeout(() => {
        this.set('copiedNotification', false);
      }, 1000);
    },

    streamStateChange(state) {
      console.log('stream state change called');
      console.log(state);
      // Set isStreaming true if state is "stream-up", false otherwise
      this.set('isStreaming', state === 'stream-up' ? true : false);
    },

    submitProfileSettings() {
      // If gender selection is male or female, save that to profileGender,
      // otherwise set the custom gender textfield as the gender.
      if (
        this.tempGenderSelection == 'Male' ||
        this.tempGenderSelection == 'Female' ||
        this.tempGenderSelection == 'Hide'
      ) {
        this.model.userPublicDatum.set('profileGender', this.tempGenderSelection);
      } else {
        this.model.userPublicDatum.set('profileGender', this.tempGenderText);
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
            this.tempGenderSelection == 'Male' ||
            this.tempGenderSelection == 'Female'
          ) {
            this.set('tempGenderText', '');
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
      this.set('tempGenderText', '');
      if (userPublicDatum.profileGender == 'Male') {
        this.set('tempGenderSelection', 'Male');
      } else if (userPublicDatum.profileGender == 'Female') {
        this.set('tempGenderSelection', 'Female');
      } else if (userPublicDatum.profileGender == 'Hide') {
        this.set('tempGenderSelection', 'Hide');
      } else {
        this.set('tempGenderSelection', 'Other');
        this.set('tempGenderText', userPublicDatum.profileGender);
        this.set('checkOtherGender', true);
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
