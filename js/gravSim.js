var canvas = document.getElementById("gravity Scroller");
var ctx = canvas.getContext("2d");

console.clear();

w = 2400;

//Player
function player(x, y) {
    this.x = x;
    this.y = y;
    this.r = 7;
    this.ax = 0;
    this.ay = 0;
    this.vx = 0;
    this.vy = 0;
    this.mx = 0;
    this.my = 0;
    this.color = "orange";
    this.planet = -1;
    this.jump = 2;
    this.angle = 0;
    this.testing = false;
}

player.prototype.draw = function() {
    ctx.translate(400, 400);
    ctx.rotate(this.angle);
    ctx.beginPath();
    ctx.moveTo(-this.r * 4 / 3, -this.r * 2);
    ctx.lineTo(0, this.r * 2);
    ctx.lineTo(this.r * 4 / 3, -this.r * 2)
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.rotate(-this.angle);
    ctx.translate(-400, -400);

    if (this.testing) {
        ctx.beginPath();
        ctx.moveTo(400, 400);
        ctx.lineTo(400 + 20 * this.ax, 400 + 20 * this.ay);
        ctx.strokeStyle = "black";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(400, 400);
        ctx.lineTo(400 + 12 * this.vx, 400 + 12 * this.vy);
        ctx.strokeStyle = "cyan";
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(400, 400);
        ctx.lineTo(400 + 40 * Math.sin(this.angle), 400 - 40 * Math.cos(this.angle));
        ctx.strokeStyle = "purple";
        ctx.stroke();
    }
}

var player = new player(w / 2, w / 2);

//Planets
function planet(d, angle, r, color, speed) {
    this.x;
    this.y;
    this.r = r;
    this.color = color;
	this.air = [8, 16, 24, 32, 40];
	this.speed = speed;
	this.angle = angle;
	this.d = d;
}

planet.prototype.draw = function() {
    ctx.fillStyle = "rgba(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + ", 0.0625)";
   	ctx.beginPath();
    ctx.arc(400 - player.x * 2 + this.x * 2, 400 - player.y * 2 + this.y * 2, this.r * 6, 0, 2 * Math.PI, false);
    ctx.fill();
	for (j = 0; j < this.air.length; j++) {
		this.air[j]--;
   		ctx.beginPath();
    	ctx.arc(400 - player.x * 2 + this.x * 2, 400 - player.y * 2 + this.y * 2, (this.r + this.r * this.air[j] / (this.air.length * 4)) * 2, 0, 2 * Math.PI, false);
    	ctx.fill();
	}
	if (this.air[0] == 0) {
		for (j = 0; j < this.air.length; j++) {
			if (j < this.air.length - 1) this.air[j] = this.air[j+1];
			else this.air[j] = this.air.length * 8;
		}
	}
    ctx.beginPath();
    ctx.arc(400 - player.x * 2 + this.x * 2, 400 - player.y * 2 + this.y * 2, this.r * 2, 0, 2 * Math.PI, false);
    ctx.fillStyle = "rgb(" + this.color[0] + "," + this.color[1] + "," + this.color[2] + ")";
    ctx.fill();
}

planets = [];
planets[planets.length] = new planet(w / 14 + Math.random() * 15, Math.PI * Math.random() * 2, 15 + Math.random() * 25, [200, 0, 0], 5 + Math.random() * 10);
planets[planets.length] = new planet(w / 7 + Math.random() * 15, Math.PI * Math.random() * 2, 15 + Math.random() * 25, [0, 200, 0], 5 + Math.random() * 10);
planets[planets.length] = new planet(3 * w / 14 + Math.random() * 15, Math.PI * Math.random() * 2, 15 + Math.random() * 25, [0, 0, 200], 5 + Math.random() * 10);
planets[planets.length] = new planet(2 * w / 7 + Math.random() * 15, Math.PI * Math.random() * 2, 15 + Math.random() * 25, [200, 200, 0], 5 + Math.random() * 10);
planets[planets.length] = new planet(5 * w / 14 + Math.random() * 15, Math.PI * Math.random() * 2, 15 + Math.random() * 25, [200, 0, 200], 5 + Math.random() * 10);
planets[planets.length] = new planet(3 * w / 7 + Math.random() * 15, Math.PI * Math.random() * 2, 15 + Math.random() * 25, [0, 200, 200], 5 + Math.random() * 10);

