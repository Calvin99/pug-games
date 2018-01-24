console.clear();
var canvas = document.getElementById("pixelrim"),
    ctx = canvas.getContext("2d"),
    w = canvas.width,
    h = canvas.height;
//Variables
var mountImg = "http://epicwibbles.com/home/wp-content/uploads/2015/05/SkyrimMount.png";
var groundImg = "http://epicwibbles.com/home/wp-content/uploads/2015/05/SkyrimForeground.png";
var spriteTorsoImg = "http://epicwibbles.com/home/wp-content/uploads/2015/05/SkyrimSpriteTors.png";
var spriteLegsImg = "http://epicwibbles.com/home/wp-content/uploads/2015/05/SkyrimSpriteLegs.png";
var spriteArmImg = "http://epicwibbles.com/home/wp-content/uploads/2015/05/SkyrimSpriteArm.png";
var practiceDummyImg = "http://epicwibbles.com/home/wp-content/uploads/2015/05/SkyrimPracticeDummy.png";
var navImg = "http://epicwibbles.com/home/wp-content/uploads/2015/05/NaviBar.png";
var questMarkerImg = "http://epicwibbles.com/home/wp-content/uploads/2015/05/SkyrimQuestMarker.png";
var questDoorImg = "http://epicwibbles.com/home/wp-content/uploads/2015/05/SkyrimQuestDoor.png";
var enemyMarkerImg = "http://epicwibbles.com/home/wp-content/uploads/2015/05/SkyrimEnemyMarker.png";
var emptyBarImg = "http://epicwibbles.com/home/wp-content/uploads/2015/05/EmptyBar.png";
var mImg = new Image();
mImg.src = mountImg;
var gImg = new Image();
gImg.src = groundImg;
var stImg = new Image();
stImg.src = spriteTorsoImg;
var slImg = new Image();
slImg.src = spriteLegsImg;
var saImg = new Image();
saImg.src = spriteArmImg;
var pdImg = new Image();
pdImg.src = practiceDummyImg;
var nImg = new Image();
nImg.src = navImg;
var qmImg = new Image();
qmImg.src = questMarkerImg;
var qdImg = new Image();
qdImg.src = questDoorImg;
var emImg = new Image();
emImg.src = enemyMarkerImg;
var eImg = new Image();
eImg.src = emptyBarImg;

var gameSpeed = 25;
var gameFrame = 0;
var frameStrike = 0;
var frameCast = 0;
var frameInt = 5;
var frameCurr = 0;
var showControls = 1;
var mouseOver = false;

var mImgx = 0;
var mImgy = h / 3;

var gImgx = 0;
var gImgy = 462;

var dovahkiin = {
    xframe: 0,
    yframe: 0,
    frameW: 160,
    x: Math.floor(w / 3 + stImg.width / 80) + 100,
    y: h - 278,
    dirx: 0,
    speed: 5,
    health: 100,
    mana: 100,
    crouch: 0,
    jump: 0,
    spell: 0,
    weapon: 0,
    magic: 50,
    attack: 40,
    casting: 0,
    striking: 0
};

var enemies = {
    x: Math.floor(w * 3/4),
    y: h - 278,
    attack: 10,
    health: 100
};

