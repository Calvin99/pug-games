console.clear();
var canvas = document.getElementById("serpongtine"),
    ctx = canvas.getContext("2d"),
    w = canvas.width,
    h = canvas.height;
ctx.fillStyle = '#bbbbbb';

var buttons = [];

var winScore = 50;

var mouseX;
var mouseY;
var click;
var play = false;
var frame = 0;

var BlueVImg = new Image();
BlueVImg.src = "http://s8.postimg.org/olvtij34l/Blue_Victory.png";

var GreenVImg = new Image();
GreenVImg.src = "http://s4.postimg.org/8c68h1dnh/Green_Victory.png";

var MenuImg = new Image();
MenuImg.src = "http://s12.postimg.org/hg3xbu8x9/New_Serpongtine_Logo.png";

var PlayButtonImg = new Image();
PlayButtonImg.src = "http://s15.postimg.org/l9p0r79br/Play_Button.png";

function MenuInit() {
    new Button(412, 115, 76, 36, '#ffff00');
}

MenuInit();

function Menu() {
    ctx.drawImage(MenuImg, 0, 0, MenuImg.width, MenuImg.height, 200, 0, 500, 500);
    for (i = 0; i < buttons.length; i++) {
        buttons[i].draw();
        buttons[i].detectClick();
    }
}

function Button(x, y, width, height, color) {
    this.x = x;
    this.y = y;
    this.height = height;
    this.width = width;
    this.color = color;
    buttons.push(this);
}
Button.prototype.draw = function () {
    ctx.drawImage(PlayButtonImg, 0, 0, PlayButtonImg.width, PlayButtonImg.height, this.x, this.y, 76, 36);

};

Button.prototype.detectClick = function () {
    if (mouseX > this.x && mouseX < this.x + this.width && mouseY > this.y && mouseY < this.y + this.height && click) {
        play = true;
        menu = false;
    }
};

function gamePiece(color, size, x, y) {
    this.color = color;
    this.size = size;
    this.x = x;
    this.y = y;
}

var menu = true;

var current = 0;
var activateR = false;
var rainbow1 = ['#0000ff', '#8800ff', '#0088ff', '#8888ff'];
var rainbow2 = ['#00ff88', '#88ff88', '#00ff00', '#88ff00'];

var head1 = new gamePiece('#0099ff', 20, w / 6 - 10, h / 2 - 10);
var tail1 = new gamePiece('#55ccdd', 20, 0, 0);
var head2 = new gamePiece('#99ff00', 20, w * 5 / 6 - 10, h / 2 - 10);
var tail2 = new gamePiece('#ccff22', 20, 0, 0);
var ball = new gamePiece('#bbbbbb', 20, w / 2 - 10, h / 2 - 10);

var ballDirX = Math.random() < 0.5 ? -10 : 10;
var ballDirY = Math.random() < 0.5 ? -10 : 10;
var ballCool = 0;
var dir1X = 0;
var dir1Y = 0;
var dir2X = 0;
var dir2Y = 0;
var last1 = {
    x: 0,
    y: 0
};
var last2 = {
    x: 0,
    y: 0
};

var segList1X = [];
var segList1Y = [];
var segList2X = [];
var segList2Y = [];
var score1 = 5;
var score2 = 5;
var showscore1 = 0;
var showscore2 = 0;
var onSeg = -1;
var border = 1;

var gameSpeed = 8;
var edge = 0;

var css = document.body.style;

ctx.fillStyle = '#222222';
ctx.fillRect(edge / 2, edge / 2, w - edge, h - edge);

//Controls-----------------------------
document.onkeydown = function (e) {

    var key = e.keyCode;

    e.preventDefault();

    //Up
    if (key == 38 && dir2Y != 20) {
        dir2Y = -20;
        dir2X = 0;
    }
    //Down
    if (key == 40 && dir2Y != -20) {
        dir2Y = 20;
        dir2X = 0;
    }
    //Left
    if (key == 37 && dir2X != 20) {
        dir2Y = 0;
        dir2X = -20;
    }
    //Right
    if (key == 39 && dir2X != -20) {
        dir2Y = 0;
        dir2X = 20;
    }


    //W up
    if (key == 87 && dir1Y != 20) {
        dir1Y = -20;
        dir1X = 0;
    }
    //S down
    if (key == 83 && dir1Y != -20) {
        dir1Y = 20;
        dir1X = 0;
    }
    //A left
    if (key == 65 && dir1X != 20) {
        dir1Y = 0;
        dir1X = -20;
    }
    //D right
    if (key == 68 && dir1X != -20) {
        dir1Y = 0;
        dir1X = 20;
    }
    //R
    if (key == 82) {
        activateR = !activateR;
    }
};

