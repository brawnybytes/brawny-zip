import React from 'react';
import {StatusBar} from 'expo-status-bar';
import {GestureHandlerRootView} from 'react-native-gesture-handler';
import {StyleSheet, View} from 'react-native';
import {GameScreen} from './src/screens/GameScreen';

export default function App() {
    return (
        <GestureHandlerRootView style={styles.root}>
            <View style={styles.root}>
                <StatusBar style="light"/>
                <GameScreen/>
            </View>
        </GestureHandlerRootView>
    );
}

const styles = StyleSheet.create({
    root: {
        flex: 1,
        backgroundColor: '#1a1a1a',
    },
});