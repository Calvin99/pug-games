console.clear();
var canvas = document.getElementById("serpongtine");
var ctx = canvas.getContext("2d");
var w = canvas.width;
var h = canvas.height;

var MenuImg = new Image();
MenuImg.src = "https://s12.postimg.org/hg3xbu8x9/New_Serpongtine_Logo.png";

var mouseX;
var mouseY;

var playing = false;

var reset = false;

function Player(x, color) {
	this.w = 13;
	this.h = 13;

	this.x = x;
	this.y = h / 2 - this.h / 2;
	this.vx = 0;
	this.vy = 0;
  
	this.color = color;
	this.tail = [[this.x,this.y], [this.x,this.y], [this.x,this.y], [this.x,this.y], [this.x,this.y], [this.x,this.y]];
  
  this.powerUp = null;
  this.powerTimer = 0;
}

Player.prototype.update = function() {
	for (i = this.tail.length - 1; i > 0; i--) {
		this.tail[i][0] = this.tail[i - 1][0];
		this.tail[i][1] = this.tail[i - 1][1];
	}
	this.tail[0][0] = this.x;
	this.tail[0][1] = this.y;
	this.x += this.vx;
	this.y += this.vy;
	
	if (this.y >= h) this.y = 0;
	if (this.y < 0) this.y = h - this.h;
	
	if (this.x >= w) {
		this.x = w - this.w;
		this.vx = 0;
	}
	if (this.x < 0) {
		this.x = 0;
		this.vx = 0;
	}
}

Player.prototype.draw = function() {
	ctx.fillStyle = this.color;
	for (i = 0; i < this.tail.length; i++) {
		ctx.fillRect(this.tail[i][0], this.tail[i][1], this.w, this.h);
	}
	ctx.fillRect(this.x - 1, this.y - 1, this.w + 2, this.h + 2);
}

Player.prototype.grow = function() {
	this.tail[this.tail.length] = [w, h];
	this.tail[this.tail.length] = [w, h];
}

var player1 = new Player(30, "#f00");
var player2 = new Player(855, "#ff0");

function hitTest(x1, y1, w1, h1, x2, y2, w2, h2) {
	if (x1 + w1 > x2 && x1 < x2 + w2 && y1 + h1 > y2 && y1 < y2 + h2) return true;
  else return false;
}

function dist(x1, y1, w1, h1, x2, y2, w2, h2) {
	return Math.pow(Math.pow((x1 + w1 / 2) - (x2 + w2 / 2), 2) + Math.pow((y1 + h1 / 2) - (y2 + h2 / 2), 2), 0.5);
}

function Ball() {
  this.w = 10;
  this.h = 10;
  
	this.x = w / 2 - this.w / 2;
  this.y = h / 2 - this.h / 2;
  this.a = Math.PI / 6 - Math.PI * Math.random() / 3;
  this.vx = Math.cos(this.a) * (Math.round(Math.random()) * 2 - 1);
  this.vy = Math.sin(this.a);
  
  this.color = "#fff";
  
  this.coolDown = 100;
  
  this.bounce = 0;
  this.last = 0;
  this.in = 0;
  this.volley = 0;
  
  this.fire = [];
}

Ball.prototype.update = function() {
	if (this.volley >= 0.5) {
  	for (i = this.fire.length - 1; i >= 0; i--) {
      this.fire[i][0] += Math.round(Math.random() * 4) - 2;
      this.fire[i][1] += Math.round(Math.random() * 4) - 2;
    	this.fire[i][3] -= 0.01;
      if (this.fire[i][3] < 0.1) this.fire.splice(i, 1);
    }
    if (this.volley < 2) {
    	this.fire[this.fire.length] = [this.x, this.y, "rgb(255, "+Math.round(Math.random() * 190)+", 0)", Math.random() / 4 + this.volley / 4];
    } else this.fire[this.fire.length] = [this.x, this.y, "rgb("+Math.round(Math.random() * 255)+", "+Math.round(Math.random() * 255)+", "+Math.round(Math.random() * 255)+")", Math.random() / 4 + this.volley / 4];
  }
  
  if (this.coolDown == 0) {

	this.x += this.vx;
  this.y += this.vy;
  
  if (this.y + this.h > h || this.y < 0) this.vy = -this.vy;
  
  if (this.x + this.w > w) {
  	player1.grow();
    reset = true;
  }
  if (this.x < 0) {
  	player2.grow();
    reset = true;
  }
  
  if (this.bounce == 0) {
      var min = null;
      var minLoc = -1;

      for (i = 0; i < player1.tail.length; i++) {
        var d = dist(this.x, this.y, this.w, this.h, player1.tail[i][0], player1.tail[i][1], player1.w, player1.h);
        if (hitTest(this.x, this.y, this.w, this.h, player1.tail[i][0], player1.tail[i][1], player1.w, player1.h) && (min == null || d < min)) {
          min = d;
          minLoc = i;
        }
      }

      if (minLoc >= 0) {
        if (this.in != 1) {
          this.bounce = 5;
          if (this.last != 1) this.volley += 0.1;
          this.last = 1;
          this.in = 1;
          if (Math.abs(this.x - player1.tail[minLoc][0]) < Math.abs(this.y - player1.tail[minLoc][1])) this.vy = -this.vy;
          else this.vx = -this.vx;
        }
      } else this.in = 0;
    }

    if (this.bounce == 0) {
      var min = null;
      var minLoc = -1;

      for (i = 0; i < player2.tail.length; i++) {
        var d = dist(this.x, this.y, this.w, this.h, player2.tail[i][0], player2.tail[i][1], player2.w, player2.h);
        if (hitTest(this.x, this.y, this.w, this.h, player2.tail[i][0], player2.tail[i][1], player2.w, player2.h) && (min == null || d < min)) {
          min = d;
          minLoc = i;
        }
      }

      if (minLoc >= 0) {
        if (this.in != 2) {
          this.bounce = 5;
          if (this.last != 2) this.volley += 0.1;
          this.last = 2;
          this.in = 2;
          if (Math.abs(this.x - player2.tail[minLoc][0]) < Math.abs(this.y - player2.tail[minLoc][1])) this.vy = -this.vy;
          else this.vx = -this.vx;
        }
      } else this.in = 0;
    }

    if (this.bounce > 0) this.bounce--;
  } else this.coolDown--;
}

