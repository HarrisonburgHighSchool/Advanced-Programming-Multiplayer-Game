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

```

### Step ??: Create Player Object
```javascript

```

### Step ??: Display the Animation
```javascript

```
