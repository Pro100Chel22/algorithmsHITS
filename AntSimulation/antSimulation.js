
import { deactivateButtons, activateButtons } from "./eventsOfButton.js";
import { drawField } from "./drawField.js";
import { showGraphicOfAnts } from "./eventsOfField.js";

export { isActive };

let isActive = false;

export function activate () {
    isActive = true;
}

export function deactivate () {
    isActive = false;
}

export function simulation (world) {
    deactivateButtons();

    let graphic = [];
    let lastUpdateGraphic = 0;
    let last = performance.now() / 1000;
    let process = setInterval(function (){
        if(!isActive || world.ants <= 0) {
            clearInterval(process);
            activateButtons();
            deactivate();
            if(world.ants <= 0) {
                alert("В колонии нет муравьев!");
            }
        }

        let cur = performance.now() / 1000;

        let dTime = cur - last;
        let fieldWasUpdated = {updated: false};
        world.update(dTime, fieldWasUpdated);

        lastUpdateGraphic += dTime;
        let updateGraphic = false;
        if(lastUpdateGraphic > 0.5) {
            updateGraphic = true;
            lastUpdateGraphic = 0;

            graphic.push({countOfWorkers: world.countOfWorkers, countOfScouts: world.countOfScouts});

            if(graphic.length > 180) {
                graphic.splice(0, 1);
            }
        }
        drawField(world, fieldWasUpdated.updated, updateGraphic, graphic);

        last = cur;
    }, 0);
}