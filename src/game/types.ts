export type Cell = {
    row: number;
    col: number;
    zone: number;
};

export type GameGrid = {
    size: number;
    cells: Cell[][];
    nodes: Record<string, number>;
    solution: { row: number; col: number }[];
};
