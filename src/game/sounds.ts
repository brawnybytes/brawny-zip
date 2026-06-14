import { createAudioPlayer, setAudioModeAsync, AudioPlayer } from 'expo-audio';

let completePlayer: AudioPlayer | null = null;
let isMuted = false;

export const setMuted = (muted: boolean) => {
    isMuted = muted;
};

export const loadSounds = async () => {
    try {
        await setAudioModeAsync({
            playsInSilentMode: true,
        });
        completePlayer = createAudioPlayer(require('../../assets/complete.wav'));
    } catch (e) {
        console.error('Failed to load sounds', e);
    }
};

export const playComplete = async () => {
    if (isMuted) return;
    try {
        if (completePlayer) {
            completePlayer.seekTo(0);
            completePlayer.play();
        } else {
            console.log('Player not ready');
        }
    } catch (e) {
        console.error('Complete error', e);
    }
};

export const unloadSounds = async () => {
    try {
        if (completePlayer) completePlayer.remove();
    } catch (e) {}
};