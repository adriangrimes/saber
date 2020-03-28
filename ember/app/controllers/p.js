import Controller from '@ember/controller';
import jQuery from 'jquery';
import RSVP from 'rsvp';
import { inject as service } from '@ember/service';
import { later } from '@ember/runloop';

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
  donationMenuOpen: false,
  donationAmountOptions: 10,
  profileSaveStart: false,
  profileSaveSuccess: false,
  editingProfile: false,

  actions: {
    addTag(tag) {
      let originalTags = this.model.userPublicDatum.userCustomTags;
      let modifiedTags = originalTags.slice();
      console.log('tags length: ' + modifiedTags.length);

      if (modifiedTags.length < 15) {
        console.log('adding tag: ' + tag);
        modifiedTags.push(tag);
        this.model.userPublicDatum.set('userCustomTags', modifiedTags);
      }
    },

    removeTagAtIndex(index) {
      let originalTags = this.model.userPublicDatum.userCustomTags;
      let modifiedTags = originalTags.slice();
      modifiedTags.removeAt(index);
      this.model.userPublicDatum.set('userCustomTags', modifiedTags);
    },
    toggleEditProfile() {
      if (this.editingProfile) {
        this.set('editingProfile', false);
      } else {
        this.set('editingProfile', true);
      }
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

    donationMenuToggle() {
      this.toggleProperty('donationMenuOpen');
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
      later(
        this,
        function() {
          this.set('copiedNotification', false);
        },
        1000
      );
    },

    streamStateChange(state) {
      console.log('stream state change called');
      console.log(state);
      // Set isStreaming true if state is "stream-up", false otherwise
      this.set('isStreaming', state === 'stream-up' ? true : false);
    },

    submitProfileSettings() {
      this.set('profileSaveStart', true);
      // Submit record to store
      this.model.userPublicDatum
        .save()
        .then(() => {
          console.log('submitProfileSettings saved');
          this.set('profileSaveSuccess', true);
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
      this.set('revertingProfileChanges', true);

      // Rollback tag selection
      this.set('tags', this.model.userPublicDatum.get('userCustomTags'));
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

    sendDonation(donationAmount) {
      donationAmount = Number.parseInt(donationAmount);
      if (
        this.get('session.isAuthenticated') &&
        Number.isInteger(donationAmount) &&
        donationAmount > 0
      ) {
        console.log('sending donation of', donationAmount);

        let cubeTransfer = this.store.createRecord('cube-transfer', {
          fromUserId: this.session.data.authenticated.user_id,
          toUserId: this.model.userPublicDatum.get('userId'),
          cubesTransferred: donationAmount,
          transferType: 'donation'
        });

        cubeTransfer
          .save()
          .then(transfer => {
            console.log('donated: ', transfer.cubesTransferred);
            this.currentUser.load({ forceReloadMessages: false });
          })
          .catch(err => {
            console.log('failed to donate', err);
            this.errorHandler.handleWithNotification(err);
          });
      } else {
        console.log('invalid donation');
        this.notify.error('Something about your donation is invalid.');
      }
    }
  }
});
