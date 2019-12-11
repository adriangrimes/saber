const WebSocket = require('ws');
const fs = require('fs');
const util = require('util'); //DEBUG - for writeToTextFile() and displaying objects as strings
const shortid = require('./shortid'); // For generating IDs
const requestLibrary = require('request'); // HTTP Gets for authentication

// get current environment from command line
const currentEnvironment = process.argv[2];

let apiHost = 'http://localhost:3000';
if (currentEnvironment) {
  switch (currentEnvironment) {
    case 'development':
      formattedJsonLogger;
      apiHost = 'http://localhost:3000';
      break;
    case 'staging':
      apiHost = 'https://api.saber.solversion.com';
      break;
    case 'production':
      apiHost = 'https://api.saber.tv';
      break;
    default:
      break;
  }
  formattedJsonLogger(
    'INFO',
    'ENV:',
    currentEnvironment + '.',
    'Using API host',
    apiHost
  );
} else {
  formattedJsonLogger(
    'WARN',
    'No environment parameter passed. Using default API host:',
    apiHost
  );
}

let wsServer = new WebSocket.Server({
  port: 7000,
  clientTracking: true
});

let chatState = {
  connections: 0,
  channels: {}
};

// Log chat state every X seconds
if (currentEnvironment == 'production') {
  setInterval(function() {
    formattedJsonLogger('INFO', 'Connections:', chatState.connections);
  }, 10000);
} else {
  setInterval(function() {
    formattedJsonLogger('INFO', 'CHAT STATE: ', chatState);
  }, 5000);
}

//On connection
wsServer.on('connection', function connection(wsClient, req) {
  formattedJsonLogger('INFO', 'Connection with client opened');
  chatState.connections = chatState.connections || 0;
  chatState.connections = chatState.connections + 1;

  initializeChannel(req.url);
  wsClient.hasStreamStateAccess = false;
  // Determine if connection is a user, or API stream state access
  if (
    req.headers['streamstate-auth'] &&
    req.headers['streamstate-auth'] === 'muKl4S80Yi3gQA2v8o2AOPgI8l'
  ) {
    formattedJsonLogger('INFO', 'streamstate access');
    wsClient.hasStreamStateAccess = true;
  } else {
    addChatUserToRequestedChannel(wsClient, req);
    formattedJsonLogger('INFO', 'after addChatUserToRequestedChannel');
  }

  // On message recieved
  wsClient.on('message', function incoming(message) {
    let parsedMessage = safeMessageParse(message, ['type', 'data'], 280);
    formattedJsonLogger('INFO', 'parsed message: ', parsedMessage);
    if (parsedMessage && parsedMessage.type) {
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
                formattedJsonLogger('INFO', 'all clients:', c.id);
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
          formattedJsonLogger('INFO', 'sent user list');
          break;
        case 'ChannelTopicUpdated':
          // Only clients with a username that matches their channel can send
          // topic updates.
          if (
            '/' + wsClient.chatUsername.toLowerCase() ===
            wsClient.channelUrl
          ) {
            let messageToSend = JSON.stringify({
              type: 'ChannelTopicUpdated'
            });
            // broadcast message to all connected clients in the room
            wsServer.clients.forEach(function(c) {
              formattedJsonLogger('INFO', 'all clients:', c.id);
              if (c.channelUrl === wsClient.channelUrl) {
                if (c && c.readyState === WebSocket.OPEN) {
                  c.send(messageToSend);
                }
              }
            });
            formattedJsonLogger('INFO', 'notified of updated channel topic');
          }
          break;
        case 'StreamState':
          if (wsClient.hasStreamStateAccess) {
            let messageToSend = JSON.stringify({
              type: 'StreamState',
              data: parsedMessage.data.state
            });
            formattedJsonLogger('INFO', 'sending state:' + messageToSend);
            // broadcast message to all connected clients in the room
            wsServer.clients.forEach(function(c) {
              if (c.channelUrl === '/' + parsedMessage.data.username) {
                if (c && c.readyState === WebSocket.OPEN) {
                  c.send(messageToSend);
                }
              }
            });
          }
          break;
        default:
          // Do nothing
          break;
      }
    }
  }); // End 'message' event block

  wsClient.on('pong', function(msg) {
    // Convert msg from hex buffer to UTF8 string
    msg = msg.toString();
    formattedJsonLogger('INFO', 'pong recieved');
    if (msg && msg.length > 0) {
      if (msg === wsClient.pingpong.pingId) {
        // client is responsive :) => restart checker
        formattedJsonLogger(
          'INFO',
          ' -',
          wsClient.id,
          wsClient.chatUsername,
          ' - received pong answer to ping: ',
          wsClient.pingpong.pingId
        ); // eslint-disable-line
        startClientPing(wsClient);
      }
    } else {
      // pong message is empty or null: stop
      formattedJsonLogger(
        'INFO',
        ' - pong message is empty or null: stopping ping'
      );
      stopClientPing(wsClient);
    }
  });

  // When a user disconnects from chat, update the userlist for that clients
  // channel
  wsClient.on('close', function() {
    formattedJsonLogger('INFO', 'close event called');

    // Subtract from connection count
    if (chatState.connections > 0) {
      chatState.connections -= 1;
    }

    // Dont attempt to remove a user when the connection is for streamstate
    if (wsClient.hasStreamStateAccess == false) {
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
              wsClient.assignedIp.includes(ip) &&
              wsClient.chatUsername === channel.userList[i].username
            ) {
              formattedJsonLogger('INFO', ' - removing ip from user');
              authenticatedUserFound = true;
              // Remove IP from ipArray
              let ipIndex = channel.userList[i].ipArray.indexOf(ip);
              if (ipIndex !== -1)
                channel.userList[i].ipArray.splice(ipIndex, 1);

              // If no IPs are assigned to the user, remove the user from all lists
              if (channel.userList[i].ipArray.length === 0) {
                formattedJsonLogger(
                  'INFO',
                  ' - all ips removed, removing user from userList'
                );
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
        formattedJsonLogger('INFO', ' - removing guest');
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
        formattedJsonLogger(
          'INFO',
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
              formattedJsonLogger('INFO', ' - client: ', c.id);
              c.send(userCountJSON);
              formattedJsonLogger('INFO', ' - broadcasting');
            }
          }
        });
      }
    }

    formattedJsonLogger(
      'INFO',
      'Connection with client ' + wsClient.assignedIp + ' closed'
    );
  });
});
formattedJsonLogger('INFO', 'Chat server started and listening...');

