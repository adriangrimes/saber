import Service from '@ember/service';
import { inject as service } from '@ember/service';
import { resolve } from 'rsvp';
import { later } from '@ember/runloop';

export default Service.extend({
  // Services
  session: service(),
  store: service(),
  notify: service(),
  errorHandler: service(),

  signupSuccess: false,
  readyForConversationLoad: true,
  readyForCreditLoad: true,
  openCreditDropdown: function() {}, //populated by dropdown-shim component
  openLoginDropdown: function() {}, //populated by dropdown-shim component

  // Main login function
  logIn(identification, password) {
    if (identification && password) {
      // Submit authentication parameters to back-end
      this.session
        .authenticate('authenticator:devise', identification.trim(), password)
        .catch(err => {
          console.log('error logging in', err);
          this.errorHandler.handleWithNotification(err);
        });
    } else {
      this.notify.error('Your login or password is missing');
    }
  },

  logOut() {
    // invalidate() causes a page refresh, which should finish the clean up and
    // logout process
    this.session.invalidate();
  },

  // Registration
  signUp(username, email, pw, fullname, contractorType, captchaResponse) {
    if (!captchaResponse) {
      this.notify.error("You must prove you're not a robot to continue.");
      return;
    }
    if (username && email && pw) {
      // Construct new user record
      let newUser = this.store.createRecord('user', {
        email: email.trim(),
        username: username.trim(),
        password: pw, // Do not trim password
        captchaResponse: captchaResponse
      });
      let isContractor = false;
      if (contractorType === 'broadcaster') {
        newUser.set('broadcasterSignup', true);
        isContractor = true;
      }
      if (contractorType === 'developer') {
        newUser.set('developerSignup', true);
        isContractor = true;
      }
      if (contractorType === 'affiliate') {
        newUser.set('affiliateSignup', true);
        isContractor = true;
      }
      if (isContractor) {
        if (fullname) {
          newUser.set('fullName', fullname);
        } else {
          this.notify.error('Please fill in all fields below to sign up.');
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
      this.notify.error('Please fill in all fields below to sign up.');
    }
  },

  load(options = { forceReloadMessages: true }) {
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
          this.loadMessages({ forceReload: options.forceReloadMessages });
        })
        .catch(err => {
          this.errorHandler.handleWithNotification(err);
        });
    } else {
      return resolve();
    }
  },

  loadMessages(options = { forceReload: true }) {
    if (this.get('readyForConversationLoad') || options.forceReload) {
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
