
import { curEvent, events } from "./eventsOfButton.js";
import { drawField } from "./drawField.js";
import { World } from "./worldObject.js";

export {
    WIDTH_FIELD,
    HEIGHT_FIELD,
    SIZE_OF_UNITE,
    SIZE_OF_HOME,
    SIZE_OF_FOOD,
    canvas,
    overlayCanvas,
    overlayCanvasGraphic,
    field,
    overlayField,
    overlayFieldGraphic,
    world,
    seed,
    infinityFood,
    mortalAnts,
    showPheromones,
    showMarkers,
    showAnts,
    showGraphicOfAnts
}

const WIDTH_FIELD = 820;
const HEIGHT_FIELD = 580;
const SIZE_OF_UNITE = 5;
const SIZE_OF_HOME = 4;
const SIZE_OF_FOOD = 3;

// Инициализация
let canvas = document.getElementById("field");
let overlayCanvas = document.createElement('canvas');
let overlayCanvasGraphic = document.createElement('canvas');
let field = canvas.getContext('2d');
let overlayField = overlayCanvas.getContext('2d');
let overlayFieldGraphic = overlayCanvasGraphic.getContext('2d');
canvas.width = WIDTH_FIELD;
canvas.height = HEIGHT_FIELD;
overlayCanvas.width = WIDTH_FIELD;
overlayCanvas.height = HEIGHT_FIELD;
overlayCanvasGraphic.width = 200;
overlayCanvasGraphic.height = 120;

let scaleX = canvas.width / canvas.clientWidth;
let scaleY = canvas.height / canvas.clientHeight;

let world = new World(WIDTH_FIELD / SIZE_OF_UNITE, HEIGHT_FIELD / SIZE_OF_UNITE);

let seed = 0;
let sizeOfColony = 250;
let percentageOfScouts = 20;
let concentrationOfFood = 1;
let concentrationOfHome = 1;
let amountOfFood = 10;
let infinityFood = true;
let mortalAnts = false;
let showPheromones = true;
let showMarkers = false;
let showAnts = true;
let showGraphicOfAnts = false;

let inputSeed = document.getElementById("inputSeed");
inputSeed.value = seed;

let inputSizeOfColony = document.getElementById("inputSizeOfColony");
inputSizeOfColony.value = sizeOfColony;
inputSizeOfColony.min = 1;
inputSizeOfColony.max = 500;

let inputPercentageOfScouts = document.getElementById("inputPercentageOfScouts");
inputPercentageOfScouts.value = percentageOfScouts;
inputPercentageOfScouts.min = 0;
inputPercentageOfScouts.max = 25;

let inputNutritional = document.getElementById("inputNutritional");
inputNutritional.value = concentrationOfFood;
inputNutritional.min = 1;
inputNutritional.max = 10;

let inputAmountOfFood = document.getElementById("inputAmountOfFood");
inputAmountOfFood.value = amountOfFood;
inputAmountOfFood.min = 1;
inputAmountOfFood.max = 1000;

let inputInfinityFood = document.getElementById("inputInfinityFood");
inputInfinityFood.checked = infinityFood;

let inputMortalAnts = document.getElementById("inputMortalAnts");
inputMortalAnts.checked = mortalAnts;

let inputShowPheromones = document.getElementById("inputShowPheromones");
inputShowPheromones.checked = showPheromones;

let inputShowMarkers = document.getElementById("inputShowMarkers");
inputShowMarkers.checked = showMarkers;

let inputShowAnts = document.getElementById("inputShowAnts");
inputShowAnts.checked = showAnts;

let inputShowGraphicOfAnts = document.getElementById("inputShowGraphicOfAnts");
inputShowGraphicOfAnts.checked = showGraphicOfAnts;

// Обработка изменения поля
export function eventResize(){
    scaleX = canvas.width / canvas.clientWidth;
    scaleY = canvas.height / canvas.clientHeight;
}

