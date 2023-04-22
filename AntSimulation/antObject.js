
import { TypeOfItem, TypeOfPheromone } from "./worldObject.js";
import { SIZE_OF_HOME, SIZE_OF_FOOD, infinityFood } from "./eventsOfField.js";
import {
    checkRayCastBarrier,
    checkRayCastBarrierForWorker,
    checkBarrier,
    checkBarrierAround,
    calcDist,
    clampVectorLength,
    normalization,
    getRandomPointInCircle,
    getRandomInt
} from "./auxiliaryFunctions.js"

export let TypeOfAnt = Object.freeze({
    WORKER_NO_FOOD: "WNF",
    WORKER_FOOD: "WF",
    WORKER_DEAD: "WD",
    SCOUT_NO_FOOD: "SNF",
    SCOUT_FOOD: "SF",
    SCOUT_DEAD: "SD"
});

const MAX_SPEED = 50;
const STEER_STRENGTH = 100;
const WANDER_STRENGTH = 1;
const RADIUS_OBSERVE = 10;
const RADIUS_OBSERVE_SCOUT = 20;

class Ant {
    constructor(x, y, type) {
        this.angle = 0;
        this.position = {x: x, y: y};
        this.velocity = {x: 0, y: 0};
        this.desiredDirection = {x: 0, y: 0};
        this.desiredPheromone = TypeOfPheromone.TO_FOOD;
        this.type = type;
        this.distToLastPheromon = 0;
        this.currentConcentration = 0;
        this.distToLastMarker = 0;
        this.currentMarker = 1;
        this.optimisationOfPath = false;
        this.timeToVanishe = 5;
    }

