# BrawnyZip — Build Prompt

This is the prompt used to build BrawnyZip with AI assistance. Use this as a reference to rebuild, extend, or create a similar app from scratch.

---

## Prompt

Build a mobile puzzle game called **BrawnyZip** using React Native + Expo + TypeScript, inspired by LinkedIn Zip.

### Core gameplay
- 8x8 grid where the player draws a path connecting numbered nodes in order (1 → 2 → 3...)
- Path must fill every single cell on the grid
- Boundary walls block certain moves between adjacent cells
- Touch drag to draw the path, backtrack by retracing steps
- Win condition: all cells filled and last node reached

### Screens
- **Home screen** — shows current level, medal badge, how to play instructions, and play button
- **Game screen** — timer, undo/reset/hint buttons (max 3 hints per puzzle), home button, level and difficulty label
- **Win screen** — star rating (1-3 stars based on time), motivational quote, medal progress, next level and replay buttons
- **Loading screen** — animated dots shown while app loads or generates next puzzle

### Puzzle generation
- Auto-generate unique puzzles using Warnsdorff's Hamiltonian path algorithm
- Fallback to snake path if generation fails
- Place numbered nodes at evenly spaced intervals along the generated path
- Add boundary walls on edges NOT used by the solution path (walls near nodes get priority)
- Difficulty scales by level: more nodes + more walls as level increases

### Difficulty config
| Level | Nodes | Walls |
|-------|-------|-------|
| 1-2   | 4     | 0     |
| 3-4   | 6     | 3     |
| 5-6   | 9     | 5     |
| 7-8   | 12    | 7     |
| 9-10  | 14    | 9     |
| 11+   | scales up to 20 | scales up to 16 |

### Progression system
- 6 rotating visual themes that change every 3 levels: Forest, Ocean, Sunset, Lavender, Cherry, Gold
- Each theme has its own background, grid line color, path color, node color, and button colors
- Star rating per puzzle: 3 stars under 60s, 2 stars under 120s, 1 star otherwise
- Medal system based on total stars collected across all levels:
    - 🌱 Beginner — 0 stars
    - 🥉 Bronze — 10 stars
    - 🥈 Silver — 25 stars
    - 🥇 Gold — 50 stars
    - 💎 Platinum — 100 stars
    - 👑 Legend — 200 stars

### Data persistence
- Save current level using AsyncStorage (`brawnyzip_level`)
- Save total stars using AsyncStorage (`brawnyzip_stars`)
- Load both on app startup

### Sound
- Win chime sound using expo-audio (C-E-G-highC ascending notes)
- Preload sound on startup using `createAudioPlayer`
- Play win sound 100ms after puzzle completion, show win screen after 1500ms

### Tech stack
- React Native + Expo SDK 54
- TypeScript
- react-native-svg (path line drawing)
- react-native-gesture-handler (touch handling)
- @react-native-async-storage/async-storage (persistence)
- expo-audio (sound)

### Project structure
```
src/
├── screens/
│   ├── HomeScreen.tsx
│   └── GameScreen.tsx
├── components/
│   ├── GridCell.tsx      — single cell with wall overlays
│   ├── PathLine.tsx      — SVG path line + visited cell highlights
│   ├── WinScreen.tsx     — overlay with stars, quote, medal
│   └── LoadingScreen.tsx — animated loading dots
└── game/
    ├── types.ts          — Cell, Walls, GameGrid types
    ├── gameLogic.ts      — canMoveTo, isGameComplete, wall checking
    ├── generator.ts      — Hamiltonian path + wall generation
    ├── storage.ts        — AsyncStorage helpers
    ├── themes.ts         — 6 visual themes
    └── medals.ts         — medal definitions and helpers
```

### Key implementation details
- PanResponder for touch handling with `pageX/pageY` for cross-platform accuracy
- Grid offset measured via `ref.measure()` for correct touch-to-cell mapping
- `panResponder` wrapped in `useRef` to avoid stale closure issues
- All stale state inside panResponder accessed via refs (`gridDataRef`, `cellSizeRef`, `totalStarsRef`, `secondsRef`)
- Nodes rendered in a separate absolute layer on top of SVG path line so they're always visible
- Walls rendered as thick black overlays on cell edges
- `canMoveTo` checks adjacency, path membership, wall between cells, and node order
- Win screen appears 1500ms after completion to let sound play fully

### Polish
- SafeAreaView on all screens
- 1 second delay before win screen appears
- Hint button shows remaining hints (e.g. Hint 3/3) and disables at 0
- Back/Home button in game screen header
- App icon and splash screen (1024x1024 PNG)
- Production build via EAS Build (`eas build -p android --profile preview`)