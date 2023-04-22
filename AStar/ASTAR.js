"use strict"

import * as coordinates from "./coordinates.js";
import * as UI from "./ASTARUI.js"
import * as sideBarNavigation from "./sidebarlogic.js";

let cols = 10;
let rows = 10;
let mapCells;
let grid;
let cellHeight;
let cellWidth;
let timeToSleep = 50;
let initPoint1 = {
    x: 0,
    y: 0,
};
let initPoint2 = {
    x: 0,
    y: 0,
}
let tempPoint = {
    x: 0,
    y: 0,
}
let cellPosition = {
    x: 0,
    y: 0,
}
let controlCoord1 = cols;
let controlCoord2 = rows;
/*"rgba(25, 45, 105, 1)";*/
const WALL_COLOR = "rgba(10, 22, 14, 1)";
const PATHS_COLOR = "rgba(120, 120, 120, 1)";
const STORED_CELL_COLOR = "rgba(9, 58, 28, 1)";
const CURRENT_CELL_COLOR = "aquamarine";
const START_CELL_COLOR = "gold";
const END_CELL_COLOR = "rgba(43, 218, 206, 1)";
const ERROR_COLOR = "darkred";
const CHOSEN_CELL_COLOR = "purple";
let typeOfColor = PATHS_COLOR;
let previousColor = "";
let tempColor = "";
let cellPosColor = "";


//BUILDING MAP
function initializeStartArr(){
    mapCells = new Array(cols);
    for(let i = 0; i < cols; i++){
        mapCells[i] = new Array(rows);
    }
}
function initializeGrid(){
    cellHeight = Math.floor(document.getElementById("canvas1").height / cols / 2);
    cellWidth = Math.floor(document.getElementById("canvas1").width / cols / 2);
    let cellTempW = 0;
    let cellTempH = 0;
    grid = null;
    grid = new Array(rows * 2 + 1);
    for(let i = 0; i < rows * 2 + 1; i++){
        grid[i] = new Array(cols * 2 + 1);
        for(let j = 0; j < cols * 2 + 1; j++){
            grid[i][j] = {
                color: WALL_COLOR,
                leftWall: cellTempW,
                rightWall: (cellTempW + cellHeight),
                roof: cellTempH,
                floor: (cellTempH + cellWidth),
                i: i,
                j: j,
                f: 0,
                g: 0,
                h: 0,
                neighbours: [],
                parent: null,
            };
            cellTempW += cellWidth;
        }
        cellTempH += cellHeight;
        cellTempW = 0
    }
}
function fillArr(){
    for(let i = 0; i < rows; i++){
        for(let j = 0; j < cols; j++){
            let cell = {
                y: i,
                x: j,
                color: WALL_COLOR,
                status: "unvisited",
                index: [j, i],
                adjacents: [],
                connections: [],
            }
            mapCells[i][j] = cell;
            if(mapCells[i - 1]){
                if(mapCells[i - 1][j]){
                    let upper = mapCells[i - 1][j];
                    cell.adjacents.push(upper);
                    upper.adjacents.push(cell);
                }
            }
            if(mapCells[i][j - 1]){
                let left = mapCells[i][j - 1];
                cell.adjacents.push(left);
                left.adjacents.push(cell);
            }
        }
    }
}
function solveArr(){
    let visited = new Set();
    let frontier = new Set();
    let startY = Math.floor(Math.random() * mapCells.length);
    let startX = Math.floor(Math.random() * mapCells[startY].length);
    let start = mapCells[startY][startX];
    frontier.add(start);
    let current = start;

    while(frontier.size > 0){
        frontier.delete(current);
        visited.add(current);
        current.status = "visited";
        grid[current.y * 2 + 1][current.x * 2 + 1].color = PATHS_COLOR;
        function addToFrontier(adjCells){
            for(let c of adjCells){
                if(c.status === "unvisited"){
                    frontier.add(c);
                    c.status = "frontier";
                    c.connections.push(current);
                }
                else if(c.status === "frontier"){
                    c.connections.push(current);
                }
            }
        }
        addToFrontier(current.adjacents);

        let iterable = [...frontier.values()];
        let randomInd = Math.floor(Math.random() * iterable.length);
        let frontierCell = iterable[randomInd];

        if(frontierCell){
            let randomConn = Math.floor(Math.random() * frontierCell.connections.length);
            let connectX = frontierCell.x + frontierCell.connections[randomConn].x;
            let connectY = frontierCell.y + frontierCell.connections[randomConn].y;
            grid[connectY + 1][connectX + 1].color = PATHS_COLOR;
        }
        current = frontierCell;
    }
}
function draw(scale1, scale2){
    let canvas = document.getElementById("canvas1");

    let ctx = canvas.getContext("2d");
    ctx.scale(scale1, scale2);
    for(let i = 0; i < grid.length - 1; i++){
        for(let j = 0; j < grid[i].length - 1; j++){
            let tempSquare = grid[i][j];
            ctx.fillStyle = tempSquare.color;
            ctx.fillRect(j, i, cellWidth, cellHeight);
        }
    }
}





