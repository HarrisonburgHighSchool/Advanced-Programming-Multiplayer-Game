let spritesheet;
let spritedata;

let animation = [];

let stomper;

function preload()  {
  spritedata = loadJSON('/assets/stomper.json');
  spritesheet = loadImage('/assets/Stomper Movements 4 Front.png');
}


function setup() {
  createCanvas(640, 480);
  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = spritesheet.get(pos.x, pos.y, pos.w, pos.h,) ;
    animation.push(img);
  }


  stomper = new Sprite(animation, 0, 50, 1);

}

function draw() {
  background(0);


  stomper.show();
  stomper.animate();


  //image(animation[frameCount % animation.length], 0, 0);
}
