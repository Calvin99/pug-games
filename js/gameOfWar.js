var canvas = document.getElementById("gameOfWar");
var ctx = canvas.getContext("2d");

console.clear();

var cellW = 10, cellH = 10;

var w = canvas.width;
var h = canvas.height-100;

var board = Array(Math.floor(w/cellW));
for (i = 0; i < board.length; i++) {
	board[i] = Array(Math.floor(h/cellH));
}

var advantage = true;
var t1Advantage = false;
var t2Advantage = false;
var t3Advantage = false;
var t4Advantage = false;
var t5Advantage = false;
var t6Advantage = false;

if (advantage) {
	t1Advantage = Math.random() < 0.25;
	t2Advantage = Math.random() < 0.25;
	t3Advantage = Math.random() < 0.25;
	t4Advantage = Math.random() < 0.25;
	t5Advantage = Math.random() < 0.25;
	t6Advantage = Math.random() < 0.25;
}

var team1Color = "red";
var team2Color = "lime";
var team3Color = "blue";
var team4Color = "yellow";
var team5Color = "aqua";
var team6Color = "fuchsia ";

function cell(x, y, color) {
	this.x = x;
	this.y = y;
	this.w = cellW;
	this.h = cellH;
	this.color = color;
	this.living = Math.random()<0.4;
	this.team1Crowd = 0;
	this.team2Crowd = 0;
	this.team3Crowd = 0;
	this.team4Crowd = 0;
	this.crowd = 0;
}

cell.prototype.tally = function() {
	this.team1Crowd = 0;
	this.team2Crowd = 0;
	this.team3Crowd = 0;
	this.team4Crowd = 0;
	this.team5Crowd = 0;
	this.team6Crowd = 0;
	this.crowd = 0;
	if (this.x > 0) {
		if (board[this.x - 1][this.y].living) {
			if (board[this.x - 1][this.y].color == team1Color) this.team1Crowd++;
			else if (board[this.x - 1][this.y].color == team2Color) this.team2Crowd++;
			else if (board[this.x - 1][this.y].color == team3Color) this.team3Crowd++;
			else if (board[this.x - 1][this.y].color == team4Color) this.team4Crowd++;
			else if (board[this.x - 1][this.y].color == team5Color) this.team5Crowd++;
			else this.team6Crowd++;
			this.crowd++;
		}
		if (this.y > 0 && board[this.x - 1][this.y - 1].living) {
			if (board[this.x - 1][this.y - 1].color == team1Color) this.team1Crowd++;
			else if (board[this.x - 1][this.y - 1].color == team2Color) this.team2Crowd++;
			else if (board[this.x - 1][this.y - 1].color == team3Color) this.team3Crowd++;
			else if (board[this.x - 1][this.y - 1].color == team4Color) this.team4Crowd++;
			else if (board[this.x - 1][this.y - 1].color == team5Color) this.team5Crowd++;
			else this.team6Crowd++;
			this.crowd++;
		}
		if (this.y < board[0].length - 1 && board[this.x - 1][this.y + 1].living) {
			if (board[this.x - 1][this.y + 1].color == team1Color) this.team1Crowd++;
			else if (board[this.x - 1][this.y + 1].color == team2Color) this.team2Crowd++;
			else if (board[this.x - 1][this.y + 1].color == team3Color) this.team3Crowd++;
			else if (board[this.x - 1][this.y + 1].color == team4Color) this.team4Crowd++;
			else if (board[this.x - 1][this.y + 1].color == team5Color) this.team5Crowd++;
			else this.team6Crowd++;
			this.crowd++;
		}
	}
	if (this.x < board.length - 1) {
		if (board[this.x + 1][this.y].living) {
			if (board[this.x + 1][this.y].color == team1Color) this.team1Crowd++;
			else if (board[this.x + 1][this.y].color == team2Color) this.team2Crowd++;
			else if (board[this.x + 1][this.y].color == team3Color) this.team3Crowd++;
			else if (board[this.x + 1][this.y].color == team4Color) this.team4Crowd++;
			else if (board[this.x + 1][this.y].color == team5Color) this.team5Crowd++;
			else this.team6Crowd++;
			this.crowd++;
		}
		if (this.y > 0 && board[this.x + 1][this.y - 1].living) {
			if (board[this.x + 1][this.y - 1].color == team1Color) this.team1Crowd++;
			else if (board[this.x + 1][this.y - 1].color == team2Color) this.team2Crowd++;
			else if (board[this.x + 1][this.y - 1].color == team3Color) this.team3Crowd++;
			else if (board[this.x + 1][this.y - 1].color == team4Color) this.team4Crowd++;
			else if (board[this.x + 1][this.y - 1].color == team5Color) this.team5Crowd++;
			else this.team6Crowd++;
			this.crowd++;
		}
		if (this.y < board[0].length - 1 && board[this.x + 1][this.y + 1].living) {
			if (board[this.x + 1][this.y + 1].color == team1Color) this.team1Crowd++;
			else if (board[this.x + 1][this.y + 1].color == team2Color) this.team2Crowd++;
			else if (board[this.x + 1][this.y + 1].color == team3Color) this.team3Crowd++;
			else if (board[this.x + 1][this.y + 1].color == team4Color) this.team4Crowd++;
			else if (board[this.x + 1][this.y + 1].color == team5Color) this.team5Crowd++;
			else this.team6Crowd++;
			this.crowd++;
		}
	}
	if (this.y > 0 && board[this.x][this.y - 1].living) {
		if (board[this.x][this.y - 1].color == team1Color) this.team1Crowd++;
		else if (board[this.x][this.y - 1].color == team2Color) this.team2Crowd++;
		else if (board[this.x][this.y - 1].color == team3Color) this.team3Crowd++;
		else if (board[this.x][this.y - 1].color == team4Color) this.team4Crowd++;
		else if (board[this.x][this.y - 1].color == team5Color) this.team5Crowd++;
		else this.team6Crowd++;
		this.crowd++;
	}
	if (this.y < board[0].length - 1 && board[this.x][this.y + 1].living) {
		if (board[this.x][this.y + 1].color == team1Color) this.team1Crowd++;
		else if (board[this.x][this.y + 1].color == team2Color) this.team2Crowd++;
		else if (board[this.x][this.y + 1].color == team3Color) this.team3Crowd++;
		else if (board[this.x][this.y + 1].color == team4Color) this.team4Crowd++;
		else if (board[this.x][this.y + 1].color == team5Color) this.team5Crowd++;
		else this.team6Crowd++;
		this.crowd++;
	}
}

