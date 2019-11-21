var socket = io();

socket.on('message', function(data) {
  console.log(data);
});

// let plx= 200;
// let ply = 200;


let spritesheet;
let spritedata;

let animation = [];

let stomper;

function preload() {
  spritedata = loadJSON('/assets/stomper.json');
  spritesheet = loadImage('/assets/Stomper Movements 4 Front.png');
}


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
  createCanvas(1000, 1000);

  noCursor();

  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h, );
    animation.push(img);
  }


  player = new Sprite(animation, 0, 50, 1);

  imgg = loadImage('assets/Grass1.png');
  imgr = loadImage('assets/Rock1.gif');
  imgt = loadImage('assets/tree1.png');
  imgt2 = loadImage('assets/tree2.png');
  socket.emit('new player');
}


// Renderer
function draw() {

  //image(animation[frameCount % animation.length], 0, 0);

  {
    for (x = 0; x < 6; x++) {
      for (y = 0; y < 6; y++) {
        image(
          imgg,
          192 * x,
          192 * y
        );
      }
    }
  }
  {
    let plx = player.x + 96
    let ply = player.y + 96
    let c = dist(mouseX, mouseY, plx, ply);
    let d = constrain(c, 0, 100);
    let x = -((d / c) * (plx - mouseX)) + plx
    let y = -((d / c) * (ply - mouseY)) + ply
    //   // For every player object sent by the server...

    ellipse(x, y, 10)
  }


  image(imgr, 0, 5);
  image(imgr, 322, 5);
  image(imgr, 350, 200);
  //
  image(imgr, 200, 300);
  image(imgr, 80, 300);
  //
  image(imgt, 0, 10);
  image(imgt2, 100, 5);
  //player
  //image(player.img, player.x, player.y)

  player.show();




  if (player.left == true) {
    player.x = player.x - 10;
    player.img = player.imgs["left"];
    player.animate();
  }
  if (player.right == true) {
    player.x = player.x + 10
    player.img = player.imgs["right"];
    player.animate();
  }
  if (player.up == true) {
    player.y = player.y - 10
    player.img = player.imgs["up"];
    player.animate();
  }
  if (player.down == true) {
    player.y = player.y + 10
    player.img = player.imgs["down"];
    player.animate();
  }
}

// socket.on('state', function(player, bullets) {
//   background(100);
//   noFill();
//   strokeWeight(3);
//   rect(0, 0, 1700, 900);
//   strokeWeight(1);
//
//   noFill();
//   fill(255,255,255)
//   ellipse(player.x, player.y, 500); // Draw an ellipse
//   fill(player.color)
//   ellipse(player.x, player.y, 20); // Draw an ellipse
//   text(player.hp, player.x - 30, player.y - 30);
//
//   line((mouseX - 10), mouseY, (mouseX + 10), mouseY);
//   line(mouseX, (mouseY - 10), mouseX, (mouseY + 10))
//
//   line(mouseX, mouseY, player.x, player.y);
//
//   // for (var id in bullets) {
//   //   var bullet = bullets[id];
//   //   fill(211, 211, 211)
//   //   rect(bullet.x, bullet.y, 10, 10)
//   // }
//
//   // for (var i = 0; i < bullets.length; i++) {
//   //   var bullet = bullets[i];
//   //   fill(255, 0, 0)
//   //   rect(bullet.x, bullet.y, 10, 10)
//   // }
//
//   // Send movement data to the server//
//   socket.emit('movement', movement);
//
// });
//
// socket.on('nearbyPlayers', function(playersOnScreen) {
//   // For every player object sent by the server...
//   for (var i = 0; i < playersOnScreen.length; i++) {
//     var player = playersOnScreen[i];
//     fill(player.color)
//     ellipse(player.x, player.y, 20); // Draw an ellipse
//     text(player.hp, player.x - 30, player.y - 30);
//   }
//
// });
//
// socket.on('nearbyBullets', function(bulletsOnScreen) {
//   // console.log(bulletsOnScreen)
//   // For all bullets sent ~
//   for (var i = 0; i < bulletsOnScreen.length; i++) {
//     var bullet = bulletsOnScreen[i];
//     fill(255, 0, 0)
//     rect(bullet.x, bullet.y, 10, 10); // Draw Bullet
//   }
//
// });
