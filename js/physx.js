console.clear();

var canvas = document.getElementById("sandbox"),
ctx = canvas.getContext("2d"),
w = canvas.width,
h = canvas.height;

var BLOCK_SIZE = 8;
	
var gameSpeed = 10;
var frameInterval = 5;
var frameCurr = 10;
var gridSpacing = 0;
var showControls = true;

var mouseX; //X loc of the cursor
var mouseY; //Y loc of the cursor

var mouseLock = false;
var lockActivatePos = [0, 0];
var lockAxis = null;
var lockPos = 0;

var blockInspect = false;
var preInspectPen = null;

var menuOpen = 0;
var paintMode = 1;
var recolorR = "88";
var recolorG = "88";
var recolorB = "88";
var paused = 0; 		//Starts unpaused by default
var placing = 0; 		//0 is default, 1 & -1 are placing or erasing
var inspecting = 0; 	//0 id default, 1 is inspecting
var gravity = 1;		//Gravity is up (-1) or down(1)
var unlocked = 0;  
var global = 0;
  
var acidStrength = 0.025;
  
var defaultBlock = 3;
//Alpha, R, G, B, Type, Density, Viscosity, Aspect
var developmentBlockInfo = [
	[1.00, "ff", "00", "ff", 0, -5, 0.0, 0], 	 //00:Air
	[1.00, "33", "33", "33", 1, 5, 1, 0], 		 //01:Stone
	[1.00, "ee", "cc", "00", 2, 4, 0.95, 0], 	 //02:Sand
	[1.00, "00", "88", "ee", 3, 3, 0.3, 0], 	 //03:Water
	[1.00, "aa", "aa", "bb", 4, -1, 0.8, 0], 	 //04:Steam
	[1.00, "ff", "66", "33", 5, 5, 1, 0.15], 	 //05:Heat
	[1.00, "99", "99", "ff", 6, 5, 1, 0.15], 	 //06:Cool
	[1.00, "55", "ff", "55", 7, 2, 0.3, 0.035],  //07:Acid
	[1.00, "88", "ee", "88", 8, -2, 0.8, 0.025], //08:Acid Gas
	[1.00, "ff", "ff", "00", 9, 5, 1, 0], 		 //09:Bees?
	[1.00, "ee", "dd", "55", 10, 5, 1, 0], 		 //10:Hive
	[1.00, "aa", "aa", "77", 11, 4, 0.95, 0.25], //11:Seed
	[1.00, "ff", "00", "00", 12, 5, 1, 0], 		 //12:Stem
	[1.00, "00", "ff", "00", 13, 5, 1, 0], 		 //13:Saturated Stem
	[1.00, "00", "00", "ff", 14, 5, 1, 0], 		 //14:Final Stem
	[1.00, "dd", "aa", "33", 15, 5, 1, 0],		 //15:Flower
	[1.00, "ff", "55", "ff", 16, 2, 0.3, 0.035], //16:Base
	[1.00, "ee", "aa", "ee", 17, -2, 0.8, 0.025],//17:Base Gas
	[1.00, "77", "ee", "ee", 18, 5, 1, 0], 		 //18:Glass
	[1.00, "ee", "aa", "77", 19, 3.5, 0.75, 0],	 //19:Molten Glass
	[1.00, "66", "44", "11", 20, 5, 1, 0],	 	 //20:Gate
	[1.00, "ee", "ee", "ee", 21, 4, 0.95, 0],	 //21:Salt
	[1.00, "88", "22", "44", 22, 2.9, 0.3, 0],	 //22:Wine
	[1.00, "ee", "11", "44", 23, 5, 1, 0.15], 	 //23:Alchemy Gem
	[1.00, "11", "ee", "44", 24, 5, 1, 0.15], 	 //24:Duplicator
	[1.00, "00", "00", "00", 25, 5, 1, 0], 		 //25:Void
	[1.00, "11", "66", "44", 26, 5, 1, 0], 		 //26:Slider
	[1.00, "ff", "88", "00", 27, -10, 0, 0.3],   //27:Fire
	[1.00, "99", "33", "11", 28, 5, 1, 0],  	 //28:Rotate
	[1.00, "aa", "aa", "aa", 29, 5, 1, 1],  	 //29:Metal
	[1.00, "11", "11", "22", 30, 4.5, 0.95, 0]   //30:Gun Powder
];
var defaultBlockInfo = [
	[0.00, "ff", "ff", "ff", 0, -5, 0.0, 0], 	 //00:Air
	[1.00, "33", "33", "33", 1, 5, 1, 0], 		 //01:Stone
	[1.00, "ee", "cc", "00", 2, 4, 0.95, 0], 	 //02:Sand
	[1.00, "00", "88", "ee", 3, 3, 0.3, 0], 	 //03:Water
	[0.15, "aa", "aa", "bb", 4, -1, 0.8, 0], 	 //04:Steam
	[1.00, "ff", "66", "33", 5, 5, 1, 0.15], 	 //05:Heat
	[1.00, "99", "99", "ff", 6, 5, 1, 0.15], 	 //06:Cool
	[1.00, "55", "ff", "55", 7, 2, 0.3, 0.035],  //07:Acid
	[0.15, "88", "ee", "88", 8, -2, 0.8, 0.025], //08:Acid Gas
	[1.00, "ff", "ff", "00", 9, 5, 1, 0], 		 //09:Bees?
	[1.00, "ee", "dd", "55", 10, 5, 1, 0], 		 //10:Hive
	[1.00, "aa", "aa", "77", 11, 4, 0.95, 0.25], //11:Seed
	[1.00, "99", "cc", "88", 12, 5, 1, 0], 		 //12:Stem
	[1.00, "99", "cc", "88", 13, 5, 1, 0], 		 //13:Saturated Stem
	[1.00, "99", "cc", "88", 14, 5, 1, 0], 		 //14:Final Stem
	[1.00, "ff", "bb", "33", 15, 5, 1, 0],		 //15:Flower
	[1.00, "ff", "55", "ff", 16, 2, 0.3, 0.035], //16:Base
	[0.15, "ee", "aa", "ee", 17, -2, 0.8, 0.025],//17:Base Gas
	[0.75, "77", "ee", "ee", 18, 5, 1, 0], 		 //18:Glass
	[1.00, "ee", "aa", "77", 19, 3.5, 0.75, 0],	 //19:Molten Glass
	[1.00, "66", "44", "11", 20, 5, 1, 0],	 	 //20:Gate
	[1.00, "ee", "ee", "ee", 21, 4, 0.95, 0],	 //21:Salt
	[1.00, "88", "22", "44", 22, 2.9, 0.3, 0],	 //22:Wine
	[1.00, "ee", "11", "44", 23, 5, 1, 0.15], 	 //23:Alchemy Gem
	[1.00, "11", "ee", "44", 24, 5, 1, 0.15], 	 //24:Duplicator
	[1.00, "00", "00", "00", 25, 5, 1, 0], 		 //25:Void
	[1.00, "11", "66", "44", 26, 5, 1, 0], 		 //26:Slider
	[1.00, "ff", "88", "00", 27, -10, 0, 0.3],   //27:Fire
	[1.00, "99", "33", "11", 28, 5, 1, 0],  	 //28:Rotate
	[1.00, "aa", "aa", "aa", 29, 5, 1, 1],  	 //29:Metal
	[1.00, "11", "11", "22", 30, 4.5, 0.95, 0]   //30:Gun Powder
];
var blockInfo = [
	[0.00, "ff", "ff", "ff", 0, -5, 0.0, 0], 	 //00:Air
	[1.00, "33", "33", "33", 1, 5, 1, 0], 		 //01:Stone
	[1.00, "ee", "cc", "00", 2, 4, 0.95, 0], 	 //02:Sand
	[1.00, "00", "88", "ee", 3, 3, 0.3, 0], 	 //03:Water
	[0.15, "aa", "aa", "bb", 4, -1, 0.8, 0], 	 //04:Steam
	[1.00, "ff", "66", "33", 5, 5, 1, 0.15], 	 //05:Heat
	[1.00, "99", "99", "ff", 6, 5, 1, 0.15], 	 //06:Cool
	[1.00, "55", "ff", "55", 7, 2, 0.3, 0.035],  //07:Acid
	[0.15, "88", "ee", "88", 8, -2, 0.8, 0.025], //08:Acid Gas
	[1.00, "ff", "ff", "00", 9, 5, 1, 0], 		 //09:Bees?
	[1.00, "ee", "dd", "55", 10, 5, 1, 0], 		 //10:Hive
	[1.00, "aa", "aa", "77", 11, 4, 0.95, 0.25], //11:Seed
	[1.00, "99", "cc", "88", 12, 5, 1, 0], 		 //12:Stem
	[1.00, "99", "cc", "88", 13, 5, 1, 0], 		 //13:Saturated Stem
	[1.00, "99", "cc", "88", 14, 5, 1, 0], 		 //14:Final Stem
	[1.00, "ff", "bb", "33", 15, 5, 1, 0],		 //15:Flower
	[1.00, "ff", "55", "ff", 16, 2, 0.3, 0.035], //16:Base
	[0.15, "ee", "aa", "ee", 17, -2, 0.8, 0.025],//17:Base Gas
	[0.75, "77", "ee", "ee", 18, 5, 1, 0], 		 //18:Glass
	[1.00, "ee", "aa", "77", 19, 3.5, 0.75, 0],	 //19:Molten Glass
	[1.00, "66", "44", "11", 20, 5, 1, 0],	 	 //20:Gate
	[1.00, "ff", "ff", "ff", 21, 4, 0.95, 0],	 //21:Salt
	[1.00, "88", "22", "44", 22, 2.9, 0.3, 0],	 //22:Wine
	[1.00, "ee", "11", "44", 23, 5, 1, 0.15], 	 //23:Alchemy Gem
	[1.00, "11", "ee", "44", 24, 5, 1, 0.15], 	 //24:Duplicator
	[1.00, "00", "00", "00", 25, 5, 1, 0], 		 //25:Void
	[1.00, "11", "66", "44", 26, 5, 1, 0], 		 //26:Slider
	[1.00, "ff", "88", "00", 27, -10, 0, 0.3],   //27:Fire
	[1.00, "99", "33", "11", 28, 5, 1, 0],  	 //28:Rotate
	[1.00, "aa", "aa", "aa", 29, 5, 1, 1],  	 //29:Metal
	[1.00, "11", "11", "22", 30, 4.5, 0.95, 0]   //30:Gun Powder
];

var blockNames = [
	"Air",
	"Stone",
	"Sand",
	"Water",
	"Steam",
	"Heating",
	"Cooling",
	"Acid",
	"Acidic Gas",
	"Bee",
	"Hive",
	"Seed",
	"Stem",
	"Saturated Stem",
	"Final Stem",
	"Flower",
	"Base",
	"Basic Gas",
	"Glass",
	"Molten Glass",
	"Gate",
	"Salt",
	"Wine",
	"Alchemy Gem",
	"Duplicator",
	"Void", 
	"Slider",
	"Fire",
	"Rotate",
	"Metal",
	"Gun Powder"
]
		
