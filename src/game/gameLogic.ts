import {GameGrid} from './types';

export type SimpleCell = { row: number; col: number };

export const cellKey = (cell: SimpleCell): string => `${cell.row}-${cell.col}`;

export const isAdjacent = (a: SimpleCell, b: SimpleCell): boolean => {
    const rowDiff = Math.abs(a.row - b.row);
    const colDiff = Math.abs(a.col - b.col);
    return (rowDiff === 1 && colDiff === 0) || (rowDiff === 0 && colDiff === 1);
};

export const isInPath = (cell: SimpleCell, path: SimpleCell[]): boolean => {
    return path.some(p => p.row === cell.row && p.col === cell.col);
};

export const getNextExpectedNode = (
    grid: GameGrid,
    path: SimpleCell[]
): number => {
    let maxNode = 0;
    for (const cell of path) {
        const key = cellKey(cell);
        if (grid.nodes[key]) {
            maxNode = Math.max(maxNode, grid.nodes[key]);
        }
    }
    return maxNode + 1;
};

export const canMoveTo = (
    cell: SimpleCell,
    path: SimpleCell[],
    grid: GameGrid
): boolean => {
    if (path.length === 0) return false;

    const last = path[path.length - 1];

    if (!isAdjacent(last, cell)) return false;

    if (isInPath(cell, path)) return false;

    const key = cellKey(cell);
    if (grid.nodes[key]) {
        const nextExpected = getNextExpectedNode(grid, path);
        if (grid.nodes[key] !== nextExpected) return false;
    }

    return true;
};

export const isGameComplete = (
    path: SimpleCell[],
    grid: GameGrid
): boolean => {
    const totalCells = grid.size * grid.size;
    if (path.length !== totalCells) return false;

    const lastCell = path[path.length - 1];
    const lastKey = cellKey(lastCell);
    const maxNode = Math.max(...Object.values(grid.nodes));

    return grid.nodes[lastKey] === maxNode;
};