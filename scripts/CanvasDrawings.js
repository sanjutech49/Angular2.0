/**
* Draws a lock on the provided canvas element.
*/
function drawLock(ctx, color, number) {
    ctx.clearRect(0, 0, 25, 25);
    ctx.restore(); ctx.save();

    ctx.strokeStyle = ctx.fillStyle = color;

    // Set the line for the arc.
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.arc(12.5, 8, 6, 0, 1 * Math.PI, true);

    // Set the line from the arc to the rectangle - left.
    ctx.moveTo(6.5, 8);
    ctx.lineTo(6.5, 10);

    // Set the line from the arc to the rectangle - right.
    ctx.moveTo(18.5, 8);
    ctx.lineTo(18.5, 10);

    // Draw the lines.
    ctx.stroke();

    // Draw the rectangle.
    ctx.fillRect(3.5, 11, 18.5, 14);

    // Draw the number.
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 11px Arial";
    ctx.fillText(number, 12.5, 22);
}

/**
* Draws a loan position banner on the provided canvas element.
*/
function drawLoanPositionBanner(ctx, color, number) {
    ctx.clearRect(0, 0, 25, 25);
    ctx.restore(); ctx.save();

    roundRect(ctx, 1, 1, 26, 17, 5, true, false, color)   

    // Draw the text.
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.font = "bold 11px Arial";
    ctx.fillText(number, 10, 13);

    var orderedText = "";
    if (number == 1)
        orderedText = "st";
    if (number == 2)
        orderedText = "nd";

    ctx.font = "bold 7px Arial";
    ctx.fillText(orderedText, 16, 10);
}

/**
* Draws a rounded rectangle.
*/
function roundRect(ctx, x, y, width, height, radius, fill, border, color, borderColor) {
    if (typeof border == "undefined")
        border = true;

    if (typeof radius === "undefined")
        radius = 5;

    ctx.strokeStyle = borderColor == undefined ? color : borderColor;
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.lineTo(x + width - radius, y);
    ctx.quadraticCurveTo(x + width, y, x + width, y + radius);
    ctx.lineTo(x + width, y + height - radius);
    ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
    ctx.lineTo(x + radius, y + height);
    ctx.quadraticCurveTo(x, y + height, x, y + height - radius);
    ctx.lineTo(x, y + radius);
    ctx.quadraticCurveTo(x, y, x + radius, y);
    ctx.closePath();
    if (border)
        ctx.stroke();

    if (fill)
        ctx.fill();
}

/**
* Draws a triangle on the provided canvas element under the subtab.
*/
function drawSubTabTriangle(ctx, color) {
    ctx.clearRect(5, 5, 15, 15);
    ctx.restore(); ctx.save();
    // Translate origin
    ctx.translate(15 / 2, 15 / 2);
    ctx.rotate(10 * Math.PI / -13.2);
    ctx.translate(-15 / 2, -15 / 2);
    ctx.fillStyle = color;
    // Filled triangle
    ctx.beginPath();
    ctx.moveTo(5, 5);
    ctx.lineTo(15, 5);
    ctx.lineTo(5, 15);
    ctx.fill();
}

function drawActiveButton(ctx, active,  color, borderColor, additionalColor) {
    ctx.clearRect(0, 0, 21, 23);
    ctx.restore();
    ctx.save();
    ctx.beginPath();
    if (active) {
        //#1FA962
        roundRect(ctx, 6, 4, 15, 15, 3, true, true, color, borderColor);
    } else {
        //#666666
        roundRect(ctx, 1, 4, 15, 15, 3, true, true, color, borderColor);
    }
    ctx.closePath();
    ctx.beginPath();
    if (active) {
        roundRect(ctx, 1, 1, 5, 21, 1, true, true, additionalColor, '#666666');
    } else {
        roundRect(ctx, 15, 1, 5, 21, 1, true, true, additionalColor, '#666666');
    }
    ctx.closePath();
}

function drawMinusPlus(ctx, color, lineColor, isPlus, size) {

    var radius = 12;
    var lineStart = 6;
    var lineLength = 20;
    var endPoint = 13;

    if (size == 'small') {
        radius = 10;
        lineStart = 8;
        lineLength = 18;
    }
    if (size == 'xsmall') {
        radius = 8;
        lineStart = 9.5;
        lineLength = 17.5;
        endPoint = 13.5;
    }
   
    if (!lineColor)
        lineColor = "#FFFFFF";

    ctx.clearRect(0, 0, 26, 26);
    ctx.restore();
    ctx.save();

    ctx.beginPath();
    ctx.fillStyle = ctx.strokeStyle = color;
    ctx.arc(13, 13, radius, 0, 2 * Math.PI);
    ctx.fill();

    ctx.beginPath();
    ctx.lineWidth = size == 'xsmall' ? 1 : 2;
    ctx.strokeStyle = lineColor;
    ctx.moveTo(lineStart, endPoint);
    ctx.lineTo(lineLength, endPoint);
    ctx.stroke();

    if (isPlus == "true") {

        ctx.moveTo(endPoint, lineStart);
        ctx.lineTo(endPoint, lineLength);
        ctx.stroke();
    }

    ctx.closePath();
}