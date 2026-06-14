import {Cell, GameGrid} from './types';

const getDifficultyConfig = (level: number): { size: number; nodes: number } => {
    let nodes: number;
    if (level <= 3) nodes = 5;
    else if (level <= 6) nodes = 8;
    else if (level <= 9) nodes = 10;
    else if (level <= 12) nodes = 12;
    else nodes = Math.min(12 + Math.floor((level - 12) / 3), 16);
    return {size: 8, nodes};
};

const getNeighbors = (
    row: number,
    col: number,
    size: number,
    visited: boolean[][]
): { row: number; col: number }[] => {
    const dirs = [
        {row: -1, col: 0},
        {row: 1, col: 0},
        {row: 0, col: -1},
        {row: 0, col: 1},
    ];
    return dirs
        .map(d => ({row: row + d.row, col: col + d.col}))
        .filter(
            c =>
                c.row >= 0 &&
                c.row < size &&
                c.col >= 0 &&
                c.col < size &&
                !visited[c.row][c.col]
        );
};

const countOnwardMoves = (
    row: number,
    col: number,
    size: number,
    visited: boolean[][]
): number => {
    return getNeighbors(row, col, size, visited).length;
};

const shuffle = <T>(arr: T[]): T[] => {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
};

const generateHamiltonianPath = (
    size: number
): { row: number; col: number }[] | null => {
    const total = size * size;

    // try multiple random starting points
    for (let attempt = 0; attempt < 20; attempt++) {
        const visited = Array.from({length: size}, () => Array(size).fill(false));
        const path: { row: number; col: number }[] = [];

        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);

        let row = startRow;
        let col = startCol;

        visited[row][col] = true;
        path.push({row, col});

        while (path.length < total) {
            const neighbors = getNeighbors(row, col, size, visited);

            if (neighbors.length === 0) break;

            // Warnsdorff: sort by fewest onward moves, shuffle ties randomly
            const scored = neighbors.map(n => ({
                ...n,
                score: countOnwardMoves(n.row, n.col, size, visited),
            }));

            // shuffle first to randomize ties
            const shuffled = shuffle(scored);
            shuffled.sort((a, b) => a.score - b.score);

            const next = shuffled[0];
            visited[next.row][next.col] = true;
            path.push(next);
            row = next.row;
            col = next.col;
        }

        if (path.length === total) return path;
    }

    return null;
};

const assignZones = (
    path: { row: number; col: number }[],
    size: number,
    nodeCount: number
): number[][] => {
    const zones = Array.from({length: size}, () => Array(size).fill(0));
    const segmentSize = Math.floor(path.length / nodeCount);

    path.forEach((cell, index) => {
        const zone = Math.min(Math.floor(index / segmentSize), nodeCount - 1) + 1;
        zones[cell.row][cell.col] = zone;
    });

    return zones;
};

export const generatePuzzle = (level: number): GameGrid => {
    const {size, nodes: nodeCount} = getDifficultyConfig(level);

    let path: { row: number; col: number }[] | null = null;

    while (!path) {
        path = generateHamiltonianPath(size);
    }

    const step = Math.floor(path.length / (nodeCount - 1));
    const nodeIndices: number[] = [];
    for (let i = 0; i < nodeCount - 1; i++) {
        nodeIndices.push(i * step);
    }
    nodeIndices.push(path.length - 1);

    const nodesMap: Record<string, number> = {};
    nodeIndices.forEach((pathIndex, i) => {
        const cell = path![pathIndex];
        nodesMap[`${cell.row}-${cell.col}`] = i + 1;
    });

    const zones = assignZones(path, size, nodeCount);

    const cells: Cell[][] = Array.from({length: size}, (_, row) =>
        Array.from({length: size}, (_, col) => ({
            row,
            col,
            zone: zones[row][col],
        }))
    );

    return {
        size,
        nodes: nodesMap,
        cells,
        solution: path,
    };
};

export const getDifficultyLabel = (level: number): string => {
    if (level <= 3) return 'EASY';
    if (level <= 6) return 'MEDIUM';
    if (level <= 10) return 'HARD';
    if (level <= 15) return 'EXPERT';
    return 'MASTER';
};