    moveToTarget(target, maxSpeed) {
        this.desiredDirection.x = (target.x - this.position.x);
        this.desiredDirection.y = (target.y - this.position.y);
        this.desiredDirection = normalization(this.desiredDirection);
        this.velocity = clampVectorLength(this.velocity, maxSpeed);
    }
    moveRandom(wanderStrength) {
        let pointInCircle = getRandomPointInCircle();
        this.desiredDirection.x = (this.desiredDirection.x + pointInCircle.x * wanderStrength);
        this.desiredDirection.y = (this.desiredDirection.y + pointInCircle.y * wanderStrength);
        this.desiredDirection = normalization(this.desiredDirection);
    }
    uTurn() {
        this.velocity.x *= -1;
        this.velocity.y *= -1;
        this.desiredDirection.x *= -1;
        this.desiredDirection.y *= -1;
    }
    checkItem (world, coefficientOfFood, coefficientOfHome, coefficientReflections, type, fieldWasUpdated) {
        if(world.grid[Math.floor(this.position.y)][Math.floor(this.position.x)].type === TypeOfItem.FOOD) {
            if(this.desiredPheromone === TypeOfPheromone.TO_FOOD) {
                this.desiredPheromone = TypeOfPheromone.TO_HOME;

                if(type === TypeOfAnt.WORKER_NO_FOOD || type === TypeOfAnt.WORKER_FOOD) {
                    this.type = TypeOfAnt.WORKER_FOOD;
                }

                if(type === TypeOfAnt.SCOUT_NO_FOOD || type === TypeOfAnt.SCOUT_FOOD) {
                    this.type = TypeOfAnt.SCOUT_FOOD;
                }

                this.currentConcentration = world.grid[Math.floor(this.position.y)][Math.floor(this.position.x)].concentrationToFood * coefficientOfFood;

                if(!infinityFood)
                {
                    world.grid[Math.floor(this.position.y)][Math.floor(this.position.x)].amountOfFood--;
                    if (world.grid[Math.floor(this.position.y)][Math.floor(this.position.x)].amountOfFood < 1) {
                        world.grid[Math.floor(this.position.y)][Math.floor(this.position.x)].concentrationToFood = 0;
                        world.grid[Math.floor(this.position.y)][Math.floor(this.position.x)].concentrationToHome = 0;
                        world.grid[Math.floor(this.position.y)][Math.floor(this.position.x)].type = TypeOfItem.NOTHING;
                        fieldWasUpdated.updated = true;

                        let id = world.findItemByCoordinate(Math.floor(this.position.x), Math.floor(this.position.y), world.foods, SIZE_OF_FOOD);
                        if(id !== -1) {
                            world.foods.splice(id, 1);
                            world.countOfFoods--;
                        }
                    }
                }

                this.uTurn();
            }
        }
        else if(world.grid[Math.floor(this.position.y)][Math.floor(this.position.x)].type === TypeOfItem.HOME) {
            if(this.desiredPheromone === TypeOfPheromone.TO_HOME) {
                this.desiredPheromone = TypeOfPheromone.TO_FOOD;

                if(type === TypeOfAnt.WORKER_NO_FOOD || type === TypeOfAnt.WORKER_FOOD) {
                    this.type = TypeOfAnt.WORKER_NO_FOOD;
                }

                if(type === TypeOfAnt.SCOUT_NO_FOOD || type === TypeOfAnt.SCOUT_FOOD) {
                    this.type = TypeOfAnt.SCOUT_NO_FOOD;
                }

                if(getRandomInt(0, 100) < coefficientReflections){
                    this.uTurn();

                    if(type === TypeOfAnt.SCOUT_NO_FOOD) {
                        this.optimisationOfPath = true;
                    }
                }

                if(type === TypeOfAnt.SCOUT_FOOD || type === TypeOfAnt.WORKER_FOOD) {
                    world.foodSupplies += 1;
                }
            }

            this.currentConcentration = world.grid[Math.floor(this.position.y)][Math.floor(this.position.x)].concentrationToHome * coefficientOfHome;
            this.currentMarker = 1;
        }
    }
    dropMarker(grid, type) {
        if (grid[Math.floor(this.position.y)][Math.floor(this.position.x)].type === TypeOfItem.NOTHING ||
            grid[Math.floor(this.position.y)][Math.floor(this.position.x)].type === TypeOfItem.PHEROMONE) {

            if(grid[Math.floor(this.position.y)][Math.floor(this.position.x)].marker < this.currentMarker) {
                grid[Math.floor(this.position.y)][Math.floor(this.position.x)].marker = this.currentMarker;
            }

            this.currentMarker *= 0.985;

            if(this.currentMarker < 0.0005 && type === TypeOfAnt.SCOUT_NO_FOOD) {
                this.desiredPheromone = TypeOfPheromone.TO_HOME;
                this.currentConcentration = 0;
            }

            this.distToLastMarker = 0;
        }
    }
    collision(x, y, maxSpeed, grid) {
        if(grid[y][x].type === TypeOfItem.BARRIER) {
            let diffX = x - Math.floor(this.position.x);
            let diffY = y - Math.floor(this.position.y);

            if(diffX === 0 && diffY === 1) {
                this.velocity.y *= -0.5;
                this.desiredDirection.y *= -0.5;
            }
            else if(diffX === 0 && diffY === -1) {
                this.velocity.y *= -0.5;
                this.desiredDirection.y *= -0.5;
            }
            else if(diffX === -1 && diffY === 0) {
                this.velocity.x *= -0.5;
                this.desiredDirection.x *= -0.5;
            }
            else if(diffX === 1 && diffY === 0) {
                this.velocity.x *= -0.5;
                this.desiredDirection.x *= -0.5;
            }
            else {
                this.uTurn();
            }
        }
        else {
            let direction = normalization(this.velocity);

            if(direction.y > 0.30) direction.y = Math.ceil(direction.y);
            else direction.y = Math.floor(direction.y);

            if(direction.x > 0.30) direction.x = Math.ceil(direction.x);
            else direction.x = Math.floor(direction.x);

            if(grid[y + direction.y][x + direction.x].type === TypeOfItem.BARRIER) {
                let neighborNothing =  checkBarrier({x: x, y: y }, direction, grid);
                if(neighborNothing.length > 0) {
                    let index = getRandomInt(0, neighborNothing.length);
                    this.velocity = clampVectorLength({x: this.velocity.x + neighborNothing[index].x + 0.5, y: this.velocity.y + neighborNothing[index].y + 0.5}, maxSpeed / 3);
                }
            }
        }
    }