var defaultAlpha = 1.0;
var penSize = 2; //Starting pen size is 2px
var currBlock = [defaultAlpha, "33", "33", "33", 1];
var updated = []; //Array tracking updated blocks
var saltUpdated = []; //Array tracking salt updated blocks
var goldUpdated = []; //Array tracking gold updated blocks

var iMax = Math.round(h / BLOCK_SIZE);
var jMax = Math.round(w / BLOCK_SIZE);
var kMax = 8;
var blockArr = new Array();

var mechArr = new Array();
var alchArr = new Array();

var slideArr = new Array();

var spinArr = new Array();
var spinTrack = new Array();

for (i = 0; i < iMax; i++) {
	blockArr[i] = new Array();
	mechArr[i] = new Array();
	alchArr[i] = new Array();
	slideArr[i] = new Array();
	spinArr[i] = new Array();
	for (j = 0; j < jMax; j++) {
		blockArr[i][j] = new Array();
		spinArr[i][j] = new Array();
		mechArr[i][j] = 0;
		alchArr[i][j] = 0;
		slideArr[i][j] = 0;
		for (k = 0; k < kMax; k++) {	
			blockArr[i][j][k] = 0;
			blockArr[i][j][5] = -5;
		}
	}
}
		
for (i = 0; i < blockArr.length; i++) {
	updated[i] = new Array();
	saltUpdated[i] = new Array();
	goldUpdated[i] = new Array();
	for (j = 0; j < blockArr[i].length; j++) {
		updated[i][j] = 0;
		saltUpdated[i][j] = 0;
		goldUpdated[i][j] = 0;
	}
}

function copyText (text) {
  const element = document.createElement('textarea');
  element.value = text;
  document.body.appendChild(element);
  element.focus();
  element.setSelectionRange(0, element.value.length);
  document.execCommand('copy');
  document.body.removeChild(element);
}

function slideSpread(i, j, iSlide, jSlide) {
	slideArr[i][j] = 1;
	try {
		if (slideArr[i + 1][j] == 0 && (blockArr[i + 1][j][4] != 0 || mechArr[i + 1][j] == 1) && (iSlide == 1 || mechArr[i + 1][j] == 1 || (blockArr[i][j][4] == blockArr[i + 1][j][4] && blockArr[i + 1][j][6] == 1)) && (blockArr[i][j][4] != 25 || blockArr[i + 1][j][4] == 25) && (blockArr[i][j][4] == 25 || blockArr[i + 1][j][4] != 25)) {
			slideSpread(i + 1, j, iSlide, jSlide);
		}
	} catch (exc) {}
	try {
		if (slideArr[i - 1][j] == 0 && (blockArr[i - 1][j][4] != 0 || mechArr[i - 1][j] == 1) && (iSlide == -1 || mechArr[i - 1][j] == 1 || (blockArr[i][j][4] == blockArr[i - 1][j][4] && blockArr[i - 1][j][6] == 1)) && (blockArr[i][j][4] != 25 || blockArr[i - 1][j][4] == 25) && (blockArr[i][j][4] == 25 || blockArr[i - 1][j][4] != 25)) {
			slideSpread(i - 1, j, iSlide, jSlide);
		}
	} catch (exc) {}
	try {
		if (slideArr[i][j + 1] == 0 && (blockArr[i][j + 1][4] != 0 || mechArr[i][j + 1] == 1) && (jSlide == 1 || mechArr[i][j + 1] == 1 || (blockArr[i][j][4] == blockArr[i][j + 1][4] && blockArr[i][j + 1][6] == 1)) && (blockArr[i][j][4] != 25 || blockArr[i][j + 1][4] == 25) && (blockArr[i][j][4] == 25 || blockArr[i][j + 1][4] != 25)) {
			slideSpread(i, j + 1, iSlide, jSlide);
		}
	} catch (exc) {}
	try {
		if (slideArr[i][j - 1] == 0 && (blockArr[i][j - 1][4] != 0 || mechArr[i][j - 1] == 1) && (jSlide == -1 || mechArr[i][j - 1] == 1 || (blockArr[i][j][4] == blockArr[i][j - 1][4] && blockArr[i][j - 1][6] == 1)) && (blockArr[i][j][4] != 25 || blockArr[i][j - 1][4] == 25) && (blockArr[i][j][4] == 25 || blockArr[i][j - 1][4] != 25)) {
			slideSpread(i, j - 1, iSlide, jSlide);
		}
	} catch (exc) {}
}

function spinSpread(i, j) {
	spinArr[i][j] = 1;
	try {
		if (spinArr[i + 1][j] == 0 && blockArr[i + 1][j][4] != 0)
			spinSpread(i + 1, j);
	} catch (exc) {}
	try {
		if (spinArr[i - 1][j] == 0 && blockArr[i - 1][j][4] != 0)
			spinSpread(i - 1, j);
	} catch (exc) {}
	try {
		if (spinArr[i][j + 1] == 0 && blockArr[i][j + 1][4] != 0)
			spinSpread(i, j + 1);
	} catch (exc) {}
	try {
		if (spinArr[i][j - 1] == 0 && blockArr[i][j - 1][4] != 0)
			spinSpread(i, j - 1);
	} catch (exc) {}
}

document.onmousedown = function(e) {
	if(menuOpen != 1){
		if (e.which == 1) {
		//Left Click
		placing = 1;
		} else {
		//Right Click
		placing = -1;
		}
	}
}

document.addEventListener("contextmenu", function(e) {
	//Click Right
	e.preventDefault();
}, false);

document.onmouseup = function(e) {
	placing = 0;
}

document.onmousewheel = function(e) {
	//Mouse Wheel
};

document.onkeydown = function(e) {
	e = window.event || e;
	var key = e.keyCode;
	e.preventDefault();

	var slide = null;
	
	var spin = null;

	if (key === 27) {
	  //ESC Key
	  //Show Info
	  showControls = -1 * showControls + 1;
	  if (showControls === 0) {
		document.getElementById('info').style.visibility = 'hidden';
	  } else if (showControls == 1) {
		document.getElementById('info').style.visibility = 'visible';
	  }
	} else if (key === 32) {
		//Space Key
		setPaused();
	} else if(key === 66){
		//B
		blockSet(9);
		unlocked = 1;
	} else if(key === 70){
		//F
		setPaintMode();
	} else if(key === 67){
		//C
		paintMode = 2;
		document.getElementById("mode").innerHTML = ("RECOLOR");
		document.getElementById("mode").className = "recolor";
		document.getElementById('rSl').style.visibility = 'visible';
		document.getElementById('gSl').style.visibility = 'visible';
		document.getElementById('bSl').style.visibility = 'visible';
		document.getElementById('backB').style.visibility = 'visible';
		document.getElementById('backRB').style.visibility = 'visible';
	} else if(key === 71){
		//G
		gravity*=-1;
	} else if(key === 72){
		//H
		if(unlocked != 0){
			blockSet(10);
		}
	} else if(key === 76){
		//L
		if(gridSpacing >= 8){
			setGridSpacing(1);
		} else {
			setGridSpacing(parseInt(gridSpacing) + 1);
		}
	} else if(key === 73){
		//I
		inspecting = (inspecting-1)*-1;
	} else if(key === 88){
		//X
		clearBoard();
	} else if (key >= 48 && key <= 57){
		if(key==48){
			if (penSize < 10) {
				setPenSize((10), document.getElementById("sizeSl").max);
				document.getElementById("sizeSl").value = penSize;
			} else if (penSize < 80) {
				setPenSize((penSize + 10), document.getElementById("sizeSl").max);
				document.getElementById("sizeSl").value = penSize;
			}
		} else {
			nKey = key - 48;
			setPenSize(key-48, document.getElementById("sizeSl").max);
			document.getElementById("sizeSl").value = penSize;
		}
	} else if(key === 192){
		//`
		var input = prompt("Input command or block ID");
		if (input === "save") {
			copyText(blockArr);
			alert("Copied map to clipboard. Paste it somewhere you'll have access to later");
		}
		else if (input === "load") {
			input = prompt("Paste saved structure");
			load(input);
		}
		else blockSet(input);
	} else if(key === 77) {
		//M
		for(i = 0; i < blockArr.length; i++) {
			for(j = 0; j < blockArr[0].length; j++) {
				if (blockArr[i][j][4] == 20 && mechArr[i][j] == 0) {
					blockReplace(i, j, 0);
					mechArr[i][j] = 1;
				} else if (mechArr[i][j] == 1) {
					blockReplace(i, j, 20);
					mechArr[i][j] = 0;
				}
			}
		}
	} else if (key === 16) {
		//Shift
		mouseLock = true;
		lockActivatePos = [mouseX, mouseY];
	} else if (key === 9 && !blockInspect) {
		//Tab
		blockInspect = true;
		preInspectPen = penSize;
		penSize = 1;
	} else if (key === 37 && paused != 1) {
		//Left Arrow
		slide = "left";
	} else if (key === 38 && paused != 1) {
		//Up Arrow
		slide = "up";
	} else if (key === 39 && paused != 1) {
		//Right Arrow
		slide = "right";
	} else if (key === 40 && paused != 1) {
		//Down Arrow
		slide = "down";
	} else if (key === 188 && paused != 1) {
		//Period
		spin = "clockwise";
	} else if (key === 190 && paused != 1) {
		//Comma
		spin = "counter ";
	}
	
	if (slide != null) {
		var iSlide = 0;
		var jSlide = 0;
		if (slide == "left") jSlide = -1;
		else if (slide == "up") iSlide = -1;
		else if (slide == "right") jSlide = 1;
		else  iSlide = 1;
		
		var noSlide = true;
		
		for (i = 0; i < blockArr.length; i++) {
			for (j = 0; j < blockArr[0].length; j++) {
				if (blockArr[i][j][4] == 26) {
					noSlide = false;
					slideArr[i][j] = 1;
				}
			}
		}
		
		for (i = 0; i < blockArr.length; i++) {
			for (j = 0; j < blockArr[0].length; j++) {
				if (slideArr[i][j] == 1) {
					try {
						if ((blockArr[i + 1][j][4] != 0 || mechArr[i + 1][j] == 1) && iSlide == 1)
							slideSpread(i + 1, j, iSlide, jSlide);
					} catch (exc) {}
					try {
						if ((blockArr[i - 1][j][4] != 0 || mechArr[i - 1][j] == 1) && iSlide == -1)
							slideSpread(i - 1, j, iSlide, jSlide);
					} catch (exc) {}
					try {
						if ((blockArr[i][j + 1][4] != 0 || mechArr[i][j + 1] == 1) && jSlide == 1)
							slideSpread(i, j + 1, iSlide, jSlide);
					} catch (exc) {}
					try {
						if ((blockArr[i][j - 1][4] != 0 || mechArr[i][j - 1] == 1) && jSlide == -1)
							slideSpread(i, j - 1, iSlide, jSlide);
					} catch (exc) {}
				}
			}
		}
		
		var iStarts = [0, 0, blockArr.length - 1];
		var iEnds = [blockArr.length, blockArr.length, -1];
		var iShifts = [1, 1, -1];
		var jStarts = [0, 0, blockArr[0].length - 1];
		var jEnds = [blockArr[0].length, blockArr[0].length, -1];
		var jShifts = [1, 1, -1];
		
		if (!noSlide) {
			for (i = iStarts[iSlide + 1]; i != iEnds[iSlide + 1]; i += iShifts[iSlide + 1]) {
				for (j = jStarts[jSlide + 1]; j != jEnds[jSlide + 1]; j += jShifts[jSlide + 1]) {
					if (slideArr[i][j] == 1) {
						var voidHit = false;
						try { if (blockArr[i + 2 * iSlide][j + 2 * jSlide][4] == 25 && blockArr[i][j][4] != 25 && blockArr[i][j][4] != 26) voidHit = true; } catch (exc) {}
						try {
							if (!voidHit) {
								for (k = 0; k < kMax; k++) blockArr[i + iSlide][j + jSlide][k] = blockArr[i][j][k];
							}
						} catch (exc) {}
						blockReplace(i, j, 0);
						if (mechArr[i][j] == 1) {
							mechArr[i + iSlide][j + jSlide] = 1;
							mechArr[i][j] = 0;
						}
						if (alchArr[i][j] == 1) {
							alchArr[i + iSlide][j + jSlide] = 1;
							alchArr[i][j] = 0;
						}
						slideArr[i][j] = 0;
					}
				}
			}
		}
	}
	
	if (spin != null) {
		for (i = 0; i < blockArr.length; i++) {
			for (j = 0; j < blockArr[0].length; j++) {
				if (blockArr[i][j][4] == 28) {
					spinArr[i][j] = 1;
					try {
						if (blockArr[i + 1][j][6] == 1) {
							spinSpread(i + 1, j);
						}
					} catch (exc) {}
					try {
						if (blockArr[i - 1][j][6] == 1) {
							spinSpread(i - 1, j);
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j + 1][6] == 1) {
							spinSpread(i, j + 1);
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j - 1][6] == 1) {
							spinSpread(i, j - 1);
						}
					} catch (exc) {}
					
					var spinArea = new Array();
					for (i2 = 0; i2 < blockArr.length; i2++) {
						for (j2 = 0; j2 < blockArr[0].length; j2++) {
							if (spinArr[i2][j2] == 1) {
								var infoArr = new Array();
								for (k = 0; k < kMax; k++) infoArr[k] = blockArr[i2][j2][k];
								spinArea[spinArea.length] = [[i2, j2], infoArr];
								blockReplace(i2, j2, 0);
								spinArr[i2][j2] = 0;
							}
						}
					}
					spinTrack[spinTrack.length] = [[i,j],spinArea];
				}
			}
		}
		
		for (s = 0; s < spinTrack.length; s++) {
			var newBlocks = spinTrack[s][1];
			for (b = 0; b < newBlocks.length; b ++) {
				var ri = spinTrack[s][0][0];
				var rj = spinTrack[s][0][1];
				var si = newBlocks[b][0][0];
				var sj = newBlocks[b][0][1];
				
				for (k = 0; k < kMax; k++) {
					try {
						if (spin == "clockwise") {
							blockArr[ri - sj + rj][rj + si - ri][k] = newBlocks[b][1][k];
						} else {
							blockArr[ri + sj - rj][rj - si + ri][k] = newBlocks[b][1][k];
						}
					} catch (exc) {}
				}
			}
		}
		
		spinTrack = new Array();
	}
};

