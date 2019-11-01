var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}

var attack = {
  normal: false,
  self: false
}

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 77: // M
      attack.normal = true;
      break;
    case 75: //k
      attack.self = true;
      break;
  }
});

document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 77: // M
      attack.normal = false;
      break;
    case 75: //k
      attack.self = false;
      break;
  }
});

document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      break;
    case 87: // W
      movement.up = true;
      break;
    case 68: // D
      movement.right = true;
      break;
    case 83: // S
      movement.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      break;
    case 87: // W
      movement.up = false;
      break;
    case 68: // D
      movement.right = false;
      break;
    case 83: // S
      movement.down = false;
      break;
  }
});

function setup() {
  createCanvas(800, 600);
  socket.emit('new player');
}

// This is basically the "draw" function
socket.on('state', function(players) {
  background(200);

  // For every player object sent by the server...
  for (var id in players) {
    var player = players[id];
    fill(player.color)
    ellipse(player.x, player.y, 20); // Draw an ellipse
    text(player.hp, player.x - 30, player.y - 30);
  }

  // Send movement data to the server
  socket.emit('movement', movement);
});
