import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import $ from 'jquery';

// use the prompt code instead of hard coded variables to enter the username or id at the launch of the webpage.
var thisUserName = "testUser"; // prompt('user name:');
var userID = 111;// prompt('user ID:');
var messageLimitTime = 5000;
var messageLimitNumber = 2;
var isSlowChat = false;
var lastMessageSent = 0;
var recentMessages = 0;

export default Controller.extend({

  isFavorite: false,
  websockets: service(),

  actions: {
    toggleFav(){
      this.toggleProperty('isFavorite');
    },
    submitmsg(){
      var clientmsg = this.$("#usermsg").val();
      this.$("#usermsg").val('');
      console.log(clientmsg);
      return false;
    },
    setupController: function(controller, model) {
      controller.set('user', model);
    },
    // user wants to send a message so...
    sendUserMessage: function() {
      var currentTime = Date.now();
      // if its not blank
      if (usermsg.value!==''){
        // if its not too soon
        if (recentMessages > messageLimitNumber && lastMessageSent+messageLimitTime > currentTime){
          if(isSlowChat){
            $this('#messages').append('<li><b>Slow Chat is enabled. Please wait a while before trying again.</b></li>');
          }else{
            $('#messages').append('<li><b>You are sending messages too fast, wait a moment and try again.</b></li>');
          }
          $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight);
        }else if (recentMessages > 0 && lastMessageSent+messageLimitTime < currentTime){
          recentMessages = 0;
        }else{
          if(lastMessageSent+messageLimitTime < currentTime){
            lastMessageSent = currentTime;
          }
          // then you can send the message to the server
          var socket = this.get('websockets').socketFor('ws://localhost:7000/');
          var messageToSend = JSON.stringify({
            type: "message",
            data: usermsg.value
          });
          socket.send(messageToSend);
          recentMessages +=1;
          usermsg.value = '';
        }
      }
    },
    //partial chat speed code. Working but client side only at the moment.
    switchChatSpeed: function(){
      var button = document.getElementById("slowChatButton");
      if(isSlowChat){
        isSlowChat = false;
        messageLimitTime = 5000;
        messageLimitNumber = 2;
        button.innerHTML  = "Enable Slow Chat";
      }else{
        isSlowChat = true;
        messageLimitTime = 30000;
        messageLimitNumber = 0;
        button.innerHTML  = "Disable Slow Chat";
      }
    },
    // switches between the 3 tabs at the top of the chat panel
    openChatTab: function() {
      $(this).tab('show');
    },
  },

  //sets up websockets
  init: function() {
    this._super();
    this.tags = ['dragons','dungeons','wednesday', 'cheeser','toodles'];

    var socket = this.get('websockets').socketFor('ws://localhost:7000/');
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);
  },
  
  myOpenHandler: function(/*event*/) {
    //This message shown on entering the chat room
    $('#messages').append('<li><b>Welcome to the Chat! Playing Super Cheese Time today Woohoo!</b></li>');
    // this code sends the new user info to the server
    var socket = this.get('websockets').socketFor('ws://localhost:7000/');
    var nameToBroadcast = JSON.stringify({
      type: "userName",
      chatUserName: thisUserName,
      userID: userID
    });
    socket.send(nameToBroadcast);
  },

  // when a message is received from the server
  myMessageHandler: function(event) {
    var messageToDisplay = JSON.parse(event.data);
    //if it's a new user add them to the users list and annouce their joining to the chatroom
    if(messageToDisplay.type === "userName"){
      $('#messages').append('<li>'+messageToDisplay.chatUserName+' has joined the chat</li>');
      $('#chat-body').scrollTop($('#chat-body')[0].scrollHeight);
      //if a change has been made to the users list, wipe the local one and replace it with the new list
    }else if(messageToDisplay.type === "userslist"){
      $('#users').empty();
      messageToDisplay.data.forEach(function(element){
        $('#users').append('<li>'+element+'</li>');
      });
    }else{
      // All other message types are actual chat messages

      //Below is the partially functioning code. it successfully opens the #userOptionsMenu accordion object, but does not pass it any data currently  data-userID= is not read by any other part of the code right now.
      //$('#messages').append('<li><b><span class="collapsed" data-toggle="collapse" data-target="#userOptionsMenu" data-userID="'+messageToDisplay.userID+'" type="button">'+messageToDisplay.chatUserName+':</span></b> '+messageToDisplay.message+'</li>');

      //Below is the functional stand in code. Clicking the username links to the users profile. Default userID is 111, Default userName is testUser
      $('#messages').append('<li><b><a href="/p/'+messageToDisplay.userID+'" type="button">'+messageToDisplay.chatUserName+':</a></b> '+messageToDisplay.message+'</li>');

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
