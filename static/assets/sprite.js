class Sprite {
  constructor(down, up, left, right, id, x, y, speed) {
    this.id = id; // ID from the server
    this.x = x;
    this.y = y;
    this.len = up.length;
    this.speed = speed;     // Animation speed
    this.index = 0;         // Animation counter
    this.imgs = {
      "down": down,         // Down animation
      "right": right,
      "up": up,             // Up animation
      "left": left
    }
    this.img = this.imgs["down"];
    this.right = false;
    this.left = false;
    this.up = false;
    this.down = false
  }


  // Draw the sprite
  show() {
    let index = floor(this.index) % this.len;
    image(this.img[index], this.x, this.y);
  }

  // Update the player animation
  animate()  {
    this.index += this.speed;
  }
}