cell.prototype.update = function() {
	if (!this.living && this.team1Crowd == 3 && this.crowd - this.team1Crowd < 3) {
		this.living = true;
		this.color = team1Color;
	} else if (!this.living && this.team2Crowd == 3 && this.crowd - this.team2Crowd < 3) {
		this.living = true;
		this.color = team2Color;
	} else if (!this.living && this.team3Crowd == 3 && this.crowd - this.team3Crowd < 3) {
		this.living = true;
		this.color = team3Color;
	} else if (!this.living && this.team4Crowd == 3 && this.crowd - this.team4Crowd < 3) {
		this.living = true;
		this.color = team4Color;
	} else if (!this.living && this.team5Crowd == 3 && this.crowd - this.team5Crowd < 3) {
		this.living = true;
		this.color = team5Color;
	} else if (!this.living && this.team6Crowd == 3 && this.crowd - this.team6Crowd < 3) {
		this.living = true;
		this.color = team6Color;
	}
	else if (this.crowd > 3) this.living = false;
	else if (!t1Advantage && this.living && this.color == team1Color && this.team1Crowd < 2) this.living = false;
	else if (!t2Advantage && this.living && this.color == team2Color && this.team2Crowd < 2) this.living = false;
	else if (!t3Advantage && this.living && this.color == team3Color && this.team3Crowd < 2) this.living = false;
	else if (!t4Advantage && this.living && this.color == team4Color && this.team4Crowd < 2) this.living = false;
	else if (!t5Advantage && this.living && this.color == team5Color && this.team5Crowd < 2) this.living = false;
	else if (!t6Advantage && this.living && this.color == team6Color && this.team6Crowd < 2) this.living = false;
	else if (this.living && this.color == team1Color && this.crowd - this.team1Crowd > 1 && this.crowd - this.team1Crowd > this.team1Crowd) this.living = false;
	else if (this.living && this.color == team2Color && this.crowd - this.team2Crowd > 1 && this.crowd - this.team2Crowd > this.team2Crowd) this.living = false;
	else if (this.living && this.color == team3Color && this.crowd - this.team3Crowd > 1 && this.crowd - this.team3Crowd > this.team3Crowd) this.living = false;
	else if (this.living && this.color == team4Color && this.crowd - this.team4Crowd > 1 && this.crowd - this.team4Crowd > this.team4Crowd) this.living = false;
	else if (this.living && this.color == team5Color && this.crowd - this.team5Crowd > 1 && this.crowd - this.team5Crowd > this.team5Crowd) this.living = false;
	else if (this.living && this.color == team6Color && this.crowd - this.team6Crowd > 1 && this.crowd - this.team6Crowd > this.team6Crowd) this.living = false;
}

