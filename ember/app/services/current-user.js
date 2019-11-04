import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';
import jQuery from 'jquery';
import { later } from '@ember/runloop';

export default Service.extend({
  // Services
  session: service(),
  store: service(),
  notify: service(),
  errorHandler: service(),
  themeChanger: service(),

  signupSuccess: false,
  readyForConversationLoad: true,

  init() {
    this._super(...arguments);
    this.errorMessages = [];
  },

  // Main login function
  logIn(identification, password) {
    if (identification && password) {
      // Submit authentication parameters to back-end
      this.session
        .authenticate('authenticator:devise', identification.trim(), password)
        .then(() => {
          // Now that we have a token, request user data from back-end
          return this.store.findRecord(
            'user',
            this.get('session.data.authenticated.user_id')
          );
        })
        .then(user => {
          console.log('heeloo darkmode:', user.darkMode);
          // Set theme to dark if true, otherwise default theme
          this.themeChanger.set('theme', user.darkMode ? 'dark' : 'default');
          // Close log in modal
          jQuery('#loginModal').modal('hide');
        })
        .catch(err => {
          console.log('error logging in', err);
          this.errorHandler.handleWithNotification(err);
        });
    } else {
      this.notify.error('Your login or password is missing');
    }
  },

  logOut() {
    this.themeChanger.set('theme', 'default');
    // invalidate() causes a page refresh, which should remove all data from
    // the store as well
    this.session.invalidate();
  },

  // Registration
  signUp(username, email, pw, fullname, contractorType) {
    if (username && email && pw) {
      // Construct new User record
      let newUser = this.store.createRecord('user', {
        email: email.trim(),
        username: username.trim(),
        password: pw // Do not trim password
      });
      let isContractor = false;
      if (contractorType === 'broadcaster') {
        newUser.set('broadcaster', true);
        newUser.set('affiliate', true);
        isContractor = true;
      }
      if (contractorType === 'developer') {
        newUser.set('developer', true);
        newUser.set('affiliate', true);
        isContractor = true;
      }
      if (contractorType === 'affiliate') {
        newUser.set('affiliate', true);
        isContractor = true;
      }
      if (isContractor) {
        if (fullname) {
          newUser.set('fullName', fullname);
        } else {
          this.notify.error('Please fill in all fields below to sign up');
        }
      }
      // Submit new record to back-end
      newUser
        .save()
        .then(() => {
          this.get('notify').success(
            'Account created! Check your email to confirm and activate your account.'
          );
        })
        .catch(err => {
          // Save/sign-up failed
          console.log('registration failed', err);
          this.errorHandler.handleWithNotification(err);
          newUser.rollbackAttributes();
        });
    } else {
      // Fields missing
      this.notify.error('Please fill in all fields below to sign up');
    }
  },

  load() {
    if (this.session.isAuthenticated) {
      console.log(
        'currentUser.load() user_id: ' +
          this.get('session.data.authenticated.user_id')
      );
      return this.store
        .findRecord('user', this.session.data.authenticated.user_id)
        .then(user => {
          // Set data returned to currentUser.user
          this.set('user', user);
          this.loadMessages();
        })
        .catch(err => {
          this.errorHandler.handleWithNotification(err);
        });
    } else {
      return resolve();
    }
  },

  loadMessages(forceReload = true) {
    if (this.get('readyForConversationLoad') || forceReload) {
      this.set('readyForConversationLoad', false);
      console.log('loading conversations for unread messages');
      this.store
        .query('conversation', {
          id: this.get('session.data.authenticated.user_id')
        })
        .then(conversations => {
          this.set('conversations', conversations.toArray());
          let unreadCount = 0;
          conversations.forEach(function(conversation) {
            unreadCount += conversation.unread;
          });
          this.set('unreadMessages', unreadCount);
          later(
            this,
            function() {
              this.set('readyForConversationLoad', true);
            },
            10000
          );
        })
        .catch(err => {
          console.log('failed to load conversations:', err);
          this.errorHandler.handleWithNotification(err);
        });
    }
  }
});