// Functions

function initializeChannel(channelUrl) {
  // Initialize room state
  chatState.channels[channelUrl] = chatState.channels[channelUrl] || {};
  let channel = chatState.channels[channelUrl];
  channel.guests = channel.guests || 0;
  channel.totalUsers = channel.totalUsers || 0;
  channel.userList = channel.userList || [];
  channel.friendlyUserList = channel.friendlyUserList || [];
}

function addChatUserToRequestedChannel(client, req) {
  formattedJsonLogger('INFO', 'addChatUserToRequestedChannel()');

  // Add basic user info to connected client object
  client.assignedIp =
    req.headers['x-forwarded-for'] || client._socket.remoteAddress;
  client.id = shortid();
  client.channelUrl = req.url;
  client.pingpong = {};
  client.pingpong.started = false;
  client.pingpong.heartbeat = null;
  client.pingpong.pingTimeout = null;

  // Check back-end for valid ticket matching the identifier/IP
  requestLibrary(
    {
      url: apiHost + '/chat_tickets?identifier=' + client.assignedIp,
      json: true
    },
    (err, res, body) => {
      if (client.readyState === WebSocket.OPEN) {
        let channel = chatState.channels[client.channelUrl];
        if (body && res && res.statusCode == 200) {
          // Add user info to the userList and friendlyUserList if ticket was valid
          formattedJsonLogger(
            'INFO',
            ' - ' + res.statusCode + ' adding as authenticated user'
          );

          client.chatUsername = body.username;

          let newUser = true;
          if (channel && channel.userList) {
            for (var i = 0; i < channel.userList.length; i++) {
              if (
                channel.userList[i] &&
                channel.userList[i].username == body.username
              ) {
                // User found, add IP to users IP array instead of creating a new user
                formattedJsonLogger(
                  'INFO',
                  ' - user already found in userList, updating IP'
                );
                newUser = false;
                channel.userList[i].ipArray.push(body.ip);
                sendUserCountToClient(client);
                break;
              }
            }
          }
          if (newUser) {
            // add additional ip to ip property
            formattedJsonLogger('INFO', ' - creating new user');
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
          //4XX/5XX status code
        } else if (res && res.statusCode.toString()[0] != '2') {
          // Else client is a guest, increment guest and totalUsers counter and
          // send updated user count to client
          formattedJsonLogger(
            'INFO',
            ' - ' + res.statusCode + ' failed to find ticket, adding as guest'
          );
          channel.guests += 1;
          channel.totalUsers += 1;
          sendUserCountToClient(client);
        } else {
          formattedJsonLogger(
            'ERROR',
            'Unusual error with API, it may be down'
          );
          channel.guests += 1;
          channel.totalUsers += 1;
          sendUserCountToClient(client);
        }
        startClientPing(client);
      }
    }
  );
}

function broadcastUserJoinAndUserCount(client) {
  // Broadcast message to all connected clients in the same channel
  formattedJsonLogger('INFO', 'broadcastUserJoinAndUserCount()');
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
        formattedJsonLogger('INFO', ' - broadcasting to client: ', c.id);
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
    formattedJsonLogger('WARN', 'Invalid message recieved.');
    return false;
  } else {
    return true;
  }
}

