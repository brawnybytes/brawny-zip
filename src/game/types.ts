export type Walls = {
    top: boolean;
    right: boolean;
    bottom: boolean;
    left: boolean;
};

export type Cell = {
    row: number;
    col: number;
    walls: Walls;
};

export type GameGrid = {
    size: number;
    cells: Cell[][];
    nodes: Record<string, number>;
    solution: { row: number; col: number }[];
};