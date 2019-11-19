let spritesheet;
let spritedata;

let animation = [];

let soldier;

function preload()  {
  spritedata = loadJSON('/assets/Akan.json');
  spritesheet = loadImage('/assets/Akan.png');
}


function setup() {
  createCanvas(640, 480);
  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h,) ;
    animation.push(img);
  }


  soldier = new Sprite(animation, 0, 50, 0.25);

}

function draw() {
  background(0);


  soldier.show();
  soldier.animate();


  //image(animation[frameCount % animation.length], 0, 0);
}
