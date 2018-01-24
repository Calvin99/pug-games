var canvas = document.getElementById("lothamator");
var context = canvas.getContext("2d");
var tileW = 64;
var tileH = 64;
//man and controls
var man;
var dirX = 0;
var dirY = 0;
var spd = 8;
//starting x and y tiles
var manStartX = 3 * tileW;
var manStartY = 10 * tileH;
//center of the game board
var centerX = 250 - 16;
var centerY = 250 - 16;
//control jumping and falling
var gravity = .6;
var jumpstart = -14;
//change if you make a zelda style
var overhead = true;
//change to your images vvvv
var manImage = "http://s9.postimg.org/shp65zr5r/Pug.png";
var baddieImage = "http://s28.postimg.org/6ulwb67x9/Lothamator_Sprite.png";
var tileImage = "http://s22.postimg.org/ygvx0t97h/Tile.png";
var bgImage = "http://s27.postimg.org/rj3ahbjtf/Background.png";
////////////////////////
var mImg = new Image();
mImg.src = manImage;
var bImg = new Image();
bImg.src = baddieImage;
var tImg = new Image();
tImg.src = tileImage;
var bgImg = new Image();
bgImg.src = bgImage;
var baddies;
var goal;
var frame;
var thread;
/****************
change for your own map
****************/
var map;
var map1 = [
 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
 [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
 [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,0,0,1,0,0,1,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
 [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,1,1,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
 [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,1,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,0,1],
 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] 
 ] ;
var map2 = [
 [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
 [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1],
 [1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,1,1,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
 [1,0,0,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,0,0,0,1,0,1,0,1,0,1,0,1,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,1,1,1,1,1,1,0,1,0,1,0,1,0,1,0,1,0,0,1],
 [0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [0,0,0,0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1] 
 ] ;
var map3 = [
 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,1,1,1,0,0,0,0,1,1,1,0,0,0,1,0,0,0,1],
 [1,0,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1],
 [1,0,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,0,0,1],
 [1,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
 [1,0,0,0,0,1,0,1,0,0,0,0,0,1,1,0,0,0,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,1,1,1,0,0,0,0,1,1,1,0,0,0,1,0,0,0,1],
 [1,0,0,1,0,0,0,0,0,1,0,1,0,0,0,1,0,0,0,1],
 [1,0,0,1,0,1,1,1,0,1,1,1,0,1,0,1,1,0,0,1],
 [1,0,0,0,0,1,1,0,0,0,0,0,0,1,0,0,0,0,0,1],
 [1,0,0,0,0,1,0,1,0,0,0,0,0,1,1,0,0,0,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1] 
 ] ;
var map4 = [
 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,1,1,1,0,0,1,1,1,1,1,1,1,1,1,0,0,1],
 [1,0,0,1,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
 [1,0,0,0,1,1,0,0,0,0,0,0,0,0,0,1,1,0,0,1],
 [1,0,0,0,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1],
 [1,1,1,0,1,1,1,1,1,1,1,1,1,0,0,1,1,0,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,1,1,0,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,0,0,0,1,1,0,0,1],
 [1,0,0,0,0,0,1,0,0,0,0,0,1,1,1,1,1,0,0,1],
 [1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,1],
 [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
 [1,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1,0,0,1],
 [1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1],
 [1,0,0,1,1,0,0,1,1,0,0,1,1,1,1,1,1,0,0,1],
 [1,0,0,1,1,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,0,1,1,0,0,0,0,0,0,0,0,0,0,1],
 [1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1], 
 ];
 /*var map5 = [
 [0,0,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,0,0,0],
 [0,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0],
 [0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,0,0,1,0,0],
 [0,1,0,0,1,0,0,0,0,0,0,0,0,0,0,1,0,0,1,0],
 [1,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0],
 [1,0,0,1,0,1,1,1,0,1,0,0,1,1,1,0,1,0,0,1],
 [1,0,1,0,1,0,1,1,1,0,0,1,0,1,1,1,0,1,0,1],
 [1,0,1,0,0,1,1,1,1,0,0,0,1,1,1,0,0,1,0,1],
 [1,0,0,0,0,0,0,1,0,0,0,0,0,0,0,0,0,0,0,1],
 [1,0,0,0,0,0,0,1,0,0,1,1,0,0,0,0,1,0,0,1],
 [0,1,0,0,0,0,0,1,1,1,0,0,0,0,0,0,1,1,0,1],
 [0,0,1,0,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,1],
 [0,0,1,0,1,1,0,1,0,1,0,1,0,1,0,1,0,0,0,1],
 [0,0,1,0,1,1,1,1,1,1,1,1,1,1,1,0,0,0,0,1],
 [0,0,1,0,0,1,0,1,0,1,0,1,0,1,0,0,0,0,1,0],
 [0,1,0,0,0,0,1,1,1,1,1,1,1,0,0,0,0,1,0,0],
 [1,0,1,0,0,0,0,0,0,0,0,0,0,0,0,0,1,0,0,0],
 [1,0,0,1,1,1,1,0,0,0,0,0,0,0,1,1,0,0,0,0],
 [1,0,0,0,0,0,0,0,1,1,1,1,1,1,0,0,0,0,0,0],
 [0,1,1,1,1,1,1,1,1,0,0,0,0,0,0,0,0,0,0,0] 
 ]*/
//tile colors
var colors = ["white", "black"];
/***************
Initialize the game and the objects
add your baddies belt
***/
function init() {
    var selectMap =  Math.round(Math.random()*4);
    if (selectMap == 0) {
        map = map1;
    } else if (selectMap == 1) {
        map = map2;
    } else if (selectMap == 2) {
        map = map3;
    } else if (selectMap == 3){
        map = map4;
    } else {
        map = map5;
    }
    clearInterval(thread);
    man = new Man(manStartX, manStartY);
    baddies = [];
    ///////////////////////////
    //ADD BADDIES
    //parameters: x position, y position
    ////////////////////////////
    new Baddie(10 * tileW, 4 * tileH);
    new Baddie(10 * tileW, 16 * tileH);
    new Baddie(17 * tileW, 10 * tileH);
    ///////////////////////
    //goal
    //////////////////////
    goal = new Goal(7 * tileW, 9.5 * tileH);
    //start the game
    thread = setInterval(draw, 30);
}

/*******
Man object
*******/
function Man(x, y) {
    this.x = x;
    this.y = y;
    this.width = 32;
    this.height = 32;
    this.color = "red";
    this.img = mImg;
    this.pose = 0;
    this.upleft = 0;
    this.upright = 0;
    this.downleft = 0;
    this.downright = 0;
    this.jumping = false;
    this.jumpspeed = 0;
    this.gravity = gravity;
    this.falling = false;
    this.dirX = 0;
    this.dirY = 0;
    this.frame = 0;
    this.yClip = 0;
    this.xClip = 0;

}
////////////////
////////////////
Man.prototype.getTile = function () {
    var tileX = Math.round(this.x / tileW - 0.5);
    var tileY = Math.round(this.y / tileH - 0.5);
    var text = "tile " + tileY + "_" + tileX;
    return text;
};
/**
get the bottom tile
**/
Man.prototype.getBottomTile = function () {
    var tileY = Math.round((this.y) / tileH - 0.5) + 1;
    //context.fillStyle = "rgba(255, 100, 100, .5)";
    //context.fillRect(manStartX, (tileY*tileH)- man.y + manStartY, tileW, tileH);
    return tileY;
};
Man.prototype.getTopTile = function () {
    var tileY = Math.round((this.y + tileH - this.height - 0.5) / tileH - .5);
    //context.fillStyle = "rgba(255, 100, 100, .5)";
    //context.fillRect(manStartX, (tileY*tileH)- man.y + manStartY, tileW, tileH);
    return tileY;
};
Man.prototype.tileX = function () {
    var tileX = Math.round((this.x) / tileW - 0.5);
    return tileX;
};
Man.prototype.tileY = function () {
    var tileY = Math.round((this.y) / tileH - 0.5);
    return tileY;
};
Man.prototype.getCorners = function (x, y) {
    var downY = Math.floor((y + this.height - 1) / tileH);
    var upY = Math.floor((y + 1) / tileH);
    var leftX = Math.floor((x + 1) / tileW);
    var rightX = Math.floor((x + this.width - 1) / tileW);
    this.upleft = map[upY][leftX];
    this.downleft = map[downY][leftX];
    this.upright = map[upY][rightX];
    this.downright = map[downY][rightX];
    //context.fillStyle = "rgba(100, 100, 100, .5)";
    //context.fillRect((leftX*tileW)- man.x + manStartX, (upY*tileH)- man.y + manStartY, (rightX - leftX)*tileW+tileW, (downY - upY)*tileW+tileW);

};

Man.prototype.move = function (dx, dy, xPos, yPos, context) {
    //set the next x values
    var nextx = this.x;
    var nexty = this.y;
    //get the corners to see if you can move
    this.getCorners(this.x, this.y + dy);
    if (dy < 0) {
        if (this.upleft === 0 && this.upright === 0) {
            nexty += dy;
        } else {
            nexty = this.tileY() * tileH + 0;
            this.jumpspeed = 0;
        }
    }
    if (dy > 0) {
        if (this.downleft === 0 && this.downright === 0) {
            nexty += dy;
        } else {
            nexty = (this.tileY() + 1) * tileH - this.height;
            this.jumping = false;
        }
    }

    this.getCorners(this.x + dx, this.y);
    if (dx < 0) {
        if (this.downleft === 0 && this.upleft === 0) {
            nextx += dx;
        } else {
            nextx = (this.tileX()) * tileW + .1;
        }
    }
    if (dx > 0) {
        if (this.upright === 0 && this.downright === 0) {
            nextx += dx;
        } else {
            nextx = (this.tileX() + 1) * tileW - this.width;
        }
    }
    //move the man
    this.x = nextx;
    this.y = nexty;
    if (!overhead) {
        this.fall();
    }
    this.update(4, dx, dy);
    this.draw(xPos, yPos, context);
    return true;
};
Man.prototype.jump = function () {
    this.jumpspeed += this.gravity;
    if (this.jumpspeed > tileH) {
        this.jumpspeed = tileH;
    }
    return true;
};
Man.prototype.fall = function () {
    if (!this.jumping) {
        this.getCorners(this.x, this.y + 1);
        if (this.downleft === 0 && this.downright === 0) {
            this.jumpspeed = 0;
            this.dirY = 1;
            this.jumping = true;
            return true;
        }
    }
    return false;
};
/**
Update man for three frames and two directions
**/
Man.prototype.update = function (rate, dx, dy) {
    //check if moving
    if (this.dirX != 0 || this.dirY != 0) {
        if (this.frame % 5 == 0) {
            if (this.pose === 0) {
                this.xClip = 64;
            }
            if (this.pose == 2) {
                this.xClip = 128;
            }
            if (this.pose == 1 || this.pose == 3) {
                this.xClip = 0;
            }
            this.pose++;
            if(this.pose == 4) {
                this.pose = 0;
            }
            console.log(this.pose);
            console.log(this.xClip);
        }
        this.frame++
    } else {
        this.xClip = 0;
        this.frame = 0;
    }
}
Man.prototype.draw = function (x, y, context) {
    //context.fillStyle = this.color;
    //context.fillRect(x, y, this.width, this.height);
    context.drawImage(this.img, this.xClip, this.yClip, 64, 64, x, y, this.width, this.height);

};
Man.prototype.hitTest = function (ob) {
    return this.x < ob.x + ob.width && this.x + this.width > ob.x && this.y < ob.y + ob.height && this.y + this.height > ob.y;

};
Baddie.prototype = new Man();
Baddie.constructor = Baddie;

function Baddie(x, y) {
    this.x = x;
    this.y = y;
    this.spd = Math.random();
    this.img = bImg;
    baddies.push(this);
}
Baddie.prototype.move = function (context) {
    /**
    baddie ai
    **/
    var bMove = 0;

    if (man.x >= this.x + this.width && man.x - this.x < tileW * 3) {
        bMove = 1;
        this.yClip = 0;
    } else if (man.x + man.width <= this.x && this.x - man.x < tileW * 3) {
        bMove = -1;
        this.yClip = 64;
    }
    if (this.jumping) {
        this.jump();
    }
    if (overhead) {
        this.dirY = 0;
        if (man.y >= this.y + this.height && man.y - this.y < tileH * 3) {
            this.dirY = 1;
        } else if (man.y + man.height <= this.y && this.y - man.y < tileH * 3) {
            this.dirY = -1;
        }
        this.jumpspeed = spd * 0.5;
    }

    Man.prototype.move.call(this, bMove * (spd) * .5, this.dirY * this.jumpspeed, this.x - man.x + centerX, this.y - man.y + centerY, context);
    if (this.hitTest(man)) {
        death();
    }
}

////the goal
function Goal(x, y){
    this.x = x;
    this.y = y;
    this.width = tileW;
    this.height = tileH;
    this.color = "lightblue";
}
Goal.prototype.draw = function (context) {
    context.fillStyle = this.color;
    context.fillRect(this.x  - man.x + centerX, this.y  - man.y + centerY, this.width, this.height);
    if(man.hitTest(this)){
        win();
    }
};
    
/********
kill the man and start over
********/
function death() {
    clearInterval(thread);
    context.fillStyle = "rgba(255, 0, 0, .5)";
    context.fillRect(0, 0, 500, 500);
    context.fillStyle = "white";
    context.font = "34px Impact";
    context.fillText("You've Been Captured!", 85, 240);
    setTimeout(function () {
        init();
    }, 1600);
}
/*********
win game
*********/
function win(){
    clearInterval(thread);
    context.fillStyle = "rgba(255, 255, 255, .8)";
    context.fillRect(0, 0, 500, 500);
    context.fillStyle = "black";
    context.font = "34px Impact";
    context.fillText("You Escaped!!!", 150, 230);
    setTimeout(function () {
        init();
    }, 1600);
    
}

function drawMap(context) {
    var x1 = man.tileX() - 6;
    var x2 = man.tileX() + 6;
    var y1 = man.tileY() - 6;
    var y2 = man.tileY() + 6;
    if (x1 < 0) {

        x1 = 0;
    }
    if (x2 > map[0].length) {


        x2 = map[0].length;
    }
    if (y1 < 0) {

        y1 = 0;
    }
    if (y2 > map.length) {

        y2 = map.length;
    }
    for (i = y1; i < y2; i++) {
        for (j = x1; j < x2; j++) {
            if (tileImage != "") {
                if (map[i][j] == 1) {
                    context.drawImage(tImg, 0, 0, tImg.width, tImg.height, j * tileW - man.x + centerX, i * tileH - man.y + centerY, tileW, tileH);
                }
            } else {
                context.fillStyle = colors[map[i][j]];
                context.fillRect(j * tileW - man.x + centerX, i * tileH - man.y + centerY, tileW, tileH);
            }
        }
    }

}


function draw() {
    context.clearRect(-5, -5, 500, 500);
    context.fillStyle = "#dddddd";
    context.fillRect(0, 0, 500, 500);
    drawMap(context);
    if (man.jumping) {
        man.jump();
    }
    man.move(man.dirX * spd, man.dirY * man.jumpspeed, centerX, centerY, context);
    for (i = 0; i < baddies.length; i++) {
        baddies[i].move(context);
    }
    goal.draw(context);

}



document.onkeydown = function (e) {
    //capture the event
    e = window.event || e;
    //get the key code
    var key = e.keyCode;
    //prevent default event behavior
    e.preventDefault();

    if (key === 37 || key === 65) {
        man.dirX = -1;
        man.yClip = 64;

    }
    if (key === 39 || key === 68) {
        man.dirX = 1;
        man.yClip = 0;
    }
    if (overhead) {
        man.jumpspeed = spd;
        if (key === 38 || key === 87) {
            man.dirY = -1;

        }
        if (key === 40 || key === 83) {
            man.dirY = 1;
        }
    } else {
        if (key === 38 && !man.jumping) {
            man.jumping = true;
            man.jumpspeed = jumpstart;
        }
    }

};
document.onkeyup = function (e) {
    //capture the event
    e = window.event || e;
    //get the key code
    var key = e.keyCode;
    if (key === 37 || key === 39 || key === 65 || key === 68) {
        man.dirX = 0;
        
    }
    if ((key === 38 || key === 40 || key === 87 || key === 83) && overhead) {
        man.dirY = 0;
    }

};

init();