//Strike!
document.onclick = function (e) {
    if (dovahkiin.weapon == 1) {
        dovahkiin.striking = 1;
        frameStrike = 0;
    }
    if(mouseOver){
		e.preventDefault();
	}
};
//Cast!
document.addEventListener("contextmenu", function (e) {
    if (dovahkiin.spell == 1 && dovahkiin.mana > 15) {
        dovahkiin.casting = 1;
        frameCast = 0;
    }
    if(mouseOver){
		e.preventDefault();
	}
}, false);
//Switch Equip
document.onmousewheel = function (e) {
    var mousePos = e.wheelDelta;
	if(mouseOver){
		e.preventDefault();
	}
    if (mousePos < 0) {
        dovahkiin.spell = -1 * dovahkiin.spell + 1;
    } else if (mousePos > 0) {
        //Scroll up
        dovahkiin.weapon = -1 * dovahkiin.weapon + 1;
    }
};
document.onkeydown = function (e) {
    e = window.event || e;
    var key = e.keyCode;
    if(mouseOver){
		e.preventDefault();
	}
    if (key === 65) {
        //left
        dovahkiin.dirx = -1 * dovahkiin.speed;
        dovahkiin.xframe = 1;
        dovahkiin.x = Math.floor(w / 3 - stImg.width / 80) + 100;
        //console.log('left');
    }
    if (key === 68) {
        //right
        dovahkiin.dirx = dovahkiin.speed;
        dovahkiin.xframe = 0;
        dovahkiin.x = Math.floor(w / 3 + stImg.width / 80) + 100;
        //console.log('right');
    }

    if (key === 87) {
        //console.log('jump!');
        //jump
    }
    if (key === 83) {
        if (dovahkiin.crouch === 0) {
            dovahkiin.crouch = 1;
            dovahkiin.speed = dovahkiin.speed / 2;
        } else {
            dovahkiin.crouch = 0;
            dovahkiin.speed = dovahkiin.speed * 2;
        }
        //console.log('sneak!');
        //crouch

    }

};

document.onkeyup = function (e) {
    dovahkiin.dirx = 0;
};

document.onmousemove = function(e) {
    e = window.event || e;

    rect = canvas.getBoundingClientRect();
    mouseX = Math.round((e.clientX - rect.left));
    mouseY = Math.round((e.clientY - rect.top));
    
    if (mouseX < 0 || mouseX > w || mouseY < 0 || mouseY > h) mouseOver = false;
    else mouseOver = true;
    console.log(mouseOver);
}

function drawBackground() {
    //Mountains
    //Mid
    ctx.drawImage(mImg, mImgx, mImgy, mImg.width, mImg.height);
    //Forward 1
    mImgx += mImg.width;
    ctx.drawImage(mImg, mImgx, mImgy, mImg.width, mImg.height);
    //Forward 2
    mImgx += mImg.width;
    ctx.drawImage(mImg, mImgx, mImgy, mImg.width, mImg.height);
    //Back 1
    mImgx -= 3 * mImg.width;
    ctx.drawImage(mImg, mImgx, mImgy, mImg.width, mImg.height);
    //Back 2
    mImgx -= 1 * mImg.width;
    ctx.drawImage(mImg, mImgx, mImgy, mImg.width, mImg.height);

    //Reset
    mImgx += 2 * mImg.width;
    if (dovahkiin.x + mImg.width >= mImgx + mImg.width) {
        mImgx += mImg.width;
    } else if (dovahkiin.x - mImg.width <= mImgx - mImg.width) {
        mImgx -= mImg.width;
    }

    //Floor
    //Mid
    ctx.drawImage(gImg, gImgx, gImgy, gImg.width, gImg.height);
    //Forward 1
    gImgx += gImg.width;
    ctx.drawImage(gImg, gImgx, gImgy, gImg.width, gImg.height);
    //Forward 2
    gImgx += gImg.width;
    ctx.drawImage(gImg, gImgx, gImgy, gImg.width, gImg.height);
    //Back 1
    gImgx -= 3 * gImg.width;
    ctx.drawImage(gImg, gImgx, gImgy, gImg.width, gImg.height);
    //Back 2
    gImgx -= 1 * gImg.width;
    ctx.drawImage(gImg, gImgx, gImgy, gImg.width, gImg.height);
    //Reset
    gImgx += 2 * gImg.width;
    if (dovahkiin.x + gImg.width >= gImgx + gImg.width) {
        gImgx += gImg.width;
    } else if (dovahkiin.x - gImg.width <= gImgx - gImg.width) {
        gImgx -= gImg.width;
    }

}

