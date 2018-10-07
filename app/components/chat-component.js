import Component from '@ember/component';
import { inject as service } from '@ember/service';
import $ from 'jquery';

// use the prompt code instead of hard coded variables to enter the username or id at the launch of the webpage.
var messageLimitTime = 5000;
var messageLimitNumber = 2;
var isSlowChat = false;
var lastMessageSent = 0;
var recentMessages = 0;

export default Component.extend({
  websockets: service(),
  userOptionsMenuId: 0,

  //sets up websockets
  init: function() {
    this._super(...arguments);

    var socket = this.get('websockets').socketFor('ws://localhost:7000/');
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);
  },

  actions:{

    // User wants to send a message so...
    sendUserMessage: function() {
      var currentTime = Date.now();
      // if its not blank
      if (usermsg.value !== '') {
        // if its not too soon
        if (recentMessages > messageLimitNumber && lastMessageSent+messageLimitTime > currentTime) {
          if (isSlowChat) {
            $this('#messages').append('<li><b>Slow Chat is enabled. Please wait a while before trying again.</b></li>');
          } else {
            $('#messages').append('<li><b>You are sending messages too fast, wait a moment and try again.</b></li>');
          }
          $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight);
        } else if (recentMessages > 0 && lastMessageSent+messageLimitTime < currentTime) {
          recentMessages = 0;
        } else {
          if (lastMessageSent+messageLimitTime < currentTime) {
            lastMessageSent = currentTime;
          }
          // then you can send the message to the server
          var socket = this.get('websockets').socketFor('ws://localhost:7000/');
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

    setUserOptionsTooltip(id) {
      console.log("setUserOptionsTooltip " + id);
      this.set('userOptionsMenuId', id);
    },

    // switches between the 3 tabs at the top of the chat panel
    openChatTab: function() {
      $(this).tab('show');
    },

  }, // End actions

  myOpenHandler: function(/*event*/) {
    //This message shown on entering the chat room
    $('#messages').append('<li><b>Welcome to the Chat! Playing Super Cheese Time today Woohoo!</b></li>');

    // this code sends the new user info to the server
    var socket = this.get('websockets').socketFor('ws://localhost:7000/');

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
  myMessageHandler: function(event) {
    var messageToDisplay = JSON.parse(event.data);
    //if it's a new user add them to the users list and annouce their joining to the chatroom
    if (messageToDisplay.type === "userName") {
      console.log(messageToDisplay);
      $('#messages').append('<li>'+messageToDisplay.chatUserName+' has joined the chat</li>');
      $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight);
      //if a change has been made to the users list, wipe the local one and replace it with the new list
    } else if (messageToDisplay.type === "userlist") {
      $('#users').empty();
      console.log(messageToDisplay.data);
      // Sort users alphabetically
      messageToDisplay.data.sort(function(a, b) {
        var m1 = a.username.toLowerCase();
        var m2 = b.username.toLowerCase();
        if(m1 < m2) return -1;
        if(m1 > m2) return 1;
        return 0;
      })
      // Display them
      messageToDisplay.data.forEach(function(user){
        console.log(user)
        $('#users').append('<li>'+user.username+'</li>');
      });
    } else {
      // All other message types are actual chat messages
      //Below is the partially functioning code. it successfully opens the #userOptionsMenu accordion object, but does not pass it any data currently  data-userId= is not read by any other part of the code right now.
      $('#messages').append('<li><b><span class="collapsed btn-default" data-toggle="collapse" data-target="#userOptionsMenu" data-userId="'+messageToDisplay.userId+'" type="button">'+messageToDisplay.chatUserName+':</span></b> '+messageToDisplay.message+'</li>');

      //Try {{#each}} in template and .push ing messages into an array to allow templates to render
      //See https://guides.emberjs.com/release/templates/displaying-a-list-of-items/ !!!

      //Below is the functional stand in code. Clicking the username links to the users profile. Default userId is 111, Default userName is testUser
      //$('#messages').append('<li><b><a href="/p/'+messageToDisplay.userId+'">'+messageToDisplay.chatUserName+':</a></b> '+messageToDisplay.message+'</li>');

      // scrolls the chat when a new message is posted
      $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight);
    }
  },

  // If Websocket connection has been closed, but the user is still on the page
  myCloseHandler: function(/*event*/){
    $('#messages').append('<li><b>Chat connection was lost. Please refresh the page.</b></li>');
    $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight);
  },

  willDestroyElement() {
    this.get('websockets').closeSocketFor('ws://localhost:7000/');
  },
});
