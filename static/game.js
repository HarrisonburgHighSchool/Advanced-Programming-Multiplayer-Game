var socket = io();

// Log messages from server to the console
socket.on('message', function(data) {
  console.log(data);
});


let spritesheet;        // temporary spritesheet storage, before slicing
let spritedata;         // spritesheet JSON data
let down = [];          // temporary down animation storage
let up = [];            // temporary up animation storage

let players = [];       // Store the enemy players
let serverPlayers = []; // Temporary storage for players from the server
let bullets = [];       // Store projectiles

var player; // The player object will go here, eventually

// An object to keep track of what
// direction the player is moving
var movement = {
  up: false,
  down: false,
  left: false,
  right: false
}

var attack = {
  bullet: false,
}

// A table to keep track of mouse data
var mouse = {
  left: false,
  mx: 0,
  my: 0
}

var pl = {
  x: 0,
  y: 0
}

// Listens to activity on the page, triggers when
// mouse is clicked
document.addEventListener('click', function(event) {
  mouse.left = true;
  mouse.mx = mouseX;
  mouse.my = mouseY;
  socket.emit('mouseclick', mouse);
  console.log('click');

});

// document.addEventListener('mousereleased', function(event) {
//   mouse.left = false;
// });

// Listens for keypresses on the DOM,
// updates relevant data structures
document.addEventListener('keydown', function(event) {
  switch (event.keyCode) {
    case 65: // A
      movement.left = true;
      player.left = true; // this seems redundant
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

// Listens for key releases on the DOM,
// updates relevant data structures
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

function preload() {
  // Load animation assets
  spritedata = loadJSON('/assets/Akan.json'); // Frame information
  front = loadImage('/assets/Akan Movements 15.png'); // Forward walk spritesheet
  back = loadImage('/assets/Akan Movements 16.png');   // Backward walk spritesheet
  left = loadImage('/assets/Akan Movements 17.png');  // Left walk spritesheet
  right = loadImage('/assets/Akan Movements 18.png'); // Right walk spritesheet
  frontright = loadImage('/assets/Akan Movements 19.png');  // ForwardRight walk spritesheet
  frontleft = loadImage('/assets/Akan Movements 20.png'); // ForwardLeft walk spritesheet
  backright = loadImage('/assets/Akan Movements 21.png'); // BackwardRight walk spritesheet
  backleft = loadImage('/assets/Akan Movements 22.png');  // BackwardLeft walk spritesheet
}

// P5js function, runs once
// after preload()
function setup() {
  createCanvas(900, 800); // create the window
  noCursor();             // don't show the cursor

  // Slice up front spritesheet
  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = front.get(pos.x, pos.y, pos.w, pos.h, );
    down.push(img);
  }

  // Slice up back spritesheet
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = back.get(pos.x, pos.y, pos.w, pos.h, );
    up.push(img);
  }

  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = left.get(pos.x, pos.y, pos.w, pos.h, );
    left.push(img);
  }

  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = right.get(pos.x, pos.y, pos.w, pos.h, );
    right.push(img);
  }


  // loading assets / naming assets

  //Player (down animation, up animation, id, x, y, speed)
  player = new Sprite(down, up, 'self', 0, 50, 0.125);

  imgg = loadImage('assets/Grass1.png');
  imgr = loadImage('assets/Rock1.gif');
  imgt = loadImage('assets/tree1.png');
  imgt2 = loadImage('assets/tree2.png');

  // Tell the server that a new player is loaded
  socket.emit('new player');
}



// Renderer
function draw() {
  background(255);


  { // Draw the map
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

  // Draw the environment stuff
  image(imgr, 322, 5);
  image(imgt, 0, 10);
  image(imgt2, 200, 5);


  // Draw crosshair
  {
    let plx = player.x + 70
    let ply = player.y + 70
    let c = dist(mouseX, mouseY, plx, ply);
    let d = constrain(c, 0, 100);
    let x = -((d / c) * (plx - mouseX)) + plx
    let y = -((d / c) * (ply - mouseY)) + ply
    line(player.x + 63, player.y + 63, x, y);
    ellipse(x, y, 10);
  }

  // What are these for?
  image(imgr, 0, 5);
  image(imgr, 322, 5);
  image(imgr, 350, 200);

  image(imgr, 200, 300);
  image(imgr, 80, 300);

  image(imgt, 0, 10);
  image(imgt2, 100, 5);

  // Crosshair placeholder



  // Check player direction, set animation image
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

  // Draw the player
  player.show();

  // Draw the enemies
  for(var id in players) {
    players[id].show();
  }

  // Add new players sent by the server, and update existing ones
  for(i = 0; i < serverPlayers.length; i++) {
    let playerPush = true; // assume the player is new

    // Check to see if a player with the same id is already
    // in the players table
    for(id in players) {
      if (players[id].id == serverPlayers[i].id) {
        playerPush = false; // if so, the player isn't new
      }
    }

    // If the player is new...
    if(playerPush) {
      // Create a new Sprite object in the players table to match the new player
      players[serverPlayers[i].id] = new Sprite(up, down, serverPlayers[i].id, serverPlayers[i].x, serverPlayers[i].y);
      console.log("New Player at X: " + serverPlayers[i].x + ", " + serverPlayers[i].y);
    } else {
      // If the player isn't new,
      // Just update it's position
      players[id].x = serverPlayers[i].x;
      players[id].y = serverPlayers[i].y;
    }
  }

  // --------------------------------------------------
  // Need code to delete objects from the players table
  // --------------------------------------------------


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
  // for(var id in bullets) {
  //   bullets[id].show();
  // }

} // end the draw() function


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

socket.on('state', function(me, bullets) {
  player.x = me.x;
  player.y = me.y;
  socket.emit('movement', movement);
});

// Server sends table full of nearby players
socket.on('nearbyPlayers', function(playersOnScreen) {
  serverPlayers = playersOnScreen
});

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
