// Holden Ernest - 9/16/2023
// some random p5js project to refresh on my JS


var y = 0;
var theCanvas;

var canvasSize; // the current canvas size

const gridSize = 10;
var offset = 5;
var selected = {
    x: -1,
    y: -1
}


// run before loading the page
function preload() {
    
    // something
    
}
// run once on setup
function setup() {
    theCanvas = createCanvas(windowHeight, windowHeight);
    centerCanvas();
    frameRate(30);
}

// run every frame
function draw() {
    background(25,25,25);
    
    drawRects();
}

function drawRects() {
    fill(100);
    var blockSize = ((canvasSize-offset) / gridSize) - offset;
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            var xx = offset+(i*(blockSize + offset));
            var yy = offset+(j*(blockSize + offset));

            if (selected.x == i && selected.y == j) {
                fill(0,255,0);
            } else {
                fill(100);
            }
            rect(xx,yy,blockSize);
        }
    }

}

// returns a grid position from a pixel position
function pixelToGrid(pixelX, pixelY) {
    var tmpX = Math.floor((Math.floor(pixelX)/canvasSize)*gridSize);
    var tmpY = Math.floor((Math.floor(pixelY)/canvasSize)*gridSize);

    return new Vector2(tmpX,tmpY);
}

// EVENT if the user ever resizes the window
function windowResized() {
    centerCanvas();
}
// EVENT mouse clicked
function mouseClicked() {
    var pos = pixelToGrid(mouseX, mouseY);
    selected.x = pos.x;
    selected.y = pos.y;
}

function Vector2(x,y) { // TEMP CLASS
    this.x = x;
    this.y = y;
  }

function centerCanvas() {
    var dif = windowWidth - windowHeight;
    if (dif > 0) {
        canvasSize = windowHeight;
        resizeCanvas(windowHeight, windowHeight);
        theCanvas.position(dif/2, 0);
    } else {
        canvasSize = windowWidth;
        resizeCanvas(windowWidth, windowWidth);
        theCanvas.position(0, -dif/2);
    }
}