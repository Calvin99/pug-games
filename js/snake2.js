var canvas1;
var context1;
var thread1;
var food1;
var food2;
var head1;
var head2;
var snakeSegments1;
var snakeSegments2;
var dir1 = [];
var dir2 = [];
var lastDir1 = [];
var lastDir2 = [];
var gap1 = 2;
//initialize the game pieces
function gamePiece(color, size, x, y) {
    this.color = color;
    this.size = size;
    this.x = x;
    this.y = y;
}
/**
the game piece will move
**/
gamePiece.prototype.move = function(x, y) {
    this.x = x;
    this.y = y;
};



//begin by gaining access to the canvas's 2d drawing context
canvas1 = document.getElementById("snake2");
context1 = canvas1.getContext("2d");
//create a snake head
head1 = new gamePiece("#ff0000", 20, 380, 380);
head1.dirX = 0;
head1.dirY = 0;

head2 = new gamePiece("#0000ff", 20, 100, 100);
head2.dirX = 0;
head2.dirY = 0;
//new move method just for the head
head1.move = function() {
    this.x += (this.size * this.dirX) / 2;
    this.y += (this.size * this.dirY) / 2;
    if (this.x == 500) {
        this.x = 0;
    }
    if (this.x < 0) {
        this.x = 480;
    }
    if (this.y == 500) {
        this.y = 0;
    }
    if (this.y < 0) {
        this.y = 480;
    }
};

head2.move = function() {
    this.x += (this.size * this.dirX) / 2;
    this.y += (this.size * this.dirY) / 2;
    if (this.x == 500) {
        this.x = 0;
    }
    if (this.x < 0) {
        this.x = 480;
    }
    if (this.y == 500) {
        this.y = 0;
    }
    if (this.y < 0) {
        this.y = 480;
    }
};
//collision detection for the head
head1.hitTest = function(ob) {
    if (this.x < ob.x + ob.size && this.x + this.size > ob.x && this.y < ob.y + ob.size && this.y + this.size > ob.y) {
        return true;
    }
    return false;
}

head2.hitTest = function(ob) {
        if (this.x < ob.x + ob.size && this.x + this.size > ob.x && this.y < ob.y + ob.size && this.y + this.size > ob.y) {
            return true;
        }
        return false;
    }
    //create the food
food1 = new gamePiece("#00ff00", 20, 240, 240);
food1.change = Math.round(Math.random() * 4);
food2 = new gamePiece("#00ff00", 20, 240, 240);
food2.change = Math.round(Math.random() * 4);