    updatePosition(dTime, grid, maxSpeed, steerStrength) {
        let desiredVelocity = {x: 0, y: 0};
        desiredVelocity.x = this.desiredDirection.x * maxSpeed;
        desiredVelocity.y = this.desiredDirection.y * maxSpeed;

        let desiredSteeringForce = {x: 0, y: 0};
        desiredSteeringForce.x = (desiredVelocity.x - this.velocity.x) * steerStrength;
        desiredSteeringForce.y = (desiredVelocity.y - this.velocity.y) * steerStrength;

        let acceleration = clampVectorLength(desiredSteeringForce, steerStrength);

        this.velocity = clampVectorLength({x: this.velocity.x + acceleration.x * dTime, y: this.velocity.y + acceleration.y * dTime}, maxSpeed);

        let gridX = Math.floor(this.position.x + this.velocity.x * dTime);
        let gridY = Math.floor(this.position.y + this.velocity.y * dTime);

        this.collision(gridX, gridY, maxSpeed, grid);

        let newPosition = {x: this.position.x + this.velocity.x * dTime, y: this.position.y + this.velocity.y * dTime};
        this.distToLastPheromon += calcDist(this.position, newPosition);
        this.distToLastMarker += calcDist(this.position, newPosition);
        this.position = newPosition;

        this.angle = Math.atan2(this.velocity.x, -this.velocity.y);
    }
}

export class AntWorker extends Ant {
    constructor(x, y) {
        super(x, y, TypeOfAnt.WORKER_NO_FOOD);
    }

