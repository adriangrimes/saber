import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';
import $ from 'jquery';

export default Service.extend({

  session: service(),
  store: service(),
  themeChanger: service(),

  signupSuccess: false,

  // All other user data is at {{currentUser.user.fullName}} etc.
  // Computed properties dont seem to like being anything but top level
  isContracted: computed('user.{broadcaster,developer,affiliate}', function() {
    if (this.get('user.broadcaster') === true || this.get('user.developer') === true || this.get('user.affiliate') === true) {
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
    this.errorMessage = [];
  },

  load() {
    console.log('currentUser.load()');
    console.log('user_id: ' + this.get('session.data.authenticated.user_id'));
    let userId = this.get('session.data.authenticated.user_id');
    if (!isEmpty(userId)) {
      return this.get('store').findRecord('user', userId).then((user) => {
        this.set('user', user); // Set data returned in user record to currentUser.user
      });
    } else {
      return resolve();
    }
  },

  // Main login function
  logIn(identification, password) {

    if (identification && password) {
      console.log('starting currentUser.logIn() function');
      // Submit authentication parameters to api server
      this.get('session').authenticate('authenticator:devise', identification, password).then(() => {
        // Now that we're authenticated, request user data from api server
        console.log('session authenticated');
        console.log(this.get('session.data'));
        return this.get('store').findRecord('user', this.get('session.data.authenticated.user_id'));
      }).then((user) => {
        console.log("login authenticate");
        // Set theme to dark if true, otherwise default theme
        this.get('themeChanger').set('theme', user.darkMode ? 'dark' : 'default');
        console.log('Session successfully authenticated for: ' + this.get('session.data.authenticated.username'));
        $('#loginModal').modal('hide'); //close log in modal
      }).catch((err) => {
        this.set('errorMessage', []);
        console.log('error loading session data');
        this.set('errorMessage', err.error || err);
      });
    } else {
      this.set('errorMessage', [{
                 title:  'Missing Info',
                 detail: 'Your login or password is missing.'
              }]);
    }
  },

  signUp(user, email, pw, pwconfirm) {
    if (email && user && pw) {
      if (pw === pwconfirm) {
        let newUser = this.get('store').createRecord('user', {
          email: email,
          username: user,
          password: pw,
          passwordConfirmation: pwconfirm
        });
        console.log('before sign up POST');
        newUser.save().then(() => {
          console.log('signup success');
          this.set('errorMessage', null);
          this.set('signupSuccess', true);
        }).catch((err) => {
          this.set('errorMessage', err.errors || err);
        });
        //Ember.$('#loginModal').modal('hide'); //close log in modal
      } else {
        console.log('setting error passwords do not match');
        this.set('errorMessage', [{ title: 'Passwords',
                                    detail: 'Passwords do not match.' }]
        );
      }
    } else {
      console.log('setting error no info');
      this.set('errorMessage', [{ title: 'Missing Info',
                                  detail: 'Please enter the information below to sign up.' }]
      );
    }
  },

  logOut() {
    this.get('session').invalidate();
    this.get('store').unloadAll('user');
    this.set('user', {});
    this.get('themeChanger').set('theme', 'default');
    console.log("logged out");
  },

});
