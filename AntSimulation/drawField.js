
import {
    WIDTH_FIELD,
    HEIGHT_FIELD,
    SIZE_OF_UNITE,
    overlayCanvas,
    overlayCanvasGraphic,
    field,
    overlayField,
    overlayFieldGraphic,
    showMarkers,
    showPheromones,
    showAnts,
    showGraphicOfAnts
} from "./eventsOfField.js";
import { TypeOfItem } from "./worldObject.js";
import { TypeOfAnt } from "./antObject.js";

let colors = Object.freeze({
    BACKGROUND: "rgb(149, 101, 62)",
    HOME: "rgb(240, 0, 0)",
    HOME_SHADOW: "rgb(200, 0, 0)",
    FOOD: "rgb(0, 200, 0)",
    FOOD_SHADOW: "rgb(0, 200, 0)",
    BARRIER: "rgb(93, 64, 39)",
    BARRIER_SHADOW: "rgb(123, 94, 69)",
    NOTHING: "yellow",
})

let antImg = new Image();
antImg.src = "images/antBrown.png";

let antFoodImg = new Image();
antFoodImg.src = "images/antBrownFood.png";

let antScoutImg = new Image();
antScoutImg.src = "images/antRed.png";

let antScoutFoodImg = new Image();
antScoutFoodImg.src = "images/antRed.png";

export function drawField(world, fieldIsUpdated = false, updateGraphic = false, graphic = []) {
    field.fillStyle = colors.BACKGROUND;
    field.fillRect(0, 0, WIDTH_FIELD, HEIGHT_FIELD);

    if(showMarkers || showPheromones) {
        for (let i = 1; i < world.height - 1; i++) {
            for (let j = 1; j < world.width - 1; j++) {
                if (world.grid[i][j].marker > 0.01 && showMarkers) {
                    drawItem(field, j, i, `rgba(100, 40, 40, ${world.grid[i][j].marker})`, "", false);
                }

                if (showPheromones) {
                    switch (world.grid[i][j].type) {
                        case TypeOfItem.PHEROMONE:
                            if (world.grid[i][j].concentrationToHome > 0.01) {
                                drawItem(field, j, i, `rgba(173, 40, 40, ${world.grid[i][j].concentrationToHome})`, "", false);
                            }
                            if (world.grid[i][j].concentrationToFood > 0.01) {
                                drawItem(field, j, i, `rgba(40, 173, 40, ${world.grid[i][j].concentrationToFood})`, "", false);
                            }
                            break;
                        case TypeOfItem.SPECIAL:
                            drawItem(field, j, i, `rgb(255, 182, 0)`, "", false);
                            break;
                    }
                }
            }
        }
    }

    if(showAnts) {
        for (let i = 0; i < world.ants.length; i++) {
            drawAnt(world.ants[i]);
        }
    }

    if(fieldIsUpdated) {
        updateOverlayCanvas(world);
    }

    if(updateGraphic) {
        updateOverlayCanvasGraphic(graphic);
    }

    field.drawImage(overlayCanvas, 0, 0);

    if(showGraphicOfAnts) {
        field.drawImage(overlayCanvasGraphic, 10, 8);
    }
}

function drawAnt(ant) {
    field.save();

    field.translate(ant.position.x * SIZE_OF_UNITE,ant.position.y * SIZE_OF_UNITE);
    field.rotate(ant.angle);
    if(ant.type === TypeOfAnt.WORKER_NO_FOOD) {
        field.drawImage(antImg, -8 / 2, -12 / 2, 8, 12);
    }
    else if (ant.type === TypeOfAnt.WORKER_FOOD) {
        field.drawImage(antFoodImg, -8 / 2, -12 / 2, 8, 12);
    }
    else if (ant.type === TypeOfAnt.WORKER_DEAD) {
        field.globalAlpha = ant.timeToVanishe / 5;
        field.drawImage(antImg, -8 / 2, -12 / 2, 8, 12);
        field.globalAlpha = 1;
    }
    else if (ant.type === TypeOfAnt.SCOUT_FOOD){
        field.drawImage(antScoutImg, -8 / 2, -12 / 2, 8, 12);
    }
    else if(ant.type === TypeOfAnt.SCOUT_NO_FOOD) {
        field.drawImage(antScoutImg, -8 / 2, -12 / 2, 8, 12);
    }
    else if (ant.type === TypeOfAnt.SCOUT_DEAD) {
        field.globalAlpha = ant.timeToVanishe / 5;
        field.drawImage(antScoutFoodImg, -8 / 2, -12 / 2, 8, 12);
        field.globalAlpha = 1;
    }

    field.restore();
}

