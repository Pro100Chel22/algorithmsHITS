
export function createField(){
    let div = document.createElement("div");
    div.setAttribute("id", "herewillbecanvas"); div.className = "field";
    document.body.appendChild(div);
}
export function addCanvasToDiv(){
    let canvas = document.createElement("canvas");
    canvas.setAttribute("id", "field");
    canvas.width = 300;
    canvas.height = canvas.width;
    document.getElementById("herewillbecanvas").appendChild(canvas);
}

export function addButtonContainer(){
    let div = document.createElement("div");
    div.setAttribute("id", "buttons");
    div.className = "inputArea";
    document.body.appendChild(div);
}
export function createButton(ids, i){
    let button = document.createElement("button");
    button.setAttribute("id", ids[i - 1]);
    button.innerText = ids[i - 1];
    return button;
}
export function appendButtons(){
    let ids = new Array("check_number", "clear");
    for(let i = 1; i <= ids.length; i++){
        let button = createButton(ids, i);
        button.setAttribute("id", ids[i - 1]);
        button.className = "mainbutton";
        document.getElementById("buttons").appendChild(button);
    }
}

