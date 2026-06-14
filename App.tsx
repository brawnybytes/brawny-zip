import React, { useState, useEffect } from 'react';
import { StatusBar } from 'expo-status-bar';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StyleSheet } from 'react-native';
import { HomeScreen } from './src/screens/HomeScreen';
import { GameScreen } from './src/screens/GameScreen';
import { loadLevel } from './src/game/storage';

export default function App() {
    const [screen, setScreen] = useState<'home' | 'game'>('home');
    const [currentLevel, setCurrentLevel] = useState(1);

    useEffect(() => {
        loadLevel().then(savedLevel => {
            setCurrentLevel(savedLevel);
        });
    }, []);

    return (
        <GestureHandlerRootView style={styles.root}>
            <StatusBar style="dark" />
            {screen === 'home' ? (
                <HomeScreen
                    level={currentLevel}
                    onPlay={() => setScreen('game')}
                />
            ) : (
                <GameScreen
                    initialLevel={currentLevel}
                    onLevelChange={setCurrentLevel}
                    onHome={() => setScreen('home')}
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