function updateOverlayCanvas (world) {
    overlayField.clearRect(0, 0, overlayCanvas.width, overlayCanvas.height);

    for(let i  = 0; i < world.height; i++) {
        for (let j = 0; j < world.width; j++) {
            let shadow = false;
            if(world.grid[i + 1][j].type === TypeOfItem.NOTHING || world.grid[i + 1][j].type === TypeOfItem.PHEROMONE) {
                shadow = true;
            }
            switch (world.grid[i][j].type) {
                case TypeOfItem.BARRIER:
                    drawItem(overlayField, j, i, colors.BARRIER, colors.BARRIER_SHADOW, shadow);
                    break;
                case TypeOfItem.HOME:
                    drawItem(overlayField, j, i, colors.HOME, colors.HOME_SHADOW, shadow);
                    break;
                case TypeOfItem.FOOD:
                    drawItem(overlayField, j, i, colors.FOOD, `rgba(0, 160, 0, ${ world.grid[i][j].concentrationToFood })`, shadow);
                    break;
                case !TypeOfItem.NOTHING:
                    drawItem(overlayField, j, i, colors.NOTHING, colors.NOTHING, false);
                    break;
            }
        }
    }
}

function updateOverlayCanvasGraphic (graphic) {
    overlayFieldGraphic.clearRect(0, 0, overlayCanvasGraphic.width, overlayCanvasGraphic.height);
    overlayFieldGraphic.fillStyle = "rgba(0, 0, 0, 0.4)";
    overlayFieldGraphic.fillRect(0, 0, overlayCanvasGraphic.width, overlayCanvasGraphic.height);

    if(graphic.length > 0) {
        let max = 1;
        for(let i = 0; i < graphic.length; i++) {
            if(Math.max(graphic[i].countOfWorkers, graphic[i].countOfScouts) > max) {
                max = Math.max(graphic[i].countOfWorkers, graphic[i].countOfScouts);
            }
        }

        overlayFieldGraphic.strokeStyle = "rgba(89,0,0,0.9)";
        overlayFieldGraphic.beginPath();
        overlayFieldGraphic.moveTo(190 - graphic.length * 1, 110 - Math.floor((graphic[0].countOfWorkers / max) * 100));
        for(let i = 1; i < graphic.length; i++) {
            overlayFieldGraphic.lineTo(190 - graphic.length * 1 + i * 1, 110 - Math.floor((graphic[i].countOfWorkers / max) * 100));
        }
        overlayFieldGraphic.stroke();

        overlayFieldGraphic.strokeStyle = "rgba(166, 0, 0, 0.9)";
        overlayFieldGraphic.beginPath();
        overlayFieldGraphic.moveTo(190 - graphic.length * 1, 110 - Math.floor((graphic[0].countOfScouts / max) * 100));
        for(let i = 1; i < graphic.length; i++) {
            overlayFieldGraphic.lineTo(190 - graphic.length * 1 + i * 1, 110 - Math.floor((graphic[i].countOfScouts  / max) * 100));
        }
        overlayFieldGraphic.stroke();
    }

    overlayFieldGraphic.strokeStyle = "rgba(0, 0, 0, 0.4)";
    overlayFieldGraphic.beginPath();
    overlayFieldGraphic.moveTo(10, 110);
    overlayFieldGraphic.lineTo(190, 110);
    overlayFieldGraphic.stroke();
}

function drawItem(context, x, y, colorItem, colorShadow, drawShadow = true) {
    context.fillStyle =  colorItem;
    context.fillRect(x * SIZE_OF_UNITE, y * SIZE_OF_UNITE, SIZE_OF_UNITE, SIZE_OF_UNITE);

    if(drawShadow) {
        context.fillStyle = colorShadow;
        context.fillRect(x * SIZE_OF_UNITE, (y + 1) * SIZE_OF_UNITE, SIZE_OF_UNITE, 3);
    }
}