function load(input) {
	input = input.split(",");
	var testArr = new Array();
	for (i = 0; i < blockArr.length; i++) {
		testArr[i] = new Array();
		for (j = 0; j < blockArr[0].length; j++) {
			testArr[i][j] = new Array();
			for (k = 0; k < kMax; k++) {
				if (k > 0 && k < 4 && input[i * blockArr[0].length * kMax + j * kMax + k] != 0) testArr[i][j][k] = input[i * blockArr[0].length * kMax + j * kMax + k];
				else testArr[i][j][k]= parseFloat(input[i * blockArr[0].length * kMax + j * kMax + k]);
			}
		}
	}
	blockArr = testArr;
}


document.onkeyup = function(e) {
	//When key is released
	e = window.event || e;
	var key = e.keyCode;
	e.preventDefault();
	
	if (key === 16) {
		//Shift
		mouseLock = false;
		lockAxis = null;
	} else if (key === 9) {
		//Tab
		blockInspect = false;
		penSize = preInspectPen;
	}
};

window.onmousemove = function(e) {
	rect = canvas.getBoundingClientRect();
	mouseX = Math.round((e.clientX - rect.left) / BLOCK_SIZE);
	mouseY = Math.round((e.clientY - rect.top) / BLOCK_SIZE);
	
	if (mouseLock) {
		if (lockAxis == null) {
			if (Math.pow(Math.pow(mouseX - lockActivatePos[0], 2) + Math.pow(mouseY - lockActivatePos[1], 2), 0.5) > 1) {
				if (Math.abs(mouseX - lockActivatePos[0]) > Math.abs(mouseY - lockActivatePos[1])) {
					lockAxis = "Y";
					lockPos = lockActivatePos[1];
				} else {
					lockAxis = "X";
					lockPos = lockActivatePos[0];
				}
			}
		}
	}
};

function checkBorder() {
	rect = canvas.getBoundingClientRect();
	if (mouseX >= 0 && mouseY >= 0 && mouseX <= w / 8 && mouseY <= h / 8) {
	  return 1;
	} else { 
	  return 0;
	}
}
  
function showBar(id1, id2, n){
	menuOpen = n;
	newMinW = 75;
	newMaxW = 100;
	newO = 0.25;
	if(id2 == "slider") newMinW /= 3;
	if(id2 == "toolbar"){
		if(n==0){
		document.getElementById(id2).style.width = 100 + "px";
		} else {
		document.getElementById(id2).style.width = 125 + "px";
		}
	} 
	if(n==0){
		document.getElementById(id1).style.width = newMinW + "px";
		document.getElementById(id1).style.opacity = newO;
	} else {
		document.getElementById(id1).style.width = newMaxW + "px";
		document.getElementById(id1).style.opacity = newO * 3;
	}
}
  
function setPenSize(n, mx){
	if (n == -1) { //On click
		if (penSize < mx) penSize++;
		else penSize = 1;
	} else penSize = n;	//On drag
	document.getElementById("size").innerHTML = ("SIZE: " +("0" + penSize).substr(-2));
}

function setPaused() {
	paused = (paused - 1) * -1;
	if (paused == 0) {
		document.getElementById("pause").innerHTML = ("PLAYING");
		document.getElementById("pause").className = "toggled";
	} else {
		document.getElementById("pause").innerHTML = ("PAUSED");
		document.getElementById("pause").className = "";
	}
}

function setGridSpacing(n){
	gridSpacing = n;
	if(gridSpacing > 1){
		document.getElementById("grid").innerHTML = ("GRID: " + (00 + "" + gridSpacing).substr(-2));	
	} else {
		document.getElementById("grid").innerHTML = ("GRID: OFF");	
	}
	document.getElementById("grid").value = gridSpacing;
}
  
function setPaintMode() {
	paintMode--;
	if (paintMode < 0) paintMode = 3;
	if (paintMode == 0) {
		document.getElementById("mode").innerHTML = ("FORCE");
		document.getElementById("mode").className = "force";
	}  else if (paintMode == 3) {
		document.getElementById("mode").innerHTML = ("REPLACE");
		document.getElementById("mode").className = "replace";
	}  else if (paintMode == 2) {
		document.getElementById("mode").innerHTML = ("RECOLOR");
		document.getElementById("mode").className = "recolor";
		document.getElementById('rSl').style.visibility = 'visible';
		document.getElementById('gSl').style.visibility = 'visible';
		document.getElementById('bSl').style.visibility = 'visible';
		document.getElementById('backB').style.visibility = 'visible';
		document.getElementById('backRB').style.visibility = 'visible';
	} else {
		document.getElementById("mode").innerHTML = ("FILL");
		document.getElementById("mode").className = "";
		document.getElementById('rSl').style.visibility = 'hidden';
		document.getElementById('gSl').style.visibility = 'hidden';
		document.getElementById('bSl').style.visibility = 'hidden';
		document.getElementById('backB').style.visibility = 'hidden';
		document.getElementById('backRB').style.visibility = 'hidden';
	}
}

function setBackground (reset) {
	if (reset) {
		document.getElementById('sandbox').style.backgroundColor = '#ddd';
		for ( i = 0; i < blockArr.length; i++) {
			for ( j = 0; j < blockArr[0].length; j++) {
				if (blockArr[i][j][4] != 0){
					 blockArr[i][j][1] = defaultBlockInfo[blockArr[i][j][4]][1];
					 blockArr[i][j][2] = defaultBlockInfo[blockArr[i][j][4]][2];
					 blockArr[i][j][3] = defaultBlockInfo[blockArr[i][j][4]][3];
				}
			}
		}
	} else {
		document.getElementById('sandbox').style.backgroundColor = "#"+recolorR+""+recolorG+""+recolorB;
	}	
}

function setR(r) {
	recolorR = parseInt(r).toString(16).toUpperCase();
	if (recolorR.length == 1) recolorR = "0" + recolorR;
}

function setG(g) {
	recolorG = parseInt(g).toString(16).toUpperCase();
	if (recolorG.length == 1) recolorG = "0" + recolorG;
}

function setB(b) {
	recolorB = parseInt(b).toString(16).toUpperCase();
	if (recolorB.length == 1) recolorB = "0" + recolorB;
}

function setGameSpeed(n){
	frameInterval = n;
	document.getElementById("speed").innerHTML="RATE: " + ("0" + n).substr(-2);
}
  
function drawGrid() {
	if(gridSpacing -1 > 0){
		for (i = 0; i < blockArr.length; i++) {
			for (j = 0; j < blockArr[i].length; j++) {
					if(i%gridSpacing==0||j%gridSpacing==0){
					ctx.globalAlpha = 0.5;
					ctx.fillStyle = "#fff";
					ctx.fillRect(j * BLOCK_SIZE, i * BLOCK_SIZE, BLOCK_SIZE, BLOCK_SIZE);
				}
			}
		}
	 }
  }
  
  /** Draws the entire blockArr
	*/
