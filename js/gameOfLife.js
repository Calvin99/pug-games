var canvas = document.getElementById("gameOfLife");
var ctx = canvas.getContext("2d");

console.clear();

var cellW = 16, cellH = 16;

var w = canvas.width;
var h = canvas.height;

var board = Array(Math.floor(w/cellW));
for (i = 0; i < board.length; i++) {
	board[i] = Array(Math.floor(h/cellH));
}

var cellColor = "rgba("+Math.floor(Math.random()*100+50)+", "+Math.floor(Math.random()*100+50)+","+Math.floor(Math.random()*100+50)+", 0.025)";

function cell(x, y) {
	this.x = x;
	this.y = y;
	this.w = cellW;
	this.h = cellH;
	this.color = cellColor;
	this.living = Math.random()<0.4;
	this.crowd = 0;
}

cell.prototype.tally = function() {
	this.crowd = 0;
	if (this.x > 0) {
		if (board[this.x - 1][this.y].living) this.crowd++;
		if (this.y > 0 && board[this.x - 1][this.y - 1].living) this.crowd++;
		if (this.y < board[0].length - 1 && board[this.x - 1][this.y + 1].living) this.crowd++;
	}
	if (this.x < board.length - 1) {
		if (board[this.x+1][this.y].living) this.crowd++;
		if (this.y > 0 && board[this.x + 1][this.y - 1].living) this.crowd++;
		if (this.y < board[0].length - 1 && board[this.x + 1][this.y + 1].living) this.crowd++;
	}
	if (this.y > 0 && board[this.x][this.y - 1].living) this.crowd++;
	if (this.y < board[0].length - 1 && board[this.x][this.y + 1].living) this.crowd++;
}

cell.prototype.update = function() {
	if ((this.living && (this.crowd >= 4 || this.crowd <= 1)) || (!this.living && this.crowd == 3)) this.living = !this.living;
}

cell.prototype.draw = function() {
	console.log("test");
	if(this.living) {
    	ctx.fillStyle = this.color;
    	ctx.fillRect(this.x*this.w, this.y*this.h, this.w, this.h);
	}
}

for (i = 0; i < board.length; i++) {
	for(j = 0; j < board[0].length; j++) {
		board[i][j] = new cell(i, j);
	}
}

var pause = false;

var count = 0;

setInterval(draw, 400);

function draw() {
	ctx.fillStyle = "#333";
	ctx.fillRect(0, 0, 1200, 720);
	if(!pause) {
		for (i = 0; i < board.length; i++) {
			for(j = 0; j < board[i].length; j++) {
				board[i][j].tally();
			}
		}
		//console.log(board[5][5].crowd+", "+board[5][5].living);
		
		for (i = 0; i < board.length; i++) {
			for(j = 0; j < board[i].length; j++) {
				board[i][j].update();
				board[i][j].draw();
			}
		}
		
		count++;
		
		if (count % 50 == 0) {
			var newColor = "rgba("+Math.floor(Math.random()*100+50)+", "+Math.floor(Math.random()*100+50)+","+Math.floor(Math.random()*100+50)+", 0.025)";
			for (i = 0; i < board.length; i++) {
				for(j = 0; j < board[i].length; j++) {
					board[i][j].living = this.living = Math.random()<0.4;
					board[i][j].color = newColor;
				}
			}
		}
	}
}