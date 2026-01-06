import { Cell, NO_INPUT, type Grid } from "../types/Akari.js";

function parse(input: any): Grid {
    if (input.type !== "akari") {
        throw new Error(`Invalid puzzle type: ${input.type}`);
    }
    
    const gridData = input.grid;

    const rows = gridData.length;
    const cols = gridData[0].length;
    const cells = gridData.flat().map((cell: string) => {
        const newCell: Cell = new Cell();
        const cellData = {
            isBlack: cell !== ".",
            number: (cell !== "#" && cell !== ".") ? parseInt(cell, 10) : null,
            input: NO_INPUT
        };
        newCell.setData(cellData);
        return newCell;
    });

    return {
        rows,
        cols,
        cells
    }
}

export { parse };