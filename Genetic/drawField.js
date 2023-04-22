
import {
    RADIUS_CITY,
    field,
    canvas,
    layoutCanvas,
    layoutField,
    alreadyDrawn,
    layoutCanvasLight,
    layoutFieldLight,
    alreadyDrawnLight
} from "./eventsOfField.js"

export function drawField(cities, drawEdges = true, bestPath, drawBestPath = false, lengthOfPath = 0, drawLengthOfPath = false, drawFinish) {
    field.clearRect(0, 0, canvas.width, canvas.height);

    drawLines(50);

    if(drawEdges) {
        for(let i = 0; i < cities.length; i++) {
            for(let j = i + 1; j < cities.length; j++) {
                field.lineWidth = 2;
                field.strokeStyle = "gray";
                field.beginPath();
                field.moveTo(cities[i].x, cities[i].y);
                field.lineTo(cities[j].x, cities[j].y);
                field.stroke();
            }
        }
    }

    if(drawBestPath) {
        drawPath(cities, bestPath);
    }

    for(let i = cities.length - 1; i >= 0; i--) {
        drawCity(cities[i], i);
    }

    let text = "Length: " + lengthOfPath.toString();

    if(drawFinish) {
        text += " - Finish!";
    }

    if(drawLengthOfPath) {
        field.shadowColor = "black";
        field.shadowBlur = 10;
        field.font = '20px Arial';
        field.lineWidth = 4;
        field.strokeStyle = "rgb(0, 0, 0)";
        field.fillStyle = "rgb(200, 200, 200)";
        field.strokeText(text, 7, 20);
        field.fillText(text, 7, 20);
        field.shadowBlur = 0;
    }
}

function drawLines (step) {
    if(!alreadyDrawn.drawn) {
        for (let i = step; i < canvas.width; i += step) {
            layoutField.lineWidth = 0.5;
            layoutField.strokeStyle = "gray";
            layoutField.beginPath();
            layoutField.moveTo(i, 0);
            layoutField.lineTo(i, canvas.height);
            layoutField.stroke();

            layoutField.lineWidth = 1.5;
            layoutField.strokeStyle = "black";
            layoutField.beginPath();
            layoutField.moveTo(i, 0);
            layoutField.lineTo(i, 5);
            layoutField.moveTo(i, canvas.height - 5);
            layoutField.lineTo(i, canvas.height);
            layoutField.stroke();

        }

        for (let i = step; i < canvas.height; i += step) {
            layoutField.lineWidth = 0.5;
            layoutField.strokeStyle = "gray";
            layoutField.beginPath();
            layoutField.moveTo(0, i);
            layoutField.lineTo(canvas.width, i);
            layoutField.stroke();

            layoutField.lineWidth = 1.5;
            layoutField.strokeStyle = "black";
            layoutField.beginPath();
            layoutField.moveTo(0, i);
            layoutField.lineTo(5, i);
            layoutField.moveTo(canvas.width - 5, i);
            layoutField.lineTo(canvas.width, i);
            layoutField.stroke();
        }

        alreadyDrawn.drawn = true;
    }

    field.drawImage(layoutCanvas, 0, 0);
}

function drawPath (cities, path) {
    for (let i = 0; i < path.length; i++) {
        let from = path[i];
        let to = path[(i + 1) % path.length];

        field.lineWidth = 3;
        field.strokeStyle = "black";
        field.beginPath();
        field.moveTo(cities[from].x, cities[from].y);
        field.lineTo(cities[to].x, cities[to].y);
        field.stroke();
    }
}

function drawCity (city, index) {
    if(!alreadyDrawnLight.drawn) {
        layoutFieldLight.lineWidth = 3;
        layoutFieldLight.fillStyle = "yellow";
        layoutFieldLight.strokeStyle = "black";
        layoutFieldLight.beginPath();
        layoutFieldLight.arc(layoutCanvasLight.width / 2, layoutCanvasLight.height / 2, RADIUS_CITY, 0, 2 * Math.PI);
        layoutFieldLight.shadowColor = "white";
        layoutFieldLight.shadowBlur = 60;
        layoutFieldLight.fill();
        layoutFieldLight.fill();
        layoutFieldLight.fill();
        layoutFieldLight.stroke();
        layoutFieldLight.stroke();
        layoutFieldLight.stroke();
        layoutFieldLight.shadowBlur = 0;
        alreadyDrawnLight.drawn = true;
    }

    field.drawImage(layoutCanvasLight, city.x - layoutCanvasLight.width / 2, city.y - layoutCanvasLight.height / 2);

    field.fillStyle = "rgb(0, 0, 0)";
    if(index.toString().length === 1) {
        field.font = '13px Arial';
        field.fillText(index.toString(), city.x - 3.5, city.y + 5);
    }
    else {
        field.font = '11px Arial';
        field.fillText(index.toString(), city.x - 6, city.y + 4);
    }
}