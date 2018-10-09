import { computed } from '@ember/object';
import Service from '@ember/service';
import { inject as service } from '@ember/service';
import $ from 'jquery';

export default Service.extend({

  store: service(),
  session: service(),
  themeChanger: service(),
  isOnline: true,
  userId: '',
  username: '',
  broadcaster: false,
  developer: false,
  affiliate: false,
  adminStatus: false,
  darkMode: false,
  isContracted: computed('broadcaster', 'developer', 'affiliate', function() {
    if (this.get('broadcaster') === true || this.get('developer') === true || this.get('affiliate') === true) {
      return true;
    } else {
      return false;
    }
  }),
  isPlayer: computed('isContracted', function() {
      return !this.get('isContracted');
  }),
  signupSuccess: false,

  init() {
    this._super(...arguments);
    console.log('At Login State Init session isAuthenticated: '+this.get('session.isAuthenticated'));

      if (this.get('session.isAuthenticated')) {
        console.log('setting up loginstate');
        return this.get('store').findRecord('user', this.get('session.data.authenticated.user_id'));
        this.set('broadcaster', user.data.broadcaster);
        this.set('developer', user.data.developer);
        this.set('affiliate', user.data.affiliate);
        this.set('darkMode', user.data.darkMode);
        console.log('At Login State Init user.data.darkMode: '+user.data.darkMode);

      }

      console.log('At Login State Init loginstate.darkMode: '+this.get('darkMode'))

  },

  // Main login function
  logIn(identification, password) {
    if (identification && password) {
      console.log('authenticate go!');

      // Submit authentication parameters to api server
      this.get('session').authenticate('authenticator:devise', identification, password).then(() => {
        // Now that we're authenticated, request user data from api server
        return this.get('store').findRecord('user', this.get('session.data.authenticated.user_id'));
      }).then((user) => {
        this.set('broadcaster', user.data.broadcaster);
        this.set('developer', user.data.developer);
        this.set('affiliate', user.data.affiliate);
        this.set('darkMode', user.data.darkMode);
        console.log('At Login State Log In loginstate.darkMode: '+this.get('darkMode'))


        // Set theme to dark if true, otherwise default theme
        this.get('themeChanger').set('theme', user.data.darkMode ? 'dark' : 'default');
        console.log('Session successfully authenticated for: ' + this.get('session.data.authenticated.username'));
        $('#loginModal').modal('hide'); //close log in modal
      }).catch((err) => {
        console.log('error loading session data');
        this.set('errorMessage', err.error || err);
      });
    } else {
      this.set('errorMessage',
              [{ title:  'Missing Info',
                 detail: 'Your login or password is missing.' }]
      );
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
    this.set('loggedIn', false);
    this.set('userId', '');
    this.set('username', '');
    this.set('broadcaster', false);
    this.set('developer', false);
    this.set('adminStatus', false);
    this.get('themeChanger').set('theme', 'default');

    console.log("logged out");
  },

});
