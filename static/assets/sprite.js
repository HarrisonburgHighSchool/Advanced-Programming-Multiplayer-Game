class Sprite {
  constructor(animation, id, x, y, speed) {
    this.x = x;
    this.y = y;
    this.animation = animation;
    this.len = this.animation.length;
    this.speed = speed;
    this.index = 0;
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



  show() {
  image(this.animation[this.index % this.len], this.x, this.y,);

  }


 animate()  {
    this.index += this.speed;

   }
}
