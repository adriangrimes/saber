import Component from '@ember/component';
import { inject } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  session: inject(),
  store: inject(),
  currentUser: inject(),

  currentPage: 1,
  noMoreHistory: false,
  sendDisabled: false,

  init() {
    this._super(...arguments);
    this.set(
      'currentUsername',
      this.get('session.data.authenticated.username')
    );
    this.set('privateMessages', []);
    if (this.selectedUser) {
      this.send('openMessages', this.selectedUser);
    }
  },

  actions: {
    openMessages(fromUser) {
      let refreshSameUser = false;
      if (this.get('selectedUser') == fromUser) {
        refreshSameUser = true;
      } else {
        this.set('privateMessages', []);
      }
      this.set('noMoreHistory', false);
      this.set('selectedUser', fromUser);
      this.set('inputReciever', fromUser);
      this.set('inputMessage', '');
      this.set('currentPage', 1);
      let that = this;
      this.store
        .query('private-message', {
          id: this.get('session.data.authenticated.user_id'),
          with: fromUser,
          page: this.currentPage
        })
        .then(function(messages) {
          if (isEmpty(messages)) {
            that.set('noMoreHistory', true);
          } else if (refreshSameUser) {
            that.set('privateMessages', messages.toArray());
          } else {
            that.get('privateMessages').unshiftObjects(messages.toArray());
          }
          that.currentUser.set('errorMessages', []);
          that.currentUser.loadMessages();
          console.log('opening messages from ' + fromUser);
        });
    },

    openNewMessage() {
      this.set('privateMessages', []);
      this.set('inputReciever', '');
      this.set('selectedUser', '');
      this.set('currentPage', 1);
      this.set('noMoreHistory', false);
      this.currentUser.set('errorMessages', []);
    },

    sendDM() {
      console.log('sending message');
      this.currentUser.set('errorMessages', []);
      this.set('sendDisabled', true);
      let that = this;
      let privateMessage = this.store.createRecord('private-message', {
        fromUser: this.get('session.data.authenticated.username'),
        toUser: this.get('inputReciever'),
        message: this.get('inputMessage').trim()
      });
      privateMessage
        .save()
        .then(() => {
          console.log('record saved');
          that.store
            .query('private-message', {
              id: that.get('session.data.authenticated.user_id'),
              with: that.get('inputReciever'),
              page: 1
            })
            .then(function(messages) {
              that.set('privateMessages', messages.toArray());
              that.set('selectedUser', that.get('inputReciever'));
              that.set('inputMessage', '');
              that.set('noMoreHistory', false);
              that.set('sendDisabled', false);
              that.currentUser.loadMessages();
            })
            .catch(function(err) {
              that.set('sendDisabled', false);
              that.currentUser.set('errorMessages', err.errors);
            });
        })
        .catch(function(err) {
          that.set('sendDisabled', false);
          privateMessage.rollback();
          that.currentUser.set('errorMessages', err.errors);
          console.log('caught error: ' + err);
        });
    },

    loadOlderMessages() {
      let that = this;
      this.incrementProperty('currentPage');
      this.currentUser.set('errorMessages', []);
      this.store
        .query('private-message', {
          id: that.get('session.data.authenticated.user_id'),
          with: that.get('inputReciever'),
          page: that.currentPage
        })
        .then(function(messages) {
          if (isEmpty(messages)) {
            that.set('noMoreHistory', true);
          } else {
            that.get('privateMessages').unshiftObjects(messages.toArray());
          }
          that.set('selectedUser', that.get('inputReciever'));
          that.set('inputMessage', '');
          that.currentUser.loadMessages();
        });
    }
  }
});
