const WebSocket = require('ws');
const fs = require('fs'); //DEBUG - for writeToTextFile()
const util = require('util'); //DEBUG - for writeToTextFile() and displaying objects as strings
const shortid = require('./shortid'); // For generating IDs
const requestLibrary = require('request'); // HTTP Gets for authentication
const apiHost = 'http://192.168.21.109:3000';

let wsServer = new WebSocket.Server({
  port: 7000,
  clientTracking: true
});

let chatState = {
  connections: 0,
  channels: {}
};

// Log chat state every X seconds
setInterval(function() {
  formattedJsonLogger('CHAT STATE: ', chatState);
}, 5000);

//On connection
wsServer.on('connection', function connection(wsClient, req) {
  console.log('INFO: Connection with client opened');
  chatState.connections = chatState.connections || 0;
  chatState.connections = chatState.connections + 1;

  initializeChannelAndAddChatUser(wsClient, req);

  // On message recieved
  wsClient.on('message', function incoming(message) {
    let parsedMessage = JSON.parse(message);
    formattedJsonLogger('recieved message: ', parsedMessage);

    switch (parsedMessage.type) {
      case 'ChatMessage':
        if (messageIsAuthorized(wsClient)) {
          if (messageIsValid(wsClient, parsedMessage) === true) {
            let messageToSend = JSON.stringify({
              type: 'ChatMessage',
              chatUsername: wsClient.chatUsername,
              data: parsedMessage.data
            });
            // broadcast message to all connected clients in the room
            wsServer.clients.forEach(function(c) {
              formattedJsonLogger('all clients: ', c.id);
              if (c.channelUrl === wsClient.channelUrl) {
                if (c && c.readyState === WebSocket.OPEN) {
                  c.send(messageToSend);
                }
              }
            });
          }
        }
        break;
      case 'ChannelChatUserList':
        // Send friendlyUserList to client that requested it
        let channel = chatState.channels[wsClient.channelUrl];
        wsClient.send(
          JSON.stringify({
            type: 'ChannelChatUserList',
            data: channel.friendlyUserList,
            // If guests is somehow negative, send 0
            guests: channel.guests < 0 ? 0 : channel.guests
          })
        );
        console.log('sent user list');
        break;
      case 'ChannelTopicUpdated':
        // Only clients with a username that matches their channel can they send
        // topic updates.
        if ('/' + wsClient.chatUsername.toLowerCase() === wsClient.channelUrl) {
          let messageToSend = JSON.stringify({
            type: 'ChannelTopicUpdated'
          });
          // broadcast message to all connected clients in the room
          wsServer.clients.forEach(function(c) {
            formattedJsonLogger('all clients: ', c.id);
            if (c.channelUrl === wsClient.channelUrl) {
              if (c && c.readyState === WebSocket.OPEN) {
                c.send(messageToSend);
              }
            }
          });
          console.log('notified of updated channel topic');
        }
        break;
      default: // Do nothing
    }
  }); // End 'message' event block

  wsClient.on('pong', function(msg) {
    // Convert msg from hex buffer to UTF8 string
    msg = msg.toString();
    console.log('pong recieved');
    if (msg && msg.length > 0) {
      if (msg === wsClient.pingpong.pingId) {
        // client is responsive :) => restart checker
        console.log(
          ' - "%s,%s" received pong answer to ping "%s"',
          wsClient.id,
          wsClient.chatUsername,
          wsClient.pingpong.pingId
        ); // eslint-disable-line
        startClientPing(wsClient);
      }
    } else {
      // pong message is empty or null: stop
      console.log(' - pong message is empty or null: stop');
      stopClientPing(wsClient);
    }
  });

  // When a user disconnects from chat, update the userlist for that clients
  // channel
  wsClient.on('close', function() {
    console.log('close event called');
    // Subtract from connection count
    if (chatState.connections > 0) {
      chatState.connections -= 1;
    }

    let channel = chatState.channels[wsClient.channelUrl];
    let authenticatedUserFound = false;

    if (channel.userList) {
      // For each user in channel
      for (var i = 0; i < channel.userList.length; i++) {
        // For each IP attached to the user
        for (var j = 0; j < channel.userList[i].ipArray.length; j++) {
          let ip = channel.userList[i].ipArray[j];
          // If IP of closing connection matches a stored IP, remove it, and if
          // there are no IPs left, remove the user from the array.
          if (
            wsClient._socket.remoteAddress.includes(ip) &&
            wsClient.chatUsername === channel.userList[i].username
          ) {
            console.log(' - removing ip from user');
            authenticatedUserFound = true;
            // Remove IP from ipArray
            let ipIndex = channel.userList[i].ipArray.indexOf(ip);
            if (ipIndex !== -1) channel.userList[i].ipArray.splice(ipIndex, 1);

            // If no IPs are assigned to the user, remove the user from all lists
            if (channel.userList[i].ipArray.length === 0) {
              console.log(' - all ips removed, removing user from userList');
              // Remove the user from the friendlyUserList
              let userListIndex = channel.friendlyUserList.indexOf(
                channel.userList[i].username
              );
              if (userListIndex !== -1) {
                channel.friendlyUserList.splice(userListIndex, 1);
              }
              // And then the userList
              channel.userList.splice(i, 1);
              // Subtract user counts
              if (channel.totalUsers > 0) {
                channel.totalUsers -= 1;
              }
            }
            break;
          }
        }
        if (authenticatedUserFound) {
          break;
        }
      }
    }
    // If client was a guest, clean up guest
    if (authenticatedUserFound === false) {
      console.log(' - removing guest');
      // Subtract user counts
      if (channel.guests > 0) {
        channel.guests -= 1;
      }
      if (channel.totalUsers > 0) {
        channel.totalUsers -= 1;
      }
    }

    // If channel is now empty, clean it up. If not, broadcast new status to
    // remaining users.
    if (
      channel.userList.length === 0 &&
      channel.friendlyUserList.length === 0 &&
      channel.guests <= 0 &&
      channel.totalUsers <= 0
    ) {
      console.log(
        ' - channel chat empty, deleting channel: ' + util.inspect(channel)
      );
      delete chatState.channels[wsClient.channelUrl];
    } else {
      // Broadcast updated user count to remaining clients
      let userCountJSON = JSON.stringify({
        type: 'ChannelUserCountUpdated',
        data: channel.friendlyUserList.length
      });
      wsServer.clients.forEach(function(c) {
        if (c.channelUrl === wsClient.channelUrl) {
          if (c && c.readyState === WebSocket.OPEN) {
            console.log(' - client: ', c.id);
            c.send(userCountJSON);
            console.log(' - broadcasting');
          }
        }
      });
    }

    console.log(
      'INFO: Connection with client ' +
        wsClient._socket.remoteAddress +
        ' closed'
    );
  });
});
console.log('INFO: Chat server started and listening...');