function drawBoard() {
	for (i = 0; i < blockArr.length; i++) {
		for (j = 0; j < blockArr[i].length; j++) {
			if (blockArr[i][j][0] != 0) {
				if (blockArr[i][j][4] == 25) ctx.globalAlpha = 1;
				else ctx.globalAlpha = blockArr[i][j][0];
				ctx.fillStyle = "#" + blockArr[i][j][1] + blockArr[i][j][2] + blockArr[i][j][3];
				ctx.fillRect(j*BLOCK_SIZE, i*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
				if (blockArr[i][j][4] == 1) {
					ctx.globalAlpha = blockArr[i][j][7] / 2;
					ctx.fillStyle = "#fd0";
					ctx.fillRect(j*BLOCK_SIZE, i*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
				}
				else if (blockArr[i][j][4] == 3) {
					ctx.globalAlpha = blockArr[i][j][7] / 2;
					ctx.fillStyle = "#000";
					ctx.fillRect(j*BLOCK_SIZE, i*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
				}
				else if (blockArr[i][j][4] == 25) {
					ctx.globalAlpha = Math.random() / 5;
					ctx.fillStyle = "#fff";
					ctx.fillRect(j*BLOCK_SIZE, i*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
				}
				else if (blockArr[i][j][4] == 28) {
					ctx.globalAlpha = blockArr[i][j][7];
					ctx.fillStyle = "#f00";
					ctx.fillRect(j*BLOCK_SIZE, i*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
				}
				else if (blockArr[i][j][4] == 29) {
					ctx.globalAlpha = Math.pow(1 - blockArr[i][j][6], 0.5);
					ctx.fillStyle = "#f60";
					ctx.fillRect(j*BLOCK_SIZE, i*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
				}
				else if (blockArr[i][j][4] == 30) {
					ctx.globalAlpha = blockArr[i][j][7];
					ctx.fillStyle = "#f30";
					ctx.fillRect(j*BLOCK_SIZE, i*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
				}
				else if (blockArr[i][j][4] == 23 && alchArr[i][j] == 1) {
					ctx.globalAlpha = Math.random() / 5;
					ctx.fillStyle = "#fff";
					ctx.fillRect(j*BLOCK_SIZE, i*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
				}
				else alchArr[i][j] = 0;
			}
			if (mechArr[i][j] != 0) {
				ctx.globalAlpha = 0.25;
				ctx.fillStyle = "#664411";
				ctx.fillRect(j*BLOCK_SIZE, i*BLOCK_SIZE,BLOCK_SIZE,BLOCK_SIZE);
			}
		}
	}
}

  /** Clears the entire board
	*/
function clearBoard() {
	for (i = 0; i < blockArr.length; i++) {
		for (j = 0; j < blockArr[i].length; j++) {
			for (k = 0; k < blockArr[i][j].length; k++) {
				blockArr[i][j][k] = 0;
			}
			blockArr[i][j][5] = -5;
			mechArr[i][j] = 0;
			alchArr[i][j] = 0;
		}
	}
}

  /** Given a direction, returns the starting and ending point of the brush
	* Param: int 1 or -1
	* Return: Distance to point
	*/
function penLoc(n) {
	return Math.round(n * (penSize / 2 - 0.5) + -1 * (-n - 1));
}
function blockDiffuse(i, j) {
	var block = blockArr[i][j];
	
	if (Math.random()>= block[6] && block[5] < 4) {
		var difFix = Math.round(Math.random()) * 2 - 1;
		if (j + difFix < blockArr[0].length && j + difFix > -1) {
			if (block[4] == blockArr[i][j + difFix][4]) {
				blockSwap(i, j, i, j + difFix);
				updated[i][j] = 0;
				updated[i][j + difFix] = 0;
				blockAveAlpha(i, j, i, j + difFix);
			}
		}
	}
}
  
  /** Given two blocks, diffuses the alpha between the two
	* Param: i and j coordinates of two different blocks
	*/
function blockAveAlpha(i1, j1, i2, j2) {
	var block1 = blockArr[i1][j1];
	var block2 = blockArr[i2][j2];
	var blockAve = (block1[0] + block2[0])/2;  
	if (block1[4] == block2[4]
	&&!(block1[0] + 0.0625 >= blockAve && block1[0] - 0.0625 <= blockAve)
	&&!(block2[0] + 0.0625 >= blockAve && block2[0] - 0.0625 <= blockAve)){
		block1[0]+=(blockAve - block1[0])/1000;
		block2[0]+=(blockAve - block2[0])/1000;
	}
}  
  
function blockSet(n) {
	for (i = 0; i < blockInfo[n].length; i++) {
	  currBlock[i] = blockInfo[n][i];
	}
	document.getElementById("densitySl").value = parseFloat(blockInfo[n][5]);
	document.getElementById("viscositySl").value = parseFloat(blockInfo[n][6]);
	document.getElementById("aspectSl").value = parseFloat(blockInfo[n][7]);
}

function blockInfoDefault(n){
	blockInfo[currBlock[4]][n] = defaultBlockInfo[currBlock[4]][n];
	blockSet(currBlock[4]);
}
  
  /**
	* Updates a blocks information based on slider positions
	* Param: new value, attribute, id
	*/
function blockInfoSet(n, i, id) {
	blockInfo[currBlock[4]][i] = n;
	if (id == "densitySl" || id == "viscositySl") {
		blockInfo[currBlock[4]][0] = 0.1+0.9*(parseFloat(blockInfo[currBlock[4]][5])+5)*(blockInfo[currBlock[4]][6])/10;
	}
	blockSet(currBlock[4]);
}
  
function blockUpdateType(){
	for (i = 0; i < blockArr.length; i++) {
		for (j = 0; j< blockArr[i].length; j++) {
			if (blockArr[i][j][4] == currBlock[4]) {
				blockReplace(i, j, currBlock[4]);
				if (paintMode == 2) {
					blockArr[i][j][1] = recolorR;
					blockArr[i][j][2] = recolorG;
					blockArr[i][j][3] = recolorB;
				}
			}
		}
	}
}	
  
  /**
	* Updates the type of block at a specific location
	* Param: i coordinate, j coordinate, new block id
	*/
function blockReplace(i, j, n){
	if (blockInfo[n][0] == 0) blockArr[i][j][0] = 0;
	else {
		blockArr[i][j][0] = (blockInfo[n][0] * Math.round(Math.random() * 50 + 50) / 100);
		if (blockArr[i][j][0]<= (1-blockInfo[n][0])) {
			blockArr[i][j][0] += (blockInfo[n][0] * Math.round(Math.random() * 50 + 50) / 100);
		}
	}
	for(k = 1; k < blockArr[i][j].length; k++){	
		blockArr[i][j][k] = blockInfo[n][k];
	}
	if (alchArr[i][j] == 1) alchArr[i][j] = 0; 
}
  
  /** Given two blocks, swap them. Update their positions
	* Param: i coordinate of block 1, j coordiate of block 1, i coordinate of block 2, j coordinate of block 2
	*/
function blockSwap(i1, j1, i2, j2) {
	if(i >= 0 && i <= blockArr.length && j >= 0 && j <= blockArr[0].length){
		temp = blockArr[i1][j1].slice(0, blockArr[i1][j1].length);
		blockArr[i1][j1] = blockArr[i2][j2].slice(0, blockArr[i2][j2].length);
		blockArr[i2][j2] = temp.slice(0, temp.length);
		updated[i1][j1] = 1;
		updated[i2][j2] = 1;
		var tempAlch = alchArr[i1][j1];
		alchArr[i1][j1] = alchArr[i2][j2];
		alchArr[i2][j2] = tempAlch;
		
	}
}

function blockFall(i, j) {
	var block = blockArr[i][j];
	if (block[5] > 0 || Math.random() > 0.95 && i < blockArr.length - 1) {
		try {
			if (block[6] != 1 && ((gravity == 1 && i != blockArr.length - 1) || (gravity == -1 && i != 0))) {
				if (blockArr[i + gravity][j][5] < block[5]) {
					blockSwap(i, j, i + gravity, j);
					return true;
				}
			}
		} catch (exc) {
			console.log(exc);
			return false;
		}
	} else if (block[5] < 0 && block[4] != 0) {
		try {
			if (block[6] != 1 && ((gravity == 1 && i != 0) || (gravity == -1 && i != blockArr.length - 1)) && Math.random() > block[6] / 2) {
				if ((blockArr[i - gravity][j][5] > block[5] || blockArr[i - gravity][j][4] == 0) && blockArr[i - gravity][j][5] < 5) {
					blockSwap(i - gravity, j, i, j);
					return true;
				}
			}
		} catch (exc) {
			console.log(exc);
			return false;
		}
	}
	return false;
}

  /** Given a block, move it left or right
	* Param: i coordinate, j coordinate
	*/
function blockSlide(i, j) {
	var block = blockArr[i][j];
	var slideFix = Math.round(Math.random()) * 2 - 1;
	//Alpha, R, G, B, Type, Density, Viscosity, Aspect
	if (Math.random() > block[6] && j + slideFix < blockArr[0].length && j + slideFix >= 0 && blockArr[i][j + slideFix][5] < block[5] && ((((( gravity > 0 && i < blockArr.length - 1) || (gravity < 0 && i > 0)) && blockArr[i][j + slideFix][5] < block[5] && blockArr[i + gravity][j + slideFix][5] < block[5]) || block[5] < 4) || (block[5] == 4 && blockArr[i][j + slideFix][5] < 4 && blockArr[i][j + slideFix][5] > 0 && blockArr[i][j + slideFix][6] < block[6]))) blockSwap(i, j, i, j + slideFix);
}

/** Updates the location of all blocks in the blockArr array	
*/
function update() {
	for (i = 0; i < updated.length; i++) {
		for (j = 0; j < updated[0].length; j++) {
			updated[i][j] = 0;
			saltUpdated[i][j] = 0;
			goldUpdated[i][j] = 0;
		}
	}
	
	var iShift = gravity;//Math.round(Math.random()) * 2 - 1;
	var iStarts = [blockArr.length - 1, null, 0];
	
	var jShift;// = Math.round(Math.random()) * 2 - 1;
	var jStarts = [blockArr[0].length - 1, null, 0];
	
	for (i = iStarts[iShift + 1]; i < blockArr.length && i > -1; i += iShift) {
		jShift = Math.round(Math.random()) * 2 - 1;
		for (j = jStarts[jShift + 1]; j < blockArr[0].length && j > -1; j += jShift) {
			if (updated[i][j] == 0) {
				var n = 0;
/*Stone*/		if (blockArr[i][j][4] == 1 && goldUpdated[i][j] == 0 && parseFloat(blockArr[i][j][7]) >= 0.25) {
					var gold = 0;
					try {
						if (blockArr[i + 1][j][4] == 1 && goldUpdated[i + 1][j] == 0) {
							gold = (parseFloat(blockArr[i][j][7]) + parseFloat(blockArr[i + 1][j][7])) / 2;
							blockArr[i][j][7] = gold;
							blockArr[i + 1][j][7] = gold;
						}
					} catch (exc) {}
					try {
						if (blockArr[i - 1][j][4] == 1 && goldUpdated[i - 1][j] == 0) {
							gold = (parseFloat(blockArr[i][j][7]) + parseFloat(blockArr[i - 1][j][7])) / 2;
							blockArr[i][j][7] = gold;
							blockArr[i - 1][j][7] = gold;
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j + 1][4] == 1 && goldUpdated[i][j + 1] == 0) {
							gold = (parseFloat(blockArr[i][j][7]) + parseFloat(blockArr[i][j + 1][7])) / 2;
							blockArr[i][j][7] = gold;
							blockArr[i][j + 1][7] = gold;
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j - 1][4] == 1 && goldUpdated[i][j - 1] == 0) {
							gold = (parseFloat(blockArr[i][j][7]) + parseFloat(blockArr[i][j - 1][7])) / 2;
							blockArr[i][j][7] = gold;
							blockArr[i][j - 1][7] = gold;	
						}
					} catch (exc) {}
				}
/*Water*/		if (blockArr[i][j][4] == 3 && saltUpdated[i][j] == 0) {
					saltUpdated[i][j] = 1;
					var salt = 0;
					try {
						if (blockArr[i + 1][j][4] == 3 && saltUpdated[i + 1][j] == 0) {
							salt = (parseFloat(blockArr[i][j][7]) + parseFloat(blockArr[i + 1][j][7])) / 2;
							blockArr[i][j][7] = salt;
							blockArr[i + 1][j][7] = salt;
							saltUpdated[i + 1][j] = 1;
						} else if (blockArr[i + 1][j][4] == 1 && Math.random() < 0.00001) {
							blockReplace(i + 1, j, 2);
						}
					} catch (exc) {}
					try {
						if (blockArr[i - 1][j][4] == 3 && saltUpdated[i - 1][j] == 0) {
							salt = (parseFloat(blockArr[i][j][7]) + parseFloat(blockArr[i - 1][j][7])) / 2;
							blockArr[i][j][7] = salt;
							blockArr[i - 1][j][7] = salt;
							saltUpdated[i - 1][j] = 1;
						} else if (blockArr[i - 1][j][4] == 1 && Math.random() < 0.00001) {
							blockReplace(i - 1, j, 2);
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j + 1][4] == 3 && saltUpdated[i][j + 1] == 0) {
							salt = (parseFloat(blockArr[i][j][7]) + parseFloat(blockArr[i][j + 1][7])) / 2;
							blockArr[i][j][7] = salt;
							blockArr[i][j + 1][7] = salt;
							saltUpdated[i][j + 1] = 1;
						} else if (blockArr[i][j + 1][4] == 1 && Math.random() < 0.00001) {
							blockReplace(i, j + 1, 2);
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j - 1][4] == 3 && saltUpdated[i][j - 1] == 0) {
							salt = (parseFloat(blockArr[i][j][7]) + parseFloat(blockArr[i][j - 1][7])) / 2;
							blockArr[i][j][7] = salt;
							blockArr[i][j - 1][7] = salt;
							saltUpdated[i][j - 1] = 1;	
						} else if (blockArr[i][j - 1][4] == 1 && Math.random() < 0.00001) {
							blockReplace(i, j - 1, 2);
						}
					} catch (exc) {}
					blockArr[i][j][5] = 3 + parseFloat(blockArr[i][j][7]) / 4;
				}
/*Heating/Fire*/else if ((blockArr[i][j][4] == 5 || blockArr[i][j][4] == 27)&& Math.random() < parseFloat(blockArr[i][j][7])) {
					try {
						if (blockArr[i + 1][j][4] == 7 || blockArr[i + 1][j][4] == 16) {
							n = blockArr[i + 1][j][4]+1;
							blockReplace(i + 1, j, n);
						} else if ((blockArr[i + 1][j][4] == 2 || blockArr[i + 1][j][4] == 18) && Math.random() < 0.25 && blockArr[i][j][4] != 27) {
							blockReplace(i + 1, j, 19);
						} else if (blockArr[i + 1][j][4] == 3) {
							if (Math.random() < blockArr[i + 1][j][7]) blockReplace(i + 1, j, 21);
							else blockReplace(i + 1, j, 4);
						} else if (blockArr[i + 1][j][4] == 22) {
							blockReplace(i + 1, j, 27);
						} else if (blockArr[i + 1][j][4] == 29 && blockArr[i + 1][j][6] > 0.8 && Math.random() < 0.01 && blockArr[i][j][4] == 5) {
							blockArr[i + 1][j][6] -= .1;
						} else if (blockArr[i + 1][j][4] == 30) {
							blockArr[i + 1][j][7] = 1;
						}
					} catch (exc) {}
					try {
						if (blockArr[i - 1][j][4] == 7 || blockArr[i - 1][j][4] == 16) {
							n = blockArr[i - 1][j][4]+1;
							blockReplace(i - 1, j, n);
						} else if ((blockArr[i - 1][j][4] == 2 || blockArr[i - 1][j][4] == 18) && Math.random() < 0.25 && blockArr[i][j][4] != 27) {
							blockReplace(i - 1, j, 19);
						} else if (blockArr[i - 1][j][4] == 3) {
							if (Math.random() < blockArr[i - 1][j][7]) blockReplace(i - 1, j, 21);
							else blockReplace(i - 1, j, 4);
						} else if (blockArr[i - 1][j][4] == 22) {
							blockReplace(i - 1, j, 27);
						} else if (blockArr[i - 1][j][4] == 29 && blockArr[i - 1][j][6] > 0.8 && Math.random() < 0.01 && blockArr[i][j][4] == 5) {
							blockArr[i - 1][j][6] -= .1;
						} else if (blockArr[i - 1][j][4] == 30) {
							blockArr[i - 1][j][7] = 1;
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j + 1][4] == 7 || blockArr[i][j + 1][4] == 16) {
							n = blockArr[i][j + 1][4]+1;
							blockReplace(i, j + 1, n);
						} else if ((blockArr[i][j + 1][4] == 2 || blockArr[i][j + 1][4] == 18) && Math.random() < 0.25 && blockArr[i][j][4] != 27) {
							blockReplace(i, j + 1, 19);
						} else if (blockArr[i][j + 1][4] == 3) {
							if (Math.random() < blockArr[i][j + 1][7]) blockReplace(i, j + 1, 21);
							else blockReplace(i, j + 1, 4);
						} else if (blockArr[i][j + 1][4] == 22) {
							blockReplace(i, j + 1, 27);
						} else if (blockArr[i][j + 1][4] == 29 && blockArr[i][j + 1][6] > 0.8 && Math.random() < 0.01 && blockArr[i][j][4] == 5) {
							blockArr[i][j + 1][6] -= .1;
						} else if (blockArr[i][j + 1][4] == 30) {
							blockArr[i][j + 1][7] = 1;
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j - 1][4] == 7 || blockArr[i][j + 1][4] == 16) {
							n = blockArr[i][j - 1][4]+1;
							blockReplace(i, j - 1, n);
						} else if ((blockArr[i][j - 1][4] == 2 || blockArr[i][j - 1][4] == 18) && Math.random() < 0.25 && blockArr[i][j][4] != 27) {
							blockReplace(i, j - 1, 19);
						} else if (blockArr[i][j - 1][4] == 3) {
							if (Math.random() < blockArr[i][j - 1][7]) blockReplace(i, j - 1, 21);
							else blockReplace(i, j - 1, 4);
						} else if (blockArr[i][j - 1][4] == 22) {
							blockReplace(i, j - 1, 27);
						} else if (blockArr[i][j - 1][4] == 29 && blockArr[i][j -1][6] > 0.8 && Math.random() < 0.01 && blockArr[i][j][4] == 5) {
							blockArr[i][j - 1][6] -= .1;
						} else if (blockArr[i][j - 1][4] == 30) {
							blockArr[i][j - 1][7] = 1;
						}
					} catch (exc) {}
				} 
/*Cooling*/		else if (blockArr[i][j][4] == 6 && Math.random() < parseFloat(blockArr[i][j][7])) {
					try {
						if (blockArr[i + 1][j][4] == 4 || blockArr[i + 1][j][4] == 8 || blockArr[i + 1][j][4] == 17) {
							n=blockArr[i + 1][j][4]-1
							blockReplace(i + 1, j, n);
						}
					} catch (exc) {}
					try {
						if (blockArr[i - 1][j][4] == 4 || blockArr[i - 1][j][4] == 8 || blockArr[i - 1][j][4] == 17) {
							n=blockArr[i - 1][j][4]-1
							blockReplace(i - 1, j, n);
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j + 1][4] == 4 || blockArr[i][j + 1][4] == 8 || blockArr[i][j + 1][4] == 17) {
							n=blockArr[i][j + 1][4] - 1;
							blockReplace(i, j + 1, n);
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j - 1][4] == 4 || blockArr[i][j - 1][4] == 8 || blockArr[i][j - 1][4] == 17) {
							n=blockArr[i][j - 1][4] - 1
							blockReplace(i, j - 1, n);
						}
					} catch (exc) {}
				} 
/*Acid/Base*/	else if (blockArr[i][j][4] == 7 || blockArr[i][j][4] == 8 || blockArr[i][j][4] == 16 || blockArr[i][j][4] == 17) {
					var solution = 7;
					if (blockArr[i][j][4] == 16 || blockArr[i][j][4] == 17) solution = 16;
					if (Math.random() > 1 - blockArr[i][j][7]) {
						try {
							if (blockArr[i + 1][j][4] == 2) {
								blockReplace(i + 1, j, solution);
							}
						} catch (exc) {}
						try {
							if (blockArr[i - 1][j][4] == 2) {
								blockReplace(i - 1, j, solution);
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j + 1][4] == 2) {
								blockReplace(i, j + 1, solution);
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j - 1][4] == 2) {
								blockReplace(i, j - 1, solution);
							}
						} catch (exc) {}
						
						try {
							if (blockArr[i + 1][j][4] >= 11 && blockArr[i + 1][j][4] <= 15) {
								blockReplace(i + 1, j, 2);
							}
						} catch (exc) {}
						try {
							if (blockArr[i - 1][j][4] >= 11 && blockArr[i - 1][j][4] <= 15) {
								blockReplace(i - 1, j, 2);
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j + 1][4] >= 11 && blockArr[i][j + 1][4] <= 15) {
								blockReplace(i, j + 1, 2);
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j - 1][4] >= 11 && blockArr[i][j - 1][4] <= 15) {
								blockReplace(i, j - 1, 2);
							}
						} catch (exc) {}
					}
					
					if (Math.random() > 1 - (blockArr[i][j][7]/100)) {
						try {
							if (blockArr[i + 1][j][4] == 1) {
								blockReplace(i + 1, j, 2);
							}
						} catch (exc) {}
						try {
							if (blockArr[i - 1][j][4] == 1) {
								blockReplace(i - 1, j, 2);
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j + 1][4] == 1) {
								blockReplace(i, j + 1, 2);
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j - 1][4] == 1) {
								blockReplace(i, j - 1, 2);
							}
						} catch (exc) {}
					}
					
					if (solution == 7) {
						try {
							if (blockArr[i + 1][j][4] == 16 || blockArr[i + 1][j][4] == 17) {
								if (Math.random() < 0.5) {
									blockReplace(i + 1, j, 21);
									blockReplace(i, j, 3);
								} else {
									blockReplace(i + 1, j, 3);
									blockReplace(i, j, 21);
								}
							} 
						} catch (exc) {}
						try {
							if (blockArr[i][j][4] != 3 && (blockArr[i - 1][j][4] == 16 || blockArr[i - 1][j][4] == 17)) {
								if (Math.random() < 0.5) {
									blockReplace(i - 1, j, 21);
									blockReplace(i, j, 3);
								} else {
									blockReplace(i - 1, j, 3);
									blockReplace(i, j, 21);
								}
							} 
						} catch (exc) {}
						try {
							if (blockArr[i][j][4] != 3 && (blockArr[i][j + 1][4] == 16 || blockArr[i][j + 1][4] == 17)) {
								if (Math.random() < 0.5) {
									blockReplace(i, j + 1, 21);
									blockReplace(i, j, 3);
								} else {
									blockReplace(i, j + 1, 3);
									blockReplace(i, j, 21);
								}
							} 
						} catch (exc) {}
						try {
							if (blockArr[i][j][4] != 3 && (blockArr[i][j - 1][4] == 16 || blockArr[i][j - 1][4] == 17)) {
								if (Math.random() < 0.5) {
									blockReplace(i, j - 1, 21);
									blockReplace(i, j, 3);
								} else {
									blockReplace(i, j - 1, 3);
									blockReplace(i, j, 21);
								}
							} 
						} catch (exc) {}
					}
				} 
