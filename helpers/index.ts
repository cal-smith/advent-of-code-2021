import { readFile } from 'fs/promises';

export const readLines = async (fileName: string): Promise<string[]> => {
    const file = await readFile(fileName);
    return file.toString().split('\n');
};

export const exec = (fn: () => Promise<any>): void => {
    fn().then(v => {
        if (v) { console.log(v); }
    })
    .catch(e => {
        if (e) { console.error(e); }
    });
}