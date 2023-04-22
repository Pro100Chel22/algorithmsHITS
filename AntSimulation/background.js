
const SIZE_OF_UNIT = 50;

let canvas = document.createElement("canvas");
let field = canvas.getContext("2d");
canvas.width = 1000;
canvas.height = 600;
field.filter = "blur(1px)";

let grid = [];
for(let i = 0; i < canvas.height / SIZE_OF_UNIT; i++) {
    let raw = [];
    for (let j = 0; j < canvas.width / SIZE_OF_UNIT; j++) {
        raw[j] = Math.random();
    }
    grid[i] = raw;
}


let process = setInterval(function () {
    for(let i = 0; i < canvas.height / SIZE_OF_UNIT; i++) {
        for (let j = 0; j < canvas.width / SIZE_OF_UNIT; j++) {
            grid[i][j] -= (Math.random() - 0.5) / 20;
            if(grid[i][j] > 0.7) grid[i][j] = 0.7;
            if(grid[i][j] < 0) grid[i][j] = 0;
        }
    }

    draw();

    let background = canvas.toDataURL('image/jpeg');
    document.body.style.backgroundImage = 'url(' + background + ')';
}, 100);

function draw() {
    field.clearRect(0, 0, canvas.width, canvas.height);
    field.rotate(Math.PI / 500);

    for(let i  = 0; i < canvas.height / SIZE_OF_UNIT; i++) {
        for (let j = 0; j < canvas.width / SIZE_OF_UNIT; j++) {
            field.fillStyle = `rgba(40, 173, 40, ${ grid[i][j]})`;
            field.fillRect(j * SIZE_OF_UNIT, i * SIZE_OF_UNIT, SIZE_OF_UNIT, SIZE_OF_UNIT);
        }
    }
}