//create the snakeSegments array
snakeSegments1 = [];
snakeSegments2 = [];
//move the objects
head1.move(0, 0);
head2.move(0, 0);
food1.move(240, 240);
food2.move(240, 240);
//initiate the procedure!!!
thread1 = setInterval(draw1, 50);
/**
draw the game
**/
function draw1() {
    //move the segments
    for (i = 0; i < snakeSegments2.length; i++) {
        //capture the segment
        var segment1 = snakeSegments2[i];
        if (head1.hitTest(segment1)) {
            //create a new snake segment
            var segment2 = new gamePiece(snakeSegments2[snakeSegments2.length - 1].color, 20, 500, 500);
            //add the segment to the array
            snakeSegments1[snakeSegments1.length] = segment2;
            snakeSegments2.splice(snakeSegments2.length - 1, 1)
        }
    }
    for (i = 0; i < snakeSegments1.length; i++) {
        //capture the segment
        var segment1 = snakeSegments1[i];
        if (head2.hitTest(segment1)) {
            //create a new snake segment
            var segment2 = new gamePiece(snakeSegments1[snakeSegments1.length - 1].color, 20, 500, 500);
            //add the segment to the array
            snakeSegments2[snakeSegments2.length] = segment2;
            snakeSegments1.splice(snakeSegments1.length - 1, 1)
        }
    }
    for (i = snakeSegments1.length - 1; i > 0; i--) {
        var next = snakeSegments1[i - 1];
        var segment = snakeSegments1[i];
        segment.move(next.x, next.y);
    }
    for (i = snakeSegments2.length - 1; i > 0; i--) {
        var next = snakeSegments2[i - 1];
        var segment = snakeSegments2[i];
        segment.move(next.x, next.y);
    }
    //move the first segment
    if (snakeSegments1.length > 0) {
        snakeSegments1[0].move(head1.x, head1.y);
    }

    if (snakeSegments2.length > 0) {
        snakeSegments2[0].move(head2.x, head2.y);
    }
    //move the head
    lastDir1 = dir1;
    lastDir2 = dir2;
	dir1 = [head1.xDir,head1.yDir];
	dir2 = [head2.xDir,head2.yDir];
    head1.move();
    head2.move();
    for (i = 0; i < snakeSegments1.length; i++) {
        //capture the segment
        var segment = snakeSegments1[i];
        if (i > 3) {
            if (head1.hitTest(segment)) {
                head1.dirX = 0;
                head1.dirY = 0;
                head1.x = 240;
                head1.y = 240;
                snakeSegments1 = [];
            }
        }
    }
    for (i = 0; i < snakeSegments2.length; i++) {
        //capture the segment
        var segment = snakeSegments2[i];
        if (i > 3) {
            if (head2.hitTest(segment)) {
                head2.dirX = 0;
                head2.dirY = 0;
                head2.x = 240;
                head2.y = 240;
                snakeSegments2 = [];
            }
        }
    }
    //check for hit test on the food
    if (head1.hitTest(food1)) {
        //alert("hit food!");
        //calculate random position
        var newX = Math.floor(Math.random() * 25) * food1.size;
        var newY = Math.floor(Math.random() * 25) * food1.size;
        //tell the food to move
        food1.move(newX, newY);
        //create a new snake segment
        var segment = new gamePiece("#551111", 20, head1.x, head1.y);
        //add the segment to the array
        snakeSegments1[snakeSegments1.length] = segment;
    }
    if (head1.hitTest(food2)) {
        //alert("hit food!");
        //calculate random position
        var newX = Math.floor(Math.random() * 25) * food2.size;
        var newY = Math.floor(Math.random() * 25) * food2.size;
        //tell the food to move
        food2.move(newX, newY);
        //create a new snake segment
        var segment = new gamePiece("#551111", 20, head1.x, head1.y);
        //add the segment to the array
        snakeSegments1[snakeSegments1.length] = segment;
    }
    if (head2.hitTest(food1)) {
        //alert("hit food!");
        //calculate random position
        var newX = Math.floor(Math.random() * 25) * food1.size;
        var newY = Math.floor(Math.random() * 25) * food1.size;
        //tell the food to move
        food1.move(newX, newY);
        //create a new snake segment
        var segment = new gamePiece("#111155", 20, head2.x, head2.y);
        //add the segment to the array
        snakeSegments2[snakeSegments2.length] = segment;
    }
    if (head2.hitTest(food2)) {
        //alert("hit food!");
        //calculate random position
        var newX = Math.floor(Math.random() * 25) * food2.size;
        var newY = Math.floor(Math.random() * 25) * food2.size;
        //tell the food to move
        food2.move(newX, newY);
        //create a new snake segment
        var segment = new gamePiece("#111155", 20, head2.x, head2.y);
        //add the segment to the array
        snakeSegments2[snakeSegments2.length] = segment;
    }
    //first the game board
    context1.fillStyle = "#333333";
    context1.fillRect(0, 0, 500, 500);
    //then the head
    //draw each segment
    for (i = snakeSegments1.length - 1; i >= 0; i--) {
        //capture the segment
        var segment = snakeSegments1[i];
        context1.fillStyle = segment.color;
        context1.fillRect(segment.x, segment.y, segment.size - gap1, segment.size - gap1);
    }

    for (i = snakeSegments2.length - 1; i >= 0; i--) {
        //capture the segment
        var segment = snakeSegments2[i];
        context1.fillStyle = segment.color;
        context1.fillRect(segment.x, segment.y, segment.size - gap1, segment.size - gap1);
    }
    //then the food
    if (Math.round(Math.random() * 25) == 12) {
        food1.change = Math.round(Math.random() * 4);
    }
    if (food1.change == 1) {
        food1.x = food1.x + (food1.size / 3);
    }
    if (food1.change == 2) {
        food1.x = food1.x - (food1.size / 3);
    }
    if (food1.change == 3) {
        food1.y = food1.y + (food1.size / 3);
    }
    if (food1.change == 4) {
        food1.y = food1.y - (food1.size / 3);
    }
    if (food1.x < 0) {
        food1.x = 490;
    }
    if (food1.x >= 500) {
        food1.x = 0;
    }
    if (food1.y < 0) {
        food1.y = 490;
    }
    if (food1.y >= 500) {
        food1.y = 0;
    }
    
    if (Math.round(Math.random() * 25) == 12) {
        food2.change = Math.round(Math.random() * 4);
    }
    if (food2.change == 1) {
        food2.x = food2.x + (food2.size / 3);
    }
    if (food2.change == 2) {
        food2.x = food2.x - (food2.size / 3);
    }
    if (food2.change == 3) {
        food2.y = food2.y + (food2.size / 3);
    }
    if (food2.change == 4) {
        food2.y = food2.y - (food2.size / 3);
    }
    if (food2.x < 0) {
        food2.x = 490;
    }
    if (food2.x >= 500) {
        food2.x = 0;
    }
    if (food2.y < 0) {
        food2.y = 490;
    }
    if (food2.y >= 500) {
        food2.y = 0;
    }
    context1.fillStyle = food1.color;
    context1.fillRect(food1.x, food1.y, food1.size - gap1, food1.size - gap1);
    context1.fillRect(food2.x, food2.y, food2.size - gap1, food2.size - gap1);
    context1.fillStyle = head1.color;
    context1.fillRect(head1.x, head1.y, head1.size - gap1, head1.size - gap1);
    context1.fillStyle = head2.color;
    context1.fillRect(head2.x, head2.y, head2.size - gap1, head2.size - gap1);
    context1.font = "30px Impact";
    context1.fillStyle = "#ffffff";
    context1.fillRect(0, 500, 500, 550);
    context1.fillStyle = "#000000";
    context1.fillText("-", 245, 535);
    context1.fillStyle = head1.color;
    context1.fillText(Math.floor(snakeSegments1.length/10) + "" + snakeSegments1.length%10, 260, 535);
    context1.fillStyle = head2.color;
    context1.fillText(Math.floor(snakeSegments2.length/10) + "" + snakeSegments2.length%10, 207, 535);
}
/**
key controls
**/
document.onkeydown = function(e) {
    //capture the event
	e = window.event || e;
	
	//get the key code
	var key = e.keyCode;
	//prevent default event behavior
	e.preventDefault();
	//establish my own behavior
	//right arrow
	if (key == 39 && head1.dirX != -1 && lastDir1[0] != -1) {
		head1.dirX = 1;
		head1.dirY = 0;
		head1.move();
	}
	//left arrow
	if (key == 37 && head1.dirX != 1 && lastDir1[0] != 1) {
		head1.dirX = -1;
		head1.dirY = 0;
		head1.move();
	}
	//up arrow
	if (key == 38 && head1.dirY != 1 && lastDir1[1] != 1) {
		head1.dirX = 0;
		head1.dirY = -1;
		head1.move();
	}
	//down arrow
	if (key == 40 && head1.dirY != -1 && lastDir1[1] != -1) {
		head1.dirX = 0;
		head1.dirY = 1;
		head1.move();
	}
	//d
	if (key == 68 && head2.dirX != -1 && lastDir2[0] != -1) {
		head2.dirX = 1;
		head2.dirY = 0;
		head2.move();
	}
	//a
	if (key == 65 && head2.dirX != 1 && lastDir2[0] != 1) {
		head2.dirX = -1;
		head2.dirY = 0;
		head2.move();
	}
	//w
	if (key == 87 && head2.dirY != 1 && lastDir2[1] != 1) {
		head2.dirX = 0;
		head2.dirY = -1;
		head2.move();
	}
	//s
	if (key == 83 && head2.dirY != -1 && lastDir2[1] != -1) {
		head2.dirX = 0;
		head2.dirY = 1;
		head2.move();
	}
	//Esc
	if (key == 27) {
		head1.dirX = 0;
		head1.dirY = 0;
		head1.x = 380;
		head1.y = 380;
		head2.dirX = 0;
		head2.dirY = 0;
		head2.x = 100;
		head2.y = 100;
		snakeSegments1 = [];
		snakeSegments2 = [];
		food1.x = 240;
		food1.y = 240;
		food1.change = Math.round(Math.random() * 4);
		food2.x = 240;
		food2.y = 240;
		food2.change = Math.round(Math.random() * 4);
	}
};