/*Bees*/		else if (blockArr[i][j][4] == 9) {
					var direction = Math.round(Math.random()) * 2 - 1;
					if (Math.random() < 0.5) {
						try {
							if (blockArr[i + direction][j][6] < 1) {
								blockSwap(i, j, i + direction, j);
							}
						} catch (exc) {}
					} else {
						try {
							if (blockArr[i][j + direction][6] < 1) {
								blockSwap(i, j, i, j + direction);
							}
						} catch (exc) {}
					}
					//pollonation
					if (Math.random() < 0.25) {
						try {
							if (blockArr[i + 1][j][4] == 14) {
								blockReplace(i + 1, j, 15);
							}
						} catch (exc) {}
						try {
							if (blockArr[i - 1][j][4] == 14) {
								blockReplace(i - 1, j, 15);
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j + 1][4] == 14) {
								blockReplace(i, j + 1, 15);
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j - 1][4] == 14) {
								blockReplace(i, j - 1, 15);
							}
						} catch (exc) {}
					}
				} 
/*Hive*/		else if (blockArr[i][j][4] == 10) {
					if (Math.random() > .99) {
						var direction = Math.random();
						if (direction > 0.75 && i < blockArr.length - 1) {
							blockReplace(i + 1, j, 9);
						} else if (direction > 0.5 && i > 0) {
							blockReplace(i - 1, j, 9);
						} else if (direction > 0.25 && j < blockArr[0].length - 1) {
							blockReplace(i, j + 1, 9);
						} else if (j > 0) {
							blockReplace(i, j - 1, 9);
						}
					}
				}
