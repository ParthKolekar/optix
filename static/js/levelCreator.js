/* levelCreator.js 
*
* HAW !!!
*
* P arth Kolekar
* A nurag Ghosh
* A rushi Vashist
* V atika Harlalka
*
* CopyLeft - 2014
* Level Creation Functionality - version 1.0
*
*/
var levelCreator = {};
levelCreator.Object = function (array) {
    /*
    We drag and drop on the canvas, on hitting play, 
    we grab the image data from the saved canvas, 
    reverse parse it to create an array to work with 
    and execute the level as a game.
    */
    this.array = array;
};

levelCreator.Array = {};
levelCreator.Array.Nothing = 0;
levelCreator.Array.Identity = 1;
levelCreator.Array.IdentityBit = 0;
levelCreator.Array.Enemy = 2;
levelCreator.Array.EnemyBit = 1;
levelCreator.Array.IceTerrain = 4;
levelCreator.Array.IceTerrainBit = 2;
levelCreator.Array.SandTerrain = 8;
levelCreator.Array.SandTerrainBit = 3;
levelCreator.Array.RandTerrain = 16;
levelCreator.Array.RandTerrainBit = 4;
levelCreator.Array.PrismDown = 32;
levelCreator.Array.PrismDownBit = 5;
levelCreator.Array.Mirror = 64;
levelCreator.Array.MirrorBit = 6;
levelCreator.Array.PortalOrange = 128;
levelCreator.Array.PortalOrangeBit = 7;
levelCreator.Array.PortalOrangeSink = 256;
levelCreator.Array.PortalOrangeSinkBit = 8;
levelCreator.Array.PortalBlue = 512;
levelCreator.Array.PortalBlueBit = 9;
levelCreator.Array.PortalBlueSink = 1024;
levelCreator.Array.PortalBlueSinkBit = 10;
levelCreator.Array.WinningTerrain = 2048;
levelCreator.Array.WinningTerrainBit = 11;
levelCreator.Array.PrismUp = 4096;
levelCreator.Array.PrismUpBit = 12;
levelCreator.Array.PrismLeft = 8192;
levelCreator.Array.PrismLeftBit = 13;
levelCreator.Array.PrismRight = 16384;
levelCreator.Array.PrismRightBit = 14;

var kineticContainer;
var canvas;
var lvlc;
var layer;
var stage;
var arr;

window.onload = function () {
    arr = [];
    for (var i = 0; i < 1000; i++) {
        arr[i] = [];
    }

    stage = new Kinetic.Stage({
        container: 'containerCanvas',
        width: 720,
        height: 600,
        border: 1
    });
    lvlc = new levelCreator.Object(arr);

    layer = new Kinetic.Layer();
    var border = new Kinetic.Line({
        points: [10, 0, 720, 0, 720, 600, 0, 600],
        closed: true,
        fill: '#FFFFFF',
        stroke: '#FFFFFF',
        strokeWidth: 2
    });
    layer.add(border);
    stage.add(layer);


    kineticContainer = document.querySelector('.kineticjs-content');
    canvas = kineticContainer.firstElementChild;
};



levelCreator.Object.prototype.reverseParse = function () {
    /* 
    Refer to levelcore.js for information about imageData 
    and pixel manipulation. This function gets the imagedata 
    from a canvas and builds up the corresponding game array. 
    */
    var imageData = canvas.getContext("2d").getImageData(0, 0, canvas.width, canvas.height);
    var pR, pB, pG, pA;
    var x = 0;
    var y = 0;
    var length = 4 * (imageData.width + (imageData.height * imageData.width));
    for (var i = 0; i < length; i += 4) {

        // the pixel red,green,blue and alpha
        pR = imageData.data[i];
        pG = imageData.data[i + 1];
        pB = imageData.data[i + 2];
        pA = imageData.data[i + 3];


        if (pR == 0xD0 && pG == 0xD0 && pB == 0xD0 && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.IceTerrain;
        }

        else if (pR == 0xD0 && pG == 0xA0 && pB == 0x60 && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.SandTerrain;
        }

        else if (pR == 0xFF && pG == 0xCC && pB == 0x99 && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.RandTerrain;
        }

        else if (pR == 0x33 && pG == 0x99 && pB == 0xFF && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.PrismDown;
        }

        else if (pR == 0x33 && pG == 0xCC && pB == 0xFF && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.PrismUp;
        }

        else if (pR == 0x33 && pG == 0x99 && pB == 0xCC && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.PrismLeft;
        }

        else if (pR == 0x33 && pG == 0xCC && pB == 0xCC && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.PrismRight;
        }

        else if (pR == 0xE3 && pG == 0x9D && pB == 0x16 && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.Mirror;
        }

        else if (pR == 0xFF && pG == 0x45 && pB == 0x00 && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.PortalOrange;
        }

        else if (pR == 0xFF && pG == 0x44 && pB == 0x00 && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.PortalOrangeSink;
        }

        else if (pR == 0x44 && pG == 0x2B && pB == 0x3B && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.PortalBlue;
        }

        else if (pR == 0x45 && pG == 0x2B && pB == 0x3B && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.PortalBlueSink;
        }

        else if (pR == 0x66 && pG == 0x33 && pB == 0xCC && pA == 0xFF) {
            this.array[x][y] = levelCreator.Array.WinningTerrain;
        }
        else {
            this.array[x][y] = levelCreator.Array.Nothing;
        }

        // incrementing array values x and y
        x += 1;
        x = x % imageData.width;
        if (x == 0) {
            y += 1;
            y = y % imageData.height;
        }
    }
    /*
    The array is stored on the local storage using an AJAX call.
    */
    var string = JSON.stringify(this.array);
    window.localStorage.setItem("array", string);
    var xmlhttp = new XMLHttpRequest();
    xmlhttp.open("POST", "storeLevel", true);
    xmlhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded; charset=UTF-8");
    xmlhttp.send("array=" + string);
};

