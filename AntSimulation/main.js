
import {
    eventButtonAddColony,
    eventButtonAddFood,
    eventButtonGenerateMaze,
    eventButtonDelete,
    eventButtonClear,
    eventButtonStart,
    eventButtonStop,
    eventButtonAddBarrier
} from "./eventsOfButton.js";

import {
    eventAddColony,
    eventResize,
    eventAddFood,
    eventDelete,
    eventMouseUp,
    eventAddBarrier,
    eventMouseDown,
    eventMouseOut,
    eventApplySettings,
    canvas
} from "./eventsOfField.js";

import * as sideBarNavigation from "./sidebarlogic.js";

// Обработка кнопок
document.getElementById("apply").addEventListener("click", eventApplySettings)
document.getElementById("addHome").addEventListener("click", eventButtonAddColony);
document.getElementById("addFood").addEventListener("click", eventButtonAddFood);
document.getElementById("addBarrier").addEventListener("click", eventButtonAddBarrier);
document.getElementById("generateMaze").addEventListener("click", eventButtonGenerateMaze);
document.getElementById("delete").addEventListener("click", eventButtonDelete);
document.getElementById("clear").addEventListener("click", eventButtonClear);
document.getElementById("start").addEventListener("click", eventButtonStart);
document.getElementById("stop").addEventListener("click", eventButtonStop);
document.getElementById("settings").addEventListener("click", function myFunction() {
    document.getElementById("myDropdown").classList.toggle("show");
})

// Обработка изменения поля
window.addEventListener("resize", eventResize);

// Обработка действий добавления еды и колоний и удаления предметов
canvas.addEventListener("mouseup", eventAddColony);
canvas.addEventListener("mouseup", eventAddFood);
canvas.addEventListener("mouseup", eventDelete);

// Обработка действия добавление препятствий
canvas.addEventListener("mousedown", eventMouseDown);
canvas.addEventListener("mousemove", eventAddBarrier);
canvas.addEventListener("mouseup", eventMouseUp);
canvas.addEventListener("mouseleave", eventMouseOut);

sideBarNavigation.navigation();