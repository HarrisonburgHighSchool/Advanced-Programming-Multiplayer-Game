# Advanced Programming Multiplayer Game


## Table of Contents

1. Sending and receiving
2. How the client and server works
3. Client side socket stuff
4. Server side socket stuff
5. Data structures


## Sending and receiving

Here are some examples from the code showing how to use socket stuff

```javascript
setInterval(function() {
  for (var id in players) {
    var playersOnScreen = [];
    var player = players[id];
    if (player.x > 0 and player.y > 0) {
      playersOnScreen.push(players[p2id]);
    }
    io.sockets.connected[id].emit('nearbyPlayers', playersOnScreen);
  }
}, 1000 / 60);
```

`setInterval`: Makes the code run after a specified time has passed. Here, the code runs after 1000/60 milliseconds, or 60 times per second.

All the players in the game are stored in the `players` table.

`io.sockets.connected[id].emit`: Sends the specified data with a specified name. Here, it is sending the table `playersOnScreen` with the name `nearbyPlayers`. The data will be received by the server.

```javascript
socket.on('state', function(serverPlayer, bullets) {
  player.x = serverPlayer.x;
  player.y = serverPlayer.y;
  socket.emit('movement', movement);
});
```

`socket.on`: This function listens for a message with a specific name, then runs a function with the message's data. Here, it is listening for the data `serverPlayer` and `bullets` being sent under the name `state`.



## How client and server works

There are two sides, the server side and client side.

The server side does calculations and processes the game. The server sends data to the clients about the positions of entities and data calculated by the server.

The client side draws the game on the player's screen. The client sends data to the server about what the player is doing.

Information is sent using `socket.emit` and received with `socket.on`.


## Client side emits and ons




## Server side emits and ons




## Data structures
