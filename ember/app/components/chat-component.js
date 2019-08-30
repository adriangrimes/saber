import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { once } from '@ember/runloop';
import jQuery from 'jquery';
import config from '../config/environment';

let socket; // Global socket var TODO: determine if it is 'safe' to have global ember vars

export default Component.extend({
  websockets: service(),
  store: service(),

  chatUserMenuUsername: '',
  userMessage: '',
  chatUserMenu: 'd-none',

  actions: {
    // User wants to send a message so...
    sendUserMessage() {
      console.log('sendUserMessage()');
      let userMessage = this.get('userMessage'); //.trim();
      // if its not blank
      if (userMessage !== '') {
        // then you can send the message to the server
        var messageToSend = JSON.stringify({
          type: 'ChatMessage',
          data: userMessage
        });
        socket.send(messageToSend);
        console.log('message sent to socket');
      }
      // Empty chat input field after sending
      this.set('userMessage', '');
    },

    openChatUserMenu(event) {
      var menuYPos = event.pageY - jQuery('#chat-panel').offset().top + 14;
      jQuery('#chatUserMenu').css({ top: menuYPos });
      // Username of clicked name
      this.set('chatUserMenuUsername', event.srcElement.textContent);
      this.set('chatUserMenu', 'd-inline-block');
    },

    closeChatUserMenu() {
      this.set('chatUserMenu', 'd-none');
    },

    getChannelChatUserList() {
      console.log('getting ChannelChatUserList');
      socket.send(
        JSON.stringify({
          type: 'ChannelChatUserList'
        })
      );
    },

    updateChannelTopic() {
      if (this.get('session.isAuthenticated')) {
        console.log('updateChannelTopic()');
        let channelTopic = this.get('channelTopic');
        this.store
          .queryRecord('user-public-datum', {
            username: this.get('session.data.authenticated.username')
          })
          .then(function(userPublicDatum) {
            userPublicDatum.set('channelTopic', channelTopic);
            userPublicDatum
              .save()
              .then(function() {
                socket.send(
                  JSON.stringify({
                    type: 'ChannelTopicUpdated'
                  })
                );
              })
              .catch(function(err) {
                // save failed
                console.log(err);
              });
          })
          .catch(err => {
            // query failed
            console.log(err);
          });
      }
    },

    blockUser() {
      console.log('You blocked ' + this.get('chatUserMenuUsername'));
    },

    sendPrivateMessage() {
      console.log(
        'You opened Private Messages with ' + this.get('chatUserMenuUsername')
      );
    }
  }, // End actions

  // Initialize chat-component
  init() {
    this._super(...arguments);

    // Store chat messages in array of objects
    this.chatMessagesList = [];
    this.chatUsersList = [];
    this.chatChannelFullUrl = `${config.chatServer}/` + this.get('chatChannel');

    this.startChatConnection();
  },

  startChatConnection() {
    // Display connection starting message
    this.set('chatMessagesList', [
      {
        data: '[connecting to chat...]',
        systemMessage: true
      }
    ]);
    if (this.get('session.isAuthenticated')) {
      // If user is logged in, set Authorization header and post to chat_ticket
      // route. Valid credentials are required to create a chat ticket
      let { email, token, user_id } = this.get('session.data.authenticated');
      let self = this;
      let jqxhr = jQuery
        .post({
          url: `${config.apiHost}/chat_tickets`,
          dataType: 'json',
          data: { id: user_id },
          headers: { Authorization: `Token token="${token}", email="${email}"` }
        })
        .done(function() {
          console.log('chat ticket created successfully');
          // Connect to chat server now that a ticket has been made to allow the
          // verified user to chat
          self.createChatConnection(self.get('chatChannelFullUrl'));
        })
        .fail(function() {
          console.log('failed to create chat ticket with ' + jqxhr.status);
        });
    } else {
      // Else just connect to the socket without a ticket to connect as a guest
      // with read only
      this.createChatConnection(this.get('chatChannelFullUrl'));
    }
  },

  createChatConnection(url) {
    // Set up websocket
    console.log('setting up websocket');
    socket = this.websockets.socketFor(url);
    socket.on('open', this.onSocketOpened, this);
    socket.on('message', this.onMessageRecieved, this);
    socket.on('close', this.onSocketClosed, this);
  },

  onSocketOpened: function(/*event*/) {
    console.log('socket opened');
    this.set('chatUsersList', []);
    // Add 2 messages on new chat connection. Connection confirm, and the
    // current topic.
    this.set('chatMessagesList', []);
    this.chatMessagesList.pushObject({
      data: '[connected to chat]',
      systemMessage: true
    });
    if (this.model.channelTopic) {
      this.chatMessagesList.pushObject({
        data: 'Topic: ' + this.model.channelTopic,
        systemMessage: true
      });
    }
  },

  // when a message is received from the server
  onMessageRecieved: function(event) {
    console.log('onMessageRecieved event');
    console.log(event);

    // Parse message event object
    var message;
    if (typeof event.data !== 'object') {
      message = JSON.parse(event.data);
    } else {
      message = event.data;
    }
    console.log(message);

    let that = this;
    // Take an action based on message type
    switch (message.type) {
      case 'ChatMessage':
        console.log('message.type = ChatMessage');
        this.chatMessagesList.pushObject({
          chatUsername: message.chatUsername,
          data: ': ' + message.data
        });
        break;
      case 'UserJoinedChannel':
        console.log('message.type = UserJoinedChannel');
        // Dont show user join message to the user who joined
        if (message.data != this.get('session.data.authenticated.username')) {
          this.chatMessagesList.pushObject({
            chatUsername: message.data,
            data: ' has joined the chat!'
          });
        }
        break;
      case 'ChannelChatUserList':
        console.log('message.type  = ChannelChatUserList');
        this.set('chatUsersList', message.data);
        this.set('chatUsersListGuestCount', message.guests);
        break;
      case 'ChannelTopicUpdated':
        console.log('message.type = ChannelTopicUpdated');
        this.store
          .queryRecord('user-public-datum', {
            username: that.get('model.username')
          })
          .then(function(user) {
            that.chatMessagesList.pushObject({
              data: user.channelTopic,
              topicMessage: true
            });
          })
          .catch(function(err) {
            // query failed
            console.log(err);
          });

        break;
      case 'ChannelUserCountUpdated':
        console.log('message.type = ChannelUserCountUpdated');
        this.set('chatChannelUserCount', message.data);
        break;
      case 'StreamState':
        console.log('message.type = StreamState');
        console.log(message.data);
        this.changeStreamState(message.data);
        break;
      default:
        // Do nothing
        break;
    }
    console.log('onMessageRecieved event end');
  },

  // If chat/WebSocket connection has been closed, but the user is still on the page
  onSocketClosed: function(/*event*/) {
    console.log('socket closed');
    this.chatMessagesList.pushObject({
      data: 'Chat connection was lost. Please refresh to reconnect.',
      systemMessage: true
    });
  },

  // When a transition occurs or page is closed
  willDestroyElement() {
    console.log('willDestroyElement()');
    console.log(this.get('chatChannelFullUrl'));
    this.websockets.closeSocketFor(this.get('chatChannelFullUrl'));
    console.log('closed socket?');
    this._super(...arguments);
  },

  didRender() {
    this._super(...arguments);
    // Scroll chat to bottom when a message is added to chatMessagesList
    // (via template re-render)
    once(this, function() {
      jQuery('#chat-body').scrollTop(jQuery('#chat-body')[0].scrollHeight);
    });
  }
});
