import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { once } from '@ember/runloop';
import jQuery from 'jquery';

// use the prompt code instead of hard coded variables to enter the username or id at the launch of the webpage.
var socket; // Global socket var
var messageLimitTime = 5000;
var messageLimitNumber = 2;
var isSlowChat = false;
var lastMessageSent = 0;
var recentMessages = 0;
//var userChatMenuIsOpen = false;

export default Component.extend({
  websockets: service(),
  chatUserMenuUserId: 0,
  chatUserMenuUserName: 'unspecified',
  // Initialize chat-component
  init: function() {
    this._super(...arguments);

    // Store chat messages in array of objects
    this.chatMessagesList = [];
    this.chatUsersList = [];

    socket = this.websockets.socketFor('ws://localhost:7000/');
    socket.on('open', this.onSocketOpened, this);
    socket.on('message', this.onMessageRecieved, this);
    socket.on('close', this.onSocketClosed, this);
  },

  actions: {

    // User wants to send a message so...
    sendUserMessage: function() {
      var currentTime = Date.now();
      var usermsg = jQuery('#usermsg')[0];
      // if its not blank
      if (usermsg.value !== '') {
        // if its not too soon
        if (recentMessages > messageLimitNumber && lastMessageSent+messageLimitTime > currentTime) {
          if (isSlowChat) {
            this.chatMessagesList.pushObject(
              { message: 'Slow Chat is enabled. Please wait a while before trying again.',
                systemMessage: true });
          } else {
            this.chatMessagesList.pushObject(
              { message: 'You are sending messages too fast, wait a moment and try again.',
                systemMessage: true });
          }
        } else if (recentMessages > 0 && lastMessageSent+messageLimitTime < currentTime) {
          recentMessages = 0;
        } else {
          if (lastMessageSent+messageLimitTime < currentTime) {
            lastMessageSent = currentTime;
          }
          // then you can send the message to the server
          var messageToSend = JSON.stringify({
            type: "chatMessage",
            data: usermsg.value
          });
          recentMessages += 1;
          usermsg.value = '';

          socket.send(messageToSend);
        }
      }
    },

    openChatUserMenu(event) {

      var menuYPos = (event.pageY - jQuery('#chat-panel').offset().top + 14);
      jQuery('#chatUserMenu').css({ 'top': menuYPos });
      this.set('chatUserMenuUserId', event.srcElement.attributes["data-user-id"].value); // User ID of clicked name
      this.set('chatUserMenuUserName', event.srcElement.attributes["data-user-name"].value); // User name of clicked name
      jQuery('#chatUserMenu').removeClass('d-none');
      jQuery('#chatUserMenu').addClass('d-inline-block');

    },

    closeChatUserMenu(){
       jQuery('#chatUserMenu').removeClass('d-inline-block');
       jQuery('#chatUserMenu').addClass('d-none');
    },

    blockUser(user){
      console.log("You blocked "+user);

    },
    sendPrivateMessage(user){
      console.log("You opend Private Messages with "+user);

    },

  }, // End actions

  onSocketOpened: function(/*event*/) {
    //This message shown on entering the chat room
    this.chatMessagesList.pushObject(
      { message: 'Welcome to the Chat! Playing Super Cheese Time today Woohoo!',
        systemMessage: true });

    if (this.get('session.isAuthenticated')) {
      var nameToBroadcast = JSON.stringify({
        type: "userName",
        chatUserName: this.get('session.data.authenticated.username'),
        userId: this.get('session.data.authenticated.user_id'),
      });

      socket.send(nameToBroadcast);
    }
  },

  // when a message is received from the server
  onMessageRecieved: function(event) {
    var messageToDisplay = JSON.parse(event.data);

    //if it's a new user add them to the users list and annouce their joining to the chatroom
    if (messageToDisplay.type === "userName") {
      console.log(messageToDisplay);
      this.chatMessagesList.pushObject(
        { chatUserName: messageToDisplay.chatUserName,
          userId: messageToDisplay.userId,
          message: '  has joined the chat!',
          });
      //if a change has been made to the users list, wipe the local one and replace it with the new list
    } else if (messageToDisplay.type === "userlist") {
      this.set('chatUsersList', []);

      // Sort users alphabetically
      messageToDisplay.data.sort(function(a, b) {
        var m1 = a.username.toLowerCase();
        var m2 = b.username.toLowerCase();
        if(m1 < m2) return -1;
        if(m1 > m2) return 1;
        return 0;
      })


      // Display them
      var chatUserListArray = this.chatUsersList;
      messageToDisplay.data.forEach(function(user){

        chatUserListArray.pushObject(
          { chatUserName: user.username,
            userId: user.id,
            });
      });

     } else {
      // All other message types are actual chat messages
      this.chatMessagesList.pushObject(
        { chatUserName: messageToDisplay.chatUserName,
          userId: messageToDisplay.userId,
          message: ': '+messageToDisplay.message });
    }
  },

  // If Websocket connection has been closed, but the user is still on the page
  onSocketClosed: function(/*event*/){
    this.chatMessagesList.pushObject(
      { message: 'Chat connection was lost. Please refresh the page.',
        systemMessage: true });
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
    this.websockets.closeSocketFor('ws://localhost:7000/');
  },
});
