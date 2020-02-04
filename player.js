
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


  module.exports.Player = Player