    checkPheromone(typeOfPheromone, X, Y, word) {
        let newPosition = {x: -1, y: -1};
        let bestConcentration = 0;
        let bestConcentrationFood = 0;
        let foundFood = false;
        let bestMarker = 0;
        let bestMarkerPosition = {x: -1, y: -1};
        let pheromones = [];
        let bestLength = 10000;

        let gridX = Math.floor(X);
        let gridY = Math.floor(Y);

        for(let i = -RADIUS_OBSERVE; i <= RADIUS_OBSERVE; i++) {
            for(let j = -RADIUS_OBSERVE; j <= RADIUS_OBSERVE; j++) {
                let direction = normalization(this.velocity);
                let radiusVector =  normalization({x: j, y: i});

                let dot = direction.x * radiusVector.x + direction.y * radiusVector.y;

                if(word.isGridCoordinates(j + gridX, i + gridY) && dot > 0 && i**2 + j**2 <= RADIUS_OBSERVE**1.9 && !checkRayCastBarrierForWorker({x: gridX, y: gridY}, {x: j + gridX, y: i + gridY}, word.grid)) {
                    if (word.grid[i + gridY][j + gridX].type === TypeOfItem.HOME && typeOfPheromone === TypeOfPheromone.TO_HOME) {
                        let id = word.findItemByCoordinate(j + gridX, i + gridY, word.homes, SIZE_OF_HOME);
                        return {x: word.homes[id].x + 0.5, y: word.homes[id].y + 0.5};
                    }
                    else if(word.grid[i + gridY][j + gridX].type === TypeOfItem.FOOD && typeOfPheromone === TypeOfPheromone.TO_FOOD) {
                        foundFood = true;
                        let length = calcDist({x: gridX, y: gridY}, {x: j + gridX, y: i + gridY});
                        if(word.grid[i + gridY][j + gridX].concentrationToFood >= bestConcentrationFood && bestLength >= length) {
                            bestConcentrationFood = word.grid[i + gridY][j + gridX].concentrationToFood;
                            bestLength = length;
                            newPosition = {x: j + gridX + 0.5, y: i + gridY + 0.5};
                        }

                        if(getRandomInt(0, 100) < 2) {
                            return newPosition;
                        }
                    }
                    else if(!foundFood && dot > 0.0 && word.grid[i + gridY][j + gridX].type === TypeOfItem.PHEROMONE) {
                        if(typeOfPheromone === TypeOfPheromone.TO_HOME) {
                            if(word.grid[i + gridY][j + gridX].concentrationToHome > bestConcentration) {
                                bestConcentration = word.grid[i + gridY][j + gridX].concentrationToHome;
                                newPosition = {x: j + gridX + 0.5, y: i + gridY + 0.5};
                                pheromones.push({x: j + gridX + 0.5, y: i + gridY + 0.5, concentration: word.grid[i + gridY][j + gridX].concentrationToHome});
                            }
                        }
                        else if(typeOfPheromone === TypeOfPheromone.TO_FOOD) {
                            if(word.grid[i + gridY][j + gridX].concentrationToFood > bestConcentration) {
                                bestConcentration = word.grid[i + gridY][j + gridX].concentrationToFood;
                                newPosition = {x: j + gridX + 0.5, y: i + gridY + 0.5};
                                pheromones.push({x: j + gridX + 0.5, y: i + gridY + 0.5, concentration: word.grid[i + gridY][j + gridX].concentrationToFood});
                            }
                        }
                    }
                    else if(typeOfPheromone === TypeOfPheromone.TO_HOME) {
                        if(bestMarker < word.grid[i + gridY][j + gridX].marker) {
                            bestMarker = word.grid[i + gridY][j + gridX].marker;
                            bestMarkerPosition = {x: j + gridX + 0.5, y: i + gridY + 0.5};
                        }
                    }
                }
            }
        }

        if(newPosition.x === -1 && newPosition.y === -1 && typeOfPheromone === TypeOfPheromone.TO_HOME) {
            return bestMarkerPosition;
        }

        if(getRandomInt(0, 100) < 5) {
            pheromones.sort((a, b) => b.concentration - a.concentration);

            if(pheromones.length > 2) {
                let index = getRandomInt(1, 3);
                newPosition.x = pheromones[index].x;
                newPosition.y = pheromones[index].y;
            }
        }
        return newPosition;
    }
    dropPheromone(dTime, grid) {
        if (this.desiredPheromone === TypeOfPheromone.TO_FOOD && this.distToLastMarker > 1) {
            this.dropMarker(grid, TypeOfAnt.WORKER_NO_FOOD);
        }

        if(this.distToLastPheromon > RADIUS_OBSERVE / 2) {
            if (grid[Math.floor(this.position.y)][Math.floor(this.position.x)].type === TypeOfItem.NOTHING ||
                grid[Math.floor(this.position.y)][Math.floor(this.position.x)].type === TypeOfItem.PHEROMONE) {
                if (this.currentConcentration >= 0.0005 && this.desiredPheromone === TypeOfPheromone.TO_FOOD ||
                    this.currentConcentration >= 0.00005 && this.desiredPheromone === TypeOfPheromone.TO_HOME) {
                    grid[Math.floor(this.position.y)][Math.floor(this.position.x)].type = TypeOfItem.PHEROMONE;

                    if (this.desiredPheromone === TypeOfPheromone.TO_FOOD) {
                        grid[Math.floor(this.position.y)][Math.floor(this.position.x)].concentrationToHome += this.currentConcentration;

                        if (checkBarrierAround(this.position, grid)) {
                            grid[Math.floor(this.position.y)][Math.floor(this.position.x)].concentrationToHome -= this.currentConcentration / 3;
                        }

                        this.currentConcentration *= (0.85);

                        if (this.currentConcentration < 0.0005) {
                            this.currentConcentration = 0;
                        }
                    } else if (this.desiredPheromone === TypeOfPheromone.TO_HOME) {
                        grid[Math.floor(this.position.y)][Math.floor(this.position.x)].concentrationToFood += this.currentConcentration;

                        if (checkBarrierAround(this.position, grid)) {
                            grid[Math.floor(this.position.y)][Math.floor(this.position.x)].concentrationToFood -= this.currentConcentration / 3;
                        }

                        this.currentConcentration *= (0.85);

                        if (this.currentConcentration < 0.00005) {
                            this.currentConcentration = 0;
                        }
                    }
                }
                this.distToLastPheromon = 0;
            }
        }
    }

