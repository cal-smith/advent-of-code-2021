import { exec, readLines } from "../helpers";

interface Cave { 
    value: string;
    connections: string[];
}

type Caves = { [key: string]: Cave };

const smallExample = `start-A
start-b
A-c
A-b
b-d
A-end
b-end
`.trim().split("\n");

const largerExaple = `dc-end
HN-start
start-kj
dc-start
dc-HN
LN-dc
HN-end
kj-sa
kj-HN
kj-dc
`.trim().split("\n");

const biggestExample = `fs-end
he-DX
fs-he
start-DX
pj-DX
end-zg
zg-sl
zg-pj
pj-he
RW-he
fs-DX
pj-RW
zg-RW
start-pj
he-WI
zg-he
pj-fs
start-RW
`.trim().split("\n");

const parse = (lines: string[]) => {
    return lines.map(line => {
        return line.split("-");
    });
};

const getCaves = (paths: string[][]) => {
    let caves: Caves = {};
    for (const [start, end] of paths) {
        if (caves[start]) {
            if (!caves[start].connections.includes(end)) {
                caves[start].connections.push(end);
            }
        } else {
            caves[start] = {
                value: start,
                connections: [end]
            };
        }
        if (caves[end]) {
            if (!caves[end].connections.includes(start)) {
                caves[end].connections.push(start);
            }
        } else {
            caves[end] = {
                value: end,
                connections: [start]
            };
        }
    }
    return caves;
};

const walkPart1 = (caves: Caves, cave: Cave, path: string[], collect: string[][]): any => {
    if (cave.value === "end") {
        path.push(cave.value);
        collect.push(path);
        return path;
    }
    if (/[A-Z]/.test(cave.value)) {
        path.push(cave.value);
        return cave.connections.map(newCave => {
            return walkPart1(caves, caves[newCave], Array.from(path), collect);
        });
    }
    if (/[a-z]/.test(cave.value) && !path.includes(cave.value)) {
        path.push(cave.value);
        return cave.connections.map(newCave => {
            return walkPart1(caves, caves[newCave], Array.from(path), collect);
        });
    }
    return null;
};

const walkCavesPart1 = (caves: Caves) => {
    let paths: string[][] = [];
    caves["start"].connections.forEach(cave => {
        walkPart1(caves, caves[cave], ["start"], paths);
    });
    return paths;
};

const canAddSmallCave = (path: string[], cave: Cave) => {
    let counts: any = {};
    for (const c of path) {
        if (/[a-z]/.test(c)) {
            if (counts[c]) {
                counts[c]++;
            } else {
                counts[c] = 1;
            }
        }
    }
    if (counts[cave.value] && counts[cave.value] >= 2) {
        return false;
    }
    for (const [c, count] of Object.entries(counts)) {
        if (counts[cave.value] && counts[c] >= 2) {
            return false;
        }
    }
    return true;
}

const walkPart2 = (caves: Caves, cave: Cave, path: string[], collect: string[][]): any => {
    if (cave.value === "end") {
        path.push(cave.value);
        collect.push(path);
        return path;
    }
    if (/[A-Z]/.test(cave.value)) {
        path.push(cave.value);
        return cave.connections.map(newCave => {
            return walkPart2(caves, caves[newCave], Array.from(path), collect);
        });
    }
    if (cave.value !== "start" && /[a-z]/.test(cave.value) && canAddSmallCave(path, cave)) {
        path.push(cave.value);
        return cave.connections.map(newCave => {
            return walkPart2(caves, caves[newCave], Array.from(path), collect);
        });
    }
    return null;
};

const walkCavesPart2 = (caves: Caves) => {
    let paths: string[][] = [];
    caves["start"].connections.forEach(cave => {
        walkPart2(caves, caves[cave], ["start"], paths);
    });
    return paths;
};

const main = async () => {
    const lines = await readLines("input.txt");
    const caves = getCaves(parse(lines));
    const smallExampleCaves = getCaves(parse(smallExample));
    const largerExampleCaves = getCaves(parse(largerExaple));
    const biggestExampleCaves = getCaves(parse(biggestExample));

    const smallExamplePaths1 = walkCavesPart1(smallExampleCaves);
    const largerExamplePaths1 = walkCavesPart1(largerExampleCaves);
    const biggestExamplePaths1 = walkCavesPart1(biggestExampleCaves);
    const paths1 = walkCavesPart1(caves);

    console.log(`part 1 small example ${smallExamplePaths1.length}`);
    console.log(`part 1 larger example ${largerExamplePaths1.length}`);
    console.log(`part 1 biggest example ${biggestExamplePaths1.length}`);
    console.log(`part 1: ${paths1.length}`);

    const smallExamplePaths2 = walkCavesPart2(smallExampleCaves);
    const largerExamplePaths2 = walkCavesPart2(largerExampleCaves);
    const biggestExamplePaths2 = walkCavesPart2(biggestExampleCaves);
    const paths2 = walkCavesPart2(caves);

    console.log(`part 2 small example ${smallExamplePaths2.length}`);
    console.log(`part 2 larger example ${largerExamplePaths2.length}`);
    console.log(`part 2 biggest example ${biggestExamplePaths2.length}`);
    console.log(`part 2: ${paths2.length}`);
};

exec(main);