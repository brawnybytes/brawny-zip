import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    SafeAreaView,
} from 'react-native';
import { getMedal } from '../game/medals';
import { playComplete } from '../game/sounds';

const SCREEN_WIDTH = Dimensions.get('window').width;

type Props = {
    level: number;
    totalStars: number;
    onPlay: () => void;
};

export const HomeScreen = ({ level, totalStars, onPlay }: Props) => {
    const medal = getMedal(totalStars);

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.content}>

                {/* logo */}
                <View style={styles.logoContainer}>
                    <Text style={styles.logoText}>BrawnyZip</Text>
                    <Text style={styles.tagline}>Connect the dots. Fill the grid.</Text>
                </View>

                {/* level badge */}
                <View style={styles.levelBadge}>
                    <Text style={styles.levelLabel}>Current Level</Text>
                    <Text style={styles.levelNumber}>{level}</Text>
                </View>

                {/* medal */}
                <View style={[styles.medalRow, { backgroundColor: medal.color, borderColor: medal.color }]}>
                    <Text style={styles.medalEmoji}>{medal.emoji}</Text>
                    <View>
                        <Text style={[styles.medalName, { color: medal.textColor }]}>{medal.name}</Text>
                        <Text style={[styles.medalStars, { color: medal.textColor, opacity: 0.7 }]}>{totalStars} stars collected</Text>
                    </View>
                </View>

                {/* play button */}
                <TouchableOpacity style={styles.playButton} onPress={onPlay}>
                    <Text style={styles.playButtonText}>Play</Text>
                </TouchableOpacity>

                {/* how to play */}
                <View style={styles.howTo}>
                    <Text style={styles.howToTitle}>How to play</Text>
                    <Text style={styles.howToStep}>1. Start from node 1</Text>
                    <Text style={styles.howToStep}>2. Connect nodes in order</Text>
                    <Text style={styles.howToStep}>3. Fill every cell on the grid</Text>
                </View>

            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    content: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 24,
        gap: 32,
    },
    logoContainer: {
        alignItems: 'center',
    },
    logoText: {
        fontSize: 40,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 1,
    },
    tagline: {
        fontSize: 15,
        color: '#888',
        marginTop: 8,
    },
    levelBadge: {
        alignItems: 'center',
        backgroundColor: '#f5f5f5',
        paddingVertical: 20,
        paddingHorizontal: 48,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: '#a3a19c',
    },
    levelLabel: {
        fontSize: 13,
        color: '#888',
        marginBottom: 4,
    },
    levelNumber: {
        fontSize: 48,
        fontWeight: 'bold',
        color: '#00933c',
    },
    medalRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        backgroundColor: '#f5f5f5',
        paddingVertical: 16,
        paddingHorizontal: 24,
        borderRadius: 16,
        borderWidth: 0.5,
        borderColor: '#a3a19c',
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
    medalStars: {
        fontSize: 13,
        color: '#888',
        marginTop: 2,
    },
    playButton: {
        backgroundColor: '#00933c',
        paddingVertical: 16,
        borderRadius: 12,
        width: SCREEN_WIDTH - 48,
        alignItems: 'center',
    },
    playButtonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    howTo: {
        width: '100%',
        backgroundColor: '#f5f5f5',
        borderRadius: 16,
        padding: 20,
        gap: 8,
    },
    howToTitle: {
        fontSize: 15,
        fontWeight: 'bold',
        color: '#000',
        marginBottom: 4,
    },
    howToStep: {
        fontSize: 14,
        color: '#555',
    },
});