    update(dTime, world, fieldWasUpdated) {
        if(this.type === TypeOfAnt.WORKER_DEAD) {
            this.timeToVanishe -= dTime;
            if(this.timeToVanishe <= 0) {
                return true;
            }

            return false;
        }

        let target = this.checkPheromone(this.desiredPheromone, this.position.x, this.position.y, world);

        if(target.x !== -1 && target.y !== -1 && getRandomInt(0, 100) < 95) {
            this.moveToTarget(target, MAX_SPEED / 3);
            this.updatePosition(dTime, world.grid, MAX_SPEED, STEER_STRENGTH * 1.5);
        }
        else {
            this.moveRandom(WANDER_STRENGTH * 0.5);
            this.updatePosition(dTime, world.grid, MAX_SPEED / 1.5, STEER_STRENGTH / 4);
        }

        this.checkItem(world, 1, 1, 95, this.type, fieldWasUpdated);
        this.dropPheromone(dTime, world.grid);

        return false;
    }
}

export class AntScout extends Ant {
    constructor(x, y) {
        super(x, y, TypeOfAnt.SCOUT_NO_FOOD);
    }

    checkPheromone (typeOfPheromone, X, Y, word) {
        let newPosition = {x: -1, y: -1};
        let bestMarker = 0;
        let worstMarkers = [];
        let bestConcentration = 0;
        let bestLength = 10000;
        let foundFood = false;
        let foundBestConcentration = false;

        let gridX = Math.floor(X);
        let gridY = Math.floor(Y);

        for(let i = -RADIUS_OBSERVE_SCOUT; i <= RADIUS_OBSERVE_SCOUT; i++) {
            for(let j = -RADIUS_OBSERVE_SCOUT; j <= RADIUS_OBSERVE_SCOUT; j++) {
                let direction = normalization(this.velocity);
                let radiusVector =  normalization({x: j, y: i});

                let dot = direction.x * radiusVector.x + direction.y * radiusVector.y;

                if(word.isGridCoordinates(j + gridX, i + gridY) && dot > -0.1 && i**2 + j**2 <= RADIUS_OBSERVE_SCOUT**1.9 && !checkRayCastBarrier({x: X, y: Y}, {x: j + gridX + 0.5, y: i + gridY + 0.5}, word.grid)) {
                    if (word.grid[i + gridY][j + gridX].type === TypeOfItem.HOME && typeOfPheromone === TypeOfPheromone.TO_HOME) {
                        let id = word.findItemByCoordinate(j + gridX, i + gridY, word.homes, SIZE_OF_HOME);
                        return {x: word.homes[id].x + 0.5, y: word.homes[id].y + 0.5};
                    }
                    else if(word.grid[i + gridY][j + gridX].type === TypeOfItem.FOOD && typeOfPheromone === TypeOfPheromone.TO_FOOD) {
                        let length = calcDist({x: gridX, y: gridY}, {x: j + gridX, y: i + gridY});
                        if(bestLength >= length) {
                            bestLength = length;
                            newPosition = {x: j + gridX + 0.5, y: i + gridY + 0.5};
                        }
                        foundFood = true;
                    }
                    else if(typeOfPheromone === TypeOfPheromone.TO_HOME) {
                        if(bestMarker < word.grid[i + gridY][j + gridX].marker) {
                            bestMarker = word.grid[i + gridY][j + gridX].marker;
                            newPosition = {x: j + gridX + 0.5, y: i + gridY + 0.5};
                        }
                    }
                    else if (word.grid[i + gridY][j + gridX].type === TypeOfItem.NOTHING && typeOfPheromone === TypeOfPheromone.TO_FOOD) {
                        if(word.grid[i + gridY][j + gridX].marker < this.currentMarker * 0.985**3) {
                            worstMarkers.push({x: j + gridX + 0.5, y: i + gridY + 0.5});
                        }
                    }
                    else if (word.grid[i + gridY][j + gridX].type === TypeOfItem.PHEROMONE && typeOfPheromone === TypeOfPheromone.TO_FOOD && this.optimisationOfPath) {
                        if (word.grid[i + gridY][j + gridX].concentrationToFood > 0.0005 && word.grid[i + gridY][j + gridX].concentrationToHome > 0.0005 &&
                            bestConcentration < word.grid[i + gridY][j + gridX].concentrationToFood) {
                            bestConcentration = word.grid[i + gridY][j + gridX].concentrationToFood;
                            newPosition = {x: j + gridX + 0.5, y: i + gridY + 0.5};
                            foundBestConcentration = true;
                        }
                    }
                }
            }
        }

        if(worstMarkers.length === 0 || this.optimisationOfPath && foundBestConcentration || foundFood) {
            return newPosition;
        }

        let rand = getRandomInt(0, worstMarkers.length);
        return worstMarkers[rand];
    }
    dropPheromone (dTime, grid) {
        if (this.desiredPheromone === TypeOfPheromone.TO_FOOD && this.distToLastMarker > 1) {
            this.dropMarker(grid, TypeOfAnt.SCOUT_NO_FOOD);
        }
        else if(this.desiredPheromone === TypeOfPheromone.TO_HOME && this.distToLastPheromon > RADIUS_OBSERVE / 2){
            if (grid[Math.floor(this.position.y)][Math.floor(this.position.x)].type === TypeOfItem.NOTHING ||
                grid[Math.floor(this.position.y)][Math.floor(this.position.x)].type === TypeOfItem.PHEROMONE) {
                if(this.currentConcentration >= 0.00005) {
                    grid[Math.floor(this.position.y)][Math.floor(this.position.x)].type = TypeOfItem.PHEROMONE;
                    grid[Math.floor(this.position.y)][Math.floor(this.position.x)].concentrationToFood += this.currentConcentration;

                    this.currentConcentration *= 0.9;

                    if (this.currentConcentration < 0.00005) {
                        this.currentConcentration = 0;
                    }

                    this.distToLastPheromon = 0;
                }
            }
        }
    }

