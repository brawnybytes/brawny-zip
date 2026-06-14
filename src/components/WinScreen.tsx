import React from 'react';
import {Dimensions, StyleSheet, Text, TouchableOpacity, View,} from 'react-native';
import { getMedal, getNextMedal } from '../game/medals';
const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
    seconds: number;
    level: number;
    totalStars: number;
    onNextPuzzle: () => void;
    onReplay: () => void;
};

const QUOTES = [
    "Every path begins with a single step.",
    "You didn't come this far to only come this far.",
    "The best way out is always through.",
    "Small wins lead to big victories.",
    "Clarity comes from engagement, not thought.",
    "Progress, not perfection.",
    "One puzzle at a time.",
    "Sharp mind, sharper path.",
    "You make it look easy.",
    "Another one bites the dust.",
    "Unstoppable.",
    "Your brain is built different.",
    "Keep going. It only gets better.",
    "Puzzle master in the making.",
    "Smooth moves.",
];

const getQuote = (level: number): string => {
    return QUOTES[level % QUOTES.length];
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

export const WinScreen = ({ seconds, level, totalStars, onNextPuzzle, onReplay }: Props) => {
    const stars = getStars(seconds);
    const quote = getQuote(level);
    const newTotal = totalStars + stars;
    const medal = getMedal(newTotal);
    const nextMedal = getNextMedal(newTotal);

    return (
        <View style={styles.overlay}>
            <View style={styles.card}>

                <Text style={styles.levelText}>Level {level} Complete!</Text>

                <StarRow stars={stars}/>

                <View style={styles.timeRow}>
                    <Text style={styles.timeLabel}>Time</Text>
                    <Text style={styles.timeValue}>{formatTime(seconds)}</Text>
                </View>

                <Text style={styles.quote}>"{quote}"</Text>

                <View style={[styles.medalRow, { backgroundColor: medal.color, borderColor: medal.color }]}>
                    <Text style={styles.medalEmoji}>{medal.emoji}</Text>
                    <View>
                        <Text style={[styles.medalName, { color: medal.textColor }]}>{medal.name}</Text>
                        <Text style={[styles.medalDesc, { color: medal.textColor, opacity: 0.7 }]}>{medal.description}</Text>
                    </View>
                </View>

                {nextMedal && (
                    <Text style={styles.nextMedal}>
                        {nextMedal.starsRequired - newTotal} stars to {nextMedal.name} {nextMedal.emoji}
                    </Text>
                )}
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
    medalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#f5f5f5',
        padding: 12,
        borderRadius: 12,
        width: '100%',
    },
    medalEmoji: {
        fontSize: 36,
    },
    medalName: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
    },
    medalDesc: {
        fontSize: 12,
        color: '#888',
    },
    nextMedal: {
        fontSize: 12,
        color: '#888',
        textAlign: 'center',
    },
    quote: {
        fontSize: 13,
        color: '#888',
        fontStyle: 'italic',
        textAlign: 'center',
        paddingHorizontal: 8,
    },
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