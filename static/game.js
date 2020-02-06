var socket = io();
// Log messages from server to the console
socket.on('message', function(data) {
  console.log(data);
});

let spritesheet;        // temporary spritesheet storage, before slicing
let spritedata;         // spritesheet JSON data
let down = [];          // temporary down animation storage
let up = [];            // temporary up animation storage
let left = [];          // temporary left animation storage
let right = [];         // temporary right animation storage
       //
let players = {}; // Store the enemy players
let serverPlayers = []; // Temporary storage for players from the server
let bullets = [];
let serverBullets = []; // Store projectiles
let waypoints = [];
wpoints = 0;
let playersinroom = 0; //the number of players waiting
let isGameStarted = false;
let pressedStart = false;


var player; // The player object will go here, eventually

var cross = {
  x: 0,
  y: 0
}

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
  let count = 0;
  for (id in players) {
    count += 1;
  }
  console.log(count);

});

document.addEventListener('mousereleased', function(event) {
  mouse.left = false;
});

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
    case 68: //
      movement.right = true;
      player.right = true;
      break;() => {

      }
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

//

function preload() {
  // Load animation assets
  spritedata = loadJSON('/assets/Akan.json'); // Frame information
  front = loadImage('/assets/Akan Movements 15.png'); // Forward walk spritesheet
  back = loadImage('/assets/Akan Movements 16.png');   // Backward walk spritesheet
  hidari = loadImage('/assets/Akan Movements 17.png');  // Left walk spritesheet
  migi = loadImage('/assets/Akan Movements 18.png');
  // // Right walk spritesheet
  //frontright = loadImage('/assets/Akan Movements 19.png');  // ForwardRight walk spritesheet
  //frontleft = loadImage('/assets/Akan Movements 20.png'); // ForwardLeft walk spritesheet
  //backright = loadImage('/assets/Akan Movements 21.png'); // BackwardRight walk spritesheet
  //backleft = loadImage('/assets/Akan Movements 22.png');  // BackwardLeft walk spritesheet
}

// P5js function, runs once
// after preload()

// Pointer lock stuff ----------------------------------------------------------
var canvas;

function lockChangeAlert() {
  // if (document.pointerLockElement === canvas ||
  //     document.mozPointerLockElement === canvas) {
  //   console.log('The pointer lock status is now locked');
  //   document.addEventListener("mousemove", updatePosition, false);
  // } else {
  //   console.log('The pointer lock status is now unlocked');
  //   document.removeEventListener("mousemove", updatePosition, false);
  // }
}

function updatePosition(e) {
  cross.x += e.movementX;
  cross.y += e.movementY;
}
document.addEventListener('pointerlockchange', lockChangeAlert, false);
document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

// -----------------------------------------------------------------------------

function setup() {
  createCanvas(900, 800); // create the window

  // Pointer lock stuff
  canvas = document.querySelector('canvas');
  canvas.onclick = function() {
    //canvas.requestPointerLock();
  };
  //canvas.requestPointerLock = canvas.requestPointerLock || canvas.mozRequestPointerLock;
  //document.exitPointerLock = document.exitPointerLock || document.mozExitPointerLock;
  // ----------


  noCursor(); // don't show the cursor

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
    let img = hidari.get(pos.x, pos.y, pos.w, pos.h, );
    left.push(img);
  }

  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = migi.get(pos.x, pos.y, pos.w, pos.h, );
    right.push(img);
  }

  
  // loading assets / naming assets

  //Player (down animation, up animation, id, x, y, speed)
  player = new Sprite(down, up, left, right, 'self', 0, 50, 0.125);

  imgg = loadImage('assets/Grass1.png');
  imgr = loadImage('assets/Rock1.gif');
  imgt = loadImage('assets/tree1.png');
  imgt2 = loadImage('assets/tree2.png');
  Enemy = loadImage('assets/Akan Movements 13.png');
  awp = loadImage('assets/Way Point.png');
  awpB = loadImage('assets/Way Point B.png');
  awpR = loadImage('assets/Way Point R.png');

  // Tell the server that a new player is loaded
  socket.emit('new player');
}



