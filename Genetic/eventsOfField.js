
import { drawField } from "./drawField.js";
import { events, curEvent} from "./eventsOfButton.js";

export {
    WIDTH_FIELD,
    HEIGHT_FIELD,
    LIMIT_CITY,
    RADIUS_CITY,
    canvas,
    field,
    layoutCanvas,
    layoutField,
    alreadyDrawn,
    layoutCanvasLight,
    layoutFieldLight,
    alreadyDrawnLight,
    cities,
    drawEdges
};

// Данные поля
const WIDTH_FIELD = 1000;
const HEIGHT_FIELD = 1000;
const RADIUS_CITY = 10;
const LIMIT_CITY = 50;

let canvas = document.getElementById("field");
let field = canvas.getContext('2d');
canvas.width = WIDTH_FIELD;
canvas.height = HEIGHT_FIELD;

let layoutCanvas = document.createElement("canvas");
layoutCanvas.width = canvas.width;
layoutCanvas.height = canvas.height;
let layoutField = layoutCanvas.getContext("2d");
let alreadyDrawn = {drawn: false};

let layoutCanvasLight = document.createElement("canvas");
layoutCanvasLight.width = 150;
layoutCanvasLight.height = 150;
let layoutFieldLight = layoutCanvasLight.getContext("2d");
let alreadyDrawnLight = {drawn: false};

let scaleX = canvas.width / canvas.clientWidth;
let scaleY = canvas.height / canvas.clientHeight;

let cities = [];

let drawEdges = false;

// Обработка изменения размера поля
export function eventResizeOfField(){
    scaleX = canvas.width / canvas.clientWidth;
    scaleY = canvas.height / canvas.clientHeight;
}

// Обработка поля
export function eventDrawEdges() {
    if(drawEdges) drawEdges = false;
    else drawEdges = true;

    drawField(cities, drawEdges);
}

// добавление городов
export function eventAddCT(event) {
    if(curEvent === events.ADDCT){
        let x = event.offsetX * scaleX;
        let y = event.offsetY * scaleY;

        if(cities.length < LIMIT_CITY){
            cities.push({x, y});
        }
        else {
            alert("Больше 50 городов добавить нельзя")
        }

        drawField(cities, drawEdges);
    }
}

// удаление городов
export function eventDeleteCT(event){
    if(curEvent === events.DELETECT){
        let x = event.offsetX * scaleX;
        let y = event.offsetY * scaleY;

        for(let i = cities.length - 1; i >= 0; i--){
            if((cities[i].x - x)**2 + (cities[i].y - y)**2 <= RADIUS_CITY**2){
                cities.splice(i, 1);
                break;
            }
        }

        drawField(cities, drawEdges);
    }
}

// перемещение городов
let isMouseDown = false;
let indexOfCity = -1;

export function eventMouseDown(event){
    if(curEvent === events.MOVECT) {
        let x = event.offsetX * scaleX;
        let y = event.offsetY * scaleY;

        for(let i = 0; i < cities.length; i++){
            if((cities[i].x - x)**2 + (cities[i].y - y)**2 <= RADIUS_CITY**2){
                isMouseDown = true;
                indexOfCity = i;
                break;
            }
        }
    }
}
export function eventMoveCT(event){
    if(curEvent === events.MOVECT && isMouseDown) {
        let x = event.offsetX * scaleX;
        let y = event.offsetY * scaleY;

        cities[indexOfCity] = {x, y};

        drawField(cities, drawEdges);
    }
}
export function eventMouseUp(){
    if(curEvent === events.MOVECT) {
        isMouseDown = false;
        indexOfCity = -1;
    }
}
export function eventMouseLeave(){
    if(curEvent === events.MOVECT) {
        isMouseDown = false;
        indexOfCity = -1;
    }
}

export function randomCities() {
    cities.length = 0;
    let num = Math.floor(Math.random() * LIMIT_CITY);
    for(let i = 0; i < num; i++) {
        let x = Math.floor(Math.random() * WIDTH_FIELD);
        let y = Math.floor(Math.random() * HEIGHT_FIELD);
        cities[i] = {x, y};
    }
}

randomCities();
drawField(cities, drawEdges);