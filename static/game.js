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
  bullet: false,
}

var mouse = {
  left: false,
  mx: 0,
  my: 0
}


document.addEventListener('click', function(event) {

  mouse.left = true;
  mouse.mx = mouseX;
  mouse.my = mouseY;
  socket.emit('mouseclick', mouse);
  console.log('click');

});

// document.addEventListener('mousereleased', function(event) {
//
//   mouse.left = false;
//
// });

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
socket.on('state', function(player, bullets) {
  background(100);
  noFill();
  strokeWeight(3);
  rect(0, 0, 800, 600);
  strokeWeight(1);

  noFill();
  fill(255,255,255)
  ellipse(player.x, player.y, 200); // Draw an ellipse
  fill(player.color)
  ellipse(player.x, player.y, 20); // Draw an ellipse
  text(player.hp, player.x - 30, player.y - 30);

  line(mouseX, mouseY, player.x, player.y);

  // for (var id in bullets) {
  //   var bullet = bullets[id];
  //   fill(211, 211, 211)
  //   rect(bullet.x, bullet.y, 10, 10)
  // }

  for (var i = 0; i < bullets.length; i++) {
    var bullet = bullets[i];
    fill(255, 0, 0)
    rect(bullet.x, bullet.y, 10, 10)
  }

  // Send movement data to the server
  socket.emit('movement', movement);

});

socket.on('nearby', function(playersOnScreen) {
  // For every player object sent by the server...
  for (var i = 0; i < playersOnScreen.length; i++) {
    var player = playersOnScreen[i];
    fill(player.color)
    ellipse(player.x, player.y, 20); // Draw an ellipse
    text(player.hp, player.x - 30, player.y - 30);
  }

});
