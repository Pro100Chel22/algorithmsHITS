
import { TypeOfItem } from "./worldObject.js";

export function checkRayCastBarrier(posFrom, posTo, grid) {
    let vectorFromTo = {x: posTo.x - posFrom.x, y: posTo.y - posFrom.y};
    let vecDir = normalization(vectorFromTo);

    for  (let x = (vecDir.x > 0) ? Math.ceil(posFrom.x) : Math.floor(posFrom.x);
         (vecDir.x > 0) ? x <= posFrom.x + vectorFromTo.x: x >= posFrom.x + vectorFromTo.x;
         (vecDir.x > 0) ? x++ : x--) {

        let depth = (x - posFrom.x) / vecDir.x;
        if(Math.abs(depth) > 30 || vecDir.x === 0) break;

        let y = posFrom.y + depth * vecDir.y;

        let gridY = (vecDir.y > 0) ? Math.ceil(y) : Math.floor(y);
        if(grid[gridY][x].type === TypeOfItem.BARRIER) {
            return true;
        }
    }

    for  (let y = (vecDir.y > 0) ? Math.ceil(posFrom.y) : Math.floor(posFrom.y);
          (vecDir.y > 0) ? y <= posFrom.y + vectorFromTo.y: y >= posFrom.y + vectorFromTo.y;
          (vecDir.y > 0) ? y++ : y--) {

        let depth = (y - posFrom.y) / vecDir.y;
        if(Math.abs(depth) > 30 || vecDir.y === 0) break;

        let x = posFrom.x + depth * vecDir.x;

        let gridX = (vecDir.x > 0) ? Math.floor(x) : Math.ceil(x);
        if(grid[y][gridX].type === TypeOfItem.BARRIER) {
            return true;
        }
    }
    return false;
}

export function checkRayCastBarrierForWorker(positionFrom, positionTo, grid) {
    let vectorFromTo = {x: positionTo.x - positionFrom.x, y: positionTo.y - positionFrom.y};
    let length = Math.floor(calcDist({x: 0, y: 0}, vectorFromTo)) + 1;
    let vecDir = normalization(vectorFromTo);
    let vecNormalDir = {x: vecDir.y, y: -vecDir.x};

    for(let i = 0; i < length; i++) {
        let curPosition = {x: vecDir.x * i, y: vecDir.y * i};

        if (grid[Math.floor(curPosition.y) + positionFrom.y][Math.floor(curPosition.x) + positionFrom.x].type === TypeOfItem.BARRIER ||
            grid[Math.floor(curPosition.y + vecNormalDir.y) + positionFrom.y][Math.floor(curPosition.x + vecNormalDir.x) + positionFrom.x].type === TypeOfItem.BARRIER ||
            grid[Math.floor(curPosition.y - vecNormalDir.y) + positionFrom.y][Math.floor(curPosition.x - vecNormalDir.x) + positionFrom.x].type === TypeOfItem.BARRIER) {
            return true;
        }
    }
    return false;
}

export function checkBarrier(position, direction, grid) {
    let cellNothing = []

    for (let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            let radiusVector = normalization({x: j, y: i});
            let dot = direction.x * radiusVector.x + direction.y * radiusVector.y;

            if (dot > 0.4 && grid[position.y + i][position.x + j].type && (i !== 0 || j !== 0)) {
                if (grid[position.y + i][position.x + j].type !== TypeOfItem.BARRIER) {
                    cellNothing.push({x: j, y: i});
                }
            }
        }
    }

    return cellNothing;
}

export function checkBarrierAround(position, grid) {
    return  grid[Math.floor(position.y) + 1][Math.floor(position.x)].type === TypeOfItem.BARRIER ||
            grid[Math.floor(position.y) - 1][Math.floor(position.x)].type === TypeOfItem.BARRIER ||
            grid[Math.floor(position.y)][Math.floor(position.x) + 1].type === TypeOfItem.BARRIER ||
            grid[Math.floor(position.y)][Math.floor(position.x) - 1].type === TypeOfItem.BARRIER;
}

export function calcDist(vectorFirst, vectorSecond) {
    return Math.sqrt((vectorFirst.x - vectorSecond.x)**2 + (vectorFirst.y - vectorSecond.y)**2);
}

export function clampVectorLength(vector, maxLength) {
    const length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);

    if (length > maxLength) {
        const directionX = vector.x / length;
        const directionY = vector.y / length;
        return { x: directionX * maxLength, y: directionY * maxLength };
    }

    return { x: vector.x, y: vector.y };
}

export function normalization(vector) {
    let length = Math.sqrt(vector.x**2 + vector.y**2);

    return {x: vector.x / length, y: vector.y / length};
}

export function getRandomPointInCircle(centerX = 0, centerY = 0, radius = 1) {
    const randomRadius = Math.random() * radius;
    const randomAngle = Math.random() * 2 * Math.PI;

    const x = centerX + randomRadius * Math.cos(randomAngle);
    const y = centerY + randomRadius * Math.sin(randomAngle);

    return {x, y};
}

export function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}