export function eventApplySettings() {
    seed = Math.floor(inputSeed.value);

    sizeOfColony = inputSizeOfColony.value;
    if(sizeOfColony < 1) {
        sizeOfColony = 1;
        inputSizeOfColony.value = 1;
    }
    else if (sizeOfColony > 500) {
        sizeOfColony = 500;
        inputSizeOfColony.value = 500;
    }

    percentageOfScouts = inputPercentageOfScouts.value;
    if(percentageOfScouts < 0) {
        percentageOfScouts = 0;
        inputPercentageOfScouts.value = 0;
    }
    else if(percentageOfScouts > 25) {
        percentageOfScouts = 25;
        inputPercentageOfScouts.value = 25;
    }

    concentrationOfFood = inputNutritional.value;
    if(concentrationOfFood < 1) {
        concentrationOfFood = 1;
        inputNutritional.value = 0.1;
    }
    else if(concentrationOfFood > 10) {
        concentrationOfFood = 10;
        inputNutritional.value = 10;
    }

    amountOfFood = Math.floor(inputAmountOfFood.value);
    if(amountOfFood < 1) {
        amountOfFood = 1;
        inputAmountOfFood.value = 1;
    }
    else if(amountOfFood > 1000) {
        amountOfFood = 1000;
        inputAmountOfFood.value = 1000;
    }

    infinityFood =  inputInfinityFood.checked;
    mortalAnts = inputMortalAnts.checked;
    showPheromones = inputShowPheromones.checked;
    showMarkers = inputShowMarkers.checked;
    showAnts = inputShowAnts.checked;
    showGraphicOfAnts = inputShowGraphicOfAnts.checked;

    document.getElementById("myDropdown").classList.toggle("show");

    drawField(world, true, true);
}

// Обработка действий добавления еды и колоний и удаления предметов
export function eventAddColony(event) {
    if(curEvent === events.ADD_COLONY) {
        let x = Math.floor(event.offsetX * scaleX / SIZE_OF_UNITE);
        let y = Math.floor(event.offsetY * scaleY / SIZE_OF_UNITE);

        world.addColony(x, y, concentrationOfHome, sizeOfColony, percentageOfScouts);

        drawField(world, true);
    }
}

export function eventAddFood(event) {
    if(curEvent === events.ADD_FOOD) {
        let x = Math.floor(event.offsetX * scaleX / SIZE_OF_UNITE);
        let y = Math.floor(event.offsetY * scaleY / SIZE_OF_UNITE);

        world.addFood(x, y, concentrationOfFood, amountOfFood);

        drawField(world, true);
    }
}

export function eventDelete(event){
    if(curEvent === events.DELETE) {
        let x = Math.floor(event.offsetX * scaleX / SIZE_OF_UNITE);
        let y = Math.floor(event.offsetY * scaleY / SIZE_OF_UNITE);

        world.deleteItem(x, y);

        drawField(world, true);
    }
}

// Обработка добавления препятствия
let isMouseDown = false;

export function eventMouseDown(event) {
    if(curEvent === events.ADD_BARRIER) {
        isMouseDown = true;

        let x = Math.floor(event.offsetX * scaleX / SIZE_OF_UNITE);
        let y = Math.floor(event.offsetY * scaleY / SIZE_OF_UNITE);

        if(!world.addBarrier(x, y)) {
            isMouseDown = false;
        }

        drawField(world, true);
    }
}

export function eventAddBarrier(event) {
    if(curEvent === events.ADD_BARRIER && isMouseDown) {
        let x = Math.floor(event.offsetX * scaleX / SIZE_OF_UNITE);
        let y = Math.floor(event.offsetY * scaleY / SIZE_OF_UNITE);

        if(!world.addBarrier(x, y)) {
            isMouseDown = false;
        }

        drawField(world, true);
    }
}

export function eventMouseUp() {
    if(curEvent === events.ADD_BARRIER) {
        isMouseDown = false;
    }
}

export function eventMouseOut() {
    if(curEvent === events.ADD_BARRIER) {
        isMouseDown = false;
    }
}

world.generateMary(1681587981864);

drawField(world, true, true);