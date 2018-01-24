var canvas;
var context;
var thread;
var food;
var head;
var snakeSegments;
var gap = 2;
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
gamePiece.prototype.move = function (x, y) {
    this.x = x;
    this.y = y;
};



//begin by gaining access to the canvas's 2d drawing context
canvas = document.getElementById("snake");
context = canvas.getContext("2d");
//create a snake head
head = new gamePiece("#534741", 20, 240, 240);
head.dirX = 0;
head.dirY = 0;
//new move method just for the head
head.move = function () {
    this.x += (this.size * this.dirX)/2;
    this.y += (this.size * this.dirY)/2;
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
head.hitTest = function(ob){
    if(this.x < ob.x + ob.size && this.x + this.size > ob.x && this.y < ob.y + ob.size && this.y + this.size > ob.y){
        return true;
    }
    return false;
}
//create the food
food = new gamePiece("#8dc73f", 20, 100, 100);
food.change = 1;
//create the snakeSegments array
snakeSegments = [];
//move the objects
head.move(0, 0);
food.move(20, 20);
//initiate the procedure!!!
thread = setInterval(draw, 50);
/**
draw the game
**/
function draw() {
    //move the segments
    for(i = snakeSegments.length-1; i > 0; i--){
        var next = snakeSegments[i-1];
        var segment = snakeSegments[i];
        segment.move(next.x, next.y);        
    }
    //move the first segment
    if(snakeSegments.length > 0){
        snakeSegments[0].move(head.x, head.y);
    }
    //move the head
    head.move();
    for(i = 0; i < snakeSegments.length; i++){
        //capture the segment
        var segment = snakeSegments[i];
        if (i> 1){
        if(head.hitTest(segment)){
            head.dirX = 0;
            head.dirY = 0;
            head.x = 240;
            head.y = 240;
            snakeSegments = [];
            food.x = 20;
            food.y = 20;
        }
        }
    }
    //check for hit test on the food
     if(head.hitTest(food)){
        //alert("hit food!");
        //calculate random position
        var newX = Math.floor(Math.random() * 25) * food.size;
        var newY = Math.floor(Math.random() * 25) * food.size;
        //tell the food to move
        food.move(newX, newY);
        //create a new snake segment
        var segment = new gamePiece("#c69c6d", 20, head.x, head.y);
        //add the segment to the array
        snakeSegments[snakeSegments.length] = segment;
     }
    //first the game board
    context.fillStyle = "#333333";
    context.fillRect(0, 0, 500, 500);
    //then the head
    //draw each segment
    for(i = 0; i < snakeSegments.length; i++){
        //capture the segment
        var segment = snakeSegments[i];
        context.fillStyle = segment.color;
        context.fillRect(segment.x, segment.y, segment.size-gap, segment.size-gap);
    }
    //then the food
    if (Math.round(Math.random()*25) == 12) {
        food.change = Math.round(Math.random()*4);
    }
    if (food.change == 1) {
        food.x = food.x + (food.size/3);
    }
    if (food.change == 2) {
        food.x = food.x - (food.size/3);
    }
    if (food.change == 3) {
        food.y = food.y + (food.size/3);
    }
    if (food.change == 4) {
        food.y = food.y - (food.size/3);
    }
    if (food.x < 0) {
        food.x = 490;
    }
    if (food.x >= 500) {
        food.x = 0;
    }
    if (food.y < 0) {
        food.y = 490;
    }
    if (food.y >= 500) {
        food.y = 0;
    }
    context.fillStyle = food.color;
    context.fillRect(food.x, food.y, food.size-gap, food.size-gap);
    context.fillStyle = head.color;
    context.fillRect(head.x, head.y, head.size-gap, head.size-gap);
}
/**
key controls
**/
document.onkeydown = function (e) {
    //capture the event
    e = window.event || e;
    //get the key code
    var key = e.keyCode;
    //prevent default event behavior
    e.preventDefault();
    //establish my own behavior
    //right arrow
    if (key == 39 && head.dirX != -1) {
        head.dirX = 1;
        head.dirY = 0;
    }
    //left arrow
    if (key == 37 && head.dirX != 1) {
        head.dirX = -1;
        head.dirY = 0;
    }
    //up arrow
    if (key == 38 && head.dirY != 1) {
        head.dirX = 0;
        head.dirY = -1;
    }
    //down arrow
    if (key == 40 && head.dirY != -1) {
        head.dirX = 0;
        head.dirY = 1;
    }
    //Esc
    if (key == 27) {
        head.dirX = 0;
        head.dirY = 0;
        head.x = 240;
        head.y = 240;
        snakeSegments = [];
        food.x = 20;
        food.y = 20;
    }
};