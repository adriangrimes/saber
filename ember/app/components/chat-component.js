import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { once, later } from '@ember/runloop';
import jQuery from 'jquery';
import config from '../config/environment';

export default Component.extend({
  websockets: service(),
  store: service(),

  classNames: ['h-100'],

  socketRef: null,

  chatUserMenuUsername: '',
  userMessage: '',
  chatUserMenuVisible: false,
  chatChannelUserCount: '-',
  chatOpen: true,

  actions: {
    // User wants to send a message so...
    sendUserMessage() {
      console.log('sendUserMessage()');
      let userMessage = this.get('userMessage').trim();
      // if its not blank
      if (userMessage) {
        // then you can send the message to the server
        var messageToSend = JSON.stringify({
          type: 'ChatMessage',
          data: userMessage
        });
        this.socketRef.send(messageToSend);
        console.log('message sent to socket');
      }
      // Empty chat input field after sending
      this.set('userMessage', '');
      this.element.querySelector('#chatMessageInput').focus();
    },

    openChatUserMenu(event) {
      var menuYPos = event.pageY - jQuery('#chat-body').offset().top + 14;
      jQuery('#chatUserMenu').css({ top: menuYPos });
      // Username of clicked name
      this.set('chatUserMenuUsername', event.srcElement.textContent);
      this.set('chatUserMenuVisible', true);
    },

    closeChatUserMenu() {
      this.set('chatUserMenuVisible', false);
    },

    chatTabSelect(openTab, tabName) {
      console.log('getting ChannelChatUserList');

      //open tab
      openTab(tabName);
      if (tabName == 'Chat') {
        this.set('chatOpen', true);
        console.log('chatOpen: ' + this.chatOpen);
      } else if (tabName == 'Users') {
        this.set('chatOpen', false);
        console.log('chatOpen: ' + this.chatOpen);
      }

      //get user getChannelChatUserList
      this.socketRef.send(
        JSON.stringify({
          type: 'ChannelChatUserList'
        })
      );
    },

    updateChannelTopic() {
      if (this.get('session.isAuthenticated')) {
        console.log('updateChannelTopic()');
        let channelTopic = this.get('channelTopic');
        let component = this;
        this.store
          .queryRecord('user-public-datum', {
            username: this.get('session.data.authenticated.username')
          })
          .then(function(userPublicDatum) {
            userPublicDatum.set('channelTopic', channelTopic);
            userPublicDatum
              .save()
              .then(function() {
                component.socketRef.send(
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
  didInsertElement() {
    console.log('didInsertElement()');
    this._super(...arguments);

    // Store chat messages in array of objects
    this.chatMessagesList = [];
    this.chatUsersList = [];
    this.chatChannelFullUrl = `${config.chatServer}/` + this.get('chatChannel');

    this.startChatConnection();
  },

  didRender() {
    this._super(...arguments);
    // Scroll chat to bottom when a message is added to chatMessagesList
    // (via template re-render)
    once(this, function() {
      if (jQuery('#chat-body')[0]) {
        jQuery('#chat-body').scrollTop(jQuery('#chat-body')[0].scrollHeight);
      }
    });
  },

  startChatConnection() {
    console.log('startChatConnection()');
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
    try {
      console.log('setting up websocket');
      const socket = this.websockets.socketFor(url);

      console.log('before websocket events');
      socket.on('open', this.onSocketOpened, this);
      socket.on('message', this.onMessageRecieved, this);
      socket.on('close', this.onSocketClosed, this);
      console.log('after websocket events');

      this.set('socketRef', socket);
    } catch (err) {
      console.log('error setting up websocket, closing:', err);
      this.websockets.closeSocketFor(this.get('chatChannelFullUrl'));
    }
  },

  onSocketOpened: function(event) {
    console.log('socket opened');

    // Make sure the user is still on the page by the time the socket has opened
    if (
      window.location.href.split('/').pop() == event.target.url.split('/').pop()
    ) {
      this.set('chatUsersList', []);
      this.set('chatMessagesList', []);
      // Add 2 messages on new chat connection. Connection confirm, and the
      // current topic.
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
    } else {
      console.log('user no longer on page, closing socket');
      event.target.close();
    }
  },

  // when a message is received from the server
  onMessageRecieved: function(event) {
    console.log('onMessageRecieved event');

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
        this.chatMessagesList.pushObject({
          chatUsername: message.chatUsername,
          data: message.data
        });
        break;
      case 'UserJoinedChannel':
        // Dont show user join message to the user who joined
        if (message.data != this.get('session.data.authenticated.username')) {
          this.chatMessagesList.pushObject({
            chatUsername: message.data,
            userJoin: true
          });
        }
        break;
      case 'ChannelChatUserList':
        this.set('chatUsersList', message.data);
        this.set('chatUsersListGuestCount', message.guests);
        break;
      case 'ChannelTopicUpdated':
        // Set a random delay of up to 2 seconds to query for the new topic, but
        // skip delay if they are a broadcaster
        var delay = Math.floor(Math.random() * 2000);
        if (this.currentUser.user && this.currentUser.user.broadcaster) {
          delay = 0;
        }
        later(
          this,
          function() {
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
          },
          delay
        );
        console.log(this.currentUser.user.broadcaster);
        break;
      case 'ChannelUserCountUpdated':
        this.set('chatChannelUserCount', message.data);
        break;
      case 'StreamState':
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
    this._super(...arguments);
    console.log(this.get('chatChannelFullUrl'));
    if (this.socketRef !== null) {
      this.websockets.closeSocketFor(this.get('chatChannelFullUrl'));
    }
    console.log('closing socket');
  }
});