function drawDovahkiin() {
    dovahkiin.yframe = frameCurr;
    //Legs
    if (dovahkiin.dirx === 0 && dovahkiin.crouch === 0) {
        dovahkiin.yframe = 0;
    } else if (dovahkiin.dirx === 0 && dovahkiin.crouch == 1) {
        dovahkiin.yframe = 3;
    }
    if (dovahkiin.xframe >= 2) {
        dovahkiin.xframe -= 2;
        if (dovahkiin.xframe >= 2) {
            dovahkiin.xframe -= 2;
        }
    } else if (dovahkiin.xframe <= -1) {
        dovahkiin.xframe += 2;
        if (dovahkiin.xframe <= -1) {
            dovahkiin.xframe += 2;
        }
    }
    ctx.drawImage(slImg, dovahkiin.xframe * slImg.width / 2, dovahkiin.yframe * slImg.height / 6, slImg.width / 2, slImg.height / 6, dovahkiin.x, dovahkiin.y, slImg.width / 2, slImg.height / 6);
    dovahkiin.yframe = frameCurr;

    //Torso
    if (dovahkiin.weapon == 1 && dovahkiin.xframe <= 1) {
        dovahkiin.xframe += 2;
    } else if (dovahkiin.weapon === 0 && dovahkiin.xframe >= 2) {
        dovahkiin.xframe -= 2;
    }
    if (dovahkiin.striking == 1) {
        if (dovahkiin.xframe <= 3) {
            dovahkiin.xframe += 2;
            if (dovahkiin.xframe <= 3) {
                dovahkiin.xframe += 2;
            }
        }
        if (dovahkiin.crouch === 0) {
            dovahkiin.yframe = 0;
        } else {
            dovahkiin.yframe = 3;
        }
        frameStrike += 1;
        if (frameStrike >= frameInt) {
            dovahkiin.yframe += 1;
        }
        if (frameStrike >= 2 * frameInt) {
            dovahkiin.yframe += 1;
        }
        if (frameStrike >= 3 * frameInt) {
            dovahkiin.striking = 0;
            frameStrike = 0;
        }
    } else {
        frameStrike = 0;
    }
    ctx.drawImage(stImg, dovahkiin.xframe * stImg.width / 6, dovahkiin.yframe * stImg.height / 6, stImg.width / 6, stImg.height / 6, dovahkiin.x, dovahkiin.y, stImg.width / 6, stImg.height / 6);
    dovahkiin.yframe = frameCurr;
    //Arm
    if (dovahkiin.spell == 1 && dovahkiin.xframe <= 1) {
        dovahkiin.xframe += 2;
    }
    if (dovahkiin.casting == 1) {
        if (dovahkiin.xframe <= 3) {
            dovahkiin.xframe += 2;
            if (dovahkiin.xframe <= 3) {
                dovahkiin.xframe += 2;
            }
        }
        if (dovahkiin.crouch === 0) {
            dovahkiin.yframe = 0;
        } else {
            dovahkiin.yframe = 3;
        }
        frameCast += 1;
        if (frameCast >= frameInt) {
            dovahkiin.yframe += 1;
            dovahkiin.mana -= 1.5;
        }
        if (frameCast >= 2 * frameInt) {
            dovahkiin.yframe += 1;
        }
        if (frameCast >= 3 * frameInt) {
            dovahkiin.casting = 0;
            frameCast = 0;

        }
    } else {
        if (dovahkiin.xframe >= 4) {
            if (dovahkiin.spell == 1) {
                dovahkiin.xframe -= 2;
            } else if (dovahkiin.spell === 0) {
                dovahkiin.xframe -= 4;
            }
        }
        if (dovahkiin.xframe >= 2 && dovahkiin.spell === 0) {
            dovahkiin.xframe -= 2;
        }
        frameCast = 0;
    }
    //console.log(dovahkiin.xframe + ' ' + dovahkiin.yframe);
    ctx.drawImage(saImg, dovahkiin.xframe * saImg.width / 6, dovahkiin.yframe * saImg.height / 6, saImg.width / 6, saImg.height / 6, dovahkiin.x, dovahkiin.y, stImg.width / 6, stImg.height / 6);
    dovahkiin.yframe = frameCurr;
    //Update Animation
    //Walking speed
    gameFrame += 1;
    if (gameFrame > dovahkiin.crouch * 5 + 10) {
        if (dovahkiin.dirx !== 0 || dovahkiin.striking === 1) {
            dovahkiin.yframe += 1;
            if (dovahkiin.yframe > 2 && dovahkiin.crouch === 0) {
                dovahkiin.yframe = 0;
            } else if (dovahkiin.yframe > 5) {
                dovahkiin.yframe = 3;
            }
            gameFrame = 0;
        } else if (dovahkiin.crouch === 0) {
            dovahkiin.yframe = 0;
        } else {
            dovahkiin.yframe = 3;
        }
        //console.log(dovahkiin.yframe + ' ' + frameCurr);
        frameCurr = dovahkiin.yframe;
    }
}


