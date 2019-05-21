const http = require('http');
const WebSocket = require('ws');
const fs = require('fs'); //DEBUG - for writeToTextFile()
const util = require('util'); //DEBUG - for writeToTextFile() and displaying objects as strings
const shortid = require('./shortid'); // For generating IDs
const requestLibrary = require('request'); // HTTP Gets for authentication
const apiHost = 'http://192.168.21.103';

const server = http.createServer();
let wsServer = new WebSocket.Server({
  noServer: true,
  clientTracking: true
});
let wsState = {
  connections: 0,
  rooms: {}
};

let userList = [];
//Generic User object
let User = {
  // Initialise user
  init: function(username, id) {
    this.username = username;
    this.id = id;
  }
};

// Log room state every 5 seconds
setInterval(function() {
  formattedJsonLogger('state: ', wsState);
}, 5000);

//On connection
wsServer.on('connection', function connection(wsClient, req) {
  console.log('INFO: Connection with client opened');
  //writeToTextFile(JSON.stringify(wsServer) + '====' + JSON.stringify(wsClient));

  // Assign ID to chat client and update room list
  wsClient.id = shortid();
  wsClient.roomUrl = req.url;
  wsState.connections = wsState.connections + 1;
  wsState.rooms[wsClient.roomUrl] = wsState.rooms[wsClient.roomUrl] || 0;
  wsState.rooms[wsClient.roomUrl] = wsState.rooms[wsClient.roomUrl] + 1;

  // On Message Recieved
  wsClient.on('message', function incoming(message) {
    if (messageIsValid(message) === true) {
      var messageRecieved = JSON.parse(message);
      formattedJsonLogger('recieved: ', messageRecieved);

      // if server received a new User, set that socket to store their username
      // and userId, then broadcast a new userList
      if (messageRecieved.type == 'userName') {
        var user = Object.create(User);
        user.init(messageRecieved.chatUserName, messageRecieved.userId);
        wsClient.socketChatUserName = messageRecieved.chatUserName;
        wsClient.socketUserId = messageRecieved.userId;
        userList.push(user);
        console.log('INFO: userlist:');
        console.log(userList);
        console.log('____________________________________');

        var updatedUsersList = JSON.stringify({
          type: 'userlist',
          data: userList
        });

        // broadcast message to all connected clients in the room
        wsServer.clients.forEach(function(c) {
          formattedJsonLogger('all clients: ', c.id);
          if (c.roomUrl === wsClient.roomUrl) {
            if (c && c.readyState === WebSocket.OPEN) {
              c.send(message);
              c.send(updatedUsersList);
            }
          }
        });
      }

      // If server received a standard message, set the username and userId to
      // the sockets username and userId, then broadcast the message.
      if (messageRecieved.type == 'chatMessage') {
        var messageToSend = JSON.stringify({
          chatUserName: wsClient.socketChatUserName,
          userId: wsClient.socketUserId,
          message: messageRecieved.data
        });

        // broadcast message to all connected clients in the room
        wsServer.clients.forEach(function(c) {
          formattedJsonLogger('all clients: ', c.id);
          if (c.roomUrl === wsClient.roomUrl) {
            if (c && c.readyState === WebSocket.OPEN) {
              c.send(messageToSend);
            }
          }
        });
      }
    }
  });

  // When a user disconnects from chat, remove them from the userlist then
  // broadcast the new user list.
  // TODO: Possibly devise a way to only send the changes to the list to reduce traffic
  wsClient.on('close', function() {
    wsState.connections = wsState.connections - 1;
    wsState.rooms[wsClient.roomUrl] = wsState.rooms[wsClient.roomUrl] - 1;
    if (wsState.rooms[wsClient.roomUrl] === 0) {
      delete wsState.rooms[wsClient.roomUrl];
    }
    console.log(
      'INFO: Connection with client closed and removed from userList'
    );
    // Remove disconnected user from userList
    userList = userList.filter(
      user => user.username !== wsClient.socketChatUserName
    );
    console.log(userList);

    var updatedUsersList = JSON.stringify({
      type: 'userlist',
      data: userList
    });
    wsServer.clients.forEach(function e(client) {
      client.send(updatedUsersList);
    });
  });
});
console.log('INFO: Chat server started and listening..');

// // During connection upgrade? Verify client here
server.on('upgrade', function upgrade(request, socket, head) {
  console.log('start upgrading connection');
  checkClientAuthAndHandleUpgrade(request, socket, head);
});
server.listen(7000);

// Functions

function checkClientAuthAndHandleUpgrade(request, socket, head) {
  let verified = false;
  request.isAuthenticated = false;
  writeToTextFile(request);


  requestLibrary(apiHost + '/chat_tickets', { json: true }, (err, res, body) => {
    console.log(res);
    // console.log(body.url);
    console.log(body);
    // if (res.status) {
    //   request.isAuthenticated = true;
    // }

    wsServer.handleUpgrade(request, socket, head, function done(ws) {
      wsServer.emit('connection', ws, request);
    });

    // if (verified) {
    //   console.log('user verified');
    //   return true;
    // }
    // console.log('user denied');
    // return false;
  });
}

function formattedJsonLogger(description, data) {
  console.log('INFO: %s%s', description, util.format(data));
}

function messageIsValid(message) {
  // Message is invalid if sent by userId 0. No user 0 exists.
  if (message.userId == 0 || message.data == '') {
    console.log('WARNING: Invalid message recieved and discarded.');
    return false;
  } else {
    return true;
  }
}

function writeToTextFile(data) {
  if (data !== undefined) {
    //Format data into string
    var output = util.format(data, { showHidden: true, depth: Infinity });

    fs.writeFile('output.txt', output, function(err) {
      if (err) {
        return console.log(err);
      }
      console.log('INFO: Text file saved.');
    });
  } else {
    return console.log(
      'ERROR: writeToTextFile() parameter data was undefined.'
    );
  }
}

//// Slow chat logic from chat-component
// var messageLimitTime = 1000;
// var messageLimitNumber = 5;
// var isSlowChat = false;
// var lastMessageSent = 0;
// var recentMessages = 0;
// sendUserMessage() {
//   let currentTime = Date.now();
//   // if its not too soon
//   if (
//     recentMessages > messageLimitNumber &&
//     lastMessageSent + messageLimitTime > currentTime
//   ) {
//     if (isSlowChat) {
//       this.chatMessagesList.pushObject({
//         message:
//           'Slow Chat is enabled. Please wait a while before trying again.',
//         systemMessage: true
//       });
//     } else {
//       this.chatMessagesList.pushObject({
//         message:
//           'You are sending messages too fast, wait a moment and try again.',
//         systemMessage: true
//       });
//     }
//   } else if (
//     recentMessages > 0 &&
//     lastMessageSent + messageLimitTime < currentTime
//   ) {
//     recentMessages = 0;
//   } else {
//     if (lastMessageSent + messageLimitTime < currentTime) {
//       lastMessageSent = currentTime;
//     }
//     // then you can send the message to the server
//     var messageToSend = JSON.stringify({
//       type: 'chatMessage',
//       data: userMessage
//     });
//     recentMessages += 1;
//     this.set('userMessage', '');
//
//     socket.send(messageToSend);
//   }
