
let cols, rows, cellHeight, cellWidth, ctx, canvas;
let grid;
const NUMBER_COLOR = "rgb(2, 176, 103)";
const MAIN_GRID_COLOR = "rgb(15, 17, 28)";


export{
    cols,
    rows,
    cellHeight,
    cellWidth,
    ctx,
    canvas,
    grid,
    NUMBER_COLOR,
    MAIN_GRID_COLOR,
}

export function buildGrid(){
    grid = new Array(cols);
    let cellTempW = 0, cellTempH = 0;
    for(let i = 0; i < cols; i++){
        grid[i] = new Array(rows);
        for(let j = 0; j < rows; j++){
            grid[i][j] = {
                color: MAIN_GRID_COLOR,
                leftWall: cellTempW,
                rightWall: cellTempW + cellHeight,
                top: cellTempH,
                floor: cellTempH + cellHeight,
                i: i,
                j: j,
                hasChanged: false,
            }
            cellTempW += cellWidth;
        }
        cellTempH += cellHeight;
        cellTempW = 0;
    }
}
export function initializeValues(){
    canvas = document.getElementById("field");

    cols = canvas.height / 6; rows = canvas.width / 6;
    cellHeight = canvas.height / cols; cellWidth = canvas.width / rows;

    buildGrid();

    ctx = canvas.getContext("2d");
}
export function colorCanvas(){
    ctx.scale(cellWidth, cellHeight);
    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            let cell = grid[i][j];
            ctx.fillStyle = cell.color;
            ctx.fillRect(j, i, cellWidth, cellHeight);
        }
    }
}



export function checkIfInBounds(x, y){
    return (x >= 0 && x < cols) && (y >= 0 && y < rows);
}
export function getMousePos(struct, e){
    let rect = struct.getBoundingClientRect();
    let factor = canvas.width / rect.width;
    return {x: factor * (e.clientX - rect.left), y: factor * (e.clientY - rect.top)};
}
export function handleClick(e){
    let pos = getMousePos(canvas, e)
    let x = pos.x; let y = pos.y;
    ctx.fillStyle = NUMBER_COLOR;

    for(let i = 0; i < cols; i++){
        for(let j = 0; j < rows; j++){
            if(x > grid[i][j].leftWall && x < grid[i][j].rightWall && y > grid[i][j].top && y < grid[i][j].floor){
                if(checkIfInBounds(j, i + 1)){
                    ctx.fillRect(j, i + 1, 1, 1);
                    grid[i + 1][j].color = NUMBER_COLOR;
                }
                if(checkIfInBounds(j, i + 2)){
                    ctx.fillRect(j, i + 2, 1, 1);
                    grid[i + 2][j].color = NUMBER_COLOR;
                }
                if(checkIfInBounds(j + 1, i)){
                    ctx.fillRect(j + 1, i, 1, 1);
                    grid[i][j + 1].color = NUMBER_COLOR;
                }
                if(checkIfInBounds(j + 2, i)){
                    ctx.fillRect(j + 2, i, 1, 1);
                    grid[i][j + 2].color = NUMBER_COLOR;
                }
                if(checkIfInBounds(j + 1, i + 1)){
                    ctx.fillRect(j + 1, i + 1, 1, 1);
                    grid[i + 1][j + 1].color = NUMBER_COLOR;
                }
                if(checkIfInBounds(j + 2, i + 2)){
                    ctx.fillRect(j + 2, i + 2, 1, 1);
                    grid[i + 2][j + 2].color = NUMBER_COLOR;
                }
                if(checkIfInBounds(j + 1, i + 2)){
                    ctx.fillRect(j + 1, i + 2, 1, 1);
                    grid[i + 2][j + 1].color = NUMBER_COLOR;
                }
                if(checkIfInBounds(j + 2, i + 1)){
                    ctx.fillRect(j + 2, i + 1, 1, 1);
                    grid[i + 1][j + 2].color = NUMBER_COLOR;
                }
                ctx.fillRect(j, i, 1, 1);
                grid[i][j].color = NUMBER_COLOR;
            }
        }
    }
}
export function start(){
    canvas.onmousemove = handleClick;
}
export function stop(){
    canvas.onmousemove = function(){};
}
export function addEventListeners() {
    canvas.onmousedown = start;
    canvas.onmouseup = stop;
 }
 export function removeEventListeners(){
    canvas.onmousedown = function(){};
    canvas.onmouseup = function(){};
 }