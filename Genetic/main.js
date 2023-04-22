
import {
    eventButtonAddCT,
    eventButtonDeleteCT,
    eventButtonMoveCT,
    eventButtonClearCT,
    eventButtonRandomCT,
    eventButtonStartTS,
    eventButtonStopTS
} from "./eventsOfButton.js";
import {
    eventResizeOfField,
    eventDrawEdges,
    eventAddCT,
    eventDeleteCT,
    eventMouseDown,
    eventMoveCT,
    eventMouseUp,
    eventMouseLeave,
    canvas
} from "./eventsOfField.js";

import * as sideBarNavigation from "./sidebarlogic.js";

// Обработка кнопок
document.getElementById("drawEdges").addEventListener("click", eventDrawEdges);
document.getElementById("addct").addEventListener("click", eventButtonAddCT);
document.getElementById("deletect").addEventListener("click", eventButtonDeleteCT);
document.getElementById("movect").addEventListener("click", eventButtonMoveCT);
document.getElementById("clearct").addEventListener("click", eventButtonClearCT);
document.getElementById("randomct").addEventListener("click", eventButtonRandomCT);
document.getElementById("startts").addEventListener("click", eventButtonStartTS);
document.getElementById("stopts").addEventListener("click", eventButtonStopTS);

// Обработка окна
window.addEventListener("resize", eventResizeOfField);

// Обработка действий добавление удаление
canvas.addEventListener("mouseup", eventAddCT);
canvas.addEventListener("mouseup", eventDeleteCT);

// Обработка действия перемещение
canvas.addEventListener("mousedown", eventMouseDown);
canvas.addEventListener("mousemove", eventMoveCT);
canvas.addEventListener("mouseup", eventMouseUp);
canvas.addEventListener("mouseleave", eventMouseLeave);

sideBarNavigation.navigation();
