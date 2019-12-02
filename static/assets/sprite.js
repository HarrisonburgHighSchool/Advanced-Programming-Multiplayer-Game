class Sprite {
  constructor(down, up, id, x, y, speed) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.animation = down;
    this.len = this.animation.length;
    this.speed = speed;
    this.index = 0;
    this.imgs = {
      "down": down,
      "right": down,
      "up": up,
      "left": up
    }
    this.img = this.imgs["down"];
    this.right = false;
    this.left = false;
    this.up = false;
    this.down = false
  }



  show() {
    let index = floor(this.index) % this.len;
    image(this.img[index], this.x, this.y);


  }


 animate()  {
    this.index += this.speed;

   }
}
