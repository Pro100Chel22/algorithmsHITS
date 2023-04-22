"use strict"

export function createButton(){
    return document.createElement("button");
}

export function createButtonContainer(){
    let elem = document.createElement("div");
    elem.setAttribute("id", "navigation");
    document.body.appendChild(elem);
}
export function changeButtonContainer(){
    document.getElementById("navigation").className = "navigation";
}

export function setButtons(){
    for(let i = 1; i <= 6; i++){
        let elem = createButton();
        elem.setAttribute("id", "button" + i);
        elem.style.border = "1 px solid red";
        document.getElementById("navigation").appendChild(elem);
    }
}