// Holden Ernest - 9/16/2023
// some random p5js project to refresh on my JS


var y = 0;
var theCanvas;

var canvasSize; // the current canvas size

const gridSize = 30;
const offset = 1;
const numBombs = 300;


var grid = new Array(gridSize);


// run before loading the page
function preload() {
    for (var i = 0; i < gridSize; i++) {
        grid[i] = new Array(gridSize);
        for (var j = 0; j < gridSize; j++) {
            grid[i][j] = new Tile(i,j,color(255,0,255));
        }
    }
    setRandomBombs(numBombs);
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            grid[i][j].reveal();
        }
    }
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
            fill(grid[i][j].c);
            rect(xx,yy,blockSize);
        }
    }

}
function setRandomBombs(totalBombs) { // not really "total" amount of bombs but its still a weight
    for(var i = 0; i < totalBombs; i++) {
        var ranX = Math.floor(Math.random() * gridSize);
        var ranY = Math.floor(Math.random() * gridSize);
        grid[ranX][ranY].setBomb();
    }
}

// returns a grid position from a pixel position
function pixelToGrid(pixelX, pixelY) {
    var tmpX = Math.floor((Math.floor(pixelX)/canvasSize)*gridSize);
    var tmpY = Math.floor((Math.floor(pixelY)/canvasSize)*gridSize);
    if (tmpX >= gridSize || tmpX < 0 || tmpY >= gridSize || tmpY < 0) return new Vector2(-1,-1);
    return new Vector2(tmpX,tmpY);
}

// EVENT if the user ever resizes the window
function windowResized() {
    centerCanvas();
}
// EVENT mouse clicked
function mouseClicked() {
    var pos = pixelToGrid(mouseX, mouseY);
    if (pos.x == -1) return;
    grid[pos.x][pos.y].reveal();
}

class Vector2 { // TEMP CLASS
    constructor(x,y) {
        this.x = x;
        this.y = y;
    }
};
class Tile { // Class for all tiles
    x;
    y;
    c;
    isBomb = false;
    constructor(x,y,c) {
        this.x = x;
        this.y = y;
        this.c = c;
    }
    isBomb() {
        return this.isBomb;
    }
    setBomb() {
        this.isBomb = true;
    }
    reveal() { // when you click this tile
        if (this.isBomb) {
            this.c = color(255,0,0);
            // game over
            console.log("you lost :(");
        } else {
            var num = this.getNumber();
            if (num == 0)
                this.c = color(255, 255, 255);
            else {
                var normalized = num / 4; // GET A BETTER WAY TO REPRESENT THE NUMBERS!
                this.c = color(255-normalized*255, 255-normalized*255, 255);
            }
        }
    }
    getNumber() { // calculate the number of bomb neighbors and return the number
        if (this.isBomb) {
            return -1;
        }
        return this.getNeighborBombs();
    }
    getNeighborBombs() {
        var count = 0;
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) continue;
                var tmpX = this.x + i;
                var tmpY = this.y + j;
                if (this.onGrid(tmpX,tmpY)) {
                    if (grid[tmpX][tmpY].isBomb) { // if the neighbor is a bomb
                        count++;
                        continue;
                    }
                    //if (grid[tmpX][tmpY].getNumber() == 0) { // if you need to recursivly reveal
                        // recursion
                    //}
                }
            }
        }
        return count;
    }
    onGrid(xx,yy) {
        return !(xx < 0 || xx >= gridSize || yy < 0 || yy >= gridSize);
    }
};

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