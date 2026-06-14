import React, {useEffect, useRef, useState} from 'react';
import {Dimensions, PanResponder, SafeAreaView, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import {GridCell} from '../components/GridCell';
import {PathLine} from '../components/PathLine';
import {canMoveTo, cellKey, isGameComplete} from '../game/gameLogic';
import {WinScreen} from '../components/WinScreen';
import {generatePuzzle, getDifficultyLabel} from '../game/generator';
import {loadTotalStars, saveLevel, saveTotalStars} from '../game/storage';
import {LoadingScreen} from '../components/LoadingScreen';
import {getTheme} from '../game/themes';
import {loadSounds, playComplete} from '../game/sounds';

const SCREEN_WIDTH = Dimensions.get('window').width;
const PADDING = 24;
const GRID_SIZE = SCREEN_WIDTH - PADDING * 2;

type Props = {
    initialLevel: number;
    onLevelChange: (level: number) => void;
    onHome: () => void;
};

export const GameScreen = ({initialLevel, onLevelChange, onHome}: Props) => {
    const [level, setLevel] = useState(initialLevel);
    const [grid, setGrid] = useState(() => generatePuzzle(initialLevel));
    const [path, setPath] = useState<{ row: number; col: number }[]>([]);
    const [isComplete, setIsComplete] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [hintsUsed, setHintsUsed] = useState(0);
    const [totalStars, setTotalStars] = useState(0);
    const totalStarsRef = useRef(0);
    const secondsRef = useRef(0);
    const MAX_HINTS = 3;

    const gridDataRef = useRef(grid);
    const timerRef = useRef<NodeJS.Timeout | null>(null);
    const gridOffset = useRef({x: 0, y: 0});

    const cellSize = GRID_SIZE / grid.size;
    const theme = getTheme(level);

    useEffect(() => {
        gridDataRef.current = grid;
    }, [grid]);

    useEffect(() => {
        startTimer();
        loadSounds();
        loadTotalStars().then(stars => {
            setTotalStars(stars);
            totalStarsRef.current = stars;
        });
        return () => stopTimer();
    }, []);
    useEffect(() => {
        if (isComplete) stopTimer();
    }, [isComplete]);

    const startTimer = () => {
        stopTimer();
        timerRef.current = setInterval(() => {
            setSeconds(s => {
                secondsRef.current = s + 1;
                return s + 1;
            });
        }, 1000);
    };

    const stopTimer = () => {
        if (timerRef.current) clearInterval(timerRef.current);
    };

    const formatTime = (s: number) => {
        const m = Math.floor(s / 60);
        const sec = s % 60;
        return `${m}:${sec.toString().padStart(2, '0')}`;
    };

    const getCellFromTouch = (x: number, y: number) => {
        const col = Math.floor(x / cellSize);
        const row = Math.floor(y / cellSize);
        if (row >= 0 && row < grid.size && col >= 0 && col < grid.size) {
            return {row, col};
        }
        return null;
    };

    const handleUndo = () => {
        setPath(prev => (prev.length <= 1 ? [] : prev.slice(0, prev.length - 1)));
        setIsComplete(false);
    };

    const handleReset = () => {
        setPath([]);
        setIsComplete(false);
        setHintsUsed(0);
    };

    const handleHint = () => {
        if (hintsUsed >= MAX_HINTS) return;
        setHintsUsed(prev => prev + 1);
        setPath(prev => {
            const nextIndex = prev.length;
            if (nextIndex >= grid.solution.length) return prev;
            return grid.solution.slice(0, nextIndex + 1);
        });
    };

    const handleNextPuzzle = () => {
        setIsComplete(false);
        setIsLoading(true);
        setTimeout(() => {
            const nextLevel = level + 1;
            const newGrid = generatePuzzle(nextLevel);
            setLevel(nextLevel);
            setGrid(newGrid);
            gridDataRef.current = newGrid;
            setPath([]);
            setSeconds(0);
            setHintsUsed(0);
            setIsLoading(false);
            saveLevel(nextLevel);
            onLevelChange(nextLevel);
            startTimer();
        }, 300);
    };

    const handleReplay = () => {
        setPath([]);
        setIsComplete(false);
        setSeconds(0);
        setHintsUsed(0);
        startTimer();
    };

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onMoveShouldSetPanResponder: () => true,
            onStartShouldSetPanResponderCapture: () => true,
            onMoveShouldSetPanResponderCapture: () => true,

            onPanResponderGrant: (evt) => {
                const {pageX, pageY} = evt.nativeEvent;
                const x = pageX - gridOffset.current.x;
                const y = pageY - gridOffset.current.y;
                const cell = getCellFromTouch(x, y);
                if (!cell) return;
                const key = cellKey(cell);
                if (gridDataRef.current.nodes[key] === 1) {
                    setPath([cell]);
                    setIsComplete(false);
                }
            },

            onPanResponderMove: (evt) => {
                const {pageX, pageY} = evt.nativeEvent;
                const x = pageX - gridOffset.current.x;
                const y = pageY - gridOffset.current.y;
                const cell = getCellFromTouch(x, y);
                if (!cell) return;

                setPath((prev) => {
                    if (prev.length === 0) return prev;

                    const existingIndex = prev.findIndex(
                        p => p.row === cell.row && p.col === cell.col
                    );
                    if (existingIndex !== -1) return prev.slice(0, existingIndex + 1);

                    if (!canMoveTo(cell, prev, gridDataRef.current)) return prev;

                    const newPath = [...prev, cell];

                    if (isGameComplete(newPath, gridDataRef.current)) {
                        setTimeout(() => {
                            playComplete();
                        }, 100);
                        setTimeout(() => {
                            setIsComplete(true);
                            const earned = secondsRef.current < 60 ? 3 : secondsRef.current < 120 ? 2 : 1;
                            const newTotal = totalStarsRef.current + earned;
                            totalStarsRef.current = newTotal;
                            setTotalStars(newTotal);
                            saveTotalStars(newTotal);
                        }, 2000);
                    }

                    return newPath;
                });
            },

            onPanResponderRelease: () => {
            },
        })
    ).current;

    const pathSet = new Set(path.map(cellKey));

    return (
        <SafeAreaView style={[styles.container, {backgroundColor: theme.background}]}>
            {isLoading && <LoadingScreen/>}
            {isComplete && (
                <WinScreen
                    seconds={seconds}
                    level={level}
                    totalStars={totalStars}
                    onReplay={handleReplay}
                    onNextPuzzle={handleNextPuzzle}
                />
            )}

            {/* header */}
            <View style={styles.header}>
                <TouchableOpacity onPress={onHome}>
                    <Text style={[styles.homeButton, {color: theme.pathColor}]}>← Home</Text>
                </TouchableOpacity>
                <Text style={[styles.title, {color: theme.titleColor}]}>Level {level}</Text>
                <Text style={[styles.difficultyText, {color: theme.timerColor}]}>{getDifficultyLabel(level)}</Text>
            </View>

            {/* timer */}
            <Text style={[styles.timerText, {color: theme.timerColor}]}>{formatTime(seconds)}</Text>

            {/* board */}
            <View style={[styles.board, {borderColor: theme.gridLine, backgroundColor: theme.boardBackground}]}>
                <View
                    style={{position: 'relative', width: GRID_SIZE, height: GRID_SIZE}}
                    ref={(ref) => {
                        if (ref) {
                            ref.measure((_x, _y, _w, _h, pageX, pageY) => {
                                gridOffset.current = {x: pageX, y: pageY};
                            });
                        }
                    }}
                    {...panResponder.panHandlers}
                >
                    {/* cells layer */}
                    <View style={{position: 'absolute', top: 0, left: 0}}>
                        {grid.cells.map((row, rowIndex) => (
                            <View key={rowIndex} style={styles.row}>
                                {row.map((cell, colIndex) => {
                                    const key = cellKey(cell);
                                    const isLast =
                                        path.length > 0 &&
                                        path[path.length - 1].row === cell.row &&
                                        path[path.length - 1].col === cell.col;
                                    return (
                                        <GridCell
                                            key={colIndex}
                                            cell={cell}
                                            nodeNumber={grid.nodes[cellKey(cell)]}
                                            cellSize={cellSize}
                                            gridLineColor={theme.gridLine}
                                            backgroundColor={theme.boardBackground}
                                        />
                                    );
                                })}
                            </View>
                        ))}
                    </View>

                    {/* path line layer */}
                    <PathLine
                        path={path}
                        cellSize={cellSize}
                        gridSize={GRID_SIZE}
                        pathColor={theme.pathColor}
                        pathFill={theme.pathFill}
                    />

                    {/* nodes layer — always on top */}
                    <View style={{position: 'absolute', top: 0, left: 0}}>
                        {Object.entries(grid.nodes).map(([key, number]) => {
                            const [row, col] = key.split('-').map(Number);
                            return (
                                <View
                                    key={key}
                                    style={{
                                        position: 'absolute',
                                        top: row * cellSize + cellSize / 2 - 16,
                                        left: col * cellSize + cellSize / 2 - 16,
                                        width: 32,
                                        height: 32,
                                        borderRadius: 16,
                                        backgroundColor: theme.nodeBackground,
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        zIndex: 100,
                                    }}
                                >
                                    <Text style={{color: theme.nodeText, fontWeight: 'bold', fontSize: 14}}>
                                        {number}
                                    </Text>
                                </View>
                            );
                        })}
                    </View>
                </View>
            </View>

            {/* bottom buttons */}
            <View style={styles.bottomBar}>
                <TouchableOpacity style={[styles.button, {borderColor: theme.buttonBorder}]} onPress={handleUndo}>
                    <Text style={[styles.buttonText, {color: theme.titleColor}]}>Undo</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, {borderColor: theme.buttonBorder}]} onPress={handleReset}>
                    <Text style={[styles.buttonText, {color: theme.titleColor}]}>Reset</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.button, {borderColor: theme.buttonBorder}, hintsUsed >= MAX_HINTS && styles.buttonDisabled]}
                    onPress={handleHint}
                    disabled={hintsUsed >= MAX_HINTS}
                >
                    <Text
                        style={[styles.buttonText, {color: theme.titleColor}, hintsUsed >= MAX_HINTS && styles.buttonTextDisabled]}>
                        Hint {MAX_HINTS - hintsUsed}/{MAX_HINTS}
                    </Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    buttonDisabled: {
        borderColor: '#ddd',
        backgroundColor: '#fafafa',
    },
    buttonTextDisabled: {
        color: '#bbb',
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        width: GRID_SIZE,
        marginBottom: 8,
    },
    homeButton: {
        color: '#00933c',
        fontSize: 14,
        fontWeight: '500',
    },
    title: {
        color: '#000',
        fontSize: 20,
        fontWeight: 'bold',
        letterSpacing: 1,
    },
    timerText: {
        color: '#000',
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 16,
    },
    difficultyText: {
        color: '#555',
        fontSize: 14,
    },
    board: {
        backgroundColor: '#fff',
        borderRadius: 16,
        borderWidth: 1,
        borderColor: '#a3a19c',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    row: {
        flexDirection: 'row',
    },
    bottomBar: {
        flexDirection: 'row',
        gap: 16,
        marginTop: 24,
    },
    button: {
        width: GRID_SIZE / 3 - 12,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#a3a19c',
        alignItems: 'center',
    },
    buttonText: {
        color: '#000',
        fontSize: 16,
        fontWeight: '500',
    },
});