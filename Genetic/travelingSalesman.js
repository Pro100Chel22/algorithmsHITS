
import { drawField } from "./drawField.js";
import { buttonDisable, buttonEnable } from "./eventsOfButton.js";

const START_CITY= 0;
const COEFF_MUTATION = 85;
const MAX_GENERATION = 100000;
const ITERATION_WITHOUT_CHANGES = 100;

let isActive = false;

export function activate() {
    isActive = true;
}

export function deactivate() {
    isActive = false;
}

export function TS(cities) {
    buttonDisable();
    activate();

    let countOfPopulation= (cities.length * 3)**2;
    let population= getStartPopulations(countOfPopulation, cities.length);
    population.sort((a, b) => getLengthOfPath(a, cities) - getLengthOfPath(b, cities));

    let bestPath = population[0];
    drawField(cities, false, bestPath, true, Math.floor(getLengthOfPath(bestPath, cities)), true);

    if(cities.length <= 3) {
        buttonEnable();
        return bestPath;
    }

    let generation = 0;
    let without_changes = 0;
    let process = setInterval(function () {
        if(generation > MAX_GENERATION || without_changes > ITERATION_WITHOUT_CHANGES || !isActive) {
            clearInterval(process);
            buttonEnable();
            deactivate();
            drawField(cities, false, bestPath, true, Math.floor(getLengthOfPath(bestPath, cities)), true, true);
        }

        // Добавление новых хромосом
        population = appendNewChromosome(population, countOfPopulation).slice();

        // Удаление худших хромосом
        population.sort((a, b) => getLengthOfPath(a, cities) - getLengthOfPath(b, cities));
        population.splice(countOfPopulation, population.length);

        if(bestPath.toString() !== population[0].toString()) {
            without_changes = 0;
            bestPath = population[0].slice();
            drawField(cities, false, bestPath, true, Math.floor(getLengthOfPath(bestPath, cities)), true);
        }

        generation++;
        without_changes++;
    }, 0);

    return bestPath;
}

// Вспомогательные функции
function getStartPopulations(countOfPopulations, lengthOfChromosome) {
    let population = [];

    for(let i = 0; i < countOfPopulations; i++) {
        let genes = getGenes(lengthOfChromosome, START_CITY);

        let chromosome = [];
        chromosome[0] = START_CITY;

        for(let j= 1; j < lengthOfChromosome; j++){
            let indexOfGene = getRandomInt(0, genes.length);

            chromosome[j] = genes[indexOfGene];

            genes.splice(indexOfGene, 1);
        }

        population[i] = chromosome;
    }

    return population;
}

function getGenes(lengthOfChromosome, startCity) {
    let genes = [];

    for (let i= 0; i < lengthOfChromosome; i++) {
        if(i !== startCity) {
            genes.push(i);
        }
    }

    return genes;
}

function appendNewChromosome(population, countOfPopulation) {
    let newPopulation = population.slice();

    for(let i = 0; i < countOfPopulation; i++) {
        let parentFirst = population[getRandomInt(0, population.length)].slice(0, population[0].length);
        let parentSecond = population[getRandomInt(0, population.length)].slice(0, population[0].length);

        let counter = 0;
        while (parentFirst.toString() === parentFirst.toString()) {
            counter++;

            parentFirst = population[getRandomInt(0, population.length)].slice(0, population[0].length);
            parentSecond = population[getRandomInt(0, population.length)].slice(0, population[0].length);

            if(counter > 10) break;
        }

        let discontinuity = getRandomInt(1, population[0].length);
        let newChromosomeFirst = crossingParents(parentFirst, parentSecond, discontinuity).slice(0, population[0].length)
        let newChromosomeSecond = crossingParents(parentSecond , parentFirst, discontinuity).slice(0, population[0].length)

        if (getRandomInt(0, 100) < COEFF_MUTATION) {
            newChromosomeFirst = mutation(newChromosomeFirst.slice());
            newChromosomeSecond = mutation(newChromosomeSecond.slice());
        }

        newPopulation[newPopulation.length] = newChromosomeFirst;
        newPopulation[newPopulation.length] = newChromosomeSecond;
    }

    return newPopulation;
}

function crossingParents(parentFirst, parentSecond, discontinuity) {
    let newChromosome = [];
    let index = 0;

    let genes = [];
    for (let i = 0; i < parentFirst.length; i++) {
        genes[i] = false;
    }

    for(let i = 0; i < discontinuity; i++, index++) {
        newChromosome[index] = parentFirst[i];
        genes[parentFirst[i]] = true;
    }

    for(let i = discontinuity; i < parentSecond.length; i++) {
        if(!genes[parentSecond[i]]) {
            newChromosome[index] = parentSecond[i];
            genes[parentSecond[i]] = true;
            index++;
        }
    }

    if(index !== parentFirst.length){
        for(let i = discontinuity; i < parentSecond.length; i++) {
            if(!genes[parentFirst[i]]) {
                newChromosome[index] = parentFirst[i];
                genes[parentFirst[i]] = true;
                index++;
            }
        }
    }

    return newChromosome;
}

function mutation(chromosome) {
    let geneFirst = getRandomInt(1, chromosome.length);
    let geneSecond = getRandomInt(1, chromosome.length);

    if (geneFirst > geneSecond) {
        [geneFirst, geneSecond] = [geneSecond, geneFirst];
    } else if (geneFirst === geneSecond) {
        return chromosome;
    }

    let newChromosome = [];

    let beginLength = geneFirst + 1;
    if(geneSecond + beginLength > chromosome.length) beginLength = chromosome.length - geneSecond;

    newChromosome.push(...chromosome.slice(geneSecond, geneSecond + beginLength));
    newChromosome.push(...chromosome.slice(geneFirst + 1, geneSecond));
    newChromosome.push(...chromosome.slice(0, geneFirst + 1));

    if(newChromosome.length !== chromosome.length) {
        newChromosome.push(...chromosome.slice(newChromosome.length, chromosome.length));
    }

    return newChromosome;
}

function calcDistance(cityFirst, citySecond) {
    return Math.sqrt((cityFirst.x - citySecond.x)**2 + (cityFirst.y - citySecond.y)**2);
}

function getLengthOfPath(path, cities){
    let length= 0;

    for(let i= 0; i < path.length; i++){
        let from = path[i];
        let to = path[(i + 1) % path.length];

        length += calcDistance(cities[from], cities[to]);
    }

    return length;
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}
