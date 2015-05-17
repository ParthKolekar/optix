/*
*   @author Anurag Ghosh
*   @version 1.6
*/

/* Changelog

*   1-June
    Old levelCore chucked.
    New code style adapted.
    Liked Prototypal Form though.

*   2-June
    Quadratic Curve Style
    Thanks Parth :)

*   2-June
    Added Spray and Scale Methods. :p
    Several Smaller Helpers added.
    Front end left. And some Refinement.

*   4-June
    Touch Handlers Corrected.

*   14-June
    Linked the Buttons to The functions.

    ERROR:
    Touch Events (Spray Error);

    Recommend:
    Change Constant Objects To gameArray.
    Causes overhead to anonymous function.

*   18-June
    BugFix
    Careless GHOSS!!!

*

*/

var levelCore = (function(levelCore, url) {
    'use strict';
    //Globals
    var canvas, context;
    var mouseX, mouseY;
    var curSize, curColor, curType, curDensity;
    var tempCanvas, tempContext;
    var clicks;
    var sprayIntervalId;
    var canvasContainer;

    //booleans
    var isPainting = false;

    var incrementSize = function() {
        /// <summary></summary>
        curSize += 1;
    };

    var decrementSize = function() {
        /// <summary></summary>
        curSize -= 1;
    };

    var selectSand = function() {
        /// <summary></summary>
        curColor = Colors.Sand;
    };

    var selectRand = function() {
        /// <summary></summary>
        curColor = Colors.Rand;
    };

    var selectIce = function() {
        /// <summary></summary>
        curColor = Colors.Ice;
    };

    var erase = function() {
        /// <summary></summary>
        curColor = Colors.None;
    };
    var useSpray = function() {
        curType = Types.Spray;
    };
    var usePencil = function() {
        /// <summary></summary>
        curType = Types.Pencil;
    };
    var useScale = function() {
        /// <summary></summary>
        curType = Types.Scale;
    };
    var getRandomOffset = function() {
        /// <summary></summary>
        /// <returns type=""></returns>
        var randomAngle = Math.random() * Math.PI * 2;
        var randomRadius = Math.random() * curSize;
        return {
            x: Math.cos(randomAngle) * randomRadius,
            y: Math.sin(randomAngle) * randomRadius
        };
    };
    var getPos = function(event) {
        /// <summary></summary>
        /// <param name="event" type=""></param>
        mouseX = event.pageX - canvas.offsetParent.offsetLeft;
        mouseY = event.pageY - canvas.offsetParent.offsetTop;
    };
    var redraw = function() {
        /// <summary></summary>
        /// <returns type=""></returns>
        tempContext.strokeStyle = curColor;
        tempContext.fillStyle = curColor;
        tempContext.lineWidth = curSize;

        if (curType === Types.Spray) {
            for (var j = 0; j < curDensity; j++) {
                var offset = getRandomOffset(curSize);
                tempContext.fillRect(mouseX + offset.x, mouseY + offset.y, 1, 1);
            }
        } else if (curType === Types.Pencil) {
            if (clicks.length < 3) {
                tempContext.beginPath();

                tempContext.arc(clicks[0].mouseX, clicks[0].mouseY, curSize / 2, 0, Math.PI * 2, !0);
                tempContext.fill();
                tempContext.closePath();

                return;
            }

            tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

            tempContext.beginPath();
            tempContext.moveTo(clicks[0].mouseX, clicks[0].mouseY);

            for (var i = 1; i < clicks.length - 2; i++) {
                var c = (clicks[i].mouseX + clicks[i + 1].mouseX) / 2;
                var d = (clicks[i].mouseY + clicks[i + 1].mouseY) / 2;

                tempContext.quadraticCurveTo(clicks[i].mouseX, clicks[i].mouseY, c, d);
            }

            tempContext.quadraticCurveTo(
                clicks[i].mouseX,
                clicks[i].mouseY,
                clicks[i + 1].mouseX,
                clicks[i + 1].mouseY
            );
            tempContext.stroke();
        } else if (curType === Types.Scale) {
            tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);

            tempContext.beginPath();

            tempContext.moveTo(clicks[0].mouseX, clicks[0].mouseY);
            tempContext.lineTo(clicks[clicks.length - 1].mouseX, clicks[clicks.length - 1].mouseY);
            tempContext.closePath();
            tempContext.stroke();
        }
    };

    var resetCanvas = function() {
        /// <summary>Resets the canvas.</summary>
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        clicks = [];
        isPainting = false;
    };

    var addClick = function(x, y) {
        /// <summary></summary>
        /// <param name="x" type=""></param>
        /// <param name="y" type=""></param>
        clicks.push({ mouseX: x, mouseY: y });
    };

    var startDraw = function() {
        /// <summary>Starts drawing on a canvas on mousdown</summary>
        if (curType === Types.Spray) {
            sprayIntervalId = setInterval(redraw, 100);
            return;
        }
        isPainting = true;

        addClick(mouseX, mouseY);
        redraw();
    };

    var keepDraw = function() {
        /// <summary></summary>
        if (isPainting) {
            addClick(mouseX, mouseY);
            redraw();
        }
    };
    var stopDraw = function() {
        /// <summary>stop drawing on canvas on mouseup</summary>
        if (curType === Types.Spray) {
            clearInterval(sprayIntervalId);
        }
        isPainting = false;
        // Writing down to real canvas now
        context.drawImage(tempCanvas, 0, 0);

        tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        clicks = [];
    };

    var onCanvasTouchStartHandler = function(event) {
        /// <summary></summary>
        /// <param name="event" type=""></param>
        if (event.touches.length == 1) {
            event.preventDefault();

            mouseX = event.touches[0].pageX - canvas.offsetParent.offsetLeft;
            mouseY = event.touches[0].pageY - canvas.offsetParent.offsetTop;

            isPainting = true;
        }
    };
    var onCanvasTouchMoveHandler = function(event) {
        /// <summary></summary>
        /// <param name="event" type=""></param>
        if (event.touches.length == 1) {
            event.preventDefault();

            mouseX = event.touches[0].pageX - canvas.offsetParent.offsetLeft;
            mouseY = event.touches[0].pageY - canvas.offsetParent.offsetTop;
        }
    };
    var onCanvasTouchEndHandler = function(event) {
        /// <summary></summary>
        event.preventDefault();
        isPainting = false;
        if (curType === Types.Spray) {
            clearInterval(sprayIntervalId);
        }
        context.drawImage(tempCanvas, 0, 0);
        tempContext.clearRect(0, 0, tempCanvas.width, tempCanvas.height);
        clicks = [];
    };
    var reverseParse = function() {
        /// <summary>This function gets the imagedata from a canvas and builds up the corresponding game array. </summary>
        var array = [];
        var i, j;

        for (i = 0; i < 1500; i++)
            array[i] = [];

        for (i = 0; i < 1500; i++)
            for (j = 0; j < 1500; j++)
                array[i][j] = 0;

        var imageData = canvas.getContext('2d').getImageData(0, 0, canvas.width, canvas.height);
        var pR, pB, pG, pA;
        var x = 0;
        var y = 0;
        var length = 4 * (imageData.width + (imageData.height * imageData.width));
        for (i = 0; i < length; i += 4) {

            // the pixel red,green,blue and alpha
            pR = imageData.data[i];
            pG = imageData.data[i + 1];
            pB = imageData.data[i + 2];
            pA = imageData.data[i + 3];


            if (pR == 0xD0 && pG == 0xD0 && pB == 0xD0 && pA == 0xFF) {
                array[x][y] = gameArray.IceTerrain;
            } else if (pR == 0xD0 && pG == 0xA0 && pB == 0x60 && pA == 0xFF) {
                array[x][y] = gameArray.SandTerrain;
            } else if (pR == 0xFF && pG == 0xCC && pB == 0x99 && pA == 0xFF) {
                array[x][y] = gameArray.RandTerrain;
            } else if (pR == 0x33 && pG == 0x99 && pB == 0xFF && pA == 0xFF) {
                array[x][y] = gameArray.PrismDown;
            } else if (pR == 0x33 && pG == 0xCC && pB == 0xFF && pA == 0xFF) {
                array[x][y] = gameArray.PrismUp;
            } else if (pR == 0x33 && pG == 0x99 && pB == 0xCC && pA == 0xFF) {
                array[x][y] = gameArray.PrismLeft;
            } else if (pR == 0x33 && pG == 0xCC && pB == 0xCC && pA == 0xFF) {
                array[x][y] = gameArray.PrismRight;
            } else if (pR == 0xE3 && pG == 0x9D && pB == 0x16 && pA == 0xFF) {
                array[x][y] = gameArray.Mirror;
            } else if (pR == 0xFF && pG == 0x45 && pB == 0x00 && pA == 0xFF) {
                array[x][y] = gameArray.PortalOrange;
            } else if (pR == 0xFF && pG == 0x44 && pB == 0x00 && pA == 0xFF) {
                array[x][y] = gameArray.PortalOrangeSink;
            } else if (pR == 0x44 && pG == 0x2B && pB == 0x3B && pA == 0xFF) {
                array[x][y] = gameArray.PortalBlue;
            } else if (pR == 0x45 && pG == 0x2B && pB == 0x3B && pA == 0xFF) {
                array[x][y] = gameArray.PortalBlueSink;
            } else if (pR == 0x66 && pG == 0x33 && pB == 0xCC && pA == 0xFF) {
                array[x][y] = gameArray.WinningTerrain;
            } else {
                array[x][y] = gameArray.Nothing;
            }
            // incrementing array values x and y
            x += 1;

            x = x % imageData.width;

            if (x == 0) {
                y += 1;
                y = y % imageData.height;
            }
        }
        var string = JSON.stringify(array);
        window.localStorage.setItem('array', string);
    };


    var initialize = function() {
        /// <summary></summary>
        canvas = document.getElementById('level');
        context = canvas.getContext('2d');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;


        // Creating a temp canvas
        canvasContainer = document.getElementById('canvasContainer');
        tempCanvas = document.createElement('canvas');
        tempContext = tempCanvas.getContext('2d');

        tempCanvas.id = 'tempCanvas';
        tempCanvas.classList.add('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;

        canvasContainer.appendChild(tempCanvas);


        // specific event listeners for drawing.
        tempCanvas.addEventListener('mousedown', startDraw, true);
        tempCanvas.addEventListener('touchstart', onCanvasTouchStartHandler, true);
        tempCanvas.addEventListener('mouseup', stopDraw, true);
        tempCanvas.addEventListener('touchend', onCanvasTouchEndHandler, true);
        //tempCanvas.addEventListener('mouseleave', stopDraw, true); // Fucks Shit Up.
        tempCanvas.addEventListener('mousemove', keepDraw, true);
        tempCanvas.addEventListener('touchmove', keepDraw, true);
        tempCanvas.addEventListener('mousemove', getPos, true);
        tempCanvas.addEventListener('touchmove', onCanvasTouchMoveHandler, true);


        // NEED BETTER WAYS. IDEAS?
        document.getElementById('incrementSize').addEventListener('click', incrementSize, true);
        document.getElementById('decrementSize').addEventListener('click', decrementSize, true);
        document.getElementById('selectSand').addEventListener('click', selectSand, true);
        document.getElementById('selectRand').addEventListener('click', selectRand, true);
        document.getElementById('selectIce').addEventListener('click', selectIce, true);
        document.getElementById('usePencil').addEventListener('click', usePencil, true);
        document.getElementById('useScale').addEventListener('click', useScale, true);
        document.getElementById('useSpray').addEventListener('click', useSpray, true);
        document.getElementById('erase').addEventListener('click', erase, true);
        document.getElementById('parse').addEventListener('click', reverseParse, true);

        //defaults
        curSize = 10;
        curDensity = curSize * 10;
        curColor = Colors.Sand;
        curType = Types.Spray;
        clicks = [];

    };

    initialize();

})(levelCore || {}, null);
