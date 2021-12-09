import { readFile } from "fs/promises";
import { exec } from "../helpers";

interface Cost {
    cost: number;
    position: number;
}

const parse = (input: string): number[] =>  input.split(",").map(v => parseInt(v, 10));

const sortCost = (cost: Cost[]): Cost[] => {
    const res = Array.from(cost);
    res.sort((a, b) => a.cost - b.cost);
    return res;
}

const fuelSpend = (crabs: number[]): Cost[] => {
    const cost = crabs.map((_, crabPosition) => {
        let cost = 0;
        for (const otherCrabPosition of crabs) {
            cost += Math.abs(crabPosition - otherCrabPosition);
        }
        return {cost: cost, position: crabPosition};
    });
    return cost;
}

const fuelSpendEnhanced = (crabs: number[]): Cost[] => {
    const cost = crabs.map((_, crabPosition) => {
        let cost = 0;
        for (const otherCrabPosition of crabs) {
            const baseCost = Math.abs(crabPosition - otherCrabPosition);
            cost += (baseCost * (baseCost + 1)) / 2;
        }
        return { cost: cost, position: crabPosition };
    });
    return cost;
}

const main = async () => {
    const example = "16,1,2,0,4,2,7,1,2,14";
    const file = await readFile("input.txt");
    const crabs = parse(file.toString());

    const examplePart1Spend = sortCost(fuelSpend(parse(example)))[0];
    console.log(`example part 1: ${examplePart1Spend.cost}`);
    const part1 = sortCost(fuelSpend(crabs))[0];
    console.log(`part 1: ${part1.cost}`);
    const examplePart2Spend = sortCost(fuelSpendEnhanced(parse(example)))[0];
    console.log(`example part 2: ${examplePart2Spend.cost}`);
    const part2 = sortCost(fuelSpendEnhanced(crabs))[0];
    console.log(`part 2: ${part2.cost}`);
};

exec(main);