function drawEnemies() {
    //Draw the Practice Dummy  
    ctx.drawImage(pdImg, enemies.x, enemies.y, pdImg.width, pdImg.height);
}

function drawHUD() {
    var enemyMarkerxloc = (44 + w / 2 - nImg.width / 2) + 70 + (w / 100 * enemies.x / 100 + pdImg.width/200);
    var navxloc = w / 2 - nImg.width / 2;
    //The Nav
    ctx.drawImage(nImg, navxloc, 10, nImg.width, nImg.height);
    //Markers
    //console.log((navxloc + 44) + ' ' + enemyMarkerxloc + ' ' + (navxloc + nImg.width - 44))
    if(enemyMarkerxloc <= navxloc + nImg.width - 64 && enemyMarkerxloc >= navxloc + 44) {
    ctx.drawImage(emImg, enemyMarkerxloc, 14, emImg.width, emImg.height);
    }
    //Mana and Health Bars
    ctx.drawImage(eImg, w / 4 - eImg.width / 2, h - 10 - eImg.height, eImg.width, eImg.height);
    ctx.drawImage(eImg, w * 3 / 4 - eImg.width / 2, h - 10 - eImg.height, eImg.width, eImg.height);
    //Filling the Bars
    ctx.fillStyle = '#2946C5';
    ctx.fillRect(w / 4 - (eImg.width / 2 - 32) * dovahkiin.mana / 100, h - 6 - eImg.height, (eImg.width - 64) * dovahkiin.mana / 100, eImg.height - 8);
    ctx.fillStyle = '#C2373A';
    ctx.fillRect(w * 3 / 4 - (eImg.width / 2 - 32) * dovahkiin.health / 100, h - 6 - eImg.height, (eImg.width - 64) * dovahkiin.health / 100, eImg.height - 8);
}

//The Gameloop
setInterval(gameLoop, gameSpeed);

function gameLoop(evt) {
    //Draw things
    ctx.clearRect(0, 0, w, h);
    ctx.fillStyle = "#bddae6";
	ctx.fillRect(0, 0, w, h);
    drawBackground();
    drawHUD();
    drawEnemies();
    drawDovahkiin();
    //Update Location   
    if (dovahkiin.dirx !== 0) {
        //dovahkiin.x += dovahkiin.dirx;
        mImgx -= dovahkiin.dirx / 3 - dovahkiin.crouch / 3;
        gImgx -= dovahkiin.dirx - dovahkiin.crouch / 3;
        enemies.x -= dovahkiin.dirx;
    }
    //Regen and Restore Mana
    if (dovahkiin.mana < 100) {
        dovahkiin.mana += 0.1;
    }
    if (dovahkiin.health < 100) {
        dovahkiin.health += 0.1;
        if(dovahkiin.health <= 0) {
            console.log("You dead")
        }
    }
    //Attacking
    if (dovahkiin.casting || dovahkiin.striking) {
        if (frameStrike >= 10 || frameCast >= 10) {
            if (enemies.x <= dovahkiin.x + stImg.width / 6 && enemies.x >= dovahkiin.x) {
                enemies.x += 5;
                enemies.health -= dovahkiin.attack/10;
            } else if (enemies.x >= dovahkiin.x - stImg.width / 6 && enemies.x <= dovahkiin.x) {
                enemies.x -= 5;
                enemies.health -= dovahkiin.attack/10;
            }
        }
    }
    //Show Controls?
    /*if (showControls === 0) {
        document.getElementById('controls').style.visibility = 'hidden';
    } else if (showControls == 1) {
        document.getElementById('controls').style.visibility = 'visible';
    }*/
}