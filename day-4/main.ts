import { readFile } from 'fs/promises';

interface Cell {
    value: number;
    selected: boolean;
}

type Row = Cell[];

type Board = Row[];

const isRowComplete = (row: Row) => {
    return row.every(cell => cell.selected);
};

const isAnyRowComplete = (board: Board) => {
    return board.some(row => isRowComplete(row));
};

const isAnyColumnComplete = (board: Board) => {
    const rowLen = board[0].length;
    for (let i = 0; i < rowLen; i++) {
        let rowSelectedCount = 0;
        for (let row of board) {
            if (row[i].selected) {
                rowSelectedCount++;
            }
        }
        if (rowSelectedCount === board.length) {
            return true;
        }
    }
    return false;
};

const cloneBoard = (board: Board): Board => {
    return board.map(row => row.map(cell => Object.assign({}, cell)));
};

const playBingo = (draws: number[], boards: Board[]): [Board, number][] => {
    let finishedStates: [Board, number][] = [];
    for (const draw of draws) {
        for (const board of boards) {
            for (const row of board) {
                row.forEach(cell => {
                    if (cell.value === draw) {
                        cell.selected = true;
                    }
                });
            }
            if (isAnyRowComplete(board) || isAnyColumnComplete(board)) {
                finishedStates.push([cloneBoard(board), draw]);
                boards = boards.filter(v => v !== board);
            }
        }
    }
    return finishedStates;
};

const sumBoard = (board: Board): number => {
    let sum = 0;
    for (const row of board) {
        for (const cell of row) {
            if (!cell.selected) {
                sum += cell.value;
            }
        }
    }
    return sum;
};

const main = async () => {
    const file = await readFile('./input.txt');
    const lines = file.toString().split('\n');
    const draws = lines.shift()?.split(',').map(v => parseInt(v, 10)) ?? [];
    // remove the extra newline
    lines.shift();
    let boards: Board[] = [];
    let currentParsedBoard = [];
    for (const line of lines) {
        if (line === "") {
            boards.push(currentParsedBoard);
            currentParsedBoard = [];
        } else {
            const parsedLine = line.split(" ").filter(v => v !== "").map(v => ({
                value: parseInt(v, 10), 
                selected: false
            }));
            currentParsedBoard.push(parsedLine);
        }
    }

    const winningBoards = playBingo(draws, boards);
    const [firstCompletedBoard, firstCompletedDraw] = winningBoards[0];
    const [lastCompletedBoard, lastCompletedDraw] = winningBoards[winningBoards.length - 1];

    const firstBoardSum = sumBoard(firstCompletedBoard);
    const lastBoardSum = sumBoard(lastCompletedBoard);

    console.log('part 1:', firstBoardSum * firstCompletedDraw);
    console.log('part 2:', lastBoardSum * lastCompletedDraw);
};

main().then(console.log).catch(console.error);