//ASTAR
function updateNeigboursGrid(grid, i, j){
    if(i < grid.length - 2){
        if(grid[i + 1][j].color !== WALL_COLOR){
            grid[i][j].neighbours.push(grid[i + 1][j]);
        }
    }
    if(i > 1){
        if(grid[i - 1][j].color !== WALL_COLOR){
            grid[i][j].neighbours.push(grid[i - 1][j]);
        }
    }
    if(j < grid[i].length - 2){
        if(grid[i][j + 1].color !== WALL_COLOR){
            grid[i][j].neighbours.push(grid[i][j + 1]);
        }
    }
    if(j > 1){
        if(grid[i][j - 1].color !== WALL_COLOR){
            grid[i][j].neighbours.push(grid[i][j - 1]);
        }
    }
}
function updateGrid(){
    for(let i = 1; i < grid.length - 1; i++){
        for(let j = 1; j < grid[i].length - 1; j++){
            updateNeigboursGrid(grid, i, j);
        }
    }

    for(let i = 1; i < grid.length - 1; i++){
        for(let j = 1; j < grid[i].length - 1; j++){
            console.log(`${i}, ${j}, ${grid[i][j].color}`);
        }
    }
}
function heuristic(position0, position1){
    let d1 = Math.abs(position1.x - position0.x);
    let d2 = Math.abs(position1.y - position0.y);
    return d1 + d2;
}
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
let hasToStop;
function changeColor(color, point, canvas){
    let ctx = canvas.getContext("2d");
    ctx.fillStyle = color;
    ctx.shadowColor = "blue";
    ctx.shadowBlur = 6;
    ctx.fillRect(point.j, point.i, 1, 1);
}
let hasAlreadyBeenStarted = false;
async function solveThisShit(){
    if(hasAlreadyBeenStarted){
        return;
    }
    hasAlreadyBeenStarted = true;
    let canvas = document.getElementById("canvas1");
    if(cellPosition.x && cellPosition.y){
        canvas.getContext("2d").fillStyle = cellPosColor;
        canvas.getContext("2d").fillRect(cellPosition.x, cellPosition.y, 1, 1);
    }
    hasToStop = false;
    let span = document.getElementById("result");
    removeEventListeners();


    let openSet = [];
    let closedSet = [];
    let path = [];
    if(!(initPoint1.x && initPoint1.y) && !(initPoint2.x && initPoint2.y)){
        span.style.color = END_CELL_COLOR;
        span.innerText = "Точки поставь нормально";

        addEventListeners();

        hasAlreadyBeenStarted = false;
        return;
    }
    updateGrid();
    let start = grid[initPoint1.y][initPoint1.x];
    let end = grid[initPoint2.y][initPoint2.x];
    console.log(start.neighbours);
    console.log(start.color);
    openSet.push(start);
    while(openSet.length > 0){
        let lowestInd = 0;
        for(let i = 0; i < openSet.length; i++){
            if(openSet[i].f < openSet[lowestInd].f){
                lowestInd = i;
            }
        }
        let current = openSet[lowestInd];
        if(current === end){
            let temp = current;
            path.push(temp);
            grid[temp.i][temp.j].color = END_CELL_COLOR;
            while(temp.parent){
                path.push(temp.parent);
                temp = temp.parent;
                grid[temp.i][temp.j].color = END_CELL_COLOR;
                changeColor(END_CELL_COLOR, temp, canvas);
                await sleep(50);
                console.log(temp.color);
            }
            for(let i = 0; i < path.length; i++){
                console.log(`${path[i].i}, ${path[i].j}`);
            }
            console.log("cuccess");
            span.style.color = "rgba(50, 255, 73, 0.8)";
            span.innerText = "Success";
            return;
        }
        openSet.splice(lowestInd, 1);
        closedSet.push(current);
        let neighbours = current.neighbours;

        if(grid[current.i][current.j].color !== START_CELL_COLOR){
            grid[current.i][current.j].color = STORED_CELL_COLOR;
            changeColor(STORED_CELL_COLOR, current, canvas);
        }
        await sleep(timeToSleep);

        for(let i = 0; i < neighbours.length; i++){
            if(hasToStop){
                span.innerText = "Algorithm has been interrupted";
                return;
            }
            let neighbour = neighbours[i];
            if(!closedSet.includes(neighbour)){
                let possibleG = current.g + 1;
                if(!openSet.includes(neighbour)){
                    openSet.push(neighbour);
                    grid[neighbour.i][neighbour.j].color = CURRENT_CELL_COLOR;
                    changeColor(CURRENT_CELL_COLOR, neighbour, canvas);
                    await sleep(timeToSleep);
                }
                else if(possibleG >= neighbour.g){
                    continue;
                }
                neighbour.g = possibleG;
                neighbour.h = heuristic(neighbour, end);
                neighbour.f = neighbour.g + neighbour.h;
                neighbour.parent = current;
            }
        }
    }
    span.style.color = ERROR_COLOR;
    span.innerText = "Cant reach the point";
    return;
}





