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
      if (messageRecieved.type == "name"){

        ws.socketName = messageRecieved.data;
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
      }else if(messageRecieved.type == "message"){
        var messageToSend = JSON.stringify({
          name: ws.socketName,
          message: messageRecieved.data
        });
        s.clients.forEach(function e(client){
          client.send(messageToSend);
        });
      }
  });
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
