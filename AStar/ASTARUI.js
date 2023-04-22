export function createCanvas(width){
    let canvas = document.createElement("canvas");
    canvas.setAttribute("id", "canvas1");
    canvas.width = width;
    canvas.height = canvas.width;
    return canvas;
}
export function addCanvasToDiv(width, handleClick){
    let canvas = createCanvas(width, handleClick);

    let div = document.createElement("div");
    div.setAttribute("id", "herewillbecanvas"); div.className = "canvas-class";
    div.appendChild(canvas);

    document.body.appendChild(div);
}


export function divInputFields(){
    let div = document.createElement("div");
    div.setAttribute("id", "inputfields");
    div.className = "inputArea";
    document.body.appendChild(div);
}
export function addListToDiv(){
    let elem = document.createElement("ul");
    elem.setAttribute("id", "ulElem");
    document.getElementById("inputfields").appendChild(elem);
}
export function addFields(){
    let ids = new Array("cols", "rows");
    let label, input;
    for(let i = 1; i <= ids.length; i++){
        label = document.createElement("label"); input = document.createElement("input");
        label.htmlFor = ids[i - 1]; label.innerText = ids[i - 1];
        input.setAttribute("id", ids[i - 1]); input.setAttribute("type", "number");input.className = "ul fields";
        document.getElementById("ulElem").append(label, input);
    }
}



export function addButtonContainer(){
    let div = document.createElement("div");
    div.setAttribute("id", "buttons");
    div.className = "buttons";
    document.getElementById("inputfields").appendChild(div);
}
export function createButton(ids, i){
    let button = document.createElement("button");
    button.setAttribute("id", ids[i - 1]);
    button.innerText = ids[i - 1];
    return button;
}
export function appendButtons(){
    let ids = new Array("inBtn", "clear", "startAlg", "startCell", "endCell");
    for(let i = 1; i <= ids.length; i++){
        let button = createButton(ids, i);
        button.setAttribute("id", ids[i - 1]);
        if(i > 2){
            button.className = "mainbutton";
            document.getElementById("inputfields").appendChild(button);
            continue;
        }
        document.getElementById("buttons").appendChild(button);
    }
}
export function addSpeedControllersDiv(){
    let div = document.createElement("div");
    div.setAttribute("id", "speedControllers");
    div.className = "speedControllers";
    document.getElementById("inputfields").appendChild(div);
}
export function addSpeedControllers(){
    let arr = new Array("1", "2", "3", "4", "5");
    for(let i = 1; i <= 5; i++){
        let button = createButton(arr, i);
        button.setAttribute("id", arr[i - 1]);
        document.getElementById("speedControllers").appendChild(button);
    }
}



export function addColorsContainer(){
    let canvas = document.createElement("canvas");
    canvas.setAttribute("id", "colors");
    canvas.className = "colorsCanvas";
    canvas.height = canvas.width / 12;
    document.getElementById("inputfields").appendChild(canvas);
}
export function addColorsToColorsContainer(){
    let canvas = document.getElementById("colors");
    let ctx = canvas.getContext("2d");

    let styles = new Array("rgba(120, 120, 120, 1)", "rgba(10, 22, 14, 1)");

    let dist = 0;
    let step = canvas.width / 2;

    for(let i = 1; i <= 2; i++){
        ctx.fillStyle = styles[i - 1];
        ctx.fillRect(dist, 0, step * i, canvas.height);
        dist = step * i;
    }
}


export function attention(){
    let div = document.createElement("div");
    let spanProcess = document.createElement("span");
    let spanPoint = document.createElement("span");
    let spanDiv1 = document.createElement("div"); spanDiv1.setAttribute("id", "spanDiv1"); spanDiv1.appendChild(spanProcess);
    let spanDiv2 = document.createElement("div"); spanDiv2.setAttribute("id", "spanDiv2"); spanDiv2.appendChild(spanPoint);

    spanProcess.innerText = "In Process"; spanProcess.setAttribute("id", "result");
    spanPoint.setAttribute("id", "currentCell");

    div.setAttribute("id", "information");
    div.className = "new";
    div.append(spanDiv1, spanDiv2);

    document.getElementById("inputfields").appendChild(div);
}
