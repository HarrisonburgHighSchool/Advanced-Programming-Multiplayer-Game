// Dependencies

var express = require('express');
var http = require('http');
var path = require('path');
var socketIO = require('socket.io');var app = express();
var server = http.Server(app);
var io = socketIO(server);app.set('port', 5000);
app.use(express.static('static'));

var room;
var start;

// Routing
var waypoints = [];
server.listen(5000, function() {
  console.log('Starting server on port 5000');
  waypoints[0] = new Waypoint(250,250,0)
  waypoints[1] = new Waypoint(500,500,1)
  waypoints[2] = new Waypoint(750,750,2)
  room = 0;
  start = false;
  nextteamselect = 0
});

// Add the WebSocket handlers

io.on('connection', function(socket) {
});

var players = {};
var waitingplayers = {};
var bullets = [];

// updates bullets

setInterval(function() {

  for (var i = 0; i < bullets.length; i++) {

    //movement

    bullets[i].x = bullets[i].x + bullets[i].dx;
    bullets[i].y = bullets[i].y + bullets[i].dy;

    //wall collision

    let collided = false;

    if (bullets[i].x >= 3900) {
      collided = true;
    }

    if (bullets[i].x <= 0) {
      collided = true;
    }

    if (bullets[i].y >= 3900) {
      collided = true;
    }

    if (bullets[i].y <= 0) {
      collided = true;
    }

    if (collided) {
      bullets.splice(i,1);
      console.log("cronk");
    }
  }
}, 1000/60); // bullet updates

io.on('connection', function(socket) {

  socket.on('new player', function() {

    // if (start == false) {
    //   // players[socket.id] = new Player(socket.id);
    //   waitingplayers[socket.id] = new Player(socket.id);
    //   console.log("New Player: " + socket.id)
    //   room = room + 1;
    //   io.sockets.emit("not started")
    // } else if (start == true){
    //   waitingplayers[socket.id] = new Player(socket.id);
    //   io.sockets.emit("already playing", room); //client side needs a screen to come up for this
    //   let i = 0;
    //   for (var id in players) {
    //     i = i + 1;
    //   }
    //   console.log("already started", i);
    // }

    waitingplayers[socket.id] = new Player(socket.id);
    room = room + 1


  });

  socket.on('movement', function(data) {

    var player = players[socket.id] || {};

    if (data.left) {
      if (player.x - 20 >= 0 - 63) {
        player.x -= 3;
      }
    }

    if (data.up) {
      if (player.y - 20 >= 0 - 63) {
        player.y -= 3;
      }
    }

    if (data.right) {
      if (player.x + 20 <= 3850) {
        player.x += 3;
      }
    }

    if (data.down) {
        if (player.y + 20 <= 3850) {
        player.y += 3;
      }
    }

    if (player.x - 20 <= 0) {
      player.x = 0 + 20;
    }

    if (player.x + 20 >= 3850) {
      player.x = 3850 - 20;
    }

    if (player.y - 20 <= 0) {
      player.y = 0 + 20;
    }

    if (player.y + 20 >= 3850) {
      player.y = 3850 - 20;
    }

    //Kill player
    if(player.hp <= 0) {
      delete players[socket.id];
      waitingplayers[socket.id] = new Player(socket.id);
      io.sockets.emit("game over")
    }

    var collision = false;
    for (p2 in players) {

      p2 = players[p2];
      if (player.id != p2.id && p2.id != NaN) {

        var a = player.x - p2.x
        var b = player.y - p2.y
        var c = player.r*2
        if (a*a + b*b <= c*c) {
          collision = true;
        }
      }
    }

    for (var i = 0; i < bullets.length; i++) {

      var a = player.x - bullets[i].x
      var b = player.y - bullets[i].y
      var c = player.r*2
      if (a*a + b*b <= c*c) {

        collision = true;
        player.hp = player.hp - 1;
        bullets.splice(i,1);
        console.log("bullet hit " + player.id);
      }
    }
    if (collision == true) {
      player.color = 'red';
    } else {
      player.color = 'green';
    }
  });


  socket.on('mouseclick', function(data) {
    // if(start) { //TEMP
      var player = players[socket.id] || {};
      if (data.left == true) {

        bullets.push(new Bullet(player, data.mx, data.my));
      }
      console.log(data);

    // }
  });

  socket.on('disconnect', function() {

    delete players[socket.id]
    delete waitingplayers[socket.id];
    io.sockets.emit('message', 'disconnect recieved');
    // room = room - 1

  });

  socket.on('pressedStart', function() {
    if(start == false) {
      waitingplayers[socket.id].state = "ready";
      console.log(""+ socket.id + " is ready to start!");
    }
  });

}); //player updates


