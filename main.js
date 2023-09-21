// Holden Ernest - 9/16/2023
// some random p5js project to refresh on my JS


var y = 0;
var theCanvas;

var canvasSize; // the current canvas size

var gridSize = 50;
const offset = 0;
var numBombs = 600;


var grid;

var content;
var isGameOver = false;

var completion = 0;

// run before loading the page
function preload() {
    content = document.getElementById("content");
    play();
}
// run once on setup
function setup() {
    theCanvas = createCanvas(windowHeight, windowHeight);
    centerCanvas();
    frameRate(15);
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
    if (isGameOver) return;
    var pos = pixelToGrid(mouseX, mouseY);
    if (pos.x == -1) return;
    grid[pos.x][pos.y].reveal();
    updateCompletion();
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
    revealed = false;
    constructor(x,y,c) {
        this.x = x;
        this.y = y;
        this.c = c;
    }
    isBomb() {
        return this.isBomb;
    }
    isRevealed() {
        return this.revealed;
    }
    setBomb() {
        this.isBomb = true;
    }
    reveal() { // when you click this tile
        if (this.isRevealed()) return;
        completion += 100/(gridSize*gridSize);
        this.revealed = true;
        if (this.isBomb) {
            this.c = color(255,0,0);
            // game over
            gameOver();
        } else {
            var num = this.getNumber();
            if (num == 0) {
                this.c = color(255, 255, 255);
                this.revealNeighbors();
            } else {
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
    revealNeighbors() { // only call when the revealed number is a 0 (no bombs as neighbors)
        for (var i = -1; i <= 1; i++) {
            for (var j = -1; j <= 1; j++) {
                if (i == 0 && j == 0) continue;
                var tmpX = this.x + i;
                var tmpY = this.y + j;
                if (this.onGrid(tmpX,tmpY)) {
                    grid[tmpX][tmpY].reveal();
                }
            }
        }
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
                }
            }
        }
        return count;
    }
    onGrid(xx,yy) {
        return !(xx < 0 || xx >= gridSize || yy < 0 || yy >= gridSize);
    }
};
function revealAll() {
    for (var i = 0; i < gridSize; i++) {
        for (var j = 0; j < gridSize; j++) {
            grid[i][j].reveal();
        }
    }
}
function updateCompletion() {
    document.getElementById("completion").innerHTML = (Math.floor(completion) + "/100 (%)");
    
}
function gameOver() {
    content.style.display = "block";
    isGameOver = true;
    var tComp = completion;
    revealAll();
    completion = tComp;
    updateCompletion();
}
function play() {
    completion = 0;
    content.style.display = "none";
    isGameOver = false;
    getNewNumbers();
    initGrid();
}
function getNewNumbers() { // update grid size and bombs
    var newGC = document.getElementById("gs").value;
    if (newTB == "") {
        newGC = 10;
    }
    gridSize = newGC;
    var newTB = Math.floor(((document.getElementById("tb").value)/100) * (gridSize * gridSize));
    if (newTB == "") {
        newTB = 25;
    }
    numBombs = newTB;
    document.getElementById("mapSizeStat").innerHTML = "Size: " + gridSize + "x" + gridSize;
    document.getElementById("bombsStat").innerHTML = "Bombs: " + numBombs;
}
function initGrid() {
    grid = new Array(gridSize);
    for (var i = 0; i < gridSize; i++) { // init grid
        grid[i] = new Array(gridSize);
        for (var j = 0; j < gridSize; j++) {
            grid[i][j] = new Tile(i,j,color(255,0,255));
        }
    }
    setRandomBombs(numBombs);
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