/*********************
Make the Flappy Birds
*********************/
//game variables
//BIRD VARIABLES
var maxVel = 3; //bird max falling velocity
var vel = .5 //bird falling velocity
var velInc = 1; //change in bird velocity
var flyingVel = 7; //distance bird will move up when he flaps wings
var birdSize = 30; //size of bird
var birdX = 235; //bird x location
var birdY = 235; //bird starting y location
var birdAnimationRate = 20; //animation speed for bird
//OBSTICLE VARIABLES
var spd = 5; //obsticle speed
var pipeWidth = 50; //width of pipe
var pipeDistance = 100; //distance between pipes
var numObsticles = 9001; //number of different obsticles in game
var gapAddition = 20; //how much bigger the gap is
//SCORE VARAIBLES
var scoreSize = 50; //font size for score
var scoreX = 225; //x position of score
var scoreY = 5; //y position of score
var scoreColor = "green"; //color of score
//FRAME RATE
var frameRate = 20;
//////////////////////////
//change to your images vvvv
//////////////////////////
var birdImage = "http://s17.postimg.org/6xx0hl7nv/bird.png";
var topPipeImage = "http://s21.postimg.org/h3yt30xsn/Pipe2.png";
var bottomPipeImage = "http://s4.postimg.org/6zo40vbgd/Pipe1.png";
var backgroundImage = "http://s30.postimg.org/ewk5ccgyl/city_pattern.png";

/***********
Game Methods
***********/
/***********
Initialize game and reset all variables
************/
function init() {
    clearInterval(thread);
    playing = false;
    score = 0;
    //initialize bird
    bird = new Bird();
    //initialize all the obsticles
    for (i = 0; i < numObsticles; i += 2) {
        //calculate x position of the pipe
        var x = (i * pipeDistance) + 500;
        //random distance between top and bottom pipes
        var dist = Math.round(Math.random() * 100) + 100;
        //random height of top pipe
        var height = Math.ceil(Math.random() * 4) * 50 + 50;
        //add the top pipe
        obsticles[i] = new Obsticle(height, x, -gapAddition, "top");
        //add the bottom pipe
        obsticles[i + 1] = new Obsticle(500 - height, x, height + dist + gapAddition, "bottom");
    }
    //initiate the procedure!!!
    thread = setInterval(draw, frameRate);
}

/********
draw the game
********/
function draw() {
    //clear the screen
    context.clearRect(0, 0, 500, 500);
    //draw the bg
    context.drawImage(bgImg, 0, 0, 500, 500);
    //draw the bird
    bird.draw();
    //move and redraw if playing game
    if (playing) {
        //update the bird
        bird.update();
        //move the bird
        bird.move();
        //all the obsticles
        for (i = 0; i < numObsticles; i++) {
            //move each obsticle
            obsticles[i].move();
            if (obsticles[i].x < 500) {
                //increase the score
                if (obsticles[i].x + obsticles[i].width < bird.x + spd && obsticles[i].x + obsticles[i].width >= bird.x && i % 2 === 0) {
                    score++;
                }
                //send obsticle to end of the line
                if (obsticles[i].x < -1 * obsticles[i].width) {
                    if (i % 2 === 0) {
                        obsticles[i].x = obsticles[numObsticles - 2].x + ((i + 2) * pipeDistance);
                    } else {
                        obsticles[i].x = obsticles[numObsticles - 1].x + ((i + 1) * pipeDistance);
                    }
                }
                //draw the obsticle
                obsticles[i].draw();
                //collision detection
                if (bird.hitTest(obsticles[i])) {
                    init();
                }
            }
        }
    }
    //keep the score on the screen
    context.font = scoreSize + "px Impact";
    // Create gradient
    var gradient = context.createLinearGradient(20, 0, 60, 0);
    gradient.addColorStop("0", "magenta");
    // gradient.addColorStop("0.5", "white");
    gradient.addColorStop("1.0", "orange");
    // Fill text
    if (!scoreColor || scoreColor === null || scoreColor === "") {
        scoreColor = gradient;
    }
    context.fillStyle = scoreColor;
    context.fillText(score, scoreX, scoreY + scoreSize * 0.75);
}
//initialize the obsticle
function Obsticle(height, x, y, placement) {
    this.width = pipeWidth;
    this.height = height;
    this.x = x;
    this.y = y;
    this.placement = placement;
}
/**
the obsticle will move
**/
Obsticle.prototype.move = function () {
    this.x -= spd;
};
/**
draw the obsticle
**/
Obsticle.prototype.draw = function () {
    im = pImg[1];
    x = 0;
    y = 256 - this.height;
    w = this.width;
    h = this.height;
    if (h > 256) {
        h = 256;
    }
    cx = this.x;
    cy = this.y;
    cw = this.width;
    ch = this.height;
    if (this.placement == "top") {
        im = pImg[0];
    } else {
        y = 0;

    }
    context.drawImage(im, x, y, w, h, cx, cy, cw, ch);
};
/**
Define the bird
**/
function Bird() {
    this.size = birdSize;
    this.x = birdX;
    this.y = birdY;
    this.frame = 0;
    this.yClip = 0;
}
/**
move the bird
**/
Bird.prototype.move = function () {
    this.y += vel;
    if (vel < maxVel) {
        vel += velInc;
    }
    if (this.y > 500) {
        init();
    }
};
/**
Check for collision
**/
Bird.prototype.hitTest = function (ob) {
    if (this.x < ob.x + ob.width && this.x + this.size > ob.x && this.y < ob.y + ob.height && this.y + this.size > ob.y) {
        return true;
    }
    return false;
};
/**
Animate bird
**/
Bird.prototype.update = function () {
    this.frame++;
    if (this.frame % birdAnimationRate === 0) {
        this.yClip += 64;
        if (this.yClip > 64) {
            this.yClip = 0;
        }
        this.frame = 0;
    }
};
/**
draw the bird
**/
Bird.prototype.draw = function () {
    context.drawImage(bImg, this.yClip, 0, 64, 64, this.x, this.y, this.size, this.size);
};

/**
key controls
**/
document.onkeydown = function (e) {
	var mouseX = e.clientX;
	var mouseY = e.clientY;
	if(mouseY>200){
		//capture the event
		e = window.event || e;
		//get the key code
		var key = e.keyCode;
		//prevent default event behavior
		e.preventDefault();
		if (!playing) {
		playing = true;
		}
		if (vel > -1 * maxVel && bird.y > bird.size) {
			vel = -1 * flyingVel;
		}
	}
};
/**
mouse controls 
**/
document.onclick = function (e) {
	var mouseX = e.clientX;
	var mouseY = e.clientY;
	if(mouseY>550){
		//capture the event
		e = window.event || e;
		//get the key code
		var key = e.keyCode;
		//prevent default event behavior
		e.preventDefault();
		if (!playing) {
		playing = true;
		}
		if (vel > -1 * maxVel && bird.y > bird.size) {
			vel = -1 * flyingVel;
		}
	}
};


/**
Variables and such
**/
//initialized in init() method
var canvas;
var context;
var thread;
var bird;
var bImg;
var pImg;
var bgImg;

var obsticles = [];
var playing = false;
var score = 0;

canvas = document.getElementById("flappydactyl");
context = canvas.getContext("2d");
//images
bImg = new Image();
bImg.src = birdImage;
pImg = [];
pImg[0] = new Image();
pImg[0].src = topPipeImage;
pImg[1] = new Image();
pImg[1].src = bottomPipeImage;
bgImg = new Image();
bgImg.src = backgroundImage;

//run game
init();