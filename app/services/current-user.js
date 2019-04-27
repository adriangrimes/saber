import { computed } from '@ember/object';
//import { isEmpty } from '@ember/utils';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';
import $ from 'jquery';

export default Service.extend({

  session: service(),
  store: service(),
  themeChanger: service(),

  signupSuccess: false,
  hasModalOpen: false,

  // All other user data is at {{currentUser.user.fullName}} etc.
  // Computed properties set to currentUser.user will be removed once the
  // model has been populated below.
  isContracted: computed('user.{broadcaster,developer,affiliate}', function() {
    if (this.get('user.broadcaster') === true ||
      this.get('user.developer') === true ||
      this.get('user.affiliate') === true) {
      return true;
    } else {
      return false;
    }
  }),
  isPlayer: computed('isContracted', function() {
      return !this.get('isContracted');
  }),

  init() {
    this._super(...arguments);
    this.errorMessages = [];
  },

  setupModal() {
    this.currentUser.set('hasModalOpen', true);
    this.currentUser.set('errorMessages', []);
  },
  cleanUpModal() {
    this.currentUser.set('hasModalOpen', false);
    this.currentUser.set('errorMessages', []);
  },

  load() {
    console.log('currentUser.load() user_id: ' +
      this.get('session.data.authenticated.user_id'));
    let userId = this.get('session.data.authenticated.user_id');
    if (!isNaN(userId)) {
      return this.get('store').findRecord('user', userId).then((user) => {
        this.set('user', user); // Set data returned to currentUser.user
      }).catch((err) => {
        this.set('errorMessages', err.errors || err);
      });
    } else {
      return resolve();
    }
  },

  // Main login function
  logIn(identification, password) {
    this.set('errorMessages', []);
    if (identification && password) {
      // Submit authentication parameters to api server
      this.get('session').authenticate('authenticator:devise',
          identification.trim(),
          password)
          .then(() => {
        // Now that we're authenticated, request user data from api server
        return this.get('store').findRecord('user',
          this.get('session.data.authenticated.user_id'));
      }).then((user) => {
        // Set theme to dark if true, otherwise default theme
        this.themeChanger.set('theme', user.darkMode ? 'dark' : 'default');
        $('#loginModal').modal('hide'); //close log in modal
      }).catch((err) => {
        this.set('errorMessages', err.errors || err);
      });
    } else {
      this.set('errorMessages',
        [{ title: 'Missing Info', detail: 'Your login or password is missing' }]);
    }
  },

  // Registration
  signUp(username, email, pw, fullname, contractor) {
    this.set('errorMessages', []);
    if (username && email && pw) {
      let newUser = this.get('store').createRecord('user', {
        email: email.trim(),
        username: username.trim(),
        password: pw // Do not trim password
      });
      if (contractor === 'broadcaster') {
        newUser.set('broadcaster', true);
        newUser.set('affiliate', true);
      }
      if (contractor === 'developer') {
        newUser.set('developer', true);
        newUser.set('affiliate', true);
      }
      if (contractor === 'affiliate') {
        newUser.set('affiliate', true);
      }
      if (fullname) {
        // Removes any extra spaces, and trims whitespace from ends
        let cleanedFullName = fullname.replace(/\s+/g,' ').trim();
        let spaceCount = (cleanedFullName.split(' ').length - 1);
        console.log(spaceCount);
        if (spaceCount > 1) {
          newUser.set('fullName', cleanedFullName.trim().split(' ').join('|'));
        } else {
          newUser.set('fullName', cleanedFullName.trim().replace(' ', '||'));
        }
      }
      newUser.save().then(() => {
        this.set('errorMessages', []);
        this.set('signupSuccess', true);
      }).catch((err) => {
        newUser.deleteRecord();
        this.set('errorMessages', err.errors || err);
      });
    } else {
      this.set('errorMessages',
        [{ title: 'Missing Info',
        detail: 'Please fill in all fields below to sign up' }]
      );
    }
  },

  logOut() {
    this.get('store').unloadAll('user');
    this.set('user', {});
    this.get('session').invalidate();
    this.get('themeChanger').set('theme', 'default');
  },

});
