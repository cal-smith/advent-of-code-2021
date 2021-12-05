import { readFile } from 'fs/promises';

export const readLines = async (fileName: string): Promise<string[]> => {
    const file = await readFile(fileName);
    return file.toString().split('\n');
};