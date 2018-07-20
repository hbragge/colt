var colors = [
    "rgb(255, 0, 0)",
    "rgb(255, 255, 0)",
    "rgb(0, 255, 0)",
    "rgb(0, 255, 255)",
    "rgb(0, 0, 255)",
    "rgb(255, 0, 255)",
]
var target = getTarget();
var squares = document.querySelectorAll(".square");
var colorDisplay = document.querySelector("#target");
var messageDisplay = document.querySelector("#message");

colorDisplay.textContent = target.toUpperCase();

for (var i = 0; i < squares.length; i++) {
    squares[i].style.backgroundColor = colors[i];

    squares[i].addEventListener("click", function() {
        if (this.style.backgroundColor === target) {
            messageDisplay.textContent = "Correct!";
            changeColors(target);
        } else {
            this.style.backgroundColor = "#232323";
            messageDisplay.textContent = "Try again!";
        }
    });
}

function changeColors(color) {
    for (var i = 0; i < squares.length; i++) {
        squares[i].style.backgroundColor = color;
    }
}

function getTarget() {
    var randInd = Math.floor(Math.random() * colors.length);
    console.log(randInd);
    return colors[randInd];
}