/*Seed*/		else if (blockArr[i][j][4] == 11) {
					try {
						if (blockArr[i + gravity][j][4] == 2) {
							try {
								if (blockArr[i - gravity][j][4] == 3 && blockArr[i - 1][j][7] < 0.1) {
									if (Math.random() > 0.25) blockReplace(i - gravity, j, 0);
									blockReplace(i, j, 12);
								} else if (Math.random() > 0.5) {
									if (j > 0) {
										if (blockArr[i][j - gravity][4] == 3 && blockArr[i][j - 1][7] < 0.1) {
											if(Math.random() > 0.25)blockReplace(i, j - 1, 0);
											blockReplace(i, j, 12);
										}
									}
								} else {
									if (j < blockArr[0].length - 1) {
										if (blockArr[i][j + 1][4] == 3 && blockArr[i][j + 1][7] < 0.1) {
											if(Math.random() > 0.25)blockReplace(i, j + 1, 0);
											blockReplace(i, j, 12);
										}
									}
								}
							} catch (exc) {}
						}
					} catch (exc) {}
				} 
/*Stem*/		else if (blockArr[i][j][4] == 12) {
					if(Math.random()* 4 < blockInfo[11][7]){
						if (i < blockArr.length - 1) {
							if (blockArr[i + 1][j][4] == 3  && blockArr[i + 1][j][7] < 0.1) {
								if(Math.random>0.75)blockReplace(i + 1, j, 4);
								blockReplace(i, j, 13);
							} else if (i > 0) {
								if (blockArr[i - 1][j][4] == 3  && blockArr[i - 1][j][7] < 0.1) {
									if(Math.random>0.75)blockReplace(i - 1, j, 4);
									blockReplace(i, j, 13);
								} else if (Math.random() > 0.5) {
									if (j > 0) {
										if (blockArr[i][j - 1][4] == 3  && blockArr[i][j - 1][7] < 0.1) {
											if(Math.random>0.75)blockReplace(i, j - 1, 4);
											blockReplace(i, j, 13);
										}
									}
								} else if (j < blockArr[0].length - 1) {
									if (blockArr[i][j + 1][4] == 3  && blockArr[i][j + 1][7] < 0.1) {
										if(Math.random>0.75)blockReplace(i, j + 1, 4);
										blockReplace(i, j, 13);
									}
								}
							}
						}
					}if(i > 0){
						if(blockArr[i - 1][j][4] == 0 
						&& (((blockArr[i][j - 1][4] == 0 || blockArr[i][j + 1][4] == 0) && blockArr[i + 1][j][4] == 0) 
						|| (blockArr[i][j - 1][4] == 0 && blockArr[i][j + 1][4] == 0))){
							if(blockArr[i][j][7]>=1){
								blockReplace(i, j,0);
							} else blockArr[i][j][7] += 0.005;
						}
					} else blockArr[i][j][7] += 0.001;
				} 
/* - Saturated*/else if (blockArr[i][j][4] == 13) {
					if (i == 0) {
						blockArr[i][j][4] = 14;
					} else {
						if (blockArr[i - 1][j][4] == 12) {
							blockReplace(i - 1, j, 13);
							blockReplace(i, j,12);
							updated[i - 1][j] = 1;
							updated[i][j] = 1;
						} else {
							if (j > 0) {
								if (blockArr[i][j - 1][4] == 12) {
									blockReplace(i, j - 1, 13);
							blockReplace(i, j,12);
									updated[i][j - 1][4] = 1;
									updated[i][j][4] = 1;
								} else if (j < blockArr[0].length - 1) {
									if (blockArr[i][j + 1][4] == 12) {
										blockReplace(i, j + 1, 13);
										blockReplace(i, j,12);
										updated[i][j + 1] = 1;
										updated[i][j] = 1;
									}
								}
							} else if (j < blockArr[0].length - 1) {
								if (blockArr[i][j + 1][4] == 12) {
									blockReplace(i, j + 1, 13);
									blockReplace(i, j, 12);
									updated[i][j + 1] = 1;
									updated[i][j] = 1;
								}
							}
						}
						if (updated[i][j] == 0) {
							if (Math.random() > 1 - blockInfo[11][7]/5) {
								blockArr[i][j][4] = 14;
							} else if (Math.random() > 0.7) {
								if (Math.random() > 0.5) {
									if (j > 0) {
										if (blockArr[i][j - 1][5] < blockArr[i][j][5]) {
											blockReplace(i, j - 1, 12);
											blockReplace(i, j, 12);
											updated[i][j - 1] = 1;
											updated[i][j] = 1;
										}
									}
								} else {
									if (j < blockArr[0].length - 1) {
										if (blockArr[i][j + 1][5] < blockArr[i][j][5]) {
											blockReplace(i, j + 1, 12);
											blockReplace(i, j, 12);
												
											updated[i][j] = 1;
										}
									}
								}
							} else if (blockArr[i - 1][j][5] < blockArr[i][j][5]) {
								blockReplace(i - 1, j, 12);
								blockReplace(i, j, 12);
								updated[i - 1][j] = 1;
								updated[i][j] = 1;
							}
						}
					}
				} 
/* - Final*/	else if (blockArr[i][j][4] == 14) {
					if (i < blockArr.length - 1) {
						if (blockArr[i + 1][j][4] == 12 || blockArr[i + 1][j][4] == 13) {
							blockReplace(i, j, 14);
						} else if (j > 0) {
							if (blockArr[i][j - 1][4] == 12 || blockArr[i][j - 1][4] == 13) {
								blockReplace(i, j - 1, 14);
							} else if (j < blockArr[0].length - 1) {
								if (blockArr[i][j + 1][4] == 12 || blockArr[i][j + 1][4] == 13) {
								blockReplace(i, j + 1, 14);
								}
							}
						} else if (j < blockArr[0].length - 1) {
							if (blockArr[i][j + 1][4] == 12 || blockArr[i][j + 1][4] == 13) {
								blockReplace(i, j + 1, 14);
							}
						}
					} else if (j > 0) {
						if (blockArr[i][j - 1][4] == 12 || blockArr[i][j - 1][4] == 13) {
							blockReplace(i, j - 1, 14);
						} else if (j < blockArr[0].length - 1) {
							if (blockArr[i][j + 1][4] == 12 || blockArr[i][j + 1][4] == 13) {
								blockReplace(i, j + 1, 14);	
							}
						}
					} else if (j < blockArr[0].length - 1) {
						if (blockArr[i][j + 1][4] == 12 || blockArr[i][j + 1][4] == 13) {
							blockReplace(i, j + 1, 14);
						}
					}
				}
