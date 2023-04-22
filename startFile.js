"use strict"

import * as coordinates from "./coordinates.js";

export function init() {
    coordinates.addCoordContainer();
    coordinates.createSpan();
    coordinates.changeSpan();
    setElements(1); setElements(2);
    setButtons();
    document.onmousemove = coordinates.mousemove;
}

function createButton(){
    return document.createElement("button");
}

function setButtons(){
    let links = new Array("AStar/ASTAR", "AntSimulation/ANTS", "Cluster/CLUSTER", "Genetic/GENETIC", "Trees/SOLUTIONSTREE", "NeuralNetrwork/NEURON");
    let names = new Array("ASTAR", "ANTS", "CLUSTER", "GENETIC", "TREE", "NEURON");
    for(let i = 1; i <= 6; i++){
        let elem = createButton();
        elem.setAttribute("id", "button" + i);
        elem.className = "one";
        elem.onclick = function(){
            window.open(links[i - 1] + ".html");
        }
        elem.innerText = names[i - 1];
        if(i <= 3){
            document.getElementById("navigation0").appendChild(elem);
        }
        else{
            document.getElementById("navigation1").appendChild(elem);
        }
    }
}


function createElement(float, i, px, classname){
    let div = document.createElement("div");
    div.setAttribute("id", classname + i);
    div.className = classname; div.style.float = float;
    if(!i){
        div.style.marginLeft = px;
    }
    else{
        div.style.marginRight = px;
    }
    return div;
}

function setElements(CASE){
    let type = new Array("left", "right");
    for(let i = 0; i < 2; i++) {
        switch(CASE) {
            case 1:
                let lamp = createElement(type[i], i, "15px", "lamp");
                document.body.appendChild(lamp);
                break;
            case 2:
                let buttonContainer = createElement(type[i], i, "35px", "navigation");
                document.body.appendChild(buttonContainer);
                break;
        }
    }
}