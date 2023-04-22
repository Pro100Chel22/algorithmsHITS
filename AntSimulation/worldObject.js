
import { SIZE_OF_HOME, SIZE_OF_FOOD, world, mortalAnts } from "./eventsOfField.js";
import { AntWorker, AntScout, TypeOfAnt } from "./antObject.js";
import { generateCave } from "./caveGeneration.js";
import { getRandomInt } from "./auxiliaryFunctions.js";

export let TypeOfItem = Object.freeze({
    PHEROMONE: "PH",
    HOME: "HM",
    FOOD: "FD",
    BARRIER: "BR",
    NOTHING: "NT",
    SPECIAL: "SP"
});

export let TypeOfPheromone = Object.freeze({
    TO_HOME: "TH",
    TO_FOOD: "TF"
});

const MAX_COUNT_OF_COLONIES = 1;
const MAX_COUNT_OF_FOOD = 10;
const RIGHT_COUNT_OF_FOOD = 40;
const TIME_TO_DEATH = 5;
const PROBABILITY_OF_A_WORKER = 90;

class Item {
    constructor(type, concentrationToHome = 0, concentrationToFood = 0, amountOfFood = 0) {
        this.type = type;
        this.concentrationToHome = concentrationToHome;
        this.concentrationToFood = concentrationToFood;
        this.marker = 0;
        this.amountOfFood = amountOfFood;
    }
}

export class World {
    constructor(width, height) {
        this.clear(width, height);
    }

    isGridCoordinates(x, y) {
        return (0 < y && y < this.height - 1 && 0 < x && x < this.width - 1);
    }
    findItemByCoordinate(x, y, Items, sizeOfItem) {
        for(let i = 0; i < Items.length; i++) {
            if(Math.abs(Items[i].x - x) <= sizeOfItem && Math.abs(Items[i].y - y) <= sizeOfItem) {
                return i;
            }
        }
        return -1;
    }
    noItems(x, y, sizeOfItem) {
        for(let i = -sizeOfItem; i <= sizeOfItem; i++){
            for(let j = -sizeOfItem; j <= sizeOfItem; j++) {
                if(!this.isGridCoordinates(j + x, i + y) || this.grid[i + y][j + x].type !== TypeOfItem.NOTHING && this.grid[i + y][j + x].type !== TypeOfItem.PHEROMONE) {
                    return false;
                }
            }
        }
        return true;
    }
    addItem(x, y, concentration, Item, sizeOfItem, amountOfFood = 0) {
        for(let i = -sizeOfItem; i <= sizeOfItem; i++){
            for(let j = -sizeOfItem; j <= sizeOfItem; j++) {
                if(i**2 + j**2 <= sizeOfItem**2.2) {
                    this.grid[i + y][j + x].type = Item;
                    if(Item === TypeOfItem.HOME) {
                        this.grid[i + y][j + x].concentrationToHome = concentration;
                        this.grid[i + y][j + x].concentrationToFood = 0;
                    }
                    else if (Item === TypeOfItem.FOOD){
                        this.grid[i + y][j + x].concentrationToHome = 0;
                        this.grid[i + y][j + x].concentrationToFood = concentration;
                        this.grid[i + y][j + x].amountOfFood = amountOfFood;
                    }
                }
            }
        }
    }
    deleteFoundItem(x, y, sizeOfItem) {
        for(let i = -sizeOfItem; i <= sizeOfItem; i++){
            for(let j = -sizeOfItem; j <= sizeOfItem; j++) {
                if(i**2 + j**2 <= sizeOfItem**2.2) {
                    this.grid[i + y][j + x].type = TypeOfItem.NOTHING;
                    this.grid[i + y][j + x].concentrationToHome = 0;
                    this.grid[i + y][j + x].concentrationToFood = 0;
                }
            }
        }
    }
    getNewGrid(width, height) {
        let newGrid = [];
        for (let i = 0; i < width; i++) {
            for (let j = 0; j < height; j++){
                let row = [];
                for(let j = 0; j < width; j++) {
                    if(i === 0 || j === 0 || i === height - 1 || j === width - 1) {
                        row[j] = new Item(TypeOfItem.BARRIER);
                    }
                    else {
                        row[j] = new Item(TypeOfItem.NOTHING);
                    }
                }
                newGrid[i] = row;
            }
        }

        return newGrid;
    }

