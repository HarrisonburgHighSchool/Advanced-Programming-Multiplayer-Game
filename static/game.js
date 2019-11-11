
var socket = io();

socket.on('message', function(data) {
  console.log(data);
});

let plx= 50;
let ply = 50;
let bubble;

function setup() {
  createCanvas(800, 600);
  socket.emit('new player');
  bubble = new Bubble();
  print(bubble.x,bubble.y);
}

// This is basically the "draw" function
// socket.on('state', function(players) {
function draw(){
  background(200);
let c = dist(mouseX,mouseY, plx, ply);
let d = constrain(c,0,100);

let x = -((d/c) * (plx-mouseX))+plx
let y = -((d/c) * (ply-mouseY))+ply
  // For every player object sent by the server...

ellipse(x,y,10)
ellipse(plx,ply,50);

  //Send movement data to the server
bubble.move();
bubble.show();


}
// function show() {
//   stroke(255);
//   strokeweight(4);
//   noFill();
//   ellipse(bubble.x, bubble.y, 24, 24);
// }
class Bubble{
  constructor(){
this.x = 200;
this.y = 200;
}
move() {
   bubble.x = bubble.x + random (-5,5);
   bubble.y = bubble.y + random (-5,5);
  }
  show() {
    stroke(255);
    strokeweight(20);
    noFill();
    ellipse(bubble.x, bubble.y, 24, 24);
  }
}