function resetAll() {
    score1 = 3;
    score2 = 3;
    showscore1 = 0;
    showscore2 = 0;
    segList1X.length = 0;
    segList1Y.length = 0;
    segList2X.length = 0;
    segList2Y.length = 0;
    head1.x = w / 6 - 10;
    head1.y = h / 2 - 10;
    head2.x = w - w / 6 - 10;
    head2.y = h / 2 - 10;
    dir1X = 0;
    dir1Y = 0;
    dir2X = 0;
    dir2Y = 0;
    ball.x = w / 2 - 10;
    ball.y = h / 2 - 10;
    border = 1;
	css.backgroundColor = '#333333';
    menu = true;
}

function hitTestTail(objectX, objectY, axis) {

    if ((ball.x + ball.size / 2 >= objectX - tail1.size / 2) && (ball.x - ball.size / 2 <= objectX + tail1.size / 2)) {

        if ((ball.y + ball.size / 2 >= objectY - tail1.size / 2) && (ball.y - ball.size / 2 <= objectY + tail1.size / 2)) {
            console.log("hit");
            return true;
        } else {
            console.log("miss");
            return false;
        }
    }
}

function hitTest(object1, object2, axis) {
    if (axis == "x") {
        if ((object1.x + object1.size >= object2.x) && (object1.x <= object2.x + object2.size)) {
            //console.log("hit");
            return true;
        } else {
            //console.log("miss");
            return false;
        }
    } else {
        if ((object1.y + object1.size >= object2.y) && (object1.x <= object2.y + object2.size)) {
            //console.log("hit");
            return true;

        } else {
            //console.log("miss");
            return false;

        }
    }
}

setInterval(gameLoop, gameSpeed);