//BUTTONS LOGIC
let awake = function(){
    if(changeSize()){
        let size = cols * 10;
        if(cols <= 50){
            size *= 3;
        }
        let div = document.getElementById("herewillbecanvas");
        div.remove();


        hasToStop = true;
        hasAlreadyBeenStarted = false;


        UI.addCanvasToDiv(size);
        addEventListeners();
        initializeStartArr();
        initializeGrid();
        fillArr();
        solveArr();
        draw(cellWidth, cellHeight);
        let turnToNothing = function(){
            let span = document.getElementById("result");
            let coords = document.getElementById("currentCell");
            initPoint1.x = 0; initPoint1.y = 0;
            initPoint2.x = 0; initPoint2.y = 0;
            cellPosition.x = 0; cellPosition.y = 0;
            typeOfColor = PATHS_COLOR; previousColor = ""; tempColor = ""; cellPosColor = "";
            span.style.color = START_CELL_COLOR;
            span.innerText = "In Process";
            coords.innerText = "";
        }
        turnToNothing();
    }
    else{
        console.log("critical error");
    }
}

function clearAll(){
    let temp = [];
    let cols = document.getElementById("cols");
    let rows = document.getElementById("rows");
    let firstPoint = document.getElementById("firstPoint");
    let secondPoint = document.getElementById("secondPoint");
    temp.push(cols, rows, firstPoint, secondPoint);
    for(let i = 0; i < temp.length; i++){
        temp[i].value = "";
        console.log(temp[i].innerHTML);
    }
}
function initializeStartCell(){
    typeOfColor = START_CELL_COLOR;
    let canvas = document.getElementById("canvas1");
    canvas.onmouseup = function(){}; canvas.onmousedown = function(){}; canvas.onclick = function(){};
    document.getElementById("canvas1").onclick = setStartCell;
}
function initializeEndCell(){
    typeOfColor = END_CELL_COLOR;
    let canvas = document.getElementById("canvas1");
    canvas.onmouseup = function(){}; canvas.onmousedown = function(){}; canvas.onclick = function(){};
    document.getElementById("canvas1").onclick = setStartCell;
}
function setStartCell(e){
    let canvas = document.getElementById("canvas1");
    let pos = getMousePos(canvas, e);

    let ctx = canvas.getContext("2d");

    if(typeOfColor === START_CELL_COLOR)
        tempPoint = initPoint1;
    else
        tempPoint = initPoint2;

    if(tempPoint.x && tempPoint.y){
        previousColor = tempColor;
    }

    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            let cell = grid[i][j];
            if((pos.x > cell.leftWall && pos.x < cell.rightWall) && (pos.y > cell.roof && pos.y < cell.floor)){
                if(previousColor !== ""){
                    grid[tempPoint.y][tempPoint.x].color = previousColor;
                    ctx.fillStyle = previousColor;
                    ctx.fillRect(tempPoint.x, tempPoint.y, 1, 1);
                }
                tempPoint.x = j; tempPoint.y = i;
                tempColor = grid[cell.i][cell.j].color;
                grid[cell.i][cell.j].color = typeOfColor;

                if(typeOfColor === START_CELL_COLOR)
                    initPoint1 = tempPoint;
                else
                    initPoint2 = tempPoint;

                ctx.fillStyle = typeOfColor; ctx.fillRect(j, i, 1, 1);

                document.getElementById("result").innerText = "In Process"; document.getElementById("result").style.color = typeOfColor;
                return;
            }
        }
    }
}





