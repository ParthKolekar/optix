/**
*   @author Parth Kolekar
*   @version 1.4 
*/


/* Changelog

*    30-May
    Commented Entire Code For You :D.
    XML-Markup Used.
    Refactored And Made Neat

*   14-June
    Added Better AI Logic.
    Added Screen Size Dependent Energy.

*   15-June
    Now Fires redwin and bluewin events in global document.
    Added better colors

*

*

*/

var gameCore = (function(gameCore, array) {
	"use strict";

	var arr;
	var width;
	var height;
	var gameEnergy;
	var gameEvent;

	var trail = [];

	var pageX;
	var pageY;
	var accumulator = 0;
	var terrain;
	var ctxRed, ctxBlue;
	var red, blue;
	var redFrame, blueFrame;
	var redCanvas, blueCanvas;

	var aiCalc = function() {
		/// <summary>Adding More Complex AI Logic</summary>
		/// <param name="x" type="Number">X Value for Red</param>
		/// <param name="y" type="Number">Y Value for Red</param>
		var index = trail.length * Math.random();
		index = Math.floor(index);
		red.InitVector(trail[index]["x"], trail[index]["y"]);
		trail = [];
	};
	var getOffset = function(offset, x, y) {
		/// <summary>Gets Back The Array Offset</summary>
		/// <param name="offset" type="Number">Integer Number For Offset</param>
		/// <param name="x" type="Number">X Value For Offset Index</param>
		/// <param name="y" type="Number">Y Value For Offset Index</param>
		/// <returns type="Number">The Array Offset At X,Y</returns>
		return ((arr[x][y] & (1 << offset)) >> (offset));
	};

	var setOffset = function(offset, x, y) {
		/// <summary>Sets The Array Offset At X,Y</summary>
		/// <param name="offset" type="Number">Integer Number For Offset</param>
		/// <param name="x" type="Number">X Value For Offset Index</param>
		/// <param name="y" type="Number">Y Value For Offset Index</param>
		arr[x][y] = (arr[x][y] | (1 << offset));
	};

	var resetOffset = function(offset, x, y) {
		/// <summary>Resets The Array Offset At X,Y</summary>
		/// <param name="offset" type="Number">Integer Number For Offset</param>
		/// <param name="x" type="Number">X Value For Offset Index</param>
		/// <param name="y" type="Number">Y Value For Offset Index</param>
		arr[x][y] = (arr[x][y] & (~(1 << offset)));
	};

	var clearBlue = function() {
		/// <summary>Clears The Blue Core</summary>
		for (var i = 0; i < 1500; i++)
			for (var j = 0; j < 1500; j++)
				resetOffset(gameArray.BlueBit, i, j);
	};

	var clearRed = function() {
		/// <summary>Clears The Red Core</summary>
		for (var i = 0; i < 1500; i++)
			for (var j = 0; j < 1500; j++)
				resetOffset(gameArray.RedBit, i, j);
	};


	gameCore.Player = function(x, y, energy) {
		/// <summary>Constructor For Player Object</summary>
		/// <param name="x" type="Object">Initial X Position For Player</param>
		/// <param name="y" type="Object">Initial Y Position For Player</param>
		/// <param name="energy" type="Object">Initial Energy For Player</param>
		this.X = x;
		this.Y = y;
		this.Energy = energy;
		this.dx = 0;
		this.dy = 0;
		this.TerrainGradient = 1;
		this.EnergyGradient = 1;
	};

	gameCore.Player.prototype.log = function() {
		/// <summary>Log Routine For Player Object</summary>
		console.log(this);
	};

	gameCore.Player.prototype.Normalise = function() {
		/// <summary>Vector Normalisation For Player</summary>
		var vectornorm = Math.sqrt(Math.pow(this.dx, 2) + Math.pow(this.dy, 2));
		this.dx /= vectornorm;
		this.dy /= vectornorm;
	};

	gameCore.Player.prototype.InitVector = function(x, y) {
		/// <summary>Redirects The Player To X,Y</summary>
		/// <param name="x" type="Number">Redirect To X</param>
		/// <param name="y" type="Number">Redirect To Y</param>
		this.dx = x - this.X;
		this.dy = y - this.Y;
		this.Normalise();
	};

	gameCore.Player.prototype.TerrainModifier = function(x, y) {
		/// <summary>Huge Terrain Modifier Chart</summary>
		/// <param name="x" type="Number">What To Do When Player Reaches X</param>
		/// <param name="y" type="Number">What To Do When Player Reaches Y</param>
		/// <returns type="None">Returns None</returns>
		var i;
		var j;
		if (getOffset(gameArray.IceTerrainBit, x, y)) {

			this.TerrainGradient = 1.5;
			return;
		}
		if (getOffset(gameArray.SandTerrainBit, x, y)) {
			this.TerrainGradient = 0.5;
			return;
		}
		if (getOffset(gameArray.PortalBlueBit, x, y)) {
			for (i = 0; i < 2000; i++)
				for (j = 0; j < 2000; j++)
					if (getOffset(gameArray.PortalOrangeSinkBit, i, j)) {
						this.X = i + 1;
						this.Y = j + 1;
					}
			return;
		}
		if (getOffset(gameArray.PortalOrangeBit, x, y)) {
			for (i = 0; i < 2000; i++)
				for (j = 0; j < 2000; j++)
					if (getOffset(gameArray.PortalBlueSinkBit, i, j)) {
						this.X = i + 1 + this.dx + this.dx;
						this.Y = j + 1 + this.dy + this.dy;
					}
			return;
		}
		if (getOffset(gameArray.PrismDownBit, x, y)) {
			i = x;
			j = y;
			if (getOffset(gameArray.PrismDownBit, i, j + 1))
				j = j + 1;
			this.X = i;
			this.Y = j;
			this.dx = 0;
			this.dy = 1;
			return;
		}
		if (getOffset(gameArray.PrismUpBit, x, y)) {
			i = x;
			j = y;
			if (getOffset(gameArray.PrismUpBit, i, j - 1))
				j = j - 1;
			this.X = i;
			this.Y = j;
			this.dx = 0;
			this.dy = -1;
			return;
		}
		if (getOffset(gameArray.PrismRightBit, x, y)) {
			i = x;
			j = y;
			if (getOffset(gameArray.PrismRightBit, i + 1, j))
				i = i + 1;
			this.X = i;
			this.Y = j;
			this.dx = 1;
			this.dy = 0;
			return;
		}
		if (getOffset(gameArray.PrismLeftBit, x, y)) {
			i = x;
			j = y;
			if (getOffset(gameArray.PrismLeftBit, i - 1, j))
				i = i - 1;
			this.X = i;
			this.Y = j;
			this.dx = -1;
			this.dy = 0;
			return;
		}
		if (getOffset(gameArray.MirrorBit, x, y)) {
			if (getOffset(gameArray.MirrorBit, x - 1, y) && getOffset(gameArray.MirrorBit, x + 1, y))
				this.dy = -this.dy;
			if (getOffset(gameArray.MirrorBit, x, y - 1) && getOffset(gameArray.MirrorBit, x, y + 1))
				this.dx = -this.dx;

			return;
		}
		if (getOffset(gameArray.RandTerrainBit, x, y)) {
			if (Math.random() > 0.9) {
				this.dx = Math.random();
				this.dy = Math.random();
				this.Normalise();
			}
			if (Math.random() > 0.9) {
				this.Energy = Math.random() * gameEnergy;
			}
			if (Math.random() > 0.9) {
				this.X = Math.random() * width;
				this.Y = Math.random() * height;
			}
			return;
		}
		if (getOffset(gameArray.WinningTerrainBit, x, y)) {
			this.winLevel();
			return;
		}
		this.TerrainGradient = 1;
	};

	var getPositionRelativeToCanvas = function(event) {
		/// <summary>Gets Position Relative To Canvas Provided No Parents</summary>
		/// <param name="event" type="Event">Touch / Mouse Event Param</param>
		pageX = event.pageX;
		pageY = event.pageY;
		pageX -= terrain.offsetParent.offsetLeft;
		pageY -= terrain.offsetParent.offsetTop;
	};

	var blueDrawLine = function() {
		/// <summary>Draws Line For Blue</summary>
		ctxBlue.beginPath();

		var x = Math.round(blue.X); //Compute ONCE;
		var y = Math.round(blue.Y);

		trail.push({ "x": x, "y": y });

		if (getOffset(gameArray.RedBit, x, y)) {
			console.log(x, y);

			blue.winLevel();

		}

		blue.TerrainModifier(x, y);

		setOffset(gameArray.BlueBit, Math.floor(blue.X), Math.floor(blue.Y));
		setOffset(gameArray.BlueBit, Math.ceil(blue.X), Math.ceil(blue.Y));

		ctxBlue.moveTo(blue.X, blue.Y);

		blue.X += blue.dx * blue.TerrainGradient;
		blue.Y += blue.dy * blue.TerrainGradient;

		ctxBlue.lineTo(blue.X, blue.Y);

		ctxBlue.strokeStyle = "#0066FF";
		ctxBlue.stroke();

		blue.Energy = blue.Energy - blue.EnergyGradient;

		if (blue.Energy <= 0 || blue.X >= width || blue.X <= 0 || blue.Y >= height || blue.Y <= 0) {
			if (blue.X <= 0)
				blue.X = 0;
			if (blue.Y <= 0)
				blue.Y = 0;

			// INIT Red HERE BECAUSE IT SHOULD LOAD ONLY ON PLAYER COMPLETION;

			clearRed();
			ctxRed.clearRect(0, 0, width, height);

			aiCalc();

			blueReset();
		} else
			blueFrame = requestAnimationFrame(blueDrawLine);
	};

	var redDrawLine = function() {
		/// <summary>Draws Line For Red</summary>
		ctxRed.beginPath();

		var x = Math.round(red.X);
		var y = Math.round(red.Y);

		if (getOffset(gameArray.BlueBit, x, y)) {

			console.log(x, y);
			red.winLevel();

		}

		red.TerrainModifier(x, y);

		setOffset(gameArray.RedBit, Math.floor(red.X), Math.floor(red.Y));
		setOffset(gameArray.RedBit, Math.ceil(red.X), Math.ceil(red.Y));

		ctxRed.moveTo(red.X, red.Y);

		red.X += red.dx * red.TerrainGradient;
		red.Y += red.dy * red.TerrainGradient;

		ctxRed.lineTo(red.X, red.Y);

		ctxRed.strokeStyle = "#FF6600";
		ctxRed.stroke();

		red.Energy = red.Energy - red.EnergyGradient;

		if (red.Energy <= 0 || red.X >= width || red.X <= 0 || red.Y >= height || red.Y <= 0) {
			if (red.X <= 0)
				red.X = 0;
			if (red.Y <= 0)
				red.Y = 0;

			redReset();
		} else
			redFrame = requestAnimationFrame(redDrawLine);
	};

	var blueReset = function() {
		/// <summary>Reset Routine For Blue</summary>
		accumulator = 0;
		cancelAnimationFrame(blueFrame);
		blue.Energy = gameEnergy;
		redFrame = requestAnimationFrame(redDrawLine);
	};
	var redReset = function() {
		/// <summary>Reset Routine For Red</summary>
		accumulator = 0;
		clearBlue();
		cancelAnimationFrame(redFrame);
		red.Energy = gameEnergy;

		document.addEventListener("click", clickEvent, true);
	};

	var clickEvent = function(event) {
		/// <summary>Responds To Click Event</summary>
		/// <param name="event" type="Event">Responds To Touch / Mouse Event</param>
		event.preventDefault();
		document.removeEventListener("click", clickEvent, true);
		getPositionRelativeToCanvas(event);

		//INIT PLAYER HERE BECUASE IT SHOULD INIT ONLY AFTER ONCLICK

		clearBlue();
		ctxBlue.clearRect(0, 0, width, height);

		blue.InitVector(pageX, pageY);

		blueFrame = window.requestAnimationFrame(blueDrawLine);
	};

	var initialize = function() {
		/// <summary>Initilises All Elements</summary>
		arr = array || JSON.parse(window.sessionStorage.getItem("array"));

		if (arr == null) {
			arr = [];

			for (i = 0; i < 1500; i++)
				arr[i] = [];

			for (i = 0; i < 1500; i++)
				for (j = 0; j < 1500; j++)
					arr[i][j] = 0;
		}

		var i, j;

		height = window.innerHeight;
		width = window.innerWidth;

		gameEnergy = Math.floor((height + width) / 10);


		terrain = document.getElementById('terrain');

		blueCanvas = document.getElementById('identity');
		redCanvas = document.getElementById('enemy');

		ctxBlue = blueCanvas.getContext('2d');
		ctxRed = redCanvas.getContext('2d');

		document.addEventListener("click", clickEvent, true);

		terrain.height = height;
		terrain.width = width;

		blueCanvas.height = height;
		blueCanvas.width = width;

		redCanvas.height = height;
		redCanvas.width = width;

		blue = new gameCore.Player(0, 0, gameEnergy);
		red = new gameCore.Player(width, height, gameEnergy);

		blue.winLevel = function () {
			if (accumulator == 0) {
				red.X = width;
				red.Y = height;
				red.InitVector(blue.X, blue.Y);

				gameEvent = new Event("bluewin");
				document.dispatchEvent(gameEvent);
			}
			accumulator = accumulator + 1;
		};

		red.winLevel = function() {
			if (accumulator == 0) {
				blue.X = 0;
				blue.Y = 0;

				gameEvent = new Event("redwin");
				document.dispatchEvent(gameEvent);
			}
			accumulator = accumulator + 1;
		};
	};

	initialize();

})(gameCore || {}, null);