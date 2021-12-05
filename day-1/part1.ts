import { readFile } from 'fs/promises';

const main = async () => {
    const file = await readFile('./input.txt');
    const lines = file.toString().split('\n').map(v => parseInt(v));
    const [_, count] = lines.reduce(([prev, count], value) => {
        if (value > prev && prev != 0) {
            return [value, count + 1];
        }
        return [value, count];
    }, [0, 0]);
    console.log('day 1:',count);
};

main().then(console.log).catch(console.error);