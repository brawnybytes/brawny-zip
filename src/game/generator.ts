import { Cell, GameGrid, Walls } from './types';

const getDifficultyConfig = (level: number): { size: number; nodes: number; walls: number } => {
    let nodes: number;
    let walls: number;
    if (level <= 3) { nodes = 5; walls = 0; }
    else if (level <= 6) { nodes = 8; walls = 4; }
    else if (level <= 9) { nodes = 10; walls = 6; }
    else if (level <= 12) { nodes = 12; walls = 8; }
    else { nodes = Math.min(12 + Math.floor((level - 12) / 3), 16); walls = 10; }
    return { size: 8, nodes, walls };
};

const getNeighbors = (
    row: number,
    col: number,
    size: number,
    visited: boolean[][]
): { row: number; col: number }[] => {
    const dirs = [
        { row: -1, col: 0 },
        { row: 1, col: 0 },
        { row: 0, col: -1 },
        { row: 0, col: 1 },
    ];
    return dirs
        .map(d => ({ row: row + d.row, col: col + d.col }))
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

    for (let attempt = 0; attempt < 20; attempt++) {
        const visited = Array.from({ length: size }, () => Array(size).fill(false));
        const path: { row: number; col: number }[] = [];

        const startRow = Math.floor(Math.random() * size);
        const startCol = Math.floor(Math.random() * size);

        let row = startRow;
        let col = startCol;

        visited[row][col] = true;
        path.push({ row, col });

        while (path.length < total) {
            const neighbors = getNeighbors(row, col, size, visited);
            if (neighbors.length === 0) break;

            const scored = neighbors.map(n => ({
                ...n,
                score: countOnwardMoves(n.row, n.col, size, visited),
            }));

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

const generateSnakePath = (size: number): { row: number; col: number }[] => {
    const path: { row: number; col: number }[] = [];
    for (let row = 0; row < size; row++) {
        const cols = row % 2 === 0
            ? Array.from({ length: size }, (_, col) => col)
            : Array.from({ length: size }, (_, col) => size - 1 - col);
        for (const col of cols) {
            path.push({ row, col });
        }
    }
    return path;
};

const getDirection = (
    from: { row: number; col: number },
    to: { row: number; col: number }
): 'top' | 'right' | 'bottom' | 'left' => {
    if (to.row < from.row) return 'top';
    if (to.row > from.row) return 'bottom';
    if (to.col > from.col) return 'right';
    return 'left';
};

const opposite = (dir: 'top' | 'right' | 'bottom' | 'left') => {
    if (dir === 'top') return 'bottom';
    if (dir === 'bottom') return 'top';
    if (dir === 'left') return 'right';
    return 'left';
};

const addWalls = (
    cells: Cell[][],
    path: { row: number; col: number }[],
    wallCount: number,
    size: number
): void => {
    // collect all internal edges that are NOT used by the solution path
    const solutionEdges = new Set<string>();
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const dir = getDirection(from, to);
        solutionEdges.add(`${from.row}-${from.col}-${dir}`);
        solutionEdges.add(`${to.row}-${to.col}-${opposite(dir)}`);
    }

    // collect candidate edges — internal edges not on solution path
    const candidates: { row: number; col: number; dir: 'top' | 'right' | 'bottom' | 'left' }[] = [];
    for (let row = 0; row < size; row++) {
        for (let col = 0; col < size; col++) {
            const dirs: ('top' | 'right' | 'bottom' | 'left')[] = ['top', 'right', 'bottom', 'left'];
            for (const dir of dirs) {
                const key = `${row}-${col}-${dir}`;
                if (!solutionEdges.has(key)) {
                    // skip outer borders
                    if (dir === 'top' && row === 0) continue;
                    if (dir === 'bottom' && row === size - 1) continue;
                    if (dir === 'left' && col === 0) continue;
                    if (dir === 'right' && col === size - 1) continue;
                    candidates.push({ row, col, dir });
                }
            }
        }
    }

    // shuffle and pick wallCount edges
    const shuffled = shuffle(candidates);
    let added = 0;

    for (const { row, col, dir } of shuffled) {
        if (added >= wallCount) break;

        // add wall on both sides of the edge
        cells[row][col].walls[dir] = true;
        const opp = opposite(dir);
        if (dir === 'top' && row > 0) cells[row - 1][col].walls[opp] = true;
        if (dir === 'bottom' && row < size - 1) cells[row + 1][col].walls[opp] = true;
        if (dir === 'left' && col > 0) cells[row][col - 1].walls[opp] = true;
        if (dir === 'right' && col < size - 1) cells[row][col + 1].walls[opp] = true;

        added++;
    }
};

export const generatePuzzle = (level: number): GameGrid => {
    const { size, nodes: nodeCount, walls: wallCount } = getDifficultyConfig(level);

    let path: { row: number; col: number }[] | null = null;
    path = generateHamiltonianPath(size);
    if (!path) path = generateSnakePath(size);

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

    // build cells with empty walls
    const cells: Cell[][] = Array.from({ length: size }, (_, row) =>
        Array.from({ length: size }, (_, col) => ({
            row,
            col,
            walls: { top: false, right: false, bottom: false, left: false },
        }))
    );

    // add walls that don't block solution
    if (wallCount > 0) {
        addWalls(cells, path, wallCount, size);
    }

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