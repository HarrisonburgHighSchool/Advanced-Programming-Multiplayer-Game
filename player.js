
class Player {
    constructor(id) {
        this.x = 450;
        this.y = 400;
        this.right = false;
        this.left = false;
        this.up = false;
        this.down = false;
        this.id = id;
        this.teamid = nextteamselect
        this.clipamount = 300
        if (this.teamid == 0) {
        nextteamselect = 1
        }
        if (this.teamid == 1) {
        nextteamselect = 0
        }
        if (this.teamid == 0) {
        this.x = 100;
        } else {
        this.x = 500;
        }
        if (this.teamid == 0) {
        this.y = 100;
        } else {
        this.y = 500;
        }
        this.hp = 10
        this.r = 10
        this.state = "waiting" //waiting or ready
    }
    update() {
        if (this.clipamount < 300) {
        this.clipamount = this.clipamount + 1
        }
    }
}

module.exports.Player = Player;

class Bullet {
    constructor(player, mx, my) {
        mx = mx + player.x+7 - 450 //mouse x + player x - half of screen width
        my = my + player.y+9.5 - 400 //gives us mouse relative to player
        this.pl_id = player.id;
        this.x = player.x+7-5;
        this.y = player.y+9.5-5;
        this.tempx = mx - player.x;
        this.tempy = my - player.y;
        this.orientation = Math.atan(this.tempy/this.tempx);
        if (player.x > mx) {
            this.dy = -Math.sin(this.orientation)*15;
            this.dx = -Math.cos(this.orientation)*15;
        } else {
            this.dy = Math.sin(this.orientation)*15;
            this.dx = Math.cos(this.orientation)*15;
        }
        // bullet needs to start not inside the players
        this.x = this.x + (this.dx*2);
        this.y = this.y + (this.dy*2);
    }
}

module.exports.Bullet = Bullet;