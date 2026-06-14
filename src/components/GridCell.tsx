import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Cell } from '../game/types';

type Props = {
    cell: Cell;
    nodeNumber?: number;
    cellSize: number;
    gridLineColor: string;
    backgroundColor: string;
};

const WALL_WIDTH = 4;

export const GridCell = ({ cell, nodeNumber, cellSize, gridLineColor, backgroundColor }: Props) => {
    return (
        <View
            style={[
                styles.cell,
                {
                    width: cellSize,
                    height: cellSize,
                    borderColor: gridLineColor,
                    backgroundColor,
                },
            ]}
        >
            {/* wall overlays */}
            {cell.walls.top && (
                <View style={[styles.wallTop, { backgroundColor: '#000', width: cellSize }]} />
            )}
            {cell.walls.bottom && (
                <View style={[styles.wallBottom, { backgroundColor: '#000', width: cellSize }]} />
            )}
            {cell.walls.left && (
                <View style={[styles.wallLeft, { backgroundColor: '#000', height: cellSize }]} />
            )}
            {cell.walls.right && (
                <View style={[styles.wallRight, { backgroundColor: '#000', height: cellSize }]} />
            )}

            {nodeNumber && (
                <View style={styles.nodeBadge}>
                    <Text style={styles.nodeText}>{nodeNumber}</Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    cell: {
        borderRightWidth: 0.5,
        borderBottomWidth: 0.5,
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
    },
    wallTop: {
        position: 'absolute',
        top: 0,
        left: 0,
        height: WALL_WIDTH,
    },
    wallBottom: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        height: WALL_WIDTH,
    },
    wallLeft: {
        position: 'absolute',
        top: 0,
        left: 0,
        width: WALL_WIDTH,
    },
    wallRight: {
        position: 'absolute',
        top: 0,
        right: 0,
        width: WALL_WIDTH,
    },
    nodeBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 10,
    },
    nodeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});