// Functions

function initializeChannelAndAddChatUser(client, req) {
  console.log('initializeChannelAndAddChatUser():');

  // Add basic user info to connected client object
  client.id = shortid();
  client.channelUrl = req.url;
  client.pingpong = {};
  client.pingpong.started = false;
  client.pingpong.heartbeat = null;
  client.pingpong.pingTimeout = null;

  // Initialize room state
  chatState.channels[client.channelUrl] =
    chatState.channels[client.channelUrl] || {};
  let channel = chatState.channels[client.channelUrl];
  channel.guests = channel.guests || 0;
  channel.totalUsers = channel.totalUsers || 0;
  channel.userList = channel.userList || [];
  channel.friendlyUserList = channel.friendlyUserList || [];

  // Check back-end for valid ticket matching the identifier/IP
  requestLibrary(
    {
      url: apiHost + '/chat_tickets?identifier=' + client._socket.remoteAddress,
      json: true
    },
    (err, res, body) => {
      if (res.statusCode == 200 && body) {
        // Add user info to the userList and friendlyUserList if ticket was valid
        console.log(' - ' + res.statusCode + ' adding as authenticated user');

        client.chatUsername = body.username;

        let newUser = true;
        for (var i = 0; i < channel.userList.length; i++) {
          if (channel.userList[i].username == body.username) {
            // User found, add IP to users IP array instead of creating a new user
            console.log(' - user already found in userList, updating IP');
            newUser = false;
            channel.userList[i].ipArray.push(body.ip);
            sendUserCountToClient(client);
            break;
          }
        }
        if (newUser) {
          // add additional ip to ip property
          console.log(' - creating new user');
          let ipArray = [];
          ipArray.push(body.ip);
          channel.userList.push({
            username: body.username,
            ipArray: ipArray,
            authorized: true
          });
          channel.friendlyUserList.push(body.username);
          // Sort friendlyUserList alphabetically for client display
          channel.friendlyUserList.sort();
          channel.totalUsers += 1;
          broadcastUserJoinAndUserCount(client);
        }
      } else if (res.statusCode == 422) {
        // Else client is a guest, increment guest and totalUsers counter and
        // send updated user count to client
        console.log(
          ' - ' + res.statusCode + ' failed to find ticket, adding as guest'
        );
        channel.guests += 1;
        channel.totalUsers += 1;
        sendUserCountToClient(client);
      } else {
        console.log('ERROR: Unusual error status code ' + res.statusCode);
        channel.guests += 1;
        channel.totalUsers += 1;
        sendUserCountToClient(client);
      }
      startClientPing(client);
    }
  );
}

