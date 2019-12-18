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

// setInterval(function() {
//   io.sockets.emit('message', 'hi!');
// }, 1000);

var players = {};
var bullets = [];

// updates bullets
setInterval(function() {
  for (var i = 0; i < bullets.length; i++) {
    //movement
    bullets[i].x = bullets[i].x + bullets[i].dx;
    bullets[i].y = bullets[i].y + bullets[i].dy;
    //wall collision
    let collided = false;
    if (bullets[i].x >= 1000) {
      collided = true;
    }
    if (bullets[i].x <= 0) {
      collided = true;
    }
    if (bullets[i].y >= 1000) {
      collided = true;
    }
    if (bullets[i].y <= 0) {
      collided = true;
    }
    if (collided) {
      bullets.splice(i,1);
      console.log("cruck");
    }
  }
}, 1000/60);

io.on('connection', function(socket) {
  socket.on('new player', function() {
    players[socket.id] = {
      x: 500,
      y: 500,
      r: 10,
      id: socket.id,
      color: 'green',
      hp: 20,
      right: false,
      left: false,
      up: false,
      down: false
    };
    console.log("New Player: " + socket.id)
  });
  socket.on('movement', function(data) {
    var player = players[socket.id] || {};
    if (data.left) {
      if (player.x - 20 >= 0 - 63) {
        player.x -= 3;
        console.log(player.x);
      }
    }
    if (data.up) {
      if (player.y - 20 >= 0 - 63) {
        player.y -= 3;
      }
    }
    if (data.right) {
      if (player.x + 20 <= 937) {
        player.x += 3;
      }
    }
    if (data.down) {
        if (player.y + 20 <= 937) {
        player.y += 3;
      }
    }

    if (player.x - 20 <= 0) {
      player.x = 0 + 20;
    }
    if (player.x + 20 >= 937) {
      player.x = 937 - 20;
    }
    if (player.y - 20 <= 0) {
      player.y = 0 + 20;
    }
    if (player.y + 20 >= 937) {
      player.y = 937 - 20;
    }

    //Kill player
    if(player.hp <= 0) {
      delete players[socket.id];
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
        var a = player.x - p2.x
        var b = player.y - p2.y
        var c = player.r*2
        // if (math.distance([player.x, player.y], [p2.x, p2.y]) <= player.r) {
        if (a*a + b*b <= c*c) {
          collision = true;
        }
      }
    }
    for (var i = 0; i < bullets.length; i++) {
      var a = player.x - bullets[i].x
      var b = player.y - bullets[i].y
      var c = player.r*2
      // if (math.distance([player.x, player.y], [p2.x, p2.y]) <= player.r) {
      if (a*a + b*b <= c*c) {
        collision = true;
        player.hp = player.hp - 1;
        bullets.splice(i,1);
        console.log("bullet hit " + player.id);
      }
    }
    if (collision == true) {
      // player.x = Math.floor(Math.random()*801);
      // player.y = Math.floor(Math.random()*601);
      player.color = 'red';
    } else {
      player.color = 'green';
    }
  });


  socket.on('mouseclick', function(data) {
    var player = players[socket.id] || {};
    if (data.left == true) {
      bullets.push(new Bullet(player, data.mx, data.my));
    }

    console.log(data);

  });



  socket.on('disconnect', function() {
    io.sockets.emit('message', 'disconnect recieved');
    delete players[socket.id]
    io.sockets.emit('message', 'disconnect recieved');
  });
//   socket.on('attack', function(data) {
//     var player = players[socket.id] || {};
//       if (data.self) {
//         player.hp -= 5;
//         delete players[socket.id]
//       }
//   });0
});

class Bullet {
 constructor(player, mx, my) {
    mx = mx + player.x+7 - 450 //mouse x + player x - half of screen width
    my = my + player.y+9.5 - 400 //gives us mouse relative to player
    this.pl_id = player.id;
    this.x = player.x+7-5;
    this.y = player.y+9.5-5;
    this.tempx = mx - player.x;
    this.tempy = my - player.y;
    this.orientation = Math.atan(this.tempy/this.tempx);
    if (player.x > mx) {
      this.dy = -Math.sin(this.orientation)*15;
      this.dx = -Math.cos(this.orientation)*15;
    } else {
      this.dy = Math.sin(this.orientation)*15;
      this.dx = Math.cos(this.orientation)*15;
    }
    // bullet needs to start not inside the players
    this.x = this.x + (this.dx*3);
    this.y = this.y + (this.dy*3);
  }
}

// class Player { // currently not used
//   constructor() {
//     this.x = 200;
//     this.y = 200;
//     this.imgs = {
//       "down": loadImage('assets/stomperD.png'),
//       "right": loadImage('assets/stomperR.png'),
//       "up": loadImage('assets/stomperU.png'),
//       "left": loadImage('assets/stomperL.png')
//     }
//     this.img = this.imgs["down"];
//     this.right = false;
//     this.left = false;
//     this.up = false;
//     this.down = false
//
//   }
// }


  setInterval(function() {
    //io.sockets.emit('state', players, bullets);
    for (var id in players) {
      var playersOnScreen = [];
      var player = players[id];
      for (p2id in players) {
        var p2 = players[p2id];
        if (player.id != p2.id && p2.id != NaN) {
          var a = player.x - p2.x;
          var b = player.y - p2.y;
          var c = 900000;
          if (a*a + b*b <= c*c) {
            playersOnScreen.push(players[p2id]);
          }
        }
      }
      io.sockets.connected[id].emit('state', players[id], bullets);
      io.sockets.connected[id].emit('nearbyPlayers', playersOnScreen);
      var bulletsOnScreen = [];
      var player = players[id];
      for (var i = 0; i < bullets.length; i++) {
        // console.log("checking a bullet")
        // var bullet = i;
        var a = player.x - bullets[i].x;
        var b = player.y - bullets[i].y;
        var c = 900000;
        if (a*a + b*b <= c*c) {
          // console.log("bullet added to table")
          bulletsOnScreen.push(bullets[i]);
        } else {
          // console.log("bullet toooooooooooooooooooo farrrrrrr")
        }
      }
      io.sockets.connected[id].emit('nearbyBullets', bulletsOnScreen);
    }
  }, 1000 / 60);

  // setInterval(function() {
  //   // io.sockets.emit('state', players, bullets);
  //   for (var id in players) {
  //     var bulletsOnScreen = [];
  //     var player = players[id];
  //     for (var i = 0; i < bullets.length; i++) {
  //       console.log("checking a bullet")
  //       // var bullet = i;
  //       var a = player.x - bullets[i].x;
  //       var b = player.y - bullets[i].y;
  //       var c = 900000;
  //       if (a*a + b*b <= c*c) {
  //         console.log("bullet added to table")
  //         bulletsOnScreen.push(bullets[i]);
  //       } else {
  //         console.log("bullet toooooooooooooooooooo farrrrrrr")
  //       }
  //     }
  //     io.sockets.connected[id].emit('nearbyBullets', bulletsOnScreen);
  //   }
  // }, 1000 / 60);
