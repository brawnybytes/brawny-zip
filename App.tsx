import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { LoadingScreen } from './src/components/LoadingScreen';
import { loadLevel, loadTotalStars } from './src/game/storage';

type Screen = 'loading' | 'home' | 'game';

export default function App() {
    const [screen, setScreen] = useState<Screen>('loading');
    const [currentLevel, setCurrentLevel] = useState(1);
    const [totalStars, setTotalStars] = useState(0);

    useEffect(() => {
        Promise.all([loadLevel(), loadTotalStars()])
            .then(([savedLevel, savedStars]) => {
                setCurrentLevel(savedLevel);
                setTotalStars(savedStars);
            })
            .catch(() => {
                setCurrentLevel(1);
                setTotalStars(0);
            })
            .finally(() => {
                setScreen('home');
            });
    }, []);

    return (
        <GestureHandlerRootView style={styles.root}>
            <StatusBar style="dark" />
            {screen === 'loading' && <LoadingScreen />}
            {screen === 'home' && (
                <HomeScreen
                    level={currentLevel}
                    totalStars={totalStars}
                    onPlay={() => setScreen('game')}
                />
            )}
            {screen === 'game' && (
                <GameScreen
                    initialLevel={currentLevel}
                    onLevelChange={setCurrentLevel}
                    onHome={() => {
                        loadTotalStars().then(stars => setTotalStars(stars));
                        setScreen('home');
                    }}
                />
            )}
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
    },
});