//Gravity and player movement
function playerUpdate() {
    player.ax = 0;
    player.ay = 0;

    player.planet = -1;
    for (i = 0; i < planets.length; i++) {
        if (Math.pow(Math.pow(player.x + player.vx - planets[i].x, 2) + Math.pow(player.y + player.vy - planets[i].y, 2), 0.5) <= 3 * planets[i].r) {
			if (player.planet != -1) {
				if (Math.pow(Math.pow(planets[i].x - player.x, 2) + Math.pow(planets[i].y - player.y, 2), 0.5) < Math.pow(Math.pow(planets[player.planet].x - player.x, 2) + Math.pow(planets[player.planet].y - player.y, 2), 0.5)) {
            		player.planet = i;
				}
			} else player.planet = i;
        }
    }

    for (i = 0; i < planets.length; i++) {
        if (player.planet == -1 || player.planet == i) {
            if (planets[i].x != player.x) player.ax -= Math.pow(planets[i].r, 1.25) * 2 * Math.cos(Math.atan((player.y - planets[i].y) / (player.x - planets[i].x))) / Math.pow(Math.pow(player.y - planets[i].y, 2) + Math.pow(player.x - planets[i].x, 2), 0.5) * Math.abs(player.x - planets[i].x) / (player.x - planets[i].x);
            if (planets[i].y != player.y) player.ay -= Math.pow(planets[i].r, 1.25) * 2 * Math.cos(Math.atan((player.x - planets[i].x) / (player.y - planets[i].y))) / Math.pow(Math.pow(player.y - planets[i].y, 2) + Math.pow(player.x - planets[i].x, 2), 0.5) * Math.abs(player.y - planets[i].y) / (player.y - planets[i].y);
        }
    }

    player.angle = Math.atan2(player.ay, player.ax) - Math.PI * Math.abs(player.ay) / player.ay + Math.PI / 2;

    player.vx += player.ax - (player.vx / 50);
    player.vy += player.ay - (player.vy / 50);

    var collide = false;
    var collidePlanet;
    for (i = 0; i < planets.length; i++) {
        if (Math.pow(Math.pow(player.x + player.vx - planets[i].x, 2) + Math.pow(player.y + player.vy - planets[i].y, 2), 0.5) <= player.r + planets[i].r) {
            collide = true;
            collidePlanet = planets[i]
            break;
        }
    }
    if (collide) {
        player.vx = 0;
        player.vy = 0;
        //if (player.x != player.planet.x) player.x = (player.r + player.planet.r) * Math.cos(Math.atan((planets[player.planet].x - player.x)/(planets[player.planet].y - player.y)));
        //if (player.y != player.planet.y) player.y = (player.r + player.planet.r) * Math.sin(Math.atan((planets[player.planet].x - player.x)/(planets[player.planet].y - player.y)));
        player.jump = 2;
    }
	
    player.x += player.vx;
    player.y += player.vy;
}

//Orbits
function planetUpdate() {
	for (i = 0; i < planets.length; i++) {
		planets[i].angle += planets[i].speed / 1440;
		if (i == player.planet) {
			player.x += w / 2 + planets[i].d * Math.cos(planets[i].angle) - planets[i].x;
			player.y += w / 2 + planets[i].d * Math.sin(planets[i].angle) - planets[i].y;
		}
		planets[i].x = w / 2 + planets[i].d * Math.cos(planets[i].angle);
		planets[i].y = w / 2 + planets[i].d * Math.sin(planets[i].angle);
	}
}

//Generate space
var stars = [];

for (i = 0; i < 500; i++) {
    stars[stars.length] = [Math.round(Math.random() * 800), Math.round(Math.random() * 800), Math.round(Math.random() * 2), "#fff8e7"]
}