/*Molten Glass*/else if (blockArr[i][j][4] == 19) {
					var hot = false;
					try {
						if (blockArr[i + 1][j][4] == 5) {
							hot = true;
						}
					} catch (exc) {}
					try {
						if (blockArr[i - 1][j][4] == 5) {
							hot = true;
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j + 1][4] == 5) {
							hot = true;
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j - 1][4] == 5) {
							hot = true;
						}
					} catch (exc) {}
					if(!hot && (i == blockArr.length - 1 || (blockArr[i + 1][j][5] == 5 && blockArr[i+1][j][6] > 0.75)) && Math.random() < 0.5) {
						blockReplace(i, j, 18);
					}
					if (hot & Math.random() < 0.5) {
						try {
							if (blockArr[i + 1][j][4] == 3 || blockArr[i + 1][j][4] == 7 || blockArr[i + 1][j][4] == 16) {
								n=blockArr[i + 1][j][4]+1;
								blockReplace(i + 1, j, n);
							} else if ((blockArr[i + 1][j][4] == 2 || blockArr[i + 1][j][4] == 18) && Math.random() < 0.25) {
								blockReplace(i + 1, j, 19);
							} else if (blockArr[i + 1][j][4] == 30) {
								blockArr[i + 1][j][7] = 1;
							}
						} catch (exc) {}
						try {
							if (blockArr[i - 1][j][4] == 3 || blockArr[i - 1][j][4] == 7 || blockArr[i - 1][j][4] == 16) {
								n=blockArr[i - 1][j][4]+1;
								blockReplace(i - 1, j, n);
							} else if ((blockArr[i - 1][j][4] == 2 || blockArr[i - 1][j][4] == 18) && Math.random() < 0.25) {
								blockReplace(i - 1, j, 19);
							} else if (blockArr[i - 1][j][4] == 30) {
								blockArr[i - 1][j][7] = 1;
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j + 1][4] == 3 || blockArr[i][j + 1][4] == 7 || blockArr[i][j + 1][4] == 16) {
								n=blockArr[i][j + 1][4]+1;
								blockReplace(i, j + 1, n);
							} else if ((blockArr[i][j + 1][4] == 2 || blockArr[i][j + 1][4] == 18) && Math.random() < 0.25) {
								blockReplace(i, j + 1, 19);
							} else if (blockArr[i][j + 1][4] == 30) {
								blockArr[i][j + 1][7] = 1;
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j - 1][4] == 3 || blockArr[i][j - 1][4] == 7 || blockArr[i][j + 1][4] == 16) {
								n=blockArr[i][j - 1][4]+1;
								blockReplace(i, j - 1, n);
							} else if ((blockArr[i][j - 1][4] == 2 || blockArr[i][j - 1][4] == 18) && Math.random() < 0.25) {
								blockReplace(i, j - 1,19);
							} else if (blockArr[i][j - 1][4] == 30) {
								blockArr[i][j - 1][7] = 1;
							}
						} catch (exc) {}
					}
					if (!hot) {
						try {
							if ((blockArr[i + 1][j][4] == 2) && Math.random() < 0.25) {
								blockReplace(i + 1, j, 19);
							} else if ((blockArr[i + 1][j][4] == 3 || blockArr[i + 1][j][4] == 7 || blockArr[i + 1][j][4] == 16) /*&& Math.random() < 0.5*/) {
								var n = blockArr[i + 1][j][4];
								blockReplace(i + 1, j, n + 1);
								blockReplace(i, j, 18);
							} else if (blockArr[i + 1][j][4] == 30) {
								blockArr[i + 1][j][7] = 1;
							}
						} catch (exc) {}
						try {
							if ((blockArr[i - 1][j][4] == 2) && Math.random() < 0.25) {
								blockReplace(i - 1, j, 19);
							} else if ((blockArr[i - 1][j][4] == 3 || blockArr[i - 1][j][4] == 7 || blockArr[i - 1][j][4] == 16) && Math.random() < 0.5) {
								var n = blockArr[i - 1][j][4];
								blockReplace(i - 1, j, n + 1);
								blockReplace(i, j, 18);
							} else if (blockArr[i + 1][j][4] == 30) {
								blockArr[i + 1][j][7] = 1;
							}
						} catch (exc) {}
						try {
							if ((blockArr[i][j + 1][4] == 2) && Math.random() < 0.25) {
								blockReplace(i, j + 1, 19);
							} else if ((blockArr[i][j + 1][4] == 3 || blockArr[i][j + 1][4] == 7 || blockArr[i][j + 1][4] == 16) && Math.random() < 0.5) {
								var n = blockArr[i][j + 1][4];
								blockReplace(i, j + 1, n + 1);
								blockReplace(i, j, 18);
							} else if (blockArr[i][j + 1][4] == 30) {
								blockArr[i][j + 1][7] = 1;
							}
						} catch (exc) {}
						try {
							if ((blockArr[i][j - 1][4] == 2) && Math.random() < 0.25) {
								blockReplace(i, j - 1, 19);
							} else if ((blockArr[i][j - 1][4] == 3 || blockArr[i][j - 1][4] == 7 || blockArr[i][j - 1][4] == 16) && Math.random() < 0.5) {
								var n = blockArr[i][j - 1][4];
								blockReplace(i, j - 1, n + 1);
								blockReplace(i, j, 18);
							} else if (blockArr[i][j - 1][4] == 30) {
								blockArr[i][j - 1][7] = 1;
							}
						} catch (exc) {}
					}
					
				}
/*Salt*/		else if (blockArr[i][j][4] == 21) {
					saltUpdated[i][j] = 1;
					try {
						if (blockArr[i + 1][j][4] == 3 && saltUpdated[i + 1][j] == 0 && blockArr[i + 1][j][7] < Math.random() / 2) {
							blockReplace(i, j, 3);
							blockArr[i][j][7] = 0.5 + blockArr[i + 1][j][7] / 2;
							blockArr[i + 1][j][7] = 0.5 + blockArr[i + 1][j][7] / 2;
							saltUpdated[i + 1][j] = 1;
						}
					} catch (exc) {}
					try {
						if (blockArr[i - 1][j][4] == 3 && saltUpdated[i - 1][j] == 0 && blockArr[i - 1][j][7] < Math.random() / 2) {
							blockReplace(i, j, 3);
							blockArr[i][j][7] = 0.5 + blockArr[i - 1][j][7] / 2;
							blockArr[i - 1][j][7] = 0.5 + blockArr[i - 1][j][7] / 2;
							saltUpdated[i - 1][j] = 1;
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j + 1][4] == 3 && saltUpdated[i][j + 1] == 0 && blockArr[i][j + 1][7] < Math.random() / 2) {
							blockReplace(i, j, 3);
							blockArr[i][j][7] = 0.5 + blockArr[i][j + 1][7] / 2;
							blockArr[i][j + 1][7] = 0.5 + blockArr[i][j + 1][7] / 2;
							saltUpdated[i][j + 1] = 1;
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j - 1][4] == 3 && saltUpdated[i][j - 1] == 0 && blockArr[i][j - 1][7] < Math.random() / 2) {
							blockReplace(i, j, 3);
							blockArr[i][j][7] = 0.5 + blockArr[i][j - 1][7] / 2;
							blockArr[i][j - 1][7] = 0.5 + blockArr[i][j - 1][7] / 2;
							saltUpdated[i][j - 1] = 1;
							
						}
					} catch (exc) {}
					
				}
/*Alchemy*/		else if (blockArr[i][j][4] == 23 && Math.random() < parseFloat(blockArr[i][j][7])) {
					if (alchArr[i][j] == 0) {
						try {
							if (blockArr[i + 1][j][4] == 21) {
								blockReplace(i + 1, j, 0);
								alchArr[i][j] = 1;
							}
						} catch (exc) {}
						try {
							if (blockArr[i - 1][j][4] == 21) {
								blockReplace(i - 1, j, 0);
								alchArr[i][j] = 1;
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j + 1][4] == 21) {
								blockReplace(i, j + 1, 0);
								alchArr[i][j] = 1;
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j - 1][4] == 21) {
								blockReplace(i, j -1, 0);
								alchArr[i][j] = 1;
							}
						} catch (exc) {}
					} 
					else {
						try {
							if (blockArr[i + 1][j][4] == 1 && blockArr[i + 1][j][7] < 1) {
								blockArr[i + 1][j][7] = 1;
								alchArr[i][j] = 0;
							} else if (blockArr[i + 1][j][4] == 3) {
								blockReplace(i + 1, j, 22);
								alchArr[i][j] = 0;
							} else if (blockArr[i + 1][j][4] == 2) {
								blockReplace(i + 1, j, 30);
								alchArr[i][j] = 0;
							}
						} catch (exc) {}
						try {
							if (blockArr[i - 1][j][4] == 1 && blockArr[i - 1][j][7] < 1) {
								blockArr[i - 1][j][7] = 1;
								alchArr[i][j] = 0;
							} else if (blockArr[i - 1][j][4] == 3) {
								blockReplace(i - 1, j, 22);
								alchArr[i][j] = 0;
							} else if (blockArr[i - 1][j][4] == 2) {
								blockReplace(i - 1, j, 30);
								alchArr[i][j] = 0;
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j + 1][4] == 1 && blockArr[i][j + 1][7] < 1) {
								blockArr[i][j + 1][7] = 1;
								alchArr[i][j] = 0;
							} else if (blockArr[i][j + 1][4] == 3) {
								blockReplace(i, j + 1, 22);
								alchArr[i][j] = 0;
							} else if (blockArr[i][j + 1][4] == 2) {
								blockReplace(i, j + 1, 30);
								alchArr[i][j] = 0;
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j - 1][4] == 1 && blockArr[i][j - 1][7] < 1) {
								blockArr[i ][j - 1][7] = 1;
								alchArr[i][j] = 0;
							} else if (blockArr[i][j - 1][4] == 3) {
								blockReplace(i, j - 1, 22);
								alchArr[i][j] = 0;
							} else if (blockArr[i][j - 1][4] == 2) {
								blockReplace(i, j - 1, 30);
								alchArr[i][j] = 0;
							}
						} catch (exc) {}
					}
					if (alchArr[i][j] == 1 && Math.random() < 0.25) {
						var iMove = 0;    
						var jMove = 0;
						if (Math.random() < 0.5) iMove = Math.round(Math.random()) * 2 - 1;
						else jMove = Math.round(Math.random()) * 2 - 1;
						try {
							if (alchArr[i + iMove][j + jMove] == 0 && blockArr[i + iMove][j + jMove][4] == 23) {
								alchArr[i + iMove][j + jMove] = 1;
								alchArr[i][j] = 0;
							}
						} catch (exc) {}
					}
				}
/*Duplicate*/	else if (blockArr[i][j][4] == 24 && Math.random() < parseFloat(blockArr[i][j][7])) {
					try {
						if (blockArr[i - 1][j][4] != 24 && blockArr[i - 1][j][4] != 0 && blockArr[i - 1][j][4] != 28 && blockArr[i - 1][j][4] != 26  && blockArr[i - 1][j][4] != 20) {
							for (k = 0; k < kMax; k++) {
								blockArr[i + 1][j][k] = blockArr[i - 1][j][k];
							}
						}
					} catch (exc) {}
				}
