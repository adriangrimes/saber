import Controller from '@ember/controller';
import { inject } from '@ember/service';

export default Controller.extend({
  session: inject(),

  init() {
    this._super(...arguments);
    this.currentUsername = this.get('session.data.authenticated.username');
  },

  setupConversationList(model) {
    let conversations = {};
    let that = this;
    model.forEach(function(message) {
      if (message.fromUser != that.get('currentUsername')) {
        conversations[message.fromUser] = conversations[message.fromUser] || {};
        // conversations[message.fromUser].messages =
        //   conversations[message.fromUser].messages || [];
        // conversations[message.fromUser].messages.push(message);
      } else if (message.toUser != that.get('currentUsername')) {
        conversations[message.toUser] = conversations[message.toUser] || {};
        // conversations[message.toUser].messages =
        //   conversations[message.toUser].messages || [];
        // conversations[message.toUser].messages.push(message);
      }
    });
    this.set('conversations', conversations);
  },

  actions: {
    openMessages(fromUser) {
      // this.store.unloadAll('private-mesfsage');
      this.set('selectedUser', fromUser);
      this.set('inputReciever', fromUser);
      this.set('inputMessage', '');
      // this.set('model', '');
      let that = this;
      this.store
        .query('private-message', {
          id: this.get('session.data.authenticated.user_id'),
          with: fromUser
        })
        .then(function(messages) {
          that.set('model', messages);
          console.log('opening messages from ' + fromUser);
          that.setupConversationList(messages);
        });
    },

    openNewMessage() {
      this.set('inputReciever', '');
      this.set('selectedUser', '');
    },

    sendDM() {
      console.log('sending message');
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
              with: that.get('inputReciever')
            })
            .then(function(messages) {
              that.set('model', messages);
              that.setupConversationList(messages);
              that.set('selectedUser', that.get('inputReciever'));
              that.set('inputMessage', '');
            });
        })
        .catch(err => {
          privateMessage.rollback();
          console.log('caught error: ' + err);
        });
    }
  }
});
