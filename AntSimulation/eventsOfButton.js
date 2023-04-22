
import { HEIGHT_FIELD, SIZE_OF_UNITE, WIDTH_FIELD, world, seed } from "./eventsOfField.js";
import { isActive, activate, deactivate, simulation } from "./antSimulation.js";
import { drawField } from "./drawField.js";

export { events, curEvent };

let events = Object.freeze({
    ADD_COLONY: "AH",
    ADD_FOOD: "AF",
    ADD_BARRIER: "AB",
    GEN_MAZE: "GM",
    DELETE: "DL",
    CLEAR: "CL",
    START: "ST",
    STOP: "SP"
})

let curEvent = events.ADD_COLONY;

export function eventButtonAddColony() {
    curEvent = events.ADD_COLONY;
}

export function eventButtonAddFood() {
    curEvent = events.ADD_FOOD;
}

export function eventButtonAddBarrier() {
    curEvent = events.ADD_BARRIER;
}

export function eventButtonGenerateMaze() {
    curEvent = events.GEN_MAZE;
    world.generateMary(seed);
    drawField(world, true);
}

export function eventButtonDelete() {
    curEvent = events.DELETE;
}

export function eventButtonClear() {
    curEvent = events.CLEAR;
    world.clear(WIDTH_FIELD / SIZE_OF_UNITE, HEIGHT_FIELD / SIZE_OF_UNITE);
    drawField(world, true);
}

export function eventButtonStart() {
    curEvent = events.START;
    if(world.countOfColonys < 1 || world.countOfFoods < 1) {
        alert("На поле должены быть одна колония и хотя бы один источник питания!")
    }
    else if(!isActive) {
        activate();
        simulation(world);
    }
}

export function eventButtonStop() {
    curEvent = events.STOP;
    deactivate();
}

export function deactivateButtons () {
    document.getElementById("addHome").disabled = true;
    document.getElementById("addFood").disabled = true;
    document.getElementById("addBarrier").disabled = true;
    document.getElementById("generateMaze").disabled = true;
    document.getElementById("delete").disabled = true;
    document.getElementById("clear").disabled = true;
    document.getElementById("start").disabled = true;
}

export function activateButtons () {
    document.getElementById("addHome").disabled = false;
    document.getElementById("addFood").disabled = false;
    document.getElementById("addBarrier").disabled = false;
    document.getElementById("generateMaze").disabled = false;
    document.getElementById("delete").disabled = false;
    document.getElementById("clear").disabled = false;
    document.getElementById("start").disabled = false;
}