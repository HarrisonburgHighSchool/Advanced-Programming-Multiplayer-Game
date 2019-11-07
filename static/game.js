var socket = io();
socket.on('message', function(data) {
  console.log(data);
});

let plx= 50;
let ply = 50;
function setup() {
  createCanvas(800, 600);
  socket.emit('new player');
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
  // Send movement data to the server
}
