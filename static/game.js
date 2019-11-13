var socket = io();
socket.on('message', function(data) {
  console.log(data);
});



function setup() {
  createCanvas(800, 600);

}

// This is basically the "draw" function
socket.on('state', function(players) {
  background(200);
  fill(255);
  ellipse(400, 300, 50);
  noFill();
  ellipse(400, 300, 200)
  if(dist(mouseX, mouseY, 400, 300) < 100) {
    ellipse(mouseX, mouseY, 50, 50);
  } else {
    let x = (dist(mouseX,mouseY,400,300)/100)*(mouseX-400);
    let y = (dist(mouseX,mouseY,400,300)/100)*(mouseY-300);
    ellipse(x, y, 50, 50);
  }
  line(mouseX, mouseY,400, 300);

});
