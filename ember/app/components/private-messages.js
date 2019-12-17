import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  session: service(),
  store: service(),
  currentUser: service(),
  errorHandler: service(),

  currentPage: 1,
  noMoreHistory: false,
  sendDisabled: false,

  init() {
    this._super(...arguments);
    this.privateMessages = [];
    this.currentUsername = this.session.data.authenticated.username;
    if (this.toUser) {
      this.selectedUser = this.toUser;
    }
    if (this.selectedUser) {
      this.send('openMessages', this.selectedUser);
    }
  },

  didInsertElement() {
    this.element.querySelector('#messageInputBox').focus();
  },

  didUpdateAttrs() {
    this.element.querySelector('#messageInputBox').focus();
  },

  actions: {
    openMessages(fromUser) {
      let that = this;
      this.set('currentPage', 1);
      this.store
        .query('private-message', {
          id: this.get('session.data.authenticated.user_id'),
          with: fromUser,
          page: 1
        })
        .then(messages => {
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
          if (isEmpty(messages)) {
            that.set('noMoreHistory', true);
          } else if (refreshSameUser) {
            that.set('privateMessages', messages.toArray());
          } else {
            that.get('privateMessages').unshiftObjects(messages.toArray());
          }
          that.currentUser.loadMessages();
          console.log('opening messages from ' + fromUser);
        })
        .catch(err => {
          console.log('failed to get private messages:', err);
          this.errorHandler.handleWithNotification(err);
        });
    },

    openNewMessage() {
      this.set('privateMessages', []);
      this.set('inputReciever', '');
      this.set('selectedUser', '');
      this.set('currentPage', 1);
      this.set('noMoreHistory', false);
    },

    sendDM() {
      console.log('sending message');
      this.set('sendDisabled', true);
      let privateMessage = this.store.createRecord('private-message', {
        fromUser: this.get('session.data.authenticated.username'),
        toUser: this.get('inputReciever'),
        message: this.get('inputMessage').trim()
      });
      privateMessage
        .save()
        .then(() => {
          console.log('record saved');
          this.store
            .query('private-message', {
              id: this.get('session.data.authenticated.user_id'),
              with: this.get('inputReciever'),
              page: 1
            })
            .then(messages => {
              this.set('privateMessages', messages.toArray());
              this.set('selectedUser', this.get('inputReciever'));
              this.set('inputMessage', '');
              this.set('noMoreHistory', false);
              this.set('sendDisabled', false);
              this.set('currentPage', 1);
              this.currentUser.loadMessages();
            })
            .catch(err => {
              this.set('sendDisabled', false);
              this.errorHandler.handleWithNotification(err);
            });
        })
        .catch(err => {
          console.log('caught error: ' + err);
          this.set('sendDisabled', false);
          privateMessage.rollbackAttributes();
          this.errorHandler.handleWithNotification(err);
        });
    },

    loadOlderMessages() {
      this.incrementProperty('currentPage');
      this.store
        .query('private-message', {
          id: this.get('session.data.authenticated.user_id'),
          with: this.get('inputReciever'),
          page: this.currentPage
        })
        .then(messages => {
          if (isEmpty(messages)) {
            this.set('noMoreHistory', true);
            this.decrementProperty('currentPage');
          } else {
            this.get('privateMessages').unshiftObjects(messages.toArray());
          }
          this.set('selectedUser', this.get('inputReciever'));
          this.set('inputMessage', '');
          this.currentUser.loadMessages();
        })
        .catch(err => {
          console.log('failed to load older messages:', err);
          this.errorHandler.handleWithNotification(err);
        });
    }
  }
});
