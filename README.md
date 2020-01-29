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

### Step 1: Open the javascript
We will be using the coding system called the JSON file.

### Step 2: Load the JSON

First, we will need to make the frames and crop out each areas in the spritesheet in a reliable size.
To show each drawings in the spritesheet individually, we need to first identify each position and how much area shall we be showing the frames. Each drawings in the spritesheet should be in a same location.

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


### Step 3: Create Animation data
In order to let it move the frames in sequence time to time, we need the function to move the image to be visible and let the next layer be visible. We will load the data of assets from the spritesheet and locate the frames into one. We will then add the data for controlling the speed and movements to it.

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

```

### Step 4: Display the Animation
We will finally draw the images in order to show the animated asset on sight.
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
### Step 5: Create Player Object
Merging with the client side, we collide with our animation data to control the animated assets by keyboard to create a player.
Remember, we need the animated data in so a player will be able to run as living while controlling.
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
----

# Client
  The Client team is responsible for:
  - player movement
  - drawing the assets to the screens
  - drawing the crosshair.  

## The Player Class
  The Player Class makes it easier to draw multiple, separate players. The Payer Class is also responsible for organizing the different directions the player faces.

  **Attributes**

  | Name | Type    | Description |
  | ---- | ------- | ----------- |
  | `x`  | integer | Sets the horizontal position of the player |
  | `y`  | integer | Sets the vertical position of the player   |

## Emitting to the Server

Here's the line of code that sends information to the server:

...

## Receiving from the Server

Here's the function that runs when the server gives us information:

...

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

# Server

## Table of Contents

1. Sending and receiving
2. How the client and server works
3. socket.emits, socket.ons, and other functions
4. Our classes


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

`socket.emit`: Used more in our code than the other emit from above. Instead of sending to a specific id like the other emit function, this broadcasts it.



## How client and server works

There are two sides, the server side and client side.

The server side does calculations and processes the game. The server sends data to the clients about the positions of entities and data calculated by the server.

The client side draws the game on the player's screen. The client sends data to the server about what the player is doing.

Information is sent using `socket.emit` and received with `socket.on`.


## socket.emits, socket.ons, and other functions

  | Name | When emitted | When received |
  | ---- | ------------ | ------------- |
  | 'new player' | by client after connected and client side player initialized | server creates new Player object identified by socket id |
  | 'movement' | client sends server the user's keypresses | functions as the player's "update" function; handles movement, collisions, health, etc. |
  | 'mouseclick' | client sends server the user's mouse input | on left click, server creates a Bullet object |
  | 'disconnect | when client leaves | deletes the player object |
  | 'state' | server sends data that's been updated, like player data and bullet data | client uses this data to update its own and to draw the screen |
  | 'nearbyPlayers' | server calculates which players are in seeing distance and sends them in a table | client uses this to draw the nearby players |

 | setIntervals |
 | ------------ |
 | At the start of server.js, a setInterval is used to update the bullets' positions and collisions |
 | At the end of server.js, a setInterval is used to calculate the data that is sent to each client |

## Our classes

 | Name | Info | Stored |
 | ---- | ---- | ------ |
 | Player | used by server, is a proper class. Stores coords, health, id | Stored in the players table, called by id. |
 | Bullet | used by server, is a proper class. Stores coords, direction of movement, and id of player that created it. | Stored in bullets table, called by table position. |
 | Waypoint | used by server, is a proper class. Stores coords, size, team who owns it, and points for ownership. | Stored in waypoint table, called by table position. |
