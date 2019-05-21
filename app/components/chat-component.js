import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { once } from '@ember/runloop';
import jQuery from 'jquery';
import config from '../config/environment';

// Use the prompt code instead of hard coded variables to enter the username or
// id at the launch of the webpage.
let socket; // Global socket var
// let chatChannelFullUrl = '';
//var userChatMenuIsOpen = false;

export default Component.extend({
  websockets: service(),

  chatUserMenuUserId: 0,
  chatUserMenuUserName: '',
  userMessage: '',

  // Initialize chat-component
  init() {
    this._super(...arguments);

    // Store chat messages in array of objects
    this.chatMessagesList = [];
    this.chatUsersList = [];
    this.chatChannelFullUrl = `${config.chatServer}/` + this.get('chatChannel');

    this.startChatConnection();
  },

  actions: {
    // User wants to send a message so...
    sendUserMessage() {
      let userMessage = this.get('userMessage').trim();
      // console.log(userMessage);
      console.log('sendUserMessage hit');
      // if its not blank
      if (userMessage !== '') {
        // then you can send the message to the server
        var messageToSend = JSON.stringify({
          type: 'chatMessage',
          data: userMessage
        });
        socket.send(messageToSend);
        console.log('message sent to socket');
      }
      this.set('userMessage', '');
      console.log('set userMessage to ""');
    },

    openChatUserMenu(event) {
      var menuYPos = event.pageY - jQuery('#chat-panel').offset().top + 14;
      jQuery('#chatUserMenu').css({ top: menuYPos });
      // Username of clicked name
      this.set('chatUserMenuUserName', event.srcElement.textContent);
      jQuery('#chatUserMenu').removeClass('d-none');
      jQuery('#chatUserMenu').addClass('d-inline-block');
    },

    closeChatUserMenu() {
      jQuery('#chatUserMenu').removeClass('d-inline-block');
      jQuery('#chatUserMenu').addClass('d-none');
    },

    blockUser(user) {
      console.log('You blocked ' + user);
    },
    sendPrivateMessage(user) {
      console.log('You opend Private Messages with ' + user);
    }
  }, // End actions

  onSocketOpened: function(/*event*/) {
    this.set('chatUsersList', []);
    //This message shown on entering the chat room
    this.chatMessagesList.pushObject({
      message: 'Welcome to the Chat! Playing Super Cheese Time today Woohoo!',
      systemMessage: true
    });

    console.log('socket opened');

    if (this.get('session.isAuthenticated')) {
      console.log('session authenticated');
      var nameToBroadcast = JSON.stringify({
        type: 'userName',
        chatUserName: this.get('session.data.authenticated.username'),
        userId: this.get('session.data.authenticated.user_id')
      });

      socket.send(nameToBroadcast);
    }
  },

  // when a message is received from the server
  onMessageRecieved: function(event) {
    console.log('onMessageRecieved event');
    var messageToDisplay = JSON.parse(event.data);

    // console.log(messageToDisplay);
    // If it's a new user add them to the users list and annouce their joining
    // to the chatroom
    if (messageToDisplay.type === 'userName') {
      // console.log(messageToDisplay);
      console.log('userName joined');
      this.chatMessagesList.pushObject({
        chatUserName: messageToDisplay.chatUserName,
        userId: messageToDisplay.userId,
        message: '  has joined the chat!'
      });
      //if a change has been made to the users list, wipe the local one and
      // replace it with the new list
    } else if (messageToDisplay.type === 'userlist') {
      console.log('refresh users list');
      this.set('chatUsersList', []);

      // Sort users alphabetically
      messageToDisplay.data.sort(function(a, b) {
        var m1 = a.username.toLowerCase();
        var m2 = b.username.toLowerCase();
        if (m1 < m2) return -1;
        if (m1 > m2) return 1;
        return 0;
      });

      // Display them
      var chatUserListArray = this.chatUsersList;
      messageToDisplay.data.forEach(function(user) {
        chatUserListArray.pushObject({
          chatUserName: user.username,
          userId: user.id
        });
      });
    } else {
      console.log('add message to chat');
      // All other message types are actual chat messages
      this.chatMessagesList.pushObject({
        chatUserName: messageToDisplay.chatUserName,
        userId: messageToDisplay.userId,
        message: ': ' + messageToDisplay.message
      });
    }
  },

  // If Websocket connection has been closed, but the user is still on the page
  onSocketClosed: function(/*event*/) {
    this.chatMessagesList.pushObject({
      message: 'Chat connection was lost. Please refresh the page.',
      systemMessage: true
    });
  },

  startChatConnection() {
    if (this.get('session.isAuthenticated')) {
      this.createAuthenticatedChatConnection(this.get('chatChannelFullUrl'));
    } else {
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

  createAuthenticatedChatConnection(url) {
    // Set Authorization header and post to chat_ticket route
    let { email, token, user_id } = this.get('session.data.authenticated');
    let authData = `Token token="${token}", email="${email}"`;
    let self = this;
    let jqxhr = jQuery
      .post({
        url: `${config.apiHost}/chat_tickets`,
        dataType: 'json',
        data: { id: user_id },
        headers: { Authorization: authData }
      })
      .done(function() {
        console.log('chat ticket created successfully');
        // Connect to chat server now that a ticket has been made to allow the
        // verified user to chat
        self.createChatConnection(url);
      })
      .fail(function() {
        console.log('failed to create chat ticket with ' + jqxhr.status);
      });
  },

  didRender() {
    this._super(...arguments);
    // Scroll chat to bottom when a message is added to chatMessagesList
    // (via template re-render)
    once(this, function() {
      jQuery('#chat-body').scrollTop(jQuery('#chat-body')[0].scrollHeight);
    });
  },

  willDestroyElement() {
    this.websockets.closeSocketFor(this.get('chatChannelFullUrl'));
    this._super(...arguments);
  }
});
