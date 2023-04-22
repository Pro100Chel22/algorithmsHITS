"use strict"
export function addCoordContainer(){
    let div = document.createElement("div");
    div.setAttribute("id", "spanContainer");
    div.className = "spanHandler";
    document.body.appendChild(div);
}

export function createSpan(){
    let elem = document.createElement("span")
    elem.setAttribute("id", "xy")
    document.getElementById("spanContainer").appendChild(elem);
}
export function changeSpan(){
    document.getElementById("xy").className = "stylish";
}
export function mousemove(event) {
    let mouse_x = 0, mouse_y = 0;
    if (document.addEventListener) {
        mouse_x = event.clientX;
        mouse_y = event.clientY;
    }
    document.getElementById('xy').innerHTML = "x = " + mouse_x + ", y = " + mouse_y;
}