function createMirrorV() {
    /*
    Creates a vertical mirror of predefined dimensions.
    */
    var rectangle = new Kinetic.Rect({
        x: 200,
        y: 100,
        width: 4,
        height: 50,
        fill: '#E39D16',
        closed: true,
        draggable: true
    });
    layer.add(rectangle);
    stage.add(layer);
}

function createMirrorH() {
    /*
    Creates a horizontal mirror of predefined dimensions.
    */
    var rectangle = new Kinetic.Rect({
        x: 100,
        y: 200,
        width: 50,
        height: 4,
        fill: '#E39D16',
        closed: true,
        draggable: true
    });
    layer.add(rectangle);
    stage.add(layer);
}

function createPrismDown() {
    /*
    Creates a prism pointing down.
    */
    var triangle = new Kinetic.Line({
        points: [30, 80, 70, 80, 50, 100],
        fill: '#3399FF',
        closed: true,
        draggable: true
    });
    layer.add(triangle);
    stage.add(layer);
}
function createPrismUp() {
    /*
    Creates a prism pointing up.
    */
    var triangle = new Kinetic.Line({
        points: [30, 140, 70, 140, 50, 120],
        fill: '#33CCFF',
        closed: true,
        draggable: true
    });
    layer.add(triangle);
    stage.add(layer);
}
function createPrismLeft() {
    /*
    Creates a prism pointing left.
    */
    var triangle = new Kinetic.Line({
        points: [30, 90, 30, 130, 10, 110],
        fill: '#3399CC',
        closed: true,
        draggable: true
    });
    layer.add(triangle);
    stage.add(layer);
}

function createPrismRight() {
    /*
    Creates a prism pointing right.
    */
    var triangle = new Kinetic.Line({
        points: [80, 90, 80, 130, 100, 110],
        fill: '#33CCCC',
        closed: true,
        draggable: true
    });
    layer.add(triangle);
    stage.add(layer);
}
function createIceTerrain() {
    /*
    Creates a strip of ice terrain.
    */
    var rectangle = new Kinetic.Rect({
        x: 0,
        y: 560,
        width: 720,
        height: 40,
        fill: '#D0D0D0',
        closed: true,
        draggable: true
    });
    layer.add(rectangle);
    stage.add(layer);
}

function createSandTerrain() {
    /*
    Creates a strip of Sand terrain.
    */
    var rectangle = new Kinetic.Rect({
        x: 0,
        y: 560,
        width: 720,
        height: 40,
        fill: '#D0A060',
        closed: true,
        draggable: true
    });
    layer.add(rectangle);
    stage.add(layer);
}
function createRandTerrain() {
    /*
    Creates a very thin strip of Random terrain.
    */
    var rectangle = new Kinetic.Rect({
        x: 0,
        y: 560,
        width: 720,
        height: 2,
        fill: '#FFCC99',
        closed: true,
        draggable: true
    });
    layer.add(rectangle);
    stage.add(layer);
}
function clearTerrain() {
    /*
    Clears the canvas.
    */
    layer.clear();
    var border = new Kinetic.Line({
        points: [0, 0, 720, 0, 720, 600, 0, 600],
        closed: true,
        fill: '#FFFFFF',
        stroke: '#FFFFFF',
        strokeWidth: 2
    });
    layer.add(border);
    stage.add(layer);
}
function parseCanvas() {

    lvlc.reverseParse();
}