setInterval(function(){
  currentreadycount = 0;
  for (const waitingplayer in waitingplayers) {
    if (waitingplayers[waitingplayer].state == "ready") {
      currentreadycount += 1;
    }
  }
  if (currentreadycount >= 2 && start == false) {
    start = true
    console.log("game started!!!!!")
    players = waitingplayers;
    waitingplayers = {};
    for (var id in players) {

    }
  }

  //restting after game end
  let reseti = 0;
  let winnerid;
  for (var id in players) {
    reseti = reseti + 1;
    winnerid = id;
  }
  if (start == true) {
    if (reseti == 0 || reseti == 1) { //ready to reset, only one or zero players left
      console.log("resetting with " + reseti + " in players table")
      if (winnerid) {
        delete players[winnerid];
        waitingplayers[winnerid] = new Player(winnerid);
        room = 1;
      }
      
      bullets = []
      waypoints[0] = new Waypoint(250,250,0)
      waypoints[1] = new Waypoint(500,500,1)
      waypoints[2] = new Waypoint(750,750,2)
      start = false;
      nextteamselect = 0
      let i = 0;
      for (var id in waitingplayers) {
        i = i + 1;
      }
      room = i;
      console.log("restarted with ", + room + "players now waiting")
    }
  }
//next time - set it so players reeset to different spots and their x and y and stuff resets
//maybe just create new players!
}, 1000/10)

setInterval(function(){

  for (pl in players) {
    // console.log(waypoints.length);
    for (var i = 0; i < waypoints.length; i++) {
      // console.log("hello");
      let player = players[pl];
      var point_a = player.x - waypoints[i].x
      var point_b = player.y - waypoints[i].y
      var point_c = 25*2
      // console.log(player.teamid);
      { // Test and send waypoints -------------------------------
        let send = true;
        if (point_a*point_a + point_b*point_b <= point_c*point_c) {
          if (player.teamid == 0){
            // console.log("score +1");
            if (waypoints[i].points <= 99) {
              waypoints[i].points += 1
              send = true
              console.log(waypoints[i].points);
              if (waypoints[i].points >= 56) {
                waypoints[i].team = 0
                console.log("Team 0 is winning!");
              }
            }
          }
          if (player.teamid == 1){
            // console.log("score -1");
            if (waypoints[i].points >= 1) {
              waypoints[i].points -= 1
              send = true
              console.log(waypoints[i].points);
              if (waypoints[i].points <= 44) {
                waypoints[i].team = 1
                console.log("Team 1 is winning!");
              }
            }
          }
        }
        if(send) {
          sendWaypoints(waypoints);
          send = false;
        }
      }
      //--------------------------------------------
    }
  }
}, 1000/5);

function sendWaypoints(waypoints) {
  let points = [];
  for (var i = 0; i < waypoints.length; i++) {
    let point = {
      "x": waypoints[i].x,
      "y": waypoints[i].y,
      "team": waypoints[i].team,
      "points": waypoints[i].points
    }
    points.push(point);
  }
  io.sockets.emit('waypoints', points)
}

setInterval(function() {
  io.sockets.emit("isStart", start, room)
}, 1000/60);


setInterval(function() {

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

      var a = player.x - bullets[i].x;
      var b = player.y - bullets[i].y;
      var c = 900000;

      if (a*a + b*b <= c*c) {
        bulletsOnScreen.push(bullets[i]);
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

function reset() {

}


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
    this.x = this.x + (this.dx*2);
    this.y = this.y + (this.dy*2);
  }
}

class Player {
  constructor(id) {
    this.x = 450;
    this.y = 400;
    this.right = false;
    this.left = false;
    this.up = false;
    this.down = false;
    this.id = id;
    this.teamid = nextteamselect
    if (this.teamid == 0) {
      nextteamselect = 1
    }
    if (this.teamid == 1) {
      nextteamselect = 0
    }
    if (this.teamid == 0) {
      this.x = 100;
    } else {
      this.x = 500;
    }
    if (this.teamid == 0) {
      this.y = 100;
    } else {
      this.y = 500;
    }
    this.hp = 10
    this.r = 10
    this.state = "waiting" //waiting or ready
  }
}

class Waypoint {
  constructor(x,y,t) {
    this.x = x
    this.y = y
    this.r = 25
    this.team = t
    this.points = 0
  }
}