Ball.prototype.draw = function() {
  for (i = 0; i < this.fire.length; i++) {
  	ctx.fillStyle = this.fire[i][2];
    ctx.globalAlpha = this.fire[i][3];
    ctx.fillRect(this.fire[i][0], this.fire[i][1], this.w, this.h);
    ctx.globalAlpha = 1;
  }
  
	ctx.fillStyle = this.color;
  ctx.fillRect(this.x, this.y, this.w, this.h);
}

ball = new Ball();

var gameSpeed = 10;
var frame = 0;

setInterval(gameLoop, gameSpeed);

function gameLoop() {
	if (playing) {
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, w, h);

    ctx.beginPath();
    ctx.setLineDash([5, 15]);
    ctx.lineWidth = 2;
    ctx.strokeStyle = "#f00";
    ctx.moveTo(w / 3, 0);
    ctx.lineTo(w / 3, h);
    ctx.stroke();
    ctx.beginPath();
    ctx.strokeStyle = "#ff0";
    ctx.moveTo(w * 2 / 3, 0);
    ctx.lineTo(w * 2 / 3, h);
    ctx.stroke();

    if (frame % 10 == 0) {
      player1.update();
      player2.update();
    }
    player1.draw();
    player2.draw();

    ball.update();
    ball.draw();
    
    ctx.textAlign = "center";
    ctx.font = "20px Courier";
    ctx.fillStyle = player1.color;
   	ctx.fillText(player1.tail.length / 2 - 3, w / 3 - 40, 40);
    ctx.fillStyle = player2.color;
   	ctx.fillText(player2.tail.length / 2 - 3, w * 2 / 3 + 40, 40);

    if (reset) {
      ball = new Ball();
      reset = false;
    }
    
    if (frame < 300) {
    	ctx.fillStyle = "#FFF";
    	ctx.globalAlpha = (300 - frame) / 150;
    	ctx.textAlign = "center";
    	ctx.font = "20px Courier";
    	ctx.fillText("First to 25 points wins!!!", 450, 125);
    	ctx.globalAlpha = 1;
    }
  } else {
    ctx.fillStyle = "#2D2D2D";
    ctx.fillRect(0, 0, w, h);
    ctx.drawImage(MenuImg, 0, 0, MenuImg.width, MenuImg.height, 200, 0, 500, 500);
    ctx.fillStyle = "#FFF";
    ctx.textAlign = "center";
    ctx.font = "20px Courier";
    if(frame % 200 < 100) ctx.fillText("Press Space to Play", 450, 125);
  }
  frame++;
}

document.onkeydown = function(e) {
	var key = e.keyCode;
	
    e.preventDefault();
	
	if (key === 32 && !playing) { //Space
		playing = !playing;
    frame = 0;
	}
	else if (key === 37 && playing) { //Left arrow
		player2.vx = -7.5;
		player2.vy = 0;
	}
	else if (key === 38 && playing) { //Up arrow
		player2.vx = 0;
		player2.vy = -7.5;
	}
	else if (key === 39 && playing) { //Right arrow
		player2.vx = 7.5;
		player2.vy = 0;
	}
	else if (key === 40 && playing) { //Down arrow
		player2.vx = 0;
		player2.vy = 7.5;
	}
	else if (key === 65 && playing) { //A
		player1.vx = -7.5;
		player1.vy = 0;
	}
	else if (key === 68 && playing) { //D
		player1.vx = 7.5;
		player1.vy = 0;
	}
	else if (key === 83 && playing) { //S
		player1.vx = 0;
		player1.vy = 7.5;
	}
	else if (key === 87 && playing) { //W
		player1.vx = 0;
		player1.vy = -7.5;
	}
}

document.onmousemove = function (e) {
	e = window.event || e;
	var rect = canvas.getBoundingClientRect();
	mouseX = e.clientX - rect.left;
	mouseY = e.clientY - rect.top;
}

document.onmousedown = function (e) {
	e = window.event || e;
}