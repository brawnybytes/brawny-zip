import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
    seconds: number;
    level: number;
    onNextPuzzle: () => void;
    onReplay: () => void;
};

const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
};

const getStars = (seconds: number): number => {
    if (seconds < 10) return 5;
    if (seconds < 20) return 4;
    if (seconds < 30) return 3;
    if (seconds < 40) return 2;
    return 1;
};

const StarRow = ({stars}: { stars: number }) => {
    return (
        <View style={styles.starRow}>
            {[1, 2, 3, 4, 5].map(i => (
                <Text key={i} style={[styles.star, i <= stars ? styles.starFilled : styles.starEmpty]}>
                    ★
                </Text>
            ))}
        </View>
    );
};

export const WinScreen = ({seconds, level, onNextPuzzle, onReplay}: Props) => {
    const stars = getStars(seconds);

    return (
        <View style={styles.overlay}>
            <View style={styles.card}>

                <Text style={styles.levelText}>Level {level} Complete!</Text>

                <StarRow stars={stars}/>

                <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>Time</Text>
                    <Text style={styles.timeValue}>{formatTime(seconds)}</Text>
                </View>

                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.secondaryButton} onPress={onReplay}>
                        <Text style={styles.secondaryButtonText}>Play Again</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.primaryButton} onPress={onNextPuzzle}>
                        <Text style={styles.primaryButtonText}>Next Level</Text>
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
        gap: 20,
    },
    levelText: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    starRow: {
        flexDirection: 'row',
        gap: 8,
    },
    star: {
        fontSize: 40,
    },
    starFilled: {
        color: '#FFD700',
    },
    starEmpty: {
        color: '#ddd',
    },
    timeRow: {
        alignItems: 'center',
    },
    timeLabel: {
        fontSize: 13,
        color: '#888',
        marginBottom: 2,
    },
    timeValue: {
        fontSize: 32,
        fontWeight: 'bold',
        color: '#00933c',
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