    update(dTime, world, fieldWasUpdated) {
        if(this.type === TypeOfAnt.SCOUT_DEAD) {
            this.timeToVanishe -= dTime;
            if(this.timeToVanishe <= 0) {
                return true;
            }

            return false;
        }

        let target = this.checkPheromone(this.desiredPheromone, Math.floor(this.position.x), Math.floor(this.position.y), world);

        if(target.x !== -1 && target.y !== -1) {
            this.moveToTarget(target, MAX_SPEED / 3);
            this.updatePosition(dTime, world.grid, MAX_SPEED / 2, STEER_STRENGTH * 1.5);

            if (this.optimisationOfPath && this.desiredPheromone === TypeOfPheromone.TO_FOOD &&
                world.grid[target.y - 0.5][target.x - 0.5].concentrationToFood > 0.0005 && world.grid[target.y - 0.5][target.x - 0.5].concentrationToHome > 0.0005 &&
                getRandomInt(0, 650) < 1) {
                this.optimisationOfPath = false;
            }
        }
        else
        {
            this.moveRandom(WANDER_STRENGTH * 0.5);
            this.updatePosition(dTime, world.grid, MAX_SPEED / 2, STEER_STRENGTH / 4);
        }

        this.checkItem(world, 6, 0, 50, this.type, fieldWasUpdated);
        this.dropPheromone(dTime, world.grid);

        return false;
    }
}