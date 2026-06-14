import React from 'react';
import Svg, {Polyline, Rect} from 'react-native-svg';

type SimpleCell = { row: number; col: number };

type Props = {
    path: SimpleCell[];
    cellSize: number;
    gridSize: number;
};

export const PathLine = ({path, cellSize, gridSize}: Props) => {
    if (path.length < 2) return null;

    const offset = cellSize / 2;
    const padding = 1; // keeps grid lines visible

    const visitedRects = path.map((cell, i) => (
        <Rect
            key={i}
            x={cell.col * cellSize + padding}
            y={cell.row * cellSize + padding}
            width={cellSize - padding * 2}
            height={cellSize - padding * 2}
            fill="rgba(0, 147, 60, 0.3)"
        />
    ));

    const points = path
        .map(cell => {
            const x = cell.col * cellSize + offset;
            const y = cell.row * cellSize + offset;
            return `${x},${y}`;
        })
        .join(' ');

    return (
        <Svg
            width={gridSize}
            height={gridSize}
            style={{position: 'absolute', top: 0, left: 0}}
            pointerEvents="none"
        >
            {visitedRects}
            <Polyline
                points={points}
                fill="none"
                stroke="#00933c"
                strokeWidth={cellSize * 0.5}
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </Svg>
    );
};