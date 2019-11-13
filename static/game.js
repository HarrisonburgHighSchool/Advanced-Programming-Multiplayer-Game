
var socket = io();

socket.on('message', function(data) {
  console.log(data);
});

// let plx= 200;
// let ply = 200;


function setup() {
  createCanvas(800, 600);
  socket.emit('new player');
  player = new Player();
}

function draw(){
  background(200);
  {
    let plx = player.x + 96
    let ply = player.y + 96
    let c = dist(mouseX,mouseY, plx, ply);
    let d = constrain(c,0,100);
    let x = -((d/c) * (plx-mouseX))+plx
    let y = -((d/c) * (ply-mouseY))+ply
      ellipse(x,y,10)
}

  //Send movement data to the server
  image(player.img, player.x, player.y)

  if(player.left == true) {
    player.x = player.x - 10;
    player.img = player.imgs["left"];
  }
  if (player.right == true) {
    player.x = player.x + 10
    player.img = player.imgs["right"];
  }
  if (player.up == true) {
    player.y = player.y - 10
    player.img = player.imgs["up"];
  }
  if (player.down == true) {
    player.y = player.y + 10
    player.img = player.imgs["down"];
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
      "down": loadImage('/assets/Down.png'),
      "right": loadImage('/assets/Right.png'),
      "up":loadImage('/assets/Up.png'),
      "left": loadImage('/assets/Left.png')
    }
    this.img = this.imgs["down"];
    this.right = false;
    this.left = false;
    this.up = false
    this.down = false
  }
}
