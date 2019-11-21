var socket = io();

socket.on('message', function(data) {
  console.log(data);
});

// let plx= 200;
// let ply = 200;


let spritesheet;
let spritedata;

let animation = [];

let soldier;

function preload()  {
  spritedata = loadJSON('/assets/Akan.json');
  spritesheet = loadImage('/assets/Akan.png');
}

function setup() {
  createCanvas(1000, 1000);
  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h, );
    animation.push(img);
  }


  soldier = new Sprite(animation, 0, 50, 0.25);
  player = new Sprite(animation, 0, 50, 0.25);
  imgg = loadImage('assets/Grass1.png');
  imgr = loadImage('assets/Rock1.gif');
  imgt = loadImage('assets/tree1.png');
  imgt2 = loadImage('assets/tree2.png');
  socket.emit('new player');
  //player = new Player();
}

function draw() {


  soldier.show();
  soldier.animate();


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

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    player.left = true;
  }
  if (keyCode === RIGHT_ARROW) {
    player.right = true;
  }
  if (keyCode === UP_ARROW) {
    player.up = true;
  }
  if (keyCode === DOWN_ARROW) {
    player.down = true;
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW) {
    player.left = false;
  }
  if (keyCode === RIGHT_ARROW) {
    player.right = false;
  }
  if (keyCode === UP_ARROW) {
    player.up = false;
  }
  if (keyCode === DOWN_ARROW) {
    player.down = false;
  }
}

class Player {
  constructor() {
    this.x = 200;
    this.y = 200;
    this.imgs = {
      "down": loadImage('assets/stomperD.png'),
      "right": loadImage('assets/stomperR.png'),
      "up": loadImage('assets/stomperU.png'),
      "left": loadImage('assets/stomperL.png')
    }
    this.img = this.imgs["down"];
    this.right = false;
    this.left = false;
    this.up = false;
    this.down = false

  }
}
