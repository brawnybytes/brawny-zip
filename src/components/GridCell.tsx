import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

type Props = {
    nodeNumber?: number;
    cellSize: number;
};

export const GridCell = ({ nodeNumber, cellSize }: Props) => {
    return (
        <View style={[styles.cell, { width: cellSize, height: cellSize }]}>
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
        borderColor: '#a3a19c',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    nodeBadge: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: '#000',
        alignItems: 'center',
        justifyContent: 'center',
    },
    nodeText: {
        color: '#fff',
        fontWeight: 'bold',
        fontSize: 14,
    },
});