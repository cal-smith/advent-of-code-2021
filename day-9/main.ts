import { exec, readLines } from "../helpers";

const example = `2199943210
3987894921
9856789892
8767896789
9899965678`.split("\n");

interface Point {
    value: number;
    visited: boolean;
    x: number;
    y: number;
}

interface LowPoint {
    point: Point;
    x: number;
    y: number;
}

const parse = (lines: string[]): Point[][] => {
    return lines.map((line, y) => {
        return line.split("").map((c, x) => ({
            value: parseInt(c, 10),
            visited: false,
            x,
            y
        }));
    });
};

const findLowPoints = (heightMap: Point[][]): LowPoint[] => {
    let lowPoints: LowPoint[] = [];
    for (let i = 0; i < heightMap.length; i++) {
        for (let j = 0; j < heightMap[i].length; j++) {
            const value = heightMap[i][j];
            let up = Number.MAX_SAFE_INTEGER;
            let down = Number.MAX_SAFE_INTEGER;
            let left = Number.MAX_SAFE_INTEGER;
            let right = Number.MAX_SAFE_INTEGER;
            if (i > 0) {
                up = heightMap[i - 1][j].value;
            }
            if (i < heightMap.length - 1) {
                down = heightMap[i + 1][j].value;
            }
            if (j > 0) {
                left = heightMap[i][j - 1].value;
            }
            if (j < heightMap[i].length - 1) {
                right = heightMap[i][j + 1].value;
            }
            if ([up, down, left, right].every(direction => value.value < direction)) {
                lowPoints.push({
                    point: value,
                    x: j,
                    y: i
                });
            }
        }
    }
    return lowPoints;
};

const getRiskLevel = (lowPoints: LowPoint[]): number => {
    return lowPoints.reduce((prev, curr) => {
        return prev + curr.point.value + 1;
    }, 0);
};

const walk = (heightMap: Point[][], point: Point) => {    
    if (point.value === 9 || point.visited) {
        return 0;
    }

    point.visited = true;
    let count = 1;

    if (point.x > 0) {
        const nextPoint = heightMap[point.y][point.x - 1];
        count += walk(heightMap, nextPoint);
    }
    if (point.x < heightMap[point.y].length - 1) {
        const nextPoint = heightMap[point.y][point.x + 1];
        count += walk(heightMap, nextPoint);
    }
    if (point.y > 0) {
        const nextPoint = heightMap[point.y - 1][point.x];
        count += walk(heightMap, nextPoint);
    }
    if (point.y < heightMap.length - 1) {
        const nextPoint = heightMap[point.y + 1][point.x];
        count += walk(heightMap, nextPoint);
    }
    
    return count;
}

const findBasinSizes = (heightMap: Point[][], lowPoints: LowPoint[]) => {
    let basinSizes = [];
    for (const lowPoint of lowPoints) {
        basinSizes.push(walk(heightMap, lowPoint.point));
    }
    return basinSizes;
};

const main = async () => {
    const lines = await readLines("input.txt");
    const exampleHeightMap = parse(example);
    console.log(`part 1 example: ${getRiskLevel(findLowPoints(exampleHeightMap))}`);

    const heightMap = parse(lines);
    const lowPoints = findLowPoints(heightMap);
    console.log(`part 1: ${getRiskLevel(lowPoints)}`);

    console.log(`part 2 example: ${findBasinSizes(exampleHeightMap, findLowPoints(exampleHeightMap))}`);
    const basins = findBasinSizes(heightMap, lowPoints).sort((a, b) => b - a);
    console.log(`part 2: ${basins[0] * basins[1] * basins[2]}`);
};

exec(main);