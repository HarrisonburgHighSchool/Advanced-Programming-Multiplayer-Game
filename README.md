# Advanced Programming Multiplayer Game

## Table of Contents

 Selection
 Contact with Online
 Instructions
 Spawning Points
 Collision
 Territories and Results
 Loop

 Selection

 Contact with Online

 Instructions

 Spawning Points

 Collision

 Territories and Results

 Loop

Art & Animations

---

# Art & Animations

Title Screen
* Background Screen for Menu

Team Selection
* Each Force of Nations (Optional)

Player Selection
* Category
* Skills
* Following list of each stamina
* Weaponry Usage

Weaponry Selection
* Primary (Melee)
* Secondary
* Effects of damage to opponents

Contact with Online

Map Selection
* Vote for a map to play.

Random Selection of a team
* Calculating numbers of player in the game.

Instructions (Optional)

Loading Screen (Optional)

Spawning Point
* All Online Players Spawn to a selected map.

Start, Timer Start
* Countdown until all players are ready.
* Countdown to zero begins the game.

Collision with other enemies
* Each weapon with different amounts of damages affects the opponents (Poison, Fire, Electrified)
* If an opponent's health point goes down first, The killers achieves a kill, but no count for score.
* Same goes for your health point goes down first, you are counted as 1 death and spawning to an occupied territory or your origin spawn point.

Taking over Territories
* The amount of time in those areas you (Only your team) secured, achieves the worth points.
* Connecting to each territory with your occupied territories deserves more points.

Time up
* Time Limit ending to zero stops the game.
* Calculate the results and territory taken by each team

Show Result and Victors
* Kills
* Time Occupied
* Areas Occupied
* Deaths
* Total Scores
* Victors and Defeats

Continue and Repeat the Process
* Return
* Loop

## How to Set Up an Animation

Description of animations, and what you need to start:

Layer by layer, we made as a sprite sheet for letting able to load the image of sequence into the code.

### Step 1:

### Step ??: Make JSON File

Here's an example of a JSON file:

```javascript

```

### Step ??: Load the JSON

```javascript
code example

{
  "frames": [
    {
      "name": "stomper-01",
      "position": {
        "x": 0,
        "y": 0,
        "w": 128,
        "h": 128
      }
    },
    {
      "name": "stomper-02",
      "position": {
        "x": 128,
        "y": 0,
        "w": 128,
        "h": 128
      }
    },
    {
      "name": "stomper-03",
      "position": {
        "x": 256,
        "y": 0,
        "w": 128,
        "h": 128
      }
    },
    {
      "name": "stomper-04",
      "position": {
        "x": 384,
        "y": 0,
        "w": 128,
        "h": 128
      }
    },
    {
      "name": "stomper-05",
      "position": {
        "x": 0,
        "y": 128,
        "w": 128,
        "h": 128
      }
    },
    {
      "name": "stomper-06",
      "position": {
        "x": 0,
        "y": 256,
        "w": 128,
        "h": 128
      }
     },
     {
      "name": "stomper-07",
      "position": {
        "x": 0,
        "y": 384,
        "w": 128,
        "h": 128
      }
    }
  ]
}
```


### Step ??: Create Animation data
```javascript
function preload()  {
  spritedata = loadJSON('/assets/soldierWalk.json');
  front = loadImage('/assets/SoldierWalkFront.png');
  back = loadImage('/assets/SoldierWalkBack.png');
}

function setup() {
  createCanvas(900, 800);
  let frames = spritedata.frames;
  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = front.get(pos.x, pos.y, pos.w, pos.h, );
    down.push(img);
  }

  for (let i = 0; i < frames.length; i++) {
    let pos = frames[i].position;
    let img = back.get(pos.x, pos.y, pos.w, pos.h, );
    up.push(img);
  }


  soldier = new Player(down, up, 0, 50, 0.125);
  player = new Player(down, up, 0, 50, 0.125);
  imgg = loadImage('assets/Grass1.png');
  imgr = loadImage('assets/Rock1.gif');
  imgt = loadImage('assets/tree1.png');
  imgt2 = loadImage('assets/tree2.png');
  socket.emit('new player');
  //player = new Player();
}
```

### Step ??: Create Player Object
```javascript
class Sprite {
  constructor(down, up, x, y, speed) {
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

```


### Step ??: Display the Animation
```javascript
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

  image(imgr, 322, 5);

  image(imgt, 0, 10);
  image(imgt2, 200, 5);


  {
    let plx = player.x + 70
    let ply = player.y + 70
    let c = dist(mouseX, mouseY, plx, ply);
    let d = constrain(c, 0, 100);
    let x = -((d / c) * (plx - mouseX)) + plx
    let y = -((d / c) * (ply - mouseY)) + ply
    //   // For every player object sent by the server...

    ellipse(x, y, 10)
  }

```

## Table of Contents

1. Sending and receiving
2. How the client and server works
3. Client side socket stuff
4. Server side socket stuff
5. Data structures


## Sending and receiving

Here are some examples from the code showing how to use socket stuff

```javascript
setInterval(function() {
  for (var id in players) {
    var playersOnScreen = [];
    var player = players[id];
    if (player.x > 0 and player.y > 0) {
      playersOnScreen.push(players[p2id]);
    }
    io.sockets.connected[id].emit('nearbyPlayers', playersOnScreen);
  }
}, 1000 / 60);
```

`setInterval`: Makes the code run after a specified time has passed. Here, the code runs after 1000/60 milliseconds, or 60 times per second.

All the players in the game are stored in the `players` table.

`io.sockets.connected[id].emit`: Sends the specified data with a specified name. Here, it is sending the table `playersOnScreen` with the name `nearbyPlayers`. The data will be received by the server.

```javascript
socket.on('state', function(serverPlayer, bullets) {
  player.x = serverPlayer.x;
  player.y = serverPlayer.y;
  socket.emit('movement', movement);
});
```

`socket.on`: This function listens for a message with a specific name, then runs a function with the message's data. Here, it is listening for the data `serverPlayer` and `bullets` being sent under the name `state`.



## How client and server works

There are two sides, the server side and client side.

The server side does calculations and processes the game. The server sends data to the clients about the positions of entities and data calculated by the server.

The client side draws the game on the player's screen. The client sends data to the server about what the player is doing.

Information is sent using `socket.emit` and received with `socket.on`.


## Client side emits and ons




## Server side emits and ons




## Data structures
