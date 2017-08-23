import Ember from 'ember';
var name = 'TestName';//prompt('Username:');


export default Ember.Component.extend({
    store: Ember.inject.service(),

  init: function() {
    this._super();
    var socket = this.get('websockets').socketFor('ws://localhost:7000/');
    socket.on('open', this.myOpenHandler, this);
    socket.on('message', this.myMessageHandler, this);
    socket.on('close', this.myCloseHandler, this);
  },

  myOpenHandler: function(event) {
    $('#messages').append('<li><b>Welcome to the Chat! Playing Super Cheese Time today Woohoo!</b></li>');
    var socket = this.get('websockets').socketFor('ws://localhost:7000/');
    var nameToBroadcast = JSON.stringify({
      type: "name",
      data: name
    });
    socket.send(nameToBroadcast);


  },

  myMessageHandler: function(event) {
    var messageToDisplay = JSON.parse(event.data);

      if(messageToDisplay.type == "name"){
        $('#messages').append('<li>'+messageToDisplay.data+' has joined the chat</li>');
      }else if(messageToDisplay.type == "userslist"){
        $('#users').empty();

          messageToDisplay.data.forEach(function(element){
            $('#users').append('<li>'+element+'</li>');
          });


      }else{
        $('#messages').append('<li><b>'+messageToDisplay.name+':</b> '+messageToDisplay.message+'</li>');

      }
  },

  myCloseHandler: function(event){

    $('#messages').append('<li><b>Chat connection was lost. Please refresh the page.</b></li>');

  },

  willDestroyElement() {
  this.get('websockets').closeSocketFor('ws://localhost:7000/');
  },


  actions: {
    sendUserMessage: function() {

      if (usermsg.value!=''){
        var socket = this.get('websockets').socketFor('ws://localhost:7000/');
        var messageToSend = JSON.stringify({
          type: "message",
          data: usermsg.value
        });
        socket.send(messageToSend);
        usermsg.value = '';
      }

    },
    openChatTab: function() {
        $(this).tab('show');

    },
  
  }
});
