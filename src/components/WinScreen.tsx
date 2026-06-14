import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
    seconds: number;
    onNextPuzzle: () => void;
    onReplay: () => void;
};

const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
};

export const WinScreen = ({seconds, onNextPuzzle, onReplay}: Props) => {
    return (
        <View style={styles.overlay}>
            <View style={styles.card}>
                <Text style={styles.emoji}>🎉</Text>
                <Text style={styles.title}>Puzzle Complete!</Text>
                <Text style={styles.subtitle}>You solved it in</Text>
                <Text style={styles.time}>{formatTime(seconds)}</Text>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={onReplay}>
                        <Text style={styles.secondaryButtonText}>Play Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryButton} onPress={onNextPuzzle}>
                        <Text style={styles.primaryButtonText}>Next Puzzle</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0,0,0,0.5)',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 999,
    },
    card: {
        backgroundColor: '#fff',
        borderRadius: 20,
        padding: 32,
        width: SCREEN_WIDTH - 48,
        alignItems: 'center',
    },
    emoji: {
        fontSize: 48,
        marginBottom: 12,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#888',
        marginBottom: 4,
    },
    time: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#00933c',
        marginBottom: 28,
    },
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    secondaryButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: '#a3a19c',
        alignItems: 'center',
    },
    secondaryButtonText: {
        color: '#000',
        fontSize: 15,
        fontWeight: '500',
    },
    primaryButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 10,
        backgroundColor: '#00933c',
        alignItems: 'center',
    },
    primaryButtonText: {
        color: '#fff',
        fontSize: 15,
        fontWeight: '500',
    },
});