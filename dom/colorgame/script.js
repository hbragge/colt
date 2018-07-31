var colors;
var target;
var squares = document.querySelectorAll(".square");
var colorDisplay = document.querySelector("#target");
var messageDisplay = document.querySelector("#message");
var h1 = document.querySelector("h1");
var resetButton = document.querySelector("#resetBtn");
var easyButton = document.querySelector("#easyBtn");
var hardButton = document.querySelector("#hardBtn");
var numColorsHard = 6;
var numColorsEasy = 3;
var numColors = numColorsHard;

resetGame(numColorsHard);
hardButton.classList.toggle("selected");

function changeMode(num) {
    if (numColors === num) {
        return;
    }
    numColors = num;
    resetGame();
    hardButton.classList.toggle("selected");
    easyButton.classList.toggle("selected");
}

easyButton.addEventListener("click", function() {
    changeMode(numColorsEasy);
});

hardButton.addEventListener("click", function() {
    changeMode(numColorsHard);
});

resetButton.addEventListener("click", function() {
    resetGame();
});

for (var i = 0; i < squares.length; i++) {
    squares[i].addEventListener("click", function() {
        if (this.style.backgroundColor === target) {
            messageDisplay.textContent = "Correct!";
            changeColors(target);
            resetButton.textContent = "New Game?";
        } else {
            this.style.backgroundColor = "#232323";
            messageDisplay.textContent = "Try again!";
        }
    });
}

function resetGame() {
    colors = generateColors(numColors);
    target = getTarget();
    colorDisplay.textContent = target;
    messageDisplay.textContent = "";
    h1.style.backgroundColor = "";
    resetButton.textContent = "New Colors";

    for (var i = 0; i < squares.length; i++) {
        if (i < numColors) {
            squares[i].style.backgroundColor = colors[i];
            squares[i].style.display = "block";
        } else {
            squares[i].style.display = "none";
        }
    }
}

function changeColors(color) {
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = color;
    }
    h1.style.backgroundColor = color;
}

function getTarget() {
    var randInd = Math.floor(Math.random() * colors.length);
    return colors[randInd];
}

function generateColors(num) {
    var arr = [];
    var r, g, b;
    var rgbMax = 128;
    for (var i = 0; i < num; i++) {
        r = Math.floor(Math.random() * rgbMax);
        g = Math.floor(Math.random() * rgbMax);
        b = Math.floor(Math.random() * rgbMax);
        arr[i] = "rgb(" + r + ", " + g + ", " + b + ")";
    }
    return arr;
}