function broadcastUserJoinAndUserCount(client) {
  // Broadcast message to all connected clients in the same channel
  console.log('broadcastUserJoinAndUserCount()');
  let userJoinJSON = JSON.stringify({
    type: 'UserJoinedChannel',
    data: client.chatUsername
  });
  let userCountJSON = JSON.stringify({
    type: 'ChannelUserCountUpdated',
    data: chatState.channels[client.channelUrl].friendlyUserList.length
  });
  wsServer.clients.forEach(function(c) {
    if (c.channelUrl === client.channelUrl) {
      if (c && c.readyState === WebSocket.OPEN) {
        console.log(' - broadcasting to client: ', c.id);
        c.send(userJoinJSON);
        c.send(userCountJSON);
      }
    }
  });
}

function sendUserCountToClient(client) {
  // Send current logged in user count to new client
  client.send(
    JSON.stringify({
      type: 'ChannelUserCountUpdated',
      data: chatState.channels[client.channelUrl].friendlyUserList.length
    })
  );
}

function messageIsValid(client, message) {
  if (message.data === '') {
    console.log('WARNING: Invalid message recieved and discarded.');
    return false;
  } else {
    return true;
  }
}

function messageIsAuthorized(client) {
  console.log('messageIsAuthorized() for ' + client._socket.remoteAddress);
  let userAuthorized = false;
  let user = {};
  let channel = chatState.channels[client.channelUrl];
  // Check if users IP matches authrorized users IP
  if (channel.userList) {
    // For each user in the channel
    for (var i = 0; i < channel.userList.length; i++) {
      // For each IP attached to the user
      for (var j = 0; j < channel.userList[i].ipArray.length; j++) {
        let ip = channel.userList[i].ipArray[j];
        // If client username and IP matches the entry in the userList
        if (
          client._socket.remoteAddress.includes(ip) === true &&
          client.chatUsername === channel.userList[i].username
        ) {
          userAuthorized = true;
          user = channel.userList[i];
          break;
        }
      }
      if (userAuthorized) {
        break;
      }
    }
    if (userAuthorized) {
      console.log(
        ' - true, matching user found / message authorized for: ' +
          user.username
      );
      return true;
    } else {
      console.log(' - false, no matching user found');
      return false;
    }
  } else {
    console.log(' - false, no matching user found');
    return false;
  }
}

// function setUpClientConnectionChecking(client) {
//   console.log('setUpClientConnectionChecking()');
//
//   client.pingpong.heartbeat = setInterval(function() {
//     startClientPing(client);
//   }, 10000);
// }

function startClientPing(client) {
  console.log('startClientPing()');
  client.pingpong.started = true;
  if (client.pingpong.pingTimeout) {
    console.log(' - clearing timeout()');
    clearTimeout(client.pingpong.pingTimeout);
  }
  setTimeout(function() {
    if (client && client.readyState === WebSocket.OPEN) {
      // client is opened
      client.pingpong.pingId = shortid();
      console.log(
        ' - Sending ping: "%s" to "%s %s"',
        client.pingpong.pingId,
        client.chatUsername,
        client.id
      );
      client.ping(client.pingpong.pingId, null, false);
      client.pingpong.pingTimeout = setTimeout(function() {
        // if we end-up here it means that the client took too long
        // to answer the ping request
        stopClientPing(client);
      }, 5000);
    } else {
      console.log(' - client socket is not opened, stopping');
      // client is not opened: stop checking
      stopClientPing(client);
    }
  }, 10000);
}

function stopClientPing(client) {
  if (client.pingpong.started) {
    clearInterval(client.pingpong.heartbeat);
    clearTimeout(client.pingpong.pingTimeout);
    client.pingpong.started = false;
    client.close(4042, ' - client seems unresponsive');
    console.log(
      ' - client "%s %s" seems unresponsive: closing...',
      client.id,
      client.chatUsername
    );
  }
}

function formattedJsonLogger(description, data) {
  console.log(
    'INFO: %s%s',
    description,
    util.inspect(data, { showHidden: true, depth: null, colors: true })
  );
}

function writeToTextFile(data) {
  if (data !== undefined) {
    //Format data into string
    let output = util.format(data, { showHidden: true, depth: Infinity });

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
// let messageLimitTime = 1000;
// let messageLimitNumber = 5;
// let isSlowChat = false;
// let lastMessageSent = 0;
// let recentMessages = 0;
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
//     let messageToSend = JSON.stringify({
//       type: 'chatMessage',
//       data: userMessage
//     });
//     recentMessages += 1;
//     this.set('userMessage', '');
//
//     socket.send(messageToSend);
//   }
