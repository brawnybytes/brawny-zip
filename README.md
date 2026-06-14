# BrawnyZip

A mobile puzzle game inspired by LinkedIn Zip. Connect numbered nodes in order and fill every cell on the grid.

## How to Play

1. Start by touching node **1**
2. Drag your finger to connect nodes in order (1 -> 2 -> 3 -> ...)
3. Your path must fill **every cell** on the grid
4. Reach the last node to complete the puzzle

## Features

- Auto-generated puzzles that increase in difficulty as you level up
- Timer to track how fast you solve each puzzle
- Star rating based on completion time
- Undo, Reset, and Hint buttons
- Progress saved automatically
- Works on iOS and Android

## Difficulty Levels

| Level | Nodes | Difficulty |
|-------|-------|------------|
| 1–3   | 5     | Easy       |
| 4–6   | 8     | Medium     |
| 7–9   | 10    | Hard       |
| 10–12 | 12    | Expert     |
| 13+   | 14–16 | Master     |

All puzzles use an 8×8 grid.

## Tech Stack

- React Native
- Expo SDK 54
- TypeScript
- react-native-svg
- react-native-gesture-handler
- AsyncStorage

## Project Structure

```
brawny-zip/
├── App.tsx
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   └── GameScreen.tsx
│   ├── components/
│   │   ├── GridCell.tsx
│   │   ├── PathLine.tsx
│   │   └── WinScreen.tsx
│   └── game/
│       ├── types.ts
│       ├── gameLogic.ts
│       ├── generator.ts
│       └── storage.ts
└── assets/
    ├── icon.png
    └── splash-icon.png
```

## Getting Started

### Prerequisites

- Node.js v18+
- Expo Go app on your phone

### Installation

```bash
git clone https://github.com/yourusername/brawny-zip.git
cd brawny-zip
npm install
npx expo start
```

Scan the QR code with Expo Go on your phone.

### Build Android APK

```bash
eas build -p android --profile preview
```

## Algorithm

Puzzles are generated using **Warnsdorff's heuristic** — a fast algorithm for finding Hamiltonian paths (paths that visit every cell exactly once). Numbered nodes are placed at evenly spaced intervals along the path. More nodes = harder puzzle since the player has less guidance.
