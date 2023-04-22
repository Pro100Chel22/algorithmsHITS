
import { drawField } from "./drawField.js";
import { cities, drawEdges, randomCities} from "./eventsOfField.js";
import { TS, deactivate } from "./travelingSalesman.js";

export { events, curEvent };

const events = Object.freeze({
    ADDCT: "ADDCT",
    DELETECT: "DELETECT",
    MOVECT: "MOVECT",
    CLEARCT: "CLEARCT",
    RANDOMCT: "RANDOMCT",
    STARTTS: "STARTTS",
    STOPTS: "STOPTS",
});

let curEvent = events.ADDCT;

export function buttonDisable() {
    document.getElementById("drawEdges").disabled = true;
    document.getElementById("addct").disabled = true;
    document.getElementById("deletect").disabled = true;
    document.getElementById("movect").disabled = true;
    document.getElementById("clearct").disabled = true;
    document.getElementById("randomct").disabled = true;
    document.getElementById("startts").disabled = true;
}

export function buttonEnable() {
    document.getElementById("drawEdges").disabled = false;
    document.getElementById("addct").disabled = false;
    document.getElementById("deletect").disabled = false;
    document.getElementById("movect").disabled = false;
    document.getElementById("clearct").disabled = false;
    document.getElementById("randomct").disabled = false;
    document.getElementById("startts").disabled = false;
}

// Обработка кнопок
export function eventButtonAddCT() {
    curEvent = events.ADDCT;
}
export function eventButtonDeleteCT() {
    curEvent = events.DELETECT;
}
export function eventButtonMoveCT() {
    curEvent = events.MOVECT;
}
export function eventButtonClearCT() {
    cities.length = 0;
    drawField(cities, drawEdges);
}
// Рандомное добавление городов
export function eventButtonRandomCT() {
    curEvent = events.RANDOMCT;
    randomCities();
    drawField(cities, drawEdges);
}

export function eventButtonStartTS() {
    curEvent = events.STARTTS;

    if(cities.length >= 1) {
        TS(cities);
    } else {
        alert("Добавьте хотя бы один город");
    }
}
export function eventButtonStopTS() {
    curEvent = events.STOPTS;
    deactivate();
}