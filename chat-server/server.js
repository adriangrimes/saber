var WebSocketServer = require('ws').Server;
var s = new WebSocketServer({port: 7000});
var fs = require('fs'); //DEBUG - for writeToTextFile()
var util = require('util'); //DEBUG - for writeToTextFile() and displaying objects as strings

var userList = [];
var User = { //Generic User object
    // Initialise user
    init: function (username, id) {
        this.username = username;
        this.id = id;
    }
};

console.log("INFO: Chat server started and listening..");

//On connection
s.on('connection', function connection(ws) {
  console.log('INFO: Connection with client opened');

  // On Message Recieved
  ws.on('message', function incoming(message) {
    if (messageIsValid(message) === true) {

      var messageRecieved = JSON.parse(message);
      console.log('INFO: received: %s', util.format(messageRecieved));
      // if server received a new User, set that socket to store their username and userId, then broadcast a new userList
      if (messageRecieved.type == "userName") {
        var user = Object.create(User);
        user.init(messageRecieved.chatUserName, messageRecieved.userId);
        ws.socketChatUserName = messageRecieved.chatUserName;
        ws.socketUserId = messageRecieved.userId;
        userList.push(user);
        console.log("INFO: userlist:");
        console.log(userList);
        console.log("____________________________________");

        var updatedUsersList = JSON.stringify({
          type: "userlist",
          data: userList
        });

        s.clients.forEach(function e(client){
          client.send(message);
          client.send(updatedUsersList);
        });
      }

      // If server received a standard message, set the username and userId to the sockets username and userId, then broadcast the message.
      if (messageRecieved.type == "chatMessage") {
        var messageToSend = JSON.stringify({
          chatUserName: ws.socketChatUserName,
          userId: ws.socketUserId,
          message: messageRecieved.data
        });
        s.clients.forEach(function e(client) {
          client.send(messageToSend);
        });
      }
    }
  });

  // When a user disconnects from chat, remove them from the userlist then broadcast the new user list.
  //TODO: Possibly devise a way to only send the changes to the list to reduce traffic
  ws.on('close', function(){
    console.log('INFO: Connection with client closed and removed from userList');
    // Remove disconnected user from userList
    userList = userList.filter(user => user.username !== ws.socketChatUserName);
    console.log(userList);

    var updatedUsersList = JSON.stringify({
      type: "userlist",
      data: userList
    });
    s.clients.forEach(function e(client){
      client.send(updatedUsersList);
    });
  });

});

function messageIsValid(message) {
  // Message is invalid if sent by userId 0. No user 0 exists.
  if (message.userId == 0 || message.data == '') {
    console.log("WARNING: Invalid message recieved and discarded.")
    return false;
  } else {
    return true;
  }
}

function writeToTextFile(data) {
  if (data !== undefined) {

    //Format data into string
    var output = util.format(data, {showHidden: true, depth: Infinity});

    fs.writeFile("output.txt", output, function(err) {
      if(err) {
          return console.log(err);
      }
      console.log("INFO: Text file saved.");
    });
  } else {
    return console.log("ERROR: writeToTextFile() parameter data was undefined.");
  }
}
