import React, {useEffect, useRef} from 'react';
import {Animated, StyleSheet, Text, View,} from 'react-native';

export const LoadingScreen = () => {
    const dot1 = useRef(new Animated.Value(0)).current;
    const dot2 = useRef(new Animated.Value(0)).current;
    const dot3 = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        const animate = (dot: Animated.Value, delay: number) => {
            Animated.loop(
                Animated.sequence([
                    Animated.delay(delay),
                    Animated.timing(dot, {
                        toValue: 1,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                    Animated.timing(dot, {
                        toValue: 0,
                        duration: 400,
                        useNativeDriver: true,
                    }),
                ])
            ).start();
        };

        animate(dot1, 0);
        animate(dot2, 150);
        animate(dot3, 300);
    }, []);

    const dotStyle = (dot: Animated.Value) => ({
        opacity: dot,
        transform: [
            {
                translateY: dot.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -8],
                }),
            },
        ],
    });

    return (
        <View style={styles.container}>
            <Text style={styles.title}>BrawnyZip</Text>
            <View style={styles.dotsRow}>
                <Animated.View style={[styles.dot, dotStyle(dot1)]}/>
                <Animated.View style={[styles.dot, dotStyle(dot2)]}/>
                <Animated.View style={[styles.dot, dotStyle(dot3)]}/>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 24,
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        color: '#000',
        letterSpacing: 1,
    },
    dotsRow: {
        flexDirection: 'row',
        gap: 8,
    },
    dot: {
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: '#00933c',
    },
});