function gameLoop(evt) {

    if (menu) {
        ctx.fillStyle = '#2d2d2d';
        ctx.fillRect(0, 0, w, h);
        Menu();
    }

    if (showscore1 >= winScore) {
        play = false;
        ctx.drawImage(BlueVImg, 0, 0, BlueVImg.width, BlueVImg.height, 270, 150, 368, 180);
		css.backgroundColor = '#0099ff';
        setTimeout(function () {
            resetAll();
        }, 5000);
    }
    if (showscore2 >= winScore) {
        play = false;
        ctx.drawImage(GreenVImg, 0, 0, GreenVImg.width, GreenVImg.height, 270, 150, 368, 180);
		css.backgroundColor = '#99ff00';
        setTimeout(function () {
            resetAll();
        }, 5000);
    }

    if (play) {
        ctx.clearRect(0, 0, w, h);

        ctx.fillStyle = '#222222';
        ctx.fillRect(edge / 2, edge / 2, w - edge, h - edge);
        ctx.fillStyle = '#2b2b2b';
        ctx.fillRect(edge / 2 + w / 3, edge / 2, w / 3 - edge, h - edge);
        ctx.fillStyle = head1.color;
        ctx.fillRect(head1.x + border, head1.y + border, head1.size - border * 2, head1.size - border * 2);

        ctx.fillStyle = head2.color;
        ctx.fillRect(head2.x + border, head2.y + border, head2.size - border * 2, head2.size - border * 2);

        ctx.fillStyle = ball.color;
        ctx.fillRect(ball.x + border, ball.y + border, ball.size - border * 2, ball.size - border * 2);
        /**    
    //Ball Targeting
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0,head1.y,0,h);
    ctx.fillRect(0,head2.y,0,h);
    ctx.fillRect(ball.x,0, 2,h);
    ctx.fillRect(0, ball.y, w,2);
    **/
        //Update Location (Snake head1)--------
        if (frame % 4 === 0) {
            if (dir1Y !== 0) {
                head1.y += dir1Y;
            }
            if (dir1X !== 0) {
                head1.x += dir1X;
            }

            if (dir2Y !== 0) {
                head2.y += dir2Y;
            }
            if (dir2X !== 0) {
                head2.x += dir2X;
            }
        }
        if (head1.x <= -10) {
        	head1.x = 0;
        }
        if (head2.x <= -10) {
        	head2.x = 0;
        }
        
        if (head1.y >= h) {
            head1.y = 0;
        } else if (head1.y <= -20) {
            head1.y = h-20;
        }
        
        if (head2.x >= w) {
                head2.x = w - 20;
            }
        if (head1.x >= w) {
        	head1.x = w - 20;
        }
        if (head2.y >= h) {
            head2.y = 0;
        } else if (head2.y <= -20) {
            head2.y = h-20;
        }
        //Update Location (ball)----------------
        ball.x += ballDirX / 4;
        ball.y += ballDirY / 4;
        ballCool --;

        if (ball.x >= w - 10) {
            if (score1 < 0) {
                score1 += 2;
            } else {
                score1 += 2;
            }
            showscore1 += 1;
            ballDirX = Math.random() < 0.5 ? -10 : 10;
            ballDirY = Math.random() < 0.5 ? -10 : 10;
            ball.x = w / 2 - 10;
            ball.y = h / 2 - 10;
        }
        if (ball.x <= -10) {
            if (score2 < 0) {
                score2 += 2;
            } else {
                score2 += 2;
            }
            showscore2 += 1;
            ballDirX = Math.random() < 0.5 ? -8 : 8;
            ballDirY = Math.random() < 0.5 ? -8 : 8;
            ball.x = w / 2 - 10;
            ball.y = h / 2 - 10;
        }
        if (ball.y >= h - 20) ballDirY = -Math.abs(ballDirY)
        else if (ball.y <= 0) ballDirY = Math.abs(ballDirY);

        //score1 Counter

        document.getElementById("p1").innerHTML = ('000' + showscore1).substr(-3);

        document.getElementById("p2").innerHTML = ('000' + showscore2).substr(-3);

        //console.log(highscore1 + " " + score1);

        //Update Location (Segments)

        onSeg = score1 - 1;

        for (i = score1; i >= 0; i--) {

            tail1.x = last1.x;
            tail1.y = last1.y;

            ctx.fillStyle = tail1.color;
            ctx.fillRect(segList1X[onSeg] + border + 1, segList1Y[onSeg] + border + 1, tail1.size - border * 2 - 2, tail1.size - border * 2 - 2);

            if (onSeg >= 1) {
                segList1X[onSeg] = segList1X[onSeg - 1];
                segList1Y[onSeg] = segList1Y[onSeg - 1];

                if (hitTest(head1, ball, "x") && hitTest(head1, ball, "y") && ballCool <= 0) {
                    if (Math.abs(head1.x - ball.x) < Math.abs(head1.y - ball.y)) {
                        ballDirY = ballDirY * -1;
                        ball.y += ballDirY / 4;
                    } else {
                        ballDirX = ballDirX * -1;
                        ball.x += ballDirX / 4;
                    }
                    ballCool = 30;
                }
                if (hitTestTail(segList1X[onSeg], segList1Y[onSeg], "x") && ballCool <= 0) {
                    if (Math.abs(segList1X[onSeg] - ball.x) < Math.abs(segList1Y[onSeg] - ball.y)) {
                        ballDirY = ballDirY * -1;
                        ball.y += ballDirY / 4;
                    } else {
                        ballDirX = ballDirX * -1;
                        ball.x += ballDirX / 4;
                    }
                    ballCool = 30;
                }
                onSeg -= 1;
            }
        }

        onSeg = score2 - 1;

        for (i = score2; i >= 0; i--) {

            tail2.x = last2.x;
            tail2.y = last2.y;

            ctx.fillStyle = tail2.color;
            ctx.fillRect(segList2X[onSeg] + border + 1, segList2Y[onSeg] + border + 1, tail2.size - border * 2 - 2, tail2.size - border * 2 - 2);

            if (onSeg >= 1) {
                segList2X[onSeg] = segList2X[onSeg - 1];
                segList2Y[onSeg] = segList2Y[onSeg - 1];

                if (hitTest(head2, ball, "x") && hitTest(head2, ball, "y") && ballCool <= 0) {
                    if (Math.abs(head2.x - ball.x) < Math.abs(head2.y - ball.y)) {
                        ballDirY = ballDirY * -1;
                        ball.y += ballDirY / 4;
                    } else {
                        ballDirX = ballDirX * -1;
                        ball.x += ballDirX / 4;
                    }
                    ballCool = 30;
                }
                if (hitTestTail(segList2X[onSeg], segList2Y[onSeg], "x") && ballCool <= 0) {
                    if (Math.abs(segList2X[onSeg] - ball.x) < Math.abs(segList2Y[onSeg] - ball.y)) {
                        ballDirY = ballDirY * -1;
                        ball.y += ballDirY / 4;
                    } else {
                        ballDirX = ballDirX * -1;
                        ball.x += ballDirX / 4;
                    }
                    ballCool = 30;
                }
                onSeg -= 1;
            }
        }

        segList1X[onSeg] = tail1.x;
        segList1Y[onSeg] = tail1.y;

        segList2X[onSeg] = tail2.x;
        segList2Y[onSeg] = tail2.y;

        last1.x = head1.x;
        last1.y = head1.y;
        last2.x = head2.x;
        last2.y = head2.y;

        if (activateR === true && frame % 8 === 0) {
            hC = current;
            if (current != rainbow1.length) {
                current++;
            } else {
                current = 0;
            }
            tC = current;
            head1.color = rainbow1[hC];
            tail1.color = rainbow1[tC];

            head2.color = rainbow2[hC];
            tail2.color = rainbow2[tC];
        }
        if (border < 0.5) {
            border -= 0.5;
        }
    }
    frame++;
}

document.onmousemove = function (e) {
    //capture the event
    e = window.event || e;
    var rect = canvas.getBoundingClientRect();
    mouseX = e.clientX - rect.left;
    mouseY = e.clientY - rect.top;
    return true;
};
document.onmousedown = function (e) {
    //capture the event
    e = window.event || e;
    click = true;

};
document.onmouseup = function (e) {
    //capture the event
    e = window.event || e;
    //get the key code
    click = false;


};