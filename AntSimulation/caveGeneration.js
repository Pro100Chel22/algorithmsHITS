
import { TypeOfItem } from "./worldObject.js";

const RANDOM_FILL_PERCENT = 47;

export function generateCave(grid, width, height, seed = 0) {
    const randomInt = customRandomInt(seed);

    for(let i = 1; i < height - 1; i++) {
        for (let j = 1; j < width - 1; j++) {
            if(randomInt(0, 100) < RANDOM_FILL_PERCENT) {
                grid[i][j].type = TypeOfItem.BARRIER;
            }
        }
    }

    for (let i = 0; i < 6; i++) {
        smoothMap(grid, width, height);
    }
}

function smoothMap(grid, width, height) {
    for(let i = 1; i < height - 1; i++) {
        for (let j = 1; j < width - 1; j++) {
            let wallCount = getSurroundWallCount(grid, width, height, j, i);

            if (wallCount > 4) {
                grid[i][j].type = TypeOfItem.BARRIER;
            }
            else if(wallCount < 4) {
                grid[i][j].type = TypeOfItem.NOTHING;
            }
        }
    }
}

function getSurroundWallCount(grid, width, height, x, y) {
    let wallCount = 0;

    for(let i = -1; i <= 1; i++) {
        for (let j = -1; j <= 1; j++) {
            if((i !== 0 || j !== 0)&& 0 <= i + y && i + y < height && 0 <= j + x && j + x < width) {
                if(grid[i + y][j + x].type === TypeOfItem.BARRIER) {
                    wallCount++;
                }
            }
        }
    }

    return wallCount;
}

function customRandomInt(beginSeed = 0) {
    const a = 1664525;
    const c = 1013904223;
    const m = Math.pow(2, 32);

    let seed = beginSeed;
    if(beginSeed === 0) {
        seed = new Date().getTime();
    }
    console.log("seed: ", seed);

    return function(min, max) {
        seed = (a * seed + c) % m;
        return Math.floor((seed / m) * (max - min)) + min;
    };
}