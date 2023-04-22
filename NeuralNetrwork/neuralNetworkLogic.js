import * as UI from "./UI.js";
import * as UILOGIC from "./mainUI_Logic.js"
import {getWeights} from "./weights.js"
import {navigation} from "./navlogic.js";


/*
export function getWeights(){
    return [];
}*/

let newGrid;
let point1 = {
    x: 0,
    y: 0,
}
let point2 = {
    x: 0,
    y: 0,
}
let point3 = {
    x:0,
    y:0,
}
let point4 = {
    x: 0,
    y: 0,
}
const MID_VALUE = 24;

function coord1(){
    newGrid = UILOGIC.grid;
    let hasFoundPoint1 = false;
    for(let j = 0; j < 50; j++){
        for(let i = 0; i < 50; i++){
            if(newGrid[i][j].color === UILOGIC.NUMBER_COLOR){
                if(!hasFoundPoint1) {
                    point1.x = j; point1.y = i;
                    for(let j = 49; j >= 0; j--){
                        for(let i = 49; i >= 0; i--){
                            if(newGrid[i][j].color === UILOGIC.NUMBER_COLOR){
                                point2.x = j; point2.y = i;
                                return;
                            }
                        }
                    }
                }
            }
        }
    }
}
function coord2(){
    for(let i = 0; i < 50; i++){
        for(let j = 0; j < 50; j++){
            if(newGrid[i][j].color === UILOGIC.NUMBER_COLOR){
                point3.x = j; point3.y = i;
                for(let i = 49; i >= 0; i--){
                    for(let j = 49; j >= 0; j--){
                        if(newGrid[i][j].color === UILOGIC.NUMBER_COLOR){
                            point4.x = j; point4.y = i;
                            return;
                        }
                    }
                }
            }
        }
    }
}
function calculateMidValueX(point1, point2){
    return (Math.floor((point1.x + point2.x) / 2));
}
function calculateMidValueY(point3, point4){
    return (Math.floor((point3.y + point4.y) / 2));
}
function findTheDifference(midPoint){
    return MID_VALUE - midPoint;
}
function transformGrid(difference, differenceY){
    for(let i = 0; i < 50; i++){
        for(let j = 0; j < 50; j++){
            if(UILOGIC.grid[i][j].color === UILOGIC.NUMBER_COLOR && UILOGIC.grid[i][j].hasChanged === false){
                UILOGIC.grid[i][j].color = UILOGIC.MAIN_GRID_COLOR;
                UILOGIC.grid[i + differenceY][j + difference].color = UILOGIC.NUMBER_COLOR;
                UILOGIC.grid[i + differenceY][j + difference].hasChanged = true;
            }
        }
    }
}
function convertCanvasNumberToIntArray(){
    let values = new Array(2500); let count = 0;
    for(let i = 0; i < UILOGIC.cols; i++) {
        for (let j = 0; j < UILOGIC.rows; j++) {
            if (UILOGIC.grid[i][j].color === UILOGIC.MAIN_GRID_COLOR)
                values[count++] = 0;
            else if (UILOGIC.grid[i][j].color === UILOGIC.NUMBER_COLOR)
                values[count++] = 255;
        }
    }
    return values;
}

function addListener(){
    coord1();
    coord2();
    console.log(`${point1.y} ${point1.x}\n${point2.y} ${point2.x}`);
    let midPointX = calculateMidValueX(point1, point2); let midPointY = calculateMidValueY(point3, point4);
    console.log(`midPoint of number: ${midPointX}`);
    console.log(`${point3.y} ${point4.y}`);
    let differenceX = findTheDifference(midPointX); let differenceY = findTheDifference(midPointY);

    console.log(`difference between mid of canvas and midPointX: ${differenceX}`);
    console.log(`difference between mid of canvas and midPointY: ${differenceY}`);
    transformGrid(differenceX, differenceY);
    let arr = convertCanvasNumberToIntArray();

    let weights = getWeights();

    console.log(weights.length);

    let resultWeights = new Array(10);

    for(let i = 0; i < 10; i++){
        resultWeights[i] = new Array(2500);
        for(let j = 0; j < 2500; j++){
            resultWeights[i][j] = arr[j] * weights[i][j] * 0.5;
        }
    }

    let answers = new Array(10);

    for(let i = 0; i < 10; i++){
        let sum = 0;
        for(let j = 0; j < 2500; j++){
            sum += resultWeights[i][j];
        }
        answers[i] = sum;
        console.log(answers[i]);
        sum = 0;
    }
    alert(answers.indexOf(Math.max(...answers)));
}

function clearCanvas(){
    for(let i = 0; i < UILOGIC.grid.length; i++){
        for(let j = 0; j < UILOGIC.grid.length; j++){
            UILOGIC.grid[i][j].color = UILOGIC.MAIN_GRID_COLOR;
            UILOGIC.ctx.fillStyle = UILOGIC.MAIN_GRID_COLOR;
            UILOGIC.ctx.fillRect(j, i, 1, 1);
        }
    }
}

function setListeners(){
    document.getElementById("check_number").onclick = addListener;
    document.getElementById("clear").onclick = clearCanvas;
}


export function init(){
    navigation();

    UI.createField(); UI.addCanvasToDiv(); UI.addButtonContainer(); UI.appendButtons();

    UILOGIC.initializeValues(); UILOGIC.colorCanvas(); UILOGIC.addEventListeners();

    setListeners();
}