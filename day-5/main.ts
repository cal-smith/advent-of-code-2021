import { readLines } from '../helpers';

type Point = [number, number];

const getHorizontalPoints = (line: any): Point[] => {
    let points: Point[] = [];
    let start = line.start;
    let end = line.end;
    if (start[0] > end[0]) {
        let tmp = start;
        start = end;
        end = tmp;
    }
    const [startX, startY] = start;
    const [endX, _endY] = end;
    const yValue = startY;
    for (let i = startX; i <= endX; i++) {
        points.push([i, yValue]);
    }
    return points;
};

const getVerticalPoints = (line: any): Point[] => {
    let points: Point[] = [];
    let start = line.start;
    let end = line.end;
    if (start[1] > end[1]) {
        let tmp = start;
        start = end;
        end = tmp;
    }
    const [startX, startY] = start;
    const [_endX, endY] = end;
    const xValue = startX;
    for (let i = startY; i <= endY; i++) {
        points.push([xValue, i]);
    }
    return points;
};

const getAnglePoints = (line: any): Point[] => {
    let points: Point[] = [];
    let start = line.start;
    let end = line.end;
    if (start[0] > end[0]) {
        let tmp = start;
        start = end;
        end = tmp;
    }
    const [startX, startY] = start;
    const [endX, endY] = end;
    let j = startY;
    for (let i = startX; i <= endX; i++) {
        points.push([i, j]);
        if (startY < endY) {
            j++;
        } else if (endY < startY) {
            j--;
        }
    }
    return points;
};

const isHorizontal = (line: any): boolean => {
    const [startX, startY] = line.start;
    const [endX, endY] = line.end;
    if (startY === endY) {
        return true;
    }
    return false;
}

const isVertical = (line: any): boolean => {
    const [startX, startY] = line.start;
    const [endX, endY] = line.end;
    if (startX === endX) {
        return true;
    }
    return false;
}

const findIntersections = (lines: any, lineToPoints: (line: any) => Point[]) => {
    const intersections = new Map();
    for (const line of lines) {
        let points: Point[] = lineToPoints(line);

        for (const point of points) {
            const key = point.toString();
            if (intersections.has(key)) {
                intersections.set(key, intersections.get(key) + 1);
            } else {
                intersections.set(key, 1);
            }
        }
    }
    return intersections;
};

const countIntersections = (intersections: Map<string, number>): number => {
    let count = 0;
    for (const [_key, value] of intersections.entries()) {
        if (value > 1) {
            count++;
        }
    }
    return count;
};

const main = async () => {
    const lines = (await readLines('./input.txt')).map(line => {
        const [start, end] = line.split(' -> ');
        return {
            start: start.split(',').map(s => parseInt(s)),
            end: end.split(',').map(s => parseInt(s))
        };
    });

    const straight_intersections = findIntersections(lines, line => {
        if (isHorizontal(line)) {
            return getHorizontalPoints(line);
        } else if (isVertical(line)) {
            return getVerticalPoints(line);
        }
        return [];
    });

    const all_intersections = findIntersections(lines, line => {
        if (isHorizontal(line)) {
            return getHorizontalPoints(line);
        } else if (isVertical(line)) {
            return getVerticalPoints(line);
        }
        return getAnglePoints(line);
    });

    console.log('part 1:', countIntersections(straight_intersections));
    console.log('part 2:', countIntersections(all_intersections));

};
main().then(console.log).catch(console.error);