// Renderer
function draw() {
  background(255);
  push();
  translate(450 - player.x, 400 - player.y); { // Draw the map
    for (x = 0; x < 20; x++) {
      for (y = 0; y < 20; y++) {
        image(
          imgg,
          32 * x,
          32 * y
        );
      }
    }
  }

  // Draw the assets stuff
  image(imgr, 322, 5);
  image(imgt, 0, 10);
  image(imgt2, 200, 5);

  player.show();

  // Draw the enemies
  for (var id in players) {
    players[id].show();
    if (players[id].left == true) {
      //player.x = player.x - 3;
      players[id].img = players[id].imgs["left"];
      players[id].animate();
    }
    if (players[id].right == true) {
      //player.x = player.x + 3
      players[id].img = players[id].imgs["right"];
      players[id].animate();
    }
    if (players[id].up == true) {
      //player.y = player.y - 3
      players[id].img = players[id].imgs["up"];
      players[id].animate();
    }
    if (players[id].down == true) {
      //player.y = player.y + 3
      players[id].img = players[id].imgs["down"];
      players[id].animate();
    }
  }

    // {
    //   let plx = player.x
    //   let ply = player.y
    //   let c = dist(cross.x, cross.y, plx, ply);
    //   let d = constrain(c, 0, 100);
    //   let x = -((d / c) * (plx - cross.x)) + plx
    //   let y = -((d / c) * (ply - cross.y)) + ply
    //   line(player.x, player.y, x, y);
    //   ellipse(x, y, 10);
    //   cross.x = x;
    //   cross.y = y;
    // }
    // Enemy = circle()
    // circle(250, 250, 50);
  // Draw the enemies
  //circle(250, 250, 50);
  for (var i=0; i<waypoints.length; i++) { /////////////////////////////////////
    //waypoints[id].show();
    //waypoints = waypoints[i];
    fill(255);
    //circle(waypoints[i].x, waypoints[i].y, 100);
    if(waypoints[i].team == 1) {
      image(awpB, waypoints[i].x, waypoints[i].y);
    } else {
      image(awp, waypoints[i].x, waypoints[i].y)
    } //else {
      //circle(waypoints[i].x, waypoints[i].y, 50)
    //}
  }

  for (var i = 0; i < bullets.length; i++) {
    fill("blue");
    circle(bullets[i].x, bullets[i].y, 5);
  }


  pop();

  {
    let plx = 450
    let ply = 400
    let mx = mouseX
    let my = mouseY
    let c = dist(mx, my, plx, ply);
    let d = constrain(c, 0, 100);
    let x = -((d / c) * (plx - mx)) + (plx)
    let y = -((d / c) * (ply - my)) + (ply)
    line(plx, ply, x, y);
    ellipse(x, y, 10);
    text()
  }
  //circle(250, 250, 50);

  //pop();

  // ellipse(100, 100, 200, 200)

  // rect(700, .1, 250, 70)
  // image(life, 700, .1)
  // image(life, 765, .1)
  // image(life, 835, .1)

  //Health Bar

  // rect(350, 700, 70, 70)
  // rect(450, 700, 70, 70)
  // rect(550, 700, 70, 70)
  {
    textSize(32);
    {fill("black")
    rect(120, 20, 200, 50)}

    {fill("red")
    rect(120, 20, player.hp*20, 50)}
    
    {fill("black")
    text(player.hp, 360, 60);
    text("|", 400, 60);
    text(wpoints, 415, 60)
    }


    // fill("red");
    // rect(10,10,70,50);

    // text(mouseX + ", " + mouseY, 10, 10);
  }

  // Draw crosshair


  // What are these for?
  // image(imgr, 0, 5);
  // image(imgr, 322, 5);
  // image(imgr, 350, 200);
  //
  // image(imgr, 200, 300);
  // image(imgr, 80, 300);
  //
  // image(imgt, 0, 10);
  // image(imgt2, 100, 5);

  // Crosshair placeholder



  // Check player direction, set animation image
  if (player.left == true) {
    //player.x = player.x - 3;
    player.img = player.imgs["left"];
    player.animate();
  }
  if (player.right == true) {
    //player.x = player.x + 3
    player.img = player.imgs["right"];
    player.animate();
  }
  if (player.up == true) {
    //player.y = player.y - 3
    player.img = player.imgs["up"];
    player.animate();
  }
  if (player.down == true) {
    //player.y = player.y + 3
    player.img = player.imgs["down"];
    player.animate();
  }

  // Draw the player


  // Add new players sent by the server, and update existing ones
  for (i = 0; i < serverPlayers.length; i++) {
    let playerPush = true; // assume the player is new

    // Check to see if a player with the same id is already
    // in the players table
    for (id in players) {
      if (players[id].id == serverPlayers[i].id) {
        playerPush = false; // if so, the player isn't new
      }
    }

    // If the player is new...
    if (playerPush) {
      // Create a new Sprite object in the players table to match the new player
      players[serverPlayers[i].id] = new Sprite(up, down, left, right, serverPlayers[i].id, serverPlayers[i].x, serverPlayers[i].y);
      console.log("New Player at X: " + serverPlayers[i].x + ", " + serverPlayers[i].y);
    } else {
      // If the player isn't new,
      // Just update it's position
      players[id].x = serverPlayers[i].x;
      players[id].up = serverPlayers[i].up;
      players[id].y = serverPlayers[i].y;
      players[id].down = serverPlayers[i].down;
    }
  }

c = color('hsb(160, 100%, 50%)');
fill(c);
ellipse(50, 50, 80, 80);


c = color(255, 255, 255);
fill(c);


ellipse(50, 50, 5, 5) // player minimap
 c = color(255, 0, 0);
 fill(c);

//place enemies on the minimap
 for(var p in players){
   let miniX = map(players[p].x, 0, 800, 34, 77)
   let miniY = map(players[p].y, -200, 800, 21, 90)
   if(dist(50, 50, miniX, miniY) < 40) {
     ellipse(miniX, miniY, 5, 5)
   }
 }


 fill(255, 0, 0);

 document.addEventListener('click', function(event) {
  if (isGameStarted == false) {
    console.log(isGameStarted)
    //  fill(255,255,255)
     x = 0
     y = 0
     w = 100
     h = 50
     {fill("black")
   rect(x,y,w,h)}  //click to start backgroud stuff

   {fill("white")
   textSize(20)
   text("Click to start", 5, 125)}  // click to start
     if (mouseX > x && mouseX < x+w && mouseY > y && mouseY < y+h && pressedStart == false) {
      // if (mouse.left = true) {
        pressedStart = true;
        socket.emit('pressedStart');
        console.log('bruh');
      // }
     }
   }
});



  // for(i = 0; i < serverBullets.length; i++) {
  //   let bulletPush = true; // assume the player is new
  //
  //   // Check to see if a player with the same id is already
  //   // in the players table
  //   for (var j = 0; j < bullets.length; i++) {
  //     if (bullets[j] == serverBullets[i]) {
  //       bulletPush = false; // if so, the player isn't new
  //     }
  //   }
  //
  //   // If the player is new...
  //   if(bulletPush) {
  //     // Create a new Sprite object in the players table to match the new player
  //     bullets[i] = serverBullets[i]
  //     console.log("New Bullet at X: " + serverBullets[i].x + ", " + serverBullets[i].y);
  //   } else {
  //     // If the player isn't new,
  //     // Just update it's position
  //     bullets[i].x = serverBullets[i].x;
  //     bullets[i].y = serverBullets[i].y;
  //   }
  // }

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
  let dx = me.x - player.x;
  let dy = me.y - player.y;
  cross.x += dx;
  cross.y += dy;
  player.x = me.x;
  player.y = me.y;
  player.hp = me.hp;
  console.log(me.clipamount);
  socket.emit('movement', movement);
});
socket.on('waypoints', function(wp) {
  waypoints = wp;
  console.log(wp.length);
});
//receives is game has started, and how many players are in room
socket.on('isStart', function(start, room ){
  playersinroom = room
  isGameStarted = start
  console.log("room = " + room)
  console.log("start = " + start)
});
//when player dies
socket.on('game over', function(){
  pressedStart = false //lets player press ready button again
});
// Server sends table full of nearby players
socket.on('nearbyPlayers', function(playersOnScreen) {
  serverPlayers = playersOnScreen;
});

socket.on('nearbyBullets', function(bulletsOnScreen) {
  // serverBullets = bulletsOnScreen
  bullets = bulletsOnScreen;
});

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