function messageIsAuthorized(client) {
  formattedJsonLogger('INFO', 'messageIsAuthorized() for ' + client.assignedIp);
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
          client.assignedIp.includes(ip) === true &&
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
      formattedJsonLogger(
        'INFO',
        ' - true, matching user found / message authorized for: ' +
          user.username
      );
      return true;
    } else {
      formattedJsonLogger('INFO', ' - false, no matching user found');
      return false;
    }
  } else {
    formattedJsonLogger('INFO', ' - false, no matching user found');
    return false;
  }
}

function startClientPing(client) {
  formattedJsonLogger('INFO', 'startClientPing()');
  client.pingpong.started = true;
  if (client.pingpong.pingTimeout) {
    formattedJsonLogger('INFO', ' - clearing timeout()');
    clearTimeout(client.pingpong.pingTimeout);
  }
  setTimeout(function() {
    if (client && client.readyState === WebSocket.OPEN) {
      // client is opened
      client.pingpong.pingId = shortid();
      formattedJsonLogger(
        'INFO',
        ' - Sending ping:',
        client.pingpong.pingId,
        'to',
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
      formattedJsonLogger('INFO', ' - client socket is not opened, stopping');
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
    formattedJsonLogger(
      'INFO',
      ' - client',
      client.id,
      client.chatUsername,
      'seems unresponsive: closing...'
    );
  }
}

// pass expected list of properties and optional maxLen
// returns obj or null
function safeMessageParse(str, propArray, maxLen) {
  var parsedObj = {};
  var safeObj = {};

  try {
    if (maxLen && str.length > maxLen) {
      console.error('ERROR: Received message over maxLen, nulling message');
      return { type: null };
    } else {
      parsedObj = JSON.parse(str);
      if (typeof parsedObj !== 'object' || Array.isArray(parsedObj)) {
        safeObj = parsedObj;
      } else {
        // copy only expected properties to the safeObj
        propArray.forEach(function(prop) {
          if (parsedObj.hasOwnProperty(prop)) {
            safeObj[prop] = parsedObj[prop];
          }
        });
      }
      return safeObj;
    }
  } catch (e) {
    console.error(e);
    return { type: null };
  }
}

function formattedJsonLogger(type, ...args) {
  console.log(new Date().toISOString(), ' ' + type + ': ', ...args);
}

function formattedJsonDeepLogger(type, description, data) {
  console.log(
    new Date().toISOString() + ' ' + type + ': %s%s%s',
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
        return formattedJsonLogger('ERROR', err);
      }
      formattedJsonLogger('INFO', 'Text file saved.');
    });
  } else {
    return formattedJsonLogger(
      'ERROR',
      'writeToTextFile() parameter data was undefined.'
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