cell.prototype.draw = function() {
	if(this.living) {
    	ctx.fillStyle = this.color;
    	ctx.fillRect(this.x*this.w, this.y*this.h, this.w, this.h);
	}
}

for (i = 0; i < board.length; i++) {
	for (j = 0; j < board[0].length; j++) {
		if (this.j < (board[0].length - 1) / 2) {
			if (i < (board.length - 1) / 3) board[i][j] = new cell(i, j, team1Color);
			else if (this.i < 2 * (board.length - 1) / 3)  board[i][j] = new cell(i, j, team2Color);
			else board[i][j] = new cell(i, j, team3Color);
		} else {
			if (i < (board.length - 1) / 3) board[i][j] = new cell(i, j, team4Color);
			else if (this.i < 2 * (board.length - 1) / 3)  board[i][j] = new cell(i, j, team5Color);
			else board[i][j] = new cell(i, j, team6Color);
		}
	}
}

var pause = false;

var count = 0;

setInterval(draw, 100);

var tally1 = 0, tally2 = 0, tally3 = 0, tally4 = 0, tally5 = 0, tally6 = 0, tallySum = 0;

var timeDelay = 100;

function draw() {
	ctx.fillStyle = "#000";
	ctx.fillRect(0, 0, 1200, 700);
	
	ctx.fillStyle = "#555";
	ctx.fillRect(150, 700, 1050, 100);
	
	ctx.fillStyle = "#999";
	ctx.fillRect(0, 700, 150, 100);
	
	for (i = 0; i < board.length; i++) {
		for(j = 0; j < board[i].length; j++) {
			board[i][j].tally();
		}
	}
	
	tally1 = 0;
	tally2 = 0;
	tally3 = 0;
	tally4 = 0;
	tally5 = 0;
	tally6 = 0;
	tallySum = 0;
	
	for (i = 0; i < board.length; i++) {
		for(j = 0; j < board[i].length; j++) {
			board[i][j].update();
			board[i][j].draw();
			if(board[i][j].living) {
				if (board[i][j].color == team1Color) tally1++;
				else if (board[i][j].color == team2Color) tally2++;
				else if (board[i][j].color == team3Color) tally3++;
				else if (board[i][j].color == team4Color) tally4++;
				else if (board[i][j].color == team5Color) tally5++;
				else if (board[i][j].color == team6Color) tally6++;
			}
		}
	}
	tallySum += tally1 + tally2 + tally3 + tally4 + tally5 + tally6;
	
	timeDelay = 100;
	
	if (tally1 == 0) timeDelay += 50;
	if (tally2 == 0) timeDelay += 50;
	if (tally3 == 0) timeDelay += 50;
	if (tally4 == 0) timeDelay += 50;
	if (tally5 == 0) timeDelay += 50;
	if (tally6 == 0) timeDelay += 50;
	
	ctx.fillStyle = "rgba(255, 0, 0, 0.25)";
	ctx.fillRect(150, 725, 1050 * (tally1 / tallySum), 75);
	if (t1Advantage) ctx.fillStyle = "rgba(255, 0, 0, 0.75)";
	if (tally1 > 0) ctx.fillRect(0, 700, 50, 50);
	ctx.fillStyle = "rgba(0, 255, 0, 0.25)";
	ctx.fillRect(150 + 1050 * (tally1 / tallySum), 725, 1050 * (tally2 / tallySum), 75);
	if (t2Advantage) ctx.fillStyle = "rgba(0, 255, 0, 0.75)";
	if (tally2 > 0) ctx.fillRect(50, 700, 50, 50);
	ctx.fillStyle = "rgba(0, 0, 255, 0.25)";
	ctx.fillRect(150 + 1050 * ((tally1 + tally2) / tallySum), 725, 1050 * (tally3 / tallySum), 75);
	if (t3Advantage) ctx.fillStyle = "rgba(0, 0, 255, 0.75)";
	if (tally3 > 0) ctx.fillRect(100, 700, 50, 50);
	ctx.fillStyle = "rgba(255, 255, 0, 0.25)";
	ctx.fillRect(150 + 1050 * ((tally1 + tally2 + tally3) / tallySum), 725, 1050 * (tally4 / tallySum), 75);
	if (t4Advantage) ctx.fillStyle = "rgba(255, 255, 0, 0.75)";
	if (tally4 > 0) ctx.fillRect(0, 750, 50, 50);
	ctx.fillStyle = "rgba(0, 255, 255, 0.25)";
	ctx.fillRect(150 + 1050 * ((tally1 + tally2 + tally3 + tally4) / tallySum), 725, 1050 * (tally5 / tallySum), 75);
	if (t5Advantage) ctx.fillStyle = "rgba(0, 255, 255, 0.75)";
	if (tally5 > 0) ctx.fillRect(50, 750, 50, 50);
	ctx.fillStyle = "rgba(255, 0, 255, 0.25)";
	ctx.fillRect(150 + 1050 * ((tally1 + tally2 + tally3 + tally4 + tally5) / tallySum), 725, 1050 * (tally6 / tallySum), 75);
	if (t6Advantage) ctx.fillStyle = "rgba(255, 0, 255, 0.75)";
	if (tally6 > 0) ctx.fillRect(100, 750, 50, 50);
	
	ctx.fillStyle = "#000";
    ctx.font = "bold 15px Verdana";
    ctx.textAlign = "center";
    if(tally1 > 0) ctx.fillText(tally1, 150 + (525 * (tally1 / tallySum)), 760);
    if(tally2 > 0) ctx.fillText(tally2, 150 + (1050 * ((tally1 + tally2 / 2) / tallySum)), 760);
    if(tally3 > 0) ctx.fillText(tally3, 150 + (1050 * ((tally1 + tally2 + tally3 / 2) / tallySum)), 760);
    if(tally4 > 0) ctx.fillText(tally4, 150 + (1050 * ((tally1 + tally2 + tally3 + tally4 / 2) / tallySum)), 760);
    if(tally5 > 0) ctx.fillText(tally5, 150 + (1050 * ((tally1 + tally2 + tally3 + tally4 + tally5 / 2) / tallySum)), 760);
    if(tally6 > 0) ctx.fillText(tally6, 150 + (1050 * ((tally1 + tally2 + tally3 + tally4 + tally5 + tally6 / 2) / tallySum)), 760);
    
    if(tally1 > 0) ctx.fillText(Math.round((tally1/tallySum)*100) + "%", 150 + (525 * (tally1 / tallySum)), 780);
    if(tally2 > 0) ctx.fillText(Math.round((tally2/tallySum)*100) + "%", 150 + (1050 * ((tally1 + tally2 / 2) / tallySum)), 780);
    if(tally3 > 0) ctx.fillText(Math.round((tally3/tallySum)*100) + "%", 150 + (1050 * ((tally1 + tally2 + tally3 / 2) / tallySum)), 780);
    if(tally4 > 0) ctx.fillText(Math.round((tally4/tallySum)*100) + "%", 150 + (1050 * ((tally1 + tally2 + tally3 + tally4 / 2) / tallySum)), 780);
    if(tally5 > 0) ctx.fillText(Math.round((tally5/tallySum)*100) + "%", 150 + (1050 * ((tally1 + tally2 + tally3 + tally4 + tally5 / 2) / tallySum)), 780);
    if(tally6 > 0) ctx.fillText(Math.round((tally6/tallySum)*100) + "%", 150 + (1050 * ((tally1 + tally2 + tally3 + tally4 + tally5 + tally6 / 2) / tallySum)), 780);
		
	count++;
	
	ctx.fillStyle = "#bbb";
	ctx.fillRect(150, 700, (timeDelay - (count % timeDelay)) * 100 / timeDelay * 10.5, 25);
		
	if (count % timeDelay == 0) {
		if (tally1 == tallySum || tally2 == tallySum || tally3 == tallySum || tally4 == tallySum || tally5 == tallySum || tally6 == tallySum) {
			/*for (i = 0; i < board.length; i++) {
				for (j = 0; j < board[0].length; j++) {
					if (this.j < (board[0].length - 1) / 2) {
						if (i < (board.length - 1) / 3) board[i][j] = new cell(i, j, team1Color);
						else if (this.i < 2 * (board.length - 1) / 3)  board[i][j] = new cell(i, j, team2Color);
						else board[i][j] = new cell(i, j, team3Color);
					} else {
						if (i < (board.length - 1) / 3) board[i][j] = new cell(i, j, team4Color);
						else if (this.i < 2 * (board.length - 1) / 3)  board[i][j] = new cell(i, j, team5Color);
						else board[i][j] = new cell(i, j, team6Color);
					}
				}
			}*/
		} else {
			t1Advantage = Math.random() > (tally1 / tallySum);
			t2Advantage = Math.random() > (tally2 / tallySum);
			t3Advantage = Math.random() > (tally3 / tallySum);
			t4Advantage = Math.random() > (tally4 / tallySum);
			t5Advantage = Math.random() > (tally5 / tallySum);
			t6Advantage = Math.random() > (tally6 / tallySum);
		}
	}
}