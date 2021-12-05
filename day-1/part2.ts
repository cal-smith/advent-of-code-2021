import { readFile } from 'fs/promises';

const sum = (array: number[]) => array.reduce((acc, v) => acc + v, 0);

const main = async () => {
    const file = await readFile('./input.txt');
    const lines = file.toString().split('\n').map(v => parseInt(v));
    let window = [];
    let count = 0;
    for (const line of lines) {
        window.push(line);
        if (window.length > 4) {
            window.shift();
        }
        const a = sum(window.slice(0, 3));
        const b = sum(window.slice(1));
        if (b > a) {
            count++;
        }
    }
    console.log('day 2:', count);
};

main().then(console.log).catch(console.error);