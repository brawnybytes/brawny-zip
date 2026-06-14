export type Theme = {
    name: string;
    background: string;
    boardBackground: string;
    gridLine: string;
    pathColor: string;
    pathFill: string;
    nodeBackground: string;
    nodeText: string;
    buttonBorder: string;
    timerColor: string;
    titleColor: string;
};

export const THEMES: Theme[] = [
    {
        name: 'Forest',
        background: '#fff',
        boardBackground: '#fff',
        gridLine: '#a3a19c',
        pathColor: '#00933c',
        pathFill: 'rgba(0, 147, 60, 0.3)',
        nodeBackground: '#000',
        nodeText: '#fff',
        buttonBorder: '#a3a19c',
        timerColor: '#000',
        titleColor: '#000',
    },
    {
        name: 'Ocean',
        background: '#f0f8ff',
        boardBackground: '#fff',
        gridLine: '#7ab3d4',
        pathColor: '#0066cc',
        pathFill: 'rgba(0, 102, 204, 0.2)',
        nodeBackground: '#003d7a',
        nodeText: '#fff',
        buttonBorder: '#7ab3d4',
        timerColor: '#003d7a',
        titleColor: '#003d7a',
    },
    {
        name: 'Sunset',
        background: '#fff8f0',
        boardBackground: '#fff',
        gridLine: '#d4a574',
        pathColor: '#cc6600',
        pathFill: 'rgba(204, 102, 0, 0.2)',
        nodeBackground: '#7a3d00',
        nodeText: '#fff',
        buttonBorder: '#d4a574',
        timerColor: '#7a3d00',
        titleColor: '#7a3d00',
    },
    {
        name: 'Night',
        background: '#1a1a2e',
        boardBackground: '#16213e',
        gridLine: '#444466',
        pathColor: '#9b59b6',
        pathFill: 'rgba(155, 89, 182, 0.3)',
        nodeBackground: '#fff',
        nodeText: '#1a1a2e',
        buttonBorder: '#444466',
        timerColor: '#fff',
        titleColor: '#fff',
    },
    {
        name: 'Cherry',
        background: '#fff0f5',
        boardBackground: '#fff',
        gridLine: '#d4a0b0',
        pathColor: '#cc0044',
        pathFill: 'rgba(204, 0, 68, 0.2)',
        nodeBackground: '#7a0028',
        nodeText: '#fff',
        buttonBorder: '#d4a0b0',
        timerColor: '#7a0028',
        titleColor: '#7a0028',
    },
    {
        name: 'Gold',
        background: '#fffaf0',
        boardBackground: '#fff',
        gridLine: '#d4c074',
        pathColor: '#cc9900',
        pathFill: 'rgba(204, 153, 0, 0.2)',
        nodeBackground: '#7a5c00',
        nodeText: '#fff',
        buttonBorder: '#d4c074',
        timerColor: '#7a5c00',
        titleColor: '#7a5c00',
    },
];

export const getTheme = (level: number): Theme => {
    const index = Math.floor((level - 1) / 3) % THEMES.length;
    return THEMES[index];
};