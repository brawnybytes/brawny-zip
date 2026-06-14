import AsyncStorage from '@react-native-async-storage/async-storage';

const LEVEL_KEY = 'brawnyzip_level';

export const saveLevel = async (level: number): Promise<void> => {
    try {
        await AsyncStorage.setItem(LEVEL_KEY, level.toString());
    } catch (e) {
        console.error('Failed to save level', e);
    }
};

export const loadLevel = async (): Promise<number> => {
    try {
        const value = await AsyncStorage.getItem(LEVEL_KEY);
        return value ? parseInt(value) : 1;
    } catch (e) {
        console.error('Failed to load level', e);
        return 1;
    }
};