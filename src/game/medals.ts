export type Medal = {
    name: string;
    emoji: string;
    color: string;
    textColor: string;
    description: string;
    starsRequired: number;
};

export const MEDALS: Medal[] = [
    {
        name: 'Beginner',
        emoji: '🌱',
        color: '#e8f5e9',
        textColor: '#2e7d32',
        description: 'First steps on the path',
        starsRequired: 0,
    },
    {
        name: 'Bronze',
        emoji: '🥉',
        color: '#fbe9e7',
        textColor: '#bf360c',
        description: 'Getting warmed up',
        starsRequired: 10,
    },
    {
        name: 'Silver',
        emoji: '🥈',
        color: '#eceff1',
        textColor: '#455a64',
        description: 'Sharp and focused',
        starsRequired: 25,
    },
    {
        name: 'Gold',
        emoji: '🥇',
        color: '#fff8e1',
        textColor: '#f57f17',
        description: 'Master of the grid',
        starsRequired: 50,
    },
    {
        name: 'Platinum',
        emoji: '💎',
        color: '#e3f2fd',
        textColor: '#1565c0',
        description: 'Unstoppable force',
        starsRequired: 100,
    },
    {
        name: 'Legend',
        emoji: '👑',
        color: '#f3e5f5',
        textColor: '#6a1b9a',
        description: 'One of a kind',
        starsRequired: 200,
    },
];

export const getMedal = (totalStars: number): Medal => {
    let current = MEDALS[0];
    for (const medal of MEDALS) {
        if (totalStars >= medal.starsRequired) {
            current = medal;
        }
    }
    return current;
};

export const getNextMedal = (totalStars: number): Medal | null => {
    for (const medal of MEDALS) {
        if (totalStars < medal.starsRequired) {
            return medal;
        }
    }
    return null;
};