// Dependencies
var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');var app = express();
var server = http.Server(app);
var io = socketIO(server);app.set('port', 5000);
app.use(express.static('static'));// Routing
// app.get('/', function(request, response) {
//   response.sendFile(path.join(__dirname, 'index.html'));
// });// Starts the server.
server.listen(5000, function() {
  console.log('Starting server on port 5000');
});
// Add the WebSocket handlers
io.on('connection', function(socket) {
});

setInterval(function() {
  io.sockets.emit('message', 'hi!');
}, 1000);

var players = {};
io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 300,
      y: 300,
      r: 10
      //id = socket.id
    };
    console.log("New Player: " + socket.id)
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      if (player.x - player.r >= 0) {
        player.x -= 5;
      }
    }
    if (data.up) {
      if (player.y - player.r >= 0) {
        player.y -= 5;
      }
    }
    if (data.right) {
      if (player.x + player.r <= 800) {
        player.x += 5;
      }
    }
    if (data.down) {
      if (player.y + player.r <= 600) {
        player.y += 5;
      }
    }

    if (player.x - player.r <= 0) {
      player.x = 0 + player.r;
    }
    if (player.x + player.r >= 800) {
      player.x = 800 - player.r;
    }
    if (player.y - player.r <= 0) {
      player.y = 0 + player.r;
    }
    if (player.y + player.r >= 600) {
      player.y = 600 - player.r;
    }
  });



  socket.on('disconnect', function() {
    io.sockets.emit('message', 'disconnect recieved');
    delete players[socket.id]
    io.sockets.emit('message', 'disconnect resolved');
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);

