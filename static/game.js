var socket = io();

socket.on('message', function(data) {
  console.log(data);
});

// let plx= 200;
// let ply = 200;


let spritesheet;
let spritedata;


let down = [];
let up = [];

let animation = [];
let players = [];
let serverPlayers = [];
let bullets = [];


let soldier;

function preload() {
  // load solider
  spritedata = loadJSON('/assets/soldierWalk.json');
  front = loadImage('/assets/SoldierWalkFront.png');
  back = loadImage('/assets/SoldierWalkBack.png');
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

var pl = {
  x: 0,
  y: 0
}

// let frames = spritedata.frames;
// for (let i = 0; i < frames.length; i++) {
//   let pos = frames[i].position;
//   let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h, );
//   animation.push(img);
// }


var player;


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
      player.left = true;
      break;
    case 87: // W
      movement.up = true;
      player.up = true;
      break;
    case 68: // D
      movement.right = true;
      player.right = true;
      break;
    case 83: // S
      movement.down = true;
      player.down = true;
      break;
  }
});
document.addEventListener('keyup', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = false;
      player.left = false;
      break;
    case 87: // W
      movement.up = false;
      player.up = false;
      break;
    case 68: // D
      movement.right = false;
      player.right = false;
      break;
    case 83: // S
      movement.down = false;
      player.down = false;
      break;
  }
});

function setup() {

  // animation configuration
  createCanvas(900, 800);


  createCanvas(1000, 1000);

  noCursor();

  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = front.get(pos.x, pos.y, pos.w, pos.h, );
    down.push(img);
  }


  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = back.get(pos.x, pos.y, pos.w, pos.h, );
    up.push(img);
  }


  // loadimg assets / naming assets
  player = new Sprite(down, up, 'self', 0, 50, 0.125);
  imgg = loadImage('assets/Grass1.png');
  imgr = loadImage('assets/Rock1.gif');
  imgt = loadImage('assets/tree1.png');
  imgt2 = loadImage('assets/tree2.png');
  socket.emit('new player');
}



// Renderer
function draw() {
  background(255);
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

  image(imgr, 322, 5);

  image(imgt, 0, 10);
  image(imgt2, 200, 5);


  {
    let plx = player.x + 70
    let ply = player.y + 70
    let c = dist(mouseX, mouseY, plx, ply);
    let d = constrain(c, 0, 100);
    let x = -((d / c) * (plx - mouseX)) + plx
    let y = -((d / c) * (ply - mouseY)) + ply
    //   // For every player object sent by the server...
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

  line(player.x + 63, player.y + 63, mouseX, mouseY);
  ellipse(mouseX, mouseY, 10);
  //player
  //image(player.img, player.x, player.y)

  for(i = 0; i < serverPlayers.length; i++) {
    let playerPush = true;
    for(id in players) {
      if (players[id].id == serverPlayers[i].id) {
        playerPush = false;
      }
    }
    if(playerPush) {
      console.log("New Player at X: " + serverPlayers[i].x + ", " + serverPlayers[i].y);
      players[serverPlayers[i].id] = new Sprite(up, down, serverPlayers[i].id, serverPlayers[i].x, serverPlayers[i].y);
    } else {
      players[id].x = serverPlayers[i].x;
      players[id].y = serverPlayers[i].y;
    }
  }
  // for(i = 0; i < serverBullets.length; i++) {
  //   let bulletPush = true;
  //   for(id in players) {
  //     if (bullets[id].id == serverBullets[i].id) {
  //       bulletPush = false;
  //     }
  //   }
  //   if(bulletPush) {
  //     console.log("New Bullet at X: " + serverBullets[i].x + ", " + serverBullets[i].y);
  //     bullets[serverBullets[i].id] = new Sprite(animation, serverBullets[i].id, serverBullets[i].x, serverBullets[i].y);
  //   } else {
  //     bullets[id].x = serverBullets[i].x;
  //     bullets[id].y = serverBullets[i].y;
  //   }
  // }





  if (player.left == true) {
    player.x = player.x - 3;
    player.img = player.imgs["left"];
    player.animate();
  }
  if (player.right == true) {
    player.x = player.x + 3
    player.img = player.imgs["right"];
    player.animate();
  }
  if (player.up == true) {
    player.y = player.y - 3
    player.img = player.imgs["up"];
    player.animate();
  }
  if (player.down == true) {
    player.y = player.y + 3
    player.img = player.imgs["down"];
    player.animate();
  }
  // if (player.left == true) {
  //   player.x = player.x - 10;
  //   player.img = player.imgs["left"];
  //   player.animate();
  // }
  // if (player.right == true) {
  //   player.x = player.x + 10
  //   player.img = player.imgs["right"];
  //   player.animate();
  // }
  // if (player.up == true) {
  //   player.y = player.y - 10
  //   player.img = player.imgs["up"];
  //   player.animate();
  // }
  // if (player.down == true) {
  //   player.y = player.y + 10
  //   player.img = player.imgs["down"];
  //   player.animate();
  // }
  player.show();
  for(var id in players) {
    players[id].show();

  }

  // for(var id in bullets) {
  //   bullets[id].show();
  // }
}


// class Player {
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

// class Player {
//   constructor(down, up, x, y, speed) {
//     this.x = x;
//     this.y = y;
//     this.animation = down;
//     this.len = this.animation.length;
//     this.speed = speed;
//     this.index = 0;
//     this.imgs = {
//       "down": down,
//       "right": down,
//       "up": up,
//       "left": up
//     }
//     this.img = this.imgs["down"];
//     this.right = false;
//     this.left = false;
//     this.up = false;
//     this.down = false
//   }
//
//
//   show() {
//     let index = floor(this.index) % this.len;
//     image(this.img[index], this.x, this.y);
//   }
// }

socket.on('state', function(serverPlayer, bullets) {
  player.x = serverPlayer.x;
  player.y = serverPlayer.y;
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
  // Send movement data to the server//


  socket.emit('movement', movement);
//
});
//
socket.on('nearbyPlayers', function(playersOnScreen) {
  // players = [];
  // // For every player object sent by the server...
  // for (var i = 0; i < playersOnScreen.length; i++) {
  //   var player = playersOnScreen[i];
  //   player = new Sprite(animation, player.x, player.y, 0.25)
  //   let count = 0;
  //   for(var id in players) {
  //     count += 1;
  //   }
  //   console.log("Total players: " + count)
  //   // players.push(player);
  //   players[player.id] = null;
  //   players[player.id] = player;
  // }

  serverPlayers = playersOnScreen

});
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

class Enemy {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  show() {
    rect(this.x, this.y, 20, 20);
  }
}