for (i = 0; i < 56; i++) {
    for (j = 0; j < 16 - (i / 5); j++) {
        stars[stars.length] = [400 + 10 * i * Math.cos(i * Math.PI / 16) + Math.round(Math.random() * 50) - 25, 400 + 6 * i * Math.sin(i * Math.PI / 16) + Math.round(Math.random() * 50) - 25, Math.round(Math.random() * 3), "rgba(" + (Math.round(Math.random() * 60) + 190 - 2 * i) + "," + (Math.round(Math.random() * 60) + 190 - 2 * i) + "," + (Math.round(Math.random() * 60) + 160) + "," + (0.75 + Math.round(Math.random() / 4)) + ")"];
        stars[stars.length] = [400 - 10 * i * Math.cos(i * Math.PI / 16) + Math.round(Math.random() * 50) - 25, 400 - 6 * i * Math.sin(i * Math.PI / 16) + Math.round(Math.random() * 50) - 25, Math.round(Math.random() * 3), "rgba(" + (Math.round(Math.random() * 60) + 190 - 2 * i) + "," + (Math.round(Math.random() * 60) + 190 - 2 * i) + "," + (Math.round(Math.random() * 60) + 160) + "," + (0.75 + Math.round(Math.random() / 4)) + ")"];
        stars[stars.length] = [400 + 10 * i * Math.cos(i * Math.PI / 16) + Math.round(Math.random() * 90) - 45, 400 + 6 * i * Math.sin(i * Math.PI / 16) + Math.round(Math.random() * 90) - 45, 1, "rgba(" + (Math.round(Math.random() * 60) + 190 - 2 * i) + "," + (Math.round(Math.random() * 60) + 190 - i) + "," + (Math.round(Math.random() * 60) + 160) + "," + (0.5 + Math.round(Math.random() / 4)) + ")"];
        stars[stars.length] = [400 - 10 * i * Math.cos(i * Math.PI / 16) + Math.round(Math.random() * 90) - 45, 400 - 6 * i * Math.sin(i * Math.PI / 16) + Math.round(Math.random() * 90) - 45, 1, "rgba(" + (Math.round(Math.random() * 60) + 190 - 2 * i) + "," + (Math.round(Math.random() * 60) + 190 - 2 * i) + "," + (Math.round(Math.random() * 60) + 160) + "," + (0.5 + Math.round(Math.random() / 4)) + ")"];
        stars[stars.length] = [400 + 10 * i * Math.cos(i * Math.PI / 16) + Math.round(Math.random() * 120) - 60, 400 + 6 * i * Math.sin(i * Math.PI / 16) + Math.round(Math.random() * 120) - 60, 1, "rgba(" + (Math.round(Math.random() * 60) + 190 - 2 * i) + "," + (Math.round(Math.random() * 60) + 190 - i) + "," + (Math.round(Math.random() * 60) + 160) + "," + (0.25 + Math.round(Math.random() / 4)) + ")"];
        stars[stars.length] = [400 - 10 * i * Math.cos(i * Math.PI / 16) + Math.round(Math.random() * 120) - 60, 400 - 6 * i * Math.sin(i * Math.PI / 16) + Math.round(Math.random() * 120) - 60, 1, "rgba(" + (Math.round(Math.random() * 60) + 190 - 2 * i) + "," + (Math.round(Math.random() * 60) + 190 - 2 * i) + "," + (Math.round(Math.random() * 60) + 160) + "," + (0.25 + Math.round(Math.random() / 4)) + ")"];
    }
}

//Run simulation
setInterval(draw, 40);

