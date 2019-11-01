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
      r: 10,
      id: socket.id,
      color: 'green'
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

    var collision = false;
    // var p2 = {
    //   x: 0,
    //   y: 0,
    //   r: 10
    // };
    for (p2 in players) {
      p2 = players[p2];
      if (player.id != p2.id && p2.id != NaN) {
        console.log(player.id)
        console.log(p2.id)
        var a = player.x - p2.x
        var b = player.y - p2.y
        var c = player.r*2
        // if (math.distance([player.x, player.y], [p2.x, p2.y]) <= player.r) {
        if (a*a + b*b <= c*c) {
          collision = true;
        }
      }
    }
    if (collision == true) {
      // player.x = Math.floor(Math.random()*801);
      // player.y = Math.floor(Math.random()*601);
      player.color = 'red';
      console.log("collision between " + player.id + " and " + p2.id);
      console.log(player.x + " , " + player.y);
      console.log(p2.x + " , " + p2.y);
    } else {
      player.color = 'green';
    }
  });

  // socket.on('collision', function() {
  //   var collision = false;
  //   for (p2 in players) {
  //     if (sqrt((player.x - p2.x)^2 + (player.y - p2.y)^2) <= player.r) {
  //       collision = true;
  //     }
  //   }
  //   if (collision) {
  //     player.x = 0;
  //     player.y = 0;
  //   }
  // }



  socket.on('disconnect', function() {
    io.sockets.emit('message', 'disconnect recieved');
    delete players[socket.id]
    io.sockets.emit('message', 'disconnect resolved');
  });
});

setInterval(function() {
  io.sockets.emit('state', players);
}, 1000 / 60);

