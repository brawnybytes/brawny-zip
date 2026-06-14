export const withFallback = <T>(fn: () => T, fallback: T): T => {
    try {
        return fn();
    } catch (e) {
        console.error('Error:', e);
        return fallback;
    }
};