function draw() {
    ctx.fillStyle = "#111";
    ctx.fillRect(0, 0, 800, 800);

    for (i = 0; i < stars.length; i++) {
        ctx.beginPath();
        ctx.arc(w / 32 - player.x / 16 + stars[i][0], w / 32 - player.y/ 16 + stars[i][1], stars[i][2], 0, 2 * Math.PI, false);
        ctx.fillStyle = stars[i][3];
        ctx.fill();
    }
	
	if (player.testing) {
    	ctx.fillStyle = "white";
    	ctx.fillRect(0, 0, 800, 800);
    	for (i = 0; i < planets.length; i++) {
        	ctx.beginPath();
        	ctx.arc(400 + w - player.x * 2, 400 + w - player.y * 2, planets[i].d * 2, 0, 2 * Math.PI, false);
        	ctx.strokeStyle = "rgb(" + planets[i].color[0] + "," + planets[i].color[1] + "," + planets[i].color[2] + ")";
        	ctx.stroke();
    	}
	}
	planetUpdate();
    for (i = 0; i < planets.length; i++) {
        planets[i].draw();
    }

    playerUpdate();
    player.draw();
	
	if(player.testing) {
		ctx.fillStyle = "black";
		ctx.fillRect(0, 0, 800, 20);
		ctx.fillRect(0, 780, 800, 20);
		ctx.fillRect(0, 20, 20, 760);
		ctx.fillRect(780, 20, 20, 760);
		ctx.fillStyle = "yellow";
		var x = 10;
		for (i = 0; i < 800 / (x * 2); i++) {
			ctx.beginPath();
			ctx.moveTo(i * x * 2, 0);
			ctx.lineTo(x + i * x * 2, 0);
			ctx.lineTo(20 + x + i * x * 2, 20);
			ctx.lineTo(20 + i * x * 2, 20);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(i * x * 2, 780);
			ctx.lineTo(x + i * x * 2, 780);
			ctx.lineTo(20 + x + i * x * 2, 800);
			ctx.lineTo(20 + i * x * 2, 800);
			ctx.fill();
		}
		for (i = 0; i < 800 / (x * 2); i++) {
			ctx.beginPath();
			ctx.moveTo(0, x + i * 2 * x);
			ctx.lineTo(0, 2 * x + i * 2 * x);
			ctx.lineTo(20, 20 + 2 * x + i * 2 * x);
			ctx.lineTo(20, 20 + x + i * 2 * x);
			ctx.fill();
			ctx.beginPath();
			ctx.moveTo(780, x + i * 2 * x);
			ctx.lineTo(780, 2 * x + i * 2 * x);
			ctx.lineTo(800, 20 + 2 * x + i * 2 * x);
			ctx.lineTo(800, 20 + x + i * 2 * x);
			ctx.fill();
		}
	}
	
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, 150, 150);
	
    for (i = 0; i < planets.length; i++) {
        ctx.beginPath();
        ctx.arc(75, 75, planets[i].d / w * 150, 0, 2 * Math.PI, false);
        ctx.strokeStyle = "rgb(" + planets[i].color[0] + "," + planets[i].color[1] + "," + planets[i].color[2] + ")";
        ctx.stroke();
    }
	
    for (i = 0; i < planets.length; i++) {
        ctx.beginPath();
        ctx.arc(planets[i].x / w * 150, planets[i].y / w * 150, planets[i].r / w * 300, 0, 2 * Math.PI, false);
        ctx.fillStyle = "rgb(" + planets[i].color[0] + "," + planets[i].color[1] + "," + planets[i].color[2] + ")";
        ctx.fill();
    }
	
	if (player.x < w && player.y < w) {
    	ctx.beginPath();
    	ctx.arc(player.x / w * 150, player.y / w * 150, 1.5, 0, 2 * Math.PI, false);
    	ctx.fillStyle = player.color;
    	ctx.fill();
	}
	
    ctx.fillStyle = "white";
    ctx.fillRect(150, 0, 5, 155);
    ctx.fillRect(0, 150, 155, 5);
}

document.onkeydown = function(e) {
    e = window.event || e;
    var key = e.keyCode;
    e.preventDefault();

    if (key === 68) { //d
        if (player.planet >= 0) {
            if (player.vx == 0 && player.vy == 0) {
                if (player.x < planets[player.planet].x) {
                    player.x += 5 * Math.sin(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                    player.y -= 5 * Math.cos(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                } else {
                    player.x -= 5 * Math.sin(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                    player.y += 5 * Math.cos(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                }
            } else {
                if (player.x < planets[player.planet].x) {
                    player.vx += 2 * Math.sin(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                    player.vy -= 2 * Math.cos(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                } else {
                    player.vx -= 2 * Math.sin(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                    player.vy += 2 * Math.cos(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                }
            }
        }
    } else if (key === 65) { //a
        if (player.planet >= 0) {
            if (player.vx == 0 && player.vy == 0) {
                if (player.x < planets[player.planet].x) {
                    player.x -= 5 * Math.sin(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                    player.y += 5 * Math.cos(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                } else {
                    player.x += 5 * Math.sin(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                    player.y -= 5 * Math.cos(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                }
            } else {
                if (player.x < planets[player.planet].x) {
                    player.vx -= 2 * Math.sin(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                    player.vy += 2 * Math.cos(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                } else {
                    player.vx += 2 * Math.sin(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                    player.vy -= 2 * Math.cos(Math.atan((player.y - planets[player.planet].y) / (player.x - planets[player.planet].x)));
                }
            }
        }
    }
    if (key === 87 && player.planet >= 0) { //w
        player.vx += 20 * Math.sin(player.angle);
        player.vy -= 20 * Math.cos(player.angle);
    }
    if (key === 84) { //t
        player.testing = !player.testing;
    }
}
