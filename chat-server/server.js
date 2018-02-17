

var WebSocketServer = require('ws').Server;
var s = new WebSocketServer({port: 7000});
var usersList = [];

//On connection
s.on('connection', function connection(ws) {
  //console.log('user connected');

  // On Message Recieved
  ws.on('message', function incoming(message) {
    var messageRecieved = JSON.parse(message);
    //console.log('received: %s', message);
    // if server received a new User, set that socket to store their username and userID, then broadcast a new userList
      if (messageRecieved.type == "userName"){

        ws.socketName = messageRecieved.chatUserName;
        ws.socketUserID = messageRecieved.userID;

        usersList.push(ws.socketName);
        //console.log(usersList);
        var updatedUsersList = JSON.stringify({
          type: "userslist",
          data: usersList
        });

        s.clients.forEach(function e(client){
          client.send(message);
          client.send(updatedUsersList);

        });
        // if server received a standard message, set the username and userID to the sockets username and userID, then broadcast the message.
      }else if(messageRecieved.type == "message"){
        var messageToSend = JSON.stringify({
          chatUserName: ws.socketName,
          userID: ws.socketUserID,
          message: messageRecieved.data
        });
        s.clients.forEach(function e(client){
          client.send(messageToSend);
        });
      }
  });
  // when a user disconnects from chat, remove them from the userlist then broadcast the new user list.
  ws.on('close', function(){
    //console.log('user disconnected');
    var userToRemove = usersList.lastIndexOf(ws.socketName);
    usersList.splice(userToRemove,1);
  //  console.log(usersList);

    var updatedUsersList = JSON.stringify({
      type: "userslist",
      data: usersList
    });
    s.clients.forEach(function e(client){
      client.send(updatedUsersList);
    });

  });

});