/*Void*/		else if (blockArr[i][j][4] == 25) {
					try {
						if (blockArr[i + 1][j][4] != 25 && blockArr[i + 1][j][6] < 1) {
							blockReplace(i + 1, j, 0);
						}
					} catch (exc) {}
					try {
						if (blockArr[i - 1][j][4] != 25 && blockArr[i - 1][j][6] < 1) {
							blockReplace(i - 1, j, 0);
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j + 1][4] != 25 && blockArr[i][j + 1][6] < 1) {
							blockReplace(i, j + 1, 0);
						}
					} catch (exc) {}
					try {
						if (blockArr[i][j - 1][4] != 25 && blockArr[i][j - 1][6] < 1) {
							blockReplace(i, j - 1, 0);
						}
					} catch (exc) {}
				}
/*Fire*/		else if (blockArr[i][j][4] == 27) {
					blockArr[i][j][0] -= Math.random() / 10;
					if (Math.random() < 0.1) blockReplace(i, j, 0);
				}
/*Rotate*/		else if (blockArr[i][j][4] == 28) {
					if (blockArr[i][j][7] > 0) blockArr[i][j][7] /= 5/4;
				}
/*Metal*/		else if (blockArr[i][j][4] == 29) {
					if (blockArr[i][j][6] < 0.95) blockArr[i][j][5] = 3.9;
					else blockArr[i][j][5] = 5;
					if (Math.random() < 0.01){
						var heat = 0;
						try {
							if (blockArr[i + 1][j][4] == 29) {
								heat = (parseFloat(blockArr[i][j][6]) + parseFloat(blockArr[i + 1][j][6])) / 2;
								blockArr[i][j][6] = heat;
								blockArr[i + 1][j][6] = heat;
							}
						} catch (exc) {}
						try {
							if (blockArr[i - 1][j][4] == 29) {
								heat = (parseFloat(blockArr[i][j][6]) + parseFloat(blockArr[i - 1][j][6])) / 2;
								blockArr[i][j][6] = heat;
								blockArr[i - 1][j][6] = heat;
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j + 1][4] == 29) {
								heat = (parseFloat(blockArr[i][j][6]) + parseFloat(blockArr[i][j + 1][6])) / 2;
								blockArr[i][j][6] = heat;
								blockArr[i][j + 1][6] = heat;
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j - 1][4] == 29) {
								heat = (parseFloat(blockArr[i][j][6]) + parseFloat(blockArr[i][j - 1][6])) / 2;
								blockArr[i][j][6] = heat;
								blockArr[i][j - 1][6] = heat;	
							}
						} catch (exc) {}
					}
				}
/*Gun Powder*/	else if (blockArr[i][j][4] == 30) {
					if (blockArr[i][j][7] == 1 && Math.random() < 0.25) {
						for (g = -1; g < 2; g++) {
							try {
								if (blockArr[i + 1][j + g][6] < 1) {
									if (Math.random() < 0.75) blockReplace(i + 1, j + g, 27);
									else blockReplace(i + 1, j + g, 0);
								}
							} catch (exc) {}
							try {
								if (blockArr[i][j + g][6] < 1) {
									if (Math.random() < 0.75) blockReplace(i, j + g, 27);
									else blockReplace(i, j + g, 0);
								}
							} catch (exc) {}
							try {
								if (blockArr[i - 1][j + g][6] < 1) {
									if (Math.random() < 0.75) blockReplace(i - 1, j + g, 27);
									else blockReplace(i - 1, j + g, 0);
								}
							} catch (exc) {}
						}
						try {
							if (blockArr[i + 2][j][6] < 1) {
								if (Math.random() < 0.75) blockReplace(i + 2, j, 27);
								else blockReplace(i + 2, j, 0);
							}
						} catch (exc) {}
						try {
							if (blockArr[i - 2][j][6] < 1) {
								if (Math.random() < 0.75) blockReplace(i - 2, j, 27);
								else blockReplace(i - 2, j, 0);
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j + 2][6] < 1) {
								if (Math.random() < 0.75) blockReplace(i, j + 2, 27);
								else blockReplace(i, j + 2, 0);
							}
						} catch (exc) {}
						try {
							if (blockArr[i][j - 2][6] < 1) {
								if (Math.random() < 0.75) blockReplace(i, j - 2, 27);
								else blockReplace(i, j - 2, 0);
							}
						} catch (exc) {}
					
						blockReplace(i, j, 27);
					} else if (Math.random() < 0.000001) blockArr[i][j][7] = 1;
				}
				if (!blockFall(i, j)) {
					if (blockArr[i][j][4] != 27) blockSlide(i, j);
					else blockReplace(i, j, 0);
					blockDiffuse(i, j);
					blockFall(i, j);
				}
			}
		}
	}
}

//Set up game before gameLoop

blockSet(1);

//The Gameloop
setInterval(gameLoop, gameSpeed);

function gameLoop(evt) {
	if (blockInspect) {
    	placing = 0;
    }
    
	//Update board
	var X = mouseX;
	var Y = mouseY;
	if (lockAxis == "X") X = lockPos;
	else if (lockAxis == "Y") Y = lockPos;
	if (placing != 0 && inspecting != 1 && checkBorder() != 0) {
		if (placing == -1) {
			for (i = penLoc(-1); i < penLoc(1) - 1; i++) {
				for (j = penLoc(-1); j < penLoc(1) - 1; j++) {
					if(Y + i >= 0 && X + j >= 0 && Y + i < h/BLOCK_SIZE && X + j < w/BLOCK_SIZE){
						if (paintMode == 2) {
							blockArr[Y + i][X + j][1] = defaultBlockInfo[blockArr[Y+i][X+j][4]][1];
							blockArr[Y + i][X + j][2] = defaultBlockInfo[blockArr[Y+i][X+j][4]][2];
							blockArr[Y + i][X + j][3] = defaultBlockInfo[blockArr[Y+i][X+j][4]][3];
						} else {
							for (k = 0; k < blockArr[mouseY+i][mouseX+j].length; k++) {	
								blockArr[Y+i][X+j][k] = 0;
							}
							blockArr[Y+i][X+j][5] = -5;
						}
					}
				}
			}
		} else {
			for (i = penLoc(-1); i < penLoc(1) - 1; i++) {
				for (j = penLoc(-1); j < penLoc(1) - 1; j++) {
					if(Y + i >= 0 && X + j >= 0 && Y + i < h/BLOCK_SIZE && X + j < w/BLOCK_SIZE){
						if (paintMode == 2) {
							if (blockArr[Y + i][X + j][4] != 0) {
								blockArr[Y + i][X + j][1] = recolorR;
								blockArr[Y + i][X + j][2] = recolorG;
								blockArr[Y + i][X + j][3] = recolorB;
							}
						} else if (paintMode == 0 || 
							(blockArr[Y + i][X + j][4] != 0 && paintMode == 3) ||
							(blockArr[Y + i][X + j][4] == 0 && paintMode != 3) || 
							blockArr[Y + i][X + j][4] == currBlock[4]) {
							if (blockArr[Y + i][X + j][0] + currBlock[0] <= 1) {
								blockArr[Y + i][X + j][0] += (currBlock[0] * Math.round(Math.random() * 50 + 50) / 100);
							}
							for (k = 1; k < blockArr[mouseY+i][mouseX+j].length; k++) {
								blockArr[Y+i][X+j][k] = currBlock[k];
							}
						}
					}
				}
			}
		}
	} else if (inspecting != 0 && placing != 0){
		console.log(blockArr[mouseY][mouseX])
	}
	if(global != 0){
		blockUpdateType();
		global = 0;
	}
	//Clear and redraw the board
	//if(placing != 0 || paused != 1){
			ctx.clearRect(0, 0, w, h);
			drawBoard();
			if(gridSpacing > 0) drawGrid();
		//}
	//Update the location of blocks
	if (paused != 1){ 
		if(frameCurr <= 0) {
			//Run the update function to update all block locations
			update();
			frameCurr = 10;
		} else frameCurr -= frameInterval;
	}
	ctx.beginPath();
	if (penSize % 2 == 0) {
		ctx.moveTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE);
			ctx.lineTo(X * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE);
			ctx.lineTo(X * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE, Y * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE);
			ctx.lineTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE, Y * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE);
			ctx.lineTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE);
		} else {
			ctx.moveTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
			ctx.lineTo(X * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
			ctx.lineTo(X * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, Y * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
			ctx.lineTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, Y * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
			ctx.lineTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
		}
	
	ctx.globalAlpha = 1;
	ctx.strokeStyle = "#555";
    ctx.lineWidth = 2;
	ctx.stroke();
    ctx.lineWidth = 1;
    
	ctx.globalAlpha = 0.25;
	ctx.fillStyle = "#"+defaultBlockInfo[currBlock[4]][1]+""+defaultBlockInfo[currBlock[4]][2]+""+defaultBlockInfo[currBlock[4]][3];
	if (paintMode == 2) ctx.fillStyle = "#"+recolorR+""+recolorG+""+recolorB;
	ctx.fillRect(mouseX * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE - BLOCK_SIZE / 2 * (penSize % 2), mouseY * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE - BLOCK_SIZE / 2 * (penSize % 2), penSize * BLOCK_SIZE, penSize * BLOCK_SIZE);

	if (lockAxis != null) {
		ctx.beginPath();
		if (penSize % 2 == 0) {
			ctx.moveTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE);
			ctx.lineTo(X * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE);
			ctx.lineTo(X * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE, Y * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE);
			ctx.lineTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE, Y * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE);
			ctx.lineTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE);
		} else {
			ctx.moveTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
			ctx.lineTo(X * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
			ctx.lineTo(X * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, Y * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
			ctx.lineTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, Y * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
			ctx.lineTo(X * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, Y * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
		}
	
		ctx.globalAlpha = 1;
		ctx.strokeStyle = "#f11";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.lineWidth = 1;
    }
    
    if (blockInspect) {
		ctx.moveTo(mouseX * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, mouseY * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
		ctx.lineTo(mouseX * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, mouseY * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
		ctx.lineTo(mouseX * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, mouseY * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
		ctx.lineTo(mouseX * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, mouseY * BLOCK_SIZE + penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
		ctx.lineTo(mouseX * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2, mouseY * BLOCK_SIZE - penSize * BLOCK_SIZE / 2 + BLOCK_SIZE / 2);
    	ctx.globalAlpha = 1;
		ctx.strokeStyle = "#ff0";
		ctx.lineWidth = 2;
		ctx.stroke();
		ctx.lineWidth = 1;
    	
    	ctx.fillStyle = 'black';
    	ctx.font = "20px Courier";
    	ctx.textAlign = "left";
    	ctx.fillText("("+mouseX+", "+mouseY+")", 25, 550);
    	ctx.fillText("Block type: "+blockNames[blockArr[mouseY][mouseX][4]], 25, 575);
    	ctx.fillText("["+blockArr[mouseY][mouseX]+"]", 25, 600);
    }
}