    addColony(x, y, concentration, sizeOfColony, percentageOfScouts) {
        if(this.countOfColonys >= MAX_COUNT_OF_COLONIES) {
            alert("Разместить больше одной колонии нельзя!");
            return;
        }

        if(!this.noItems(x, y, SIZE_OF_HOME)){
            alert("Разместить колонию в этом месте нельзя!");
            return;
        }

        this.addItem(x, y, concentration, TypeOfItem.HOME, SIZE_OF_HOME);

        this.countOfColonys = 1;
        this.homes[0] = {x, y, concentration};

        this.countOfWorkers = Math.ceil( sizeOfColony * (100 - percentageOfScouts) / 100);
        for (let i = 0; i < this.countOfWorkers; i++) {
            this.ants.push(new AntWorker(x, y));
        }

        this.countOfScouts = sizeOfColony - this.countOfWorkers;
        for (let i = 0; i < this.countOfScouts; i++) {
            this.ants.push(new AntScout(x, y));
        }

       this.lastUpadteOfFoodSupplies = 0;
    }
    addFood(x, y, concentration, amountOfFood) {
        if(this.countOfFoods >= MAX_COUNT_OF_FOOD) {
            alert("Разместить больше пяти источников питания нельзя!");
            return;
        }

        if(!this.noItems(x, y, SIZE_OF_FOOD)) {
            alert("Разместить источник питания в этом месте нельзя!");
            return;
        }


        this.addItem(x, y, concentration, TypeOfItem.FOOD, SIZE_OF_FOOD, amountOfFood);

        this.countOfFoods++;
        this.foods[this.foods.length] = {x, y, concentration, amountOfFood};
    }
    addBarrier(x, y) {
        if(!this.isGridCoordinates(x, y) ||
            this.grid[y][x].type !== TypeOfItem.BARRIER && this.grid[y][x].type !== TypeOfItem.NOTHING && this.grid[y][x].type !== TypeOfItem.PHEROMONE && this.grid[y][x].type !== TypeOfItem.SPECIAL) {
            alert("Разместить препятсвие в этом месте нельзя!");
            return false;
        }

        this.grid[y][x].type = TypeOfItem.BARRIER;

        return true;
    }
    generateMary(seed = -1) {
        this.clear(this.width, this.height);

        generateCave(this.grid, this.width, this.height, seed);

        for (let i = 0; i < this.homes.length; i++) {
            this.addItem(this.homes[i].x, this.homes[i].y, this.homes[i].concentration, TypeOfItem.HOME, SIZE_OF_HOME);
        }

        for (let i = 0; i < this.foods.length; i++) {
            this.addItem(this.foods[i].x, this.foods[i].y, this.foods[i].concentration, TypeOfItem.FOOD, SIZE_OF_FOOD);
        }
    }
    deleteItem(x, y) {
        if(this.grid[y][x].type === TypeOfItem.BARRIER) {
            if(!this.isGridCoordinates(x, y)) {
                alert("Удалить это препятствие нельзя!");
                return;
            }
            this.grid[y][x].type = TypeOfItem.NOTHING;
        }
        else if(this.grid[y][x].type === TypeOfItem.HOME) {
            let index = this.findItemByCoordinate(x, y, this.homes, SIZE_OF_HOME);
            if(index !== - 1) {
                this.deleteFoundItem(this.homes[index].x, this.homes[index].y, SIZE_OF_HOME);
                this.countOfColonys = 0;
                this.homes.length = 0;
                this.ants.length = 0;

                for (let i = 1; i < this.height - 1; i++) {
                    for (let j = 1; j < this.width - 1; j++) {
                        if(this.grid[i][j].type === TypeOfItem.NOTHING || this.grid[i][j].type === TypeOfItem.PHEROMONE) {
                            this.grid[i][j].concentrationToFood = 0;
                            this.grid[i][j].concentrationToHome = 0;
                            this.grid[i][j].marker = 0;
                        }
                    }
                }
            }
        }
        else if (this.grid[y][x].type === TypeOfItem.FOOD) {
            let index = this.findItemByCoordinate(x, y, this.foods, SIZE_OF_FOOD);
            if(index !== - 1) {
                this.deleteFoundItem(this.foods[index].x, this.foods[index].y, SIZE_OF_FOOD);
                this.countOfFoods--;
                this.foods.splice(index, 1);
            }
            else {
                this.grid[y][x].concentrationToFood = 0;
                this.grid[y][x].concentrationToHome = 0;
                this.grid[y][x].type = TypeOfItem.NOTHING;
            }
        }
    }
    clear(width, height) {
        this.width = width;
        this.height = height;
        this.countOfColonys = 0;
        this.countOfFoods = 0;
        this.homes = [];
        this.foodSupplies = 0;
        this.lastUpadteOfFoodSupplies = 0;
        this.ants = [];
        this.countOfWorkers = 0;
        this.countOfScouts = 0;
        this.foods = [];

        this.grid = this.getNewGrid(this.width, this.height);
    }
    updatePheromone(dTime) {
        for(let i  = 1; i < this.height - 1; i++) {
            for (let j = 1; j <  this.width - 1; j++) {
                switch (this.grid[i][j].type) {
                    case TypeOfItem.PHEROMONE:
                        if(this.grid[i][j].concentrationToHome < 0.0005) {
                            this.grid[i][j].concentrationToHome = 0;
                        } else {
                            this.grid[i][j].concentrationToHome *= (0.996);
                        }

                        if(this.grid[i][j].concentrationToFood < 0.0005) {
                            this.grid[i][j].concentrationToFood = 0;
                        } else {
                            this.grid[i][j].concentrationToFood *= (0.997);
                        }

                        if(this.grid[i][j].concentrationToFood === 0 && this.grid[i][j].concentrationToHome === 0) {
                            this.grid[i][j].type = TypeOfItem.NOTHING;
                        }
                        break;
                    case TypeOfItem.SPECIAL:
                        this.grid[i][j].type = TypeOfItem.NOTHING;
                        break;
                }
            }
        }
    }
    update(dTime, fieldWasUpdated) {
        if(dTime > 0.01) {
            dTime = 0.01;
        }

        this.updatePheromone(dTime);

        let disappearedAnts = [];
        let lastFoodSupplies = this.foodSupplies;
        for (let i = 0; i < this.ants.length; i++) {
            let disappeared = this.ants[i].update(dTime, this, fieldWasUpdated);

            if(disappeared) {
                disappearedAnts.push(i);
            }
        }

        if(mortalAnts) {
            for(let i = 0; i < disappearedAnts.length; i++) {
                this.ants.splice(disappearedAnts[i], 1);
            }

            this.lastUpadteOfFoodSupplies += 0.01;

            if(lastFoodSupplies !== this.foodSupplies) {
                this.lastUpadteOfFoodSupplies = 0;
            }

            if(world.foodSupplies >= RIGHT_COUNT_OF_FOOD) {
                world.foodSupplies -= Math.floor(world.foodSupplies / RIGHT_COUNT_OF_FOOD) * RIGHT_COUNT_OF_FOOD;

                if(getRandomInt(0, 100) < PROBABILITY_OF_A_WORKER) {
                    this.ants.push(new AntWorker(this.homes[0].x, this.homes[0].y));
                    this.countOfWorkers++;
                }
                else {
                    this.ants.push(new AntScout(this.homes[0].x, this.homes[0].y));
                    this.countOfScouts++;
                }
                console.log(this.countOfWorkers, this.countOfScouts, this.ants.length);
            }

            if(this.lastUpadteOfFoodSupplies > TIME_TO_DEATH) {
                this.lastUpadteOfFoodSupplies = 0;

                let index = getRandomInt(0, this.ants.length);
                if(this.ants[index].type === TypeOfAnt.WORKER_NO_FOOD) {
                    this.countOfWorkers--;
                    this.ants[index].type = TypeOfAnt.WORKER_DEAD;
                }

                if(this.ants[index].type === TypeOfAnt.SCOUT_NO_FOOD) {
                    this.countOfScouts--;
                    this.ants[index].type = TypeOfAnt.SCOUT_DEAD;
                }

                console.log(this.countOfWorkers, this.countOfScouts, this.ants.length);
            }
        }
    }
}