//LISTENERS
let changeSize = function(){
    let val1 = Number(document.getElementById("cols").value);
    let val2 = Number(document.getElementById("rows").value);
    if((val1 instanceof String) || (val2 instanceof String)){
        console.log(typeof val1); console.log(typeof val2);
        return false;
    }
    controlCoord1 = val1; controlCoord2 = val2;
    cols = Math.ceil(val1 / 2); rows = Math.ceil(val2 / 2);
    return true;
}
function getMousePos(struct, e){
    let rect = struct.getBoundingClientRect();
    let factor = struct.height / rect.height;
    return {x: factor * (e.clientX - rect.left), y: factor * (e.clientY - rect.top)};
}
function setOrRemoveWalls(e){
    let canvas = document.getElementById("canvas1");
    let pos = getMousePos(canvas, e);

    let ctx = canvas.getContext("2d");

    let x = pos.x;
    let y = pos.y;
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            let cell = grid[i][j];
            if((x > cell.leftWall && x < cell.rightWall) && (y > cell.roof && y < cell.floor)){
                if(cell.color === START_CELL_COLOR || cell.color === END_CELL_COLOR){
                    return;
                }
                grid[cell.i][cell.j].color = typeOfColor;
                ctx.fillStyle = typeOfColor;
                ctx.fillRect(j, i, 1, 1);
                return;
            }
        }
    }
}
function setColor(e){
    addEventListeners();
    let table = document.getElementById("colors");
    let pos = getMousePos(table, e);
    let x = pos.x;
    typeOfColor = (x > 0 && x < table.width / 2) ? PATHS_COLOR : WALL_COLOR;
}
function start(){
    document.getElementById("canvas1").onmousemove = setOrRemoveWalls;
}
function stop(){
    document.getElementById("canvas1").onmousemove = function(){};
}
function getCellPosition(e){
    let pos = getMousePos(document.getElementById("canvas1"), e);
    let span = document.getElementById("currentCell"); span.style.color = START_CELL_COLOR;

    let canvas = document.getElementById("canvas1");
    let ctx = canvas.getContext("2d");
    for(let i = 0; i < grid.length; i++){
        for(let j = 0; j < grid[i].length; j++){
            let cell = grid[i][j];
            if((pos.x > cell.leftWall && pos.x < cell.rightWall) && (pos.y > cell.roof && pos.y < cell.floor)){
                if(cellPosition.x && cellPosition.y){
                    ctx.fillStyle = cellPosColor;
                    ctx.fillRect(cellPosition.x, cellPosition.y, 1, 1);
                }

                ctx.fillStyle = CHOSEN_CELL_COLOR;
                cellPosition.x = j; cellPosition.y = i;
                cellPosColor = grid[i][j].color;

                if(grid[i][j].color !== START_CELL_COLOR && grid[i][j].color !== END_CELL_COLOR){
                    ctx.fillRect(j, i, 1, 1);
                }
                span.innerText = `Cell coord: ${i};${j}`;
                return;
            }
        }
    }
}
function addEventListeners(){
    let canvas = document.getElementById("canvas1");
    canvas.onmousedown = start; canvas.onmouseup = stop; canvas.onclick = getCellPosition;
    document.getElementById("colors").onclick = setColor;
    document.getElementById("startCell").onclick = initializeStartCell;
    document.getElementById("endCell").onclick = initializeEndCell;
}
function removeEventListeners(){
    let canvas = document.getElementById("canvas1");
    canvas.onmousedown = function(){}; canvas.onmouseup = function(){}; canvas.onclick = function(){};
    document.getElementById("colors").onclick = function(){};
    document.getElementById("startCell").onclick = function(){};
    document.getElementById("endCell").onclick = function(){};
}
function setEventListeners(){
    let inputButton = document.getElementById("inBtn"); inputButton.onclick = awake;
    let clearButton = document.getElementById("clear"); clearButton.onclick = clearAll;
    let solutionButton = document.getElementById("startAlg"); solutionButton.onclick = solveThisShit;
    let initializeStartButton = document.getElementById("startCell"); initializeStartButton.onclick = initializeStartCell;
    let colors = document.getElementById("colors"); colors.onclick = setColor;


    let buttons = new Array("1", "2", "3", "4", "5"); let time = new Array(1, 5, 10, 25, 50);
    for(let i = 0; i < buttons.length; i++){
        document.getElementById(buttons[i]).onclick = function(){
            timeToSleep = time[i];
            console.log(timeToSleep);
        }
    }
}






export function init(){
    coordinates.addCoordContainer();
    coordinates.createSpan();
    coordinates.changeSpan();
    window.onmousemove = coordinates.mousemove;

    UI.addCanvasToDiv(300);
    UI.divInputFields(); UI.addListToDiv(); UI.addFields(); UI.addButtonContainer(); UI.appendButtons(); UI.addSpeedControllersDiv(); UI.addSpeedControllers();
    UI.addColorsContainer(); UI.addColorsToColorsContainer(); UI.attention(); sideBarNavigation.navigation();

    addEventListeners();
    initializeStartArr();
    initializeGrid();
    fillArr();
    solveArr();
    draw(cellWidth, cellHeight);
    setEventListeners();
    document.getElementById("cols").value = 20;
    document.getElementById("rows").value = 20;
}