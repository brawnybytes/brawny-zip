import AsyncStorage from '@react-native-async-storage/async-storage';

const LEVEL_KEY = 'brawnyzip_level';
const STARS_KEY = 'brawnyzip_stars';

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

export const saveTotalStars = async (stars: number): Promise<void> => {
    try {
        await AsyncStorage.setItem(STARS_KEY, stars.toString());
    } catch (e) {
        console.error('Failed to save stars', e);
    }
};

export const loadTotalStars = async (): Promise<number> => {
    try {
        const value = await AsyncStorage.getItem(STARS_KEY);
        return value ? parseInt(value) : 0;
    } catch (e) {
        console.error('Failed to load stars', e);
        return 0;
    }
};