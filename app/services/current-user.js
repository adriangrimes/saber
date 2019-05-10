import Service from '@ember/service';
import { not as computedNot, or as computedOr } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';
import jQuery from 'jquery';

export default Service.extend({

  // Services
  session: service(),
  store: service(),
  themeChanger: service(),

  // All other user data is at {{currentUser.user.fullName}} etc.
  // Any properties set to currentUser.user will be removed once the model has
  // been populated below.
  signupSuccess: false,
  hasModalOpen: false,
  isContracted: computedOr('user.{broadcaster,developer,affiliate}'),
  isPlayer: computedNot('isContracted'),

  init() {
    this._super(...arguments);
    this.errorMessages = [];
  },

  // Main login function
  logIn(identification, password) {
    this.set('errorMessages', []);
    if (identification && password) {
      // Submit authentication parameters to back-end
      this.session.authenticate('authenticator:devise',
        identification.trim(),
        password)
        .then(() => {
          // Now that we have a token, request user data from back-end
          return this.store.findRecord('user',
            this.get('session.data.authenticated.user_id'));
      }).then((user) => {
        // Set theme to dark if true, otherwise default theme
        this.themeChanger.set('theme', user.darkMode ? 'dark' : 'default');
        // Close log in modal
        jQuery('#loginModal').modal('hide');
      }).catch((err) => {
        this.set('errorMessages', err.errors || err);
      });
    } else {
      this.set('errorMessages',
        [{ title: 'Missing Info', detail: 'Your login or password is missing' }]);
    }
  },

  logOut() {
    this.store.unloadAll('user');
    this.set('user', {});
    this.session.invalidate();
    this.themeChanger.set('theme', 'default');
  },

  // Registration
  signUp(username, email, pw, fullname, contractor) {
    this.set('errorMessages', []);
    if (username && email && pw) {
      // Create new User record
      let newUser = this.store.createRecord('user', {
        email: email.trim(),
        username: username.trim(),
        password: pw // Do not trim password
      });
      let isContractor = false;
      if (contractor === 'broadcaster') {
        newUser.set('broadcaster', true);
        newUser.set('affiliate', true);
        isContractor = true;
      }
      if (contractor === 'developer') {
        newUser.set('developer', true);
        newUser.set('affiliate', true);
        isContractor = true;
      }
      if (contractor === 'affiliate') {
        newUser.set('affiliate', true);
        isContractor = true;
      }
      if (isContractor) {
        if (fullname) {
            newUser.set('fullName', fullname);
        } else {
          this.set('errorMessages',
            [{ title: 'Missing Info',
            detail: 'Please fill in all fields below to sign up' }]
          );
        }
      }
      // Submit new record to back-end
      newUser.save().then(() => {
        // Clean up
        this.set('errorMessages', []);
        this.set('signupSuccess', true);
      }).catch((err) => {
        // Save/sign-up failed
        newUser.deleteRecord();
        this.set('errorMessages', err.errors || err);
      });
    } else {
      // Fields missing
      this.set('errorMessages',
        [{ title: 'Missing Info',
        detail: 'Please fill in all fields below to sign up' }]
      );
    }
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
      return this.store.findRecord('user', userId).then((user) => {
        // Set data returned to currentUser.user
        this.set('user', user);
      }).catch((err) => {
        this.set('errorMessages', err.errors || err);
      });
    } else {
      return resolve();
    }
  },

  uploadIdentification(blob) {
    this.get('model.uploadedIdentification').pushObject({
      signed_id: blob.signedId,
      delete: false
    });
    // Attach upload to user account
    this.model.save().then( () => {
      console.log('model saved');
    }).catch( () => {
      console.log('model failed to save');
    });
  },

  deleteFile(file) {
    file.delete = true;
    // Set delete property to true on file, and save model to back-end to delete
    // file attachment and blob
    this.model.save().then( () => {
      console.log('model saved');
    }).catch( () => {
      console.log('model failed to save');
    });
  },

});
