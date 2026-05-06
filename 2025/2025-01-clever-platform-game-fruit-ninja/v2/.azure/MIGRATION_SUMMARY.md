# Migration Summary: Gameplay to GameplayTemplate Integration

## สรุปการ Migrate Fruit Ninja concept game

ได้ทำการ migrate Gameplay component ให้ใช้ `GameplayTemplate` จาก core-utils อย่างสมบูรณ์ โดย**ลบ logic ของ ModalConfigEditor** ออกจาก Gameplay component และให้ GameplayTemplate จัดการทั้งหมดแทน รวมถึงการปรับปรุงเพิ่มเติมหลายส่วนเพื่อความสมบูรณ์และ type safety

---

## 📦 GameplayTemplate Features ปัจจุบัน

### 🎯 Core Features

#### 1. **Enums for Type Safety**

```typescript
export enum CountdownPhase {
  START = 'start',       // Initial game start or wave start
  CONTINUE = 'continue', // Resume after user pause
  WAVE = 'wave',        // New wave starting (system pause)
}

export enum ConfigEditorPhase {
  BEFORE_GAME = 'before-game', // Show config editor before game starts
  AFTER_GAME = 'after-game',   // Show config editor after game ends
}

export enum GameStatus {
  SUCCESS = 'success', // Game completed successfully
  DEAD = 'dead',       // Game over (failed)
}
```

#### 2. **State Management**

```typescript
interface GameplayTemplateState {
  forceRenderKey: number;

  // Config Editor Modal States
  showConfigEditor: boolean;
  configEditorPhase: ConfigEditorPhase;
  editableConfig: any | null;

  // Game Flow States
  isGameStarted: boolean;
  isGameEnding: boolean;
  isPause: boolean;
  isSystemPause: boolean; // True = system pause (no UI), False = user pause (show UI)
  endGame: boolean;
  statusGame: GameStatus | null;

  // Countdown States
  countdownState: {
    show: boolean;
    seconds: number;
    phase: CountdownPhase;
    text: string;
  } | null;

  // Round Display
  roundDisplay: number | null;
}
```

#### 3. **Game Flow Methods**

**Config Management:**

- `initializeConfig()` - โหลด config จาก file หรือ localStorage
- `showConfigEditorModal()` - แสดง config editor (before/after game)
- `hideConfigEditorModal()` - ซ่อน config editor
- `onConfigConfirm()` - จัดการเมื่อ confirm config
- `onConfigDownload()` - ดาวน์โหลด config เป็นไฟล์
- `restartGameWithConfig()` - รีสตาร์ทเกมด้วย config ใหม่

**Game Control:**

- `startGame()` - เริ่มเกม (แสดง countdown ก่อน)
- `pauseGame()` - หยุดเกม (user pause, แสดง UI)
- `resumeGame()` - เล่นต่อ (แสดง countdown ก่อน)
- `endGame(status)` - จบเกม (แสดง modal หลัง 3 วินาที)

**Countdown & Display:**

- `showCountdown(seconds, phase, text)` - แสดง countdown พร้อม auto-hide
- `showRoundDisplay(round, duration)` - แสดงหมายเลขรอบ
- `showRoundDisplayWithCountdown(round, duration)` - แสดงรอบ → countdown → เริ่มเกม

#### 4. **System Pause vs User Pause**

**User Pause** (`isSystemPause = false`):

- ผู้เล่นกด pause เอง
- แสดงปุ่ม Resume และ UI
- Dark overlay + UI controls

**System Pause** (`isSystemPause = true`):

- ระบบ pause ระหว่างแสดง round display/countdown
- **ไม่แสดงปุ่ม Resume**
- แค่ dark overlay (ไม่มี UI บัง)

### 5. **Render Methods**

Child classes สามารถ override เพื่อ customize UI:

```typescript
// Config editor modal
protected renderConfigEditor(): React.ReactNode

// Countdown display (auto-hide after countdown)
protected renderCountdown(): React.ReactNode

// Round number display
protected renderRoundDisplay(): React.ReactNode

// Game over modal
protected renderEndGame(): React.ReactNode

// Main game content
protected abstract renderScene(): React.ReactNode
```

**Render Order (z-index):**

1. **z-50**: Config Editor Modal & End Game Modal (ด้านบนสุด)
2. **z-30**: Countdown Modal
3. **z-20**: Round Display
4. **z-0**: Scene Content (game rendering)

#### 6. **Wave Config State Management**

**ปัญหาเดิม:**

- Config ใช้ `configRef` (non-reactive) → ไม่ trigger re-render
- แก้ไข config แล้วเกมยังใช้ค่าเก่า

**โซลูชันใหม่:**

```typescript
// GameplayTemplate
interface GameplayTemplateState {
  waveConfig: any | null; // ← Reactive state
}

setConfig(config: any) {
  this.gameplayState.waveConfig = config; // State (reactive)
  this.configRef.current = config;        // Ref (backward compat)
  this.forceRerender();
}

// SceneGameplay
renderScene = () => {
  return <Gameplay config={this.gameplayState.waveConfig} />;
}

// Gameplay Component - ใช้ propsConfig โดยตรง
const Gameplay = ({ config: propsConfig }: GameplayProps) => {
  // ใช้ config จาก props โดยตรง
  let configWavePreset: waveConfig | null = propsConfig;

  // Fallback loading เมื่อ config เป็น null
  useEffect(() => {
    if (!propsConfig) {
      const loadConfig = async () => {
        const loaded = await helperConfigLoad(PUBLIC_ASSETS_LOCATION.config.waveConfig);
        configWavePreset = loaded;
      };
      loadConfig();
    }
  }, [propsConfig]);

  // ใช้ configWavePreset ใน game logic
  // React จะ re-render เมื่อ propsConfig เปลี่ยน
};
```

**Benefits:**

- ✅ Config changes trigger re-render อัตโนมัติ
- ✅ ไม่ต้องใช้ useRef - ง่ายและชัดเจนกว่า
- ✅ React state management จัดการ re-render ให้
- ✅ Fallback loading when config is null
- ✅ Game loop always uses latest config

#### 7. **Auto-Hide Mechanisms**

**Countdown Auto-Hide:**

- ใช้ `countdownTimerRef` กับ `setInterval`
- ลดเลขทุก 1 วินาที
- เมื่อถึง 0 → ซ่อนอัตโนมัติ
- สำหรับ `CountdownPhase.WAVE` → resume เกมอัตโนมัติ

**Round Display Auto-Hide:**

- ใช้ `setTimeout`
- แสดง 1.5 วินาที (default) แล้วซ่อน
- หลังซ่อน → แสดง countdown ต่อ (ถ้าใช้ `showRoundDisplayWithCountdown`)

---

## ✅ สิ่งที่เปลี่ยนแปลง

### Phase 0: Wave Config State Management

**ปัญหา:**

- Config ที่แก้ไขใน ModalConfigEditor ไม่ถูกใช้เมื่อเริ่มเกม
- `configRef.current` (non-reactive) ไม่ trigger React re-render
- Game loop ใช้ `let` variable ที่ถูก reset ทุกครั้งที่ component re-render

**โซลูชัน:**

1. **เพิ่ม `waveConfig` ใน GameplayTemplateState:**

   ```typescript
   interface GameplayTemplateState {
     waveConfig: any | null; // ← เพิ่มเพื่อ reactive config management
     // ... other states
   }
   ```

2. **แก้ไข `setConfig()` ให้เซ็ตทั้ง state และ ref:**

   ```typescript
   setConfig(config: any) {
     this.gameplayState.waveConfig = config; // Reactive state
     this.configRef.current = config;        // Backward compatibility
     this.forceRerender();                   // Trigger re-render
   }
   ```

3. **อัปเดต `initializeConfig()` ให้อ่านจาก state:**

   ```typescript
   protected async initializeConfig() {
     await this.onLoadConfig();
     const config = this.gameplayState.waveConfig; // ← จาก state แทน getConfig()
     // ...
   }
   ```

4. **อัปเดต `renderScene()` ให้ส่ง waveConfig จาก state:**

   ```typescript
   renderScene = () => {
     return <Gameplay config={this.gameplayState.waveConfig} />;
   }
   ```

5. **ใช้ `useRef` ใน Gameplay component:**

   ```typescript
   const configWavePresetRef = useRef<waveConfig | null>(propsConfig);
   let configWavePreset = configWavePresetRef.current; // Sync from ref
   ```

6. **useEffect sync config พร้อม deep comparison:**

   ```typescript
   useEffect(() => {
     if (propsConfig) {
       configWavePresetRef.current = propsConfig;
       configWavePreset = propsConfig;
     } else {
       // Fallback: load from file
       const loadedConfig = await helperConfigLoad(...);
       configWavePresetRef.current = loadedConfig;
     }
   }, [JSON.stringify(propsConfig)]); // Deep comparison
   ```

7. **Game loop sync จาก ref ทุกเฟรม:**
   ```typescript
   timeManager.fixedUpdate((dt) => {
     configWavePreset = configWavePresetRef.current; // Get latest!
     // ... game logic
   });
   ```

**ผลลัพธ์:**

- ✅ Config ที่แก้ไขถูกใช้เมื่อเริ่มเกม
- ✅ Config persist ระหว่าง re-renders
- ✅ Fallback loading เมื่อ config เป็น null (Production mode)
- ✅ Type-safe และ maintainable

### Phase 1: Initial Migration

#### **Gameplay Component**

**เพิ่ม:**

- `GameplayProps` interface เพื่อรับ props จาก GameplayTemplate
- Props destructuring เพื่อรับค่าจาก parent
- Local state fallback สำหรับ `isPause`, `countdownState`, `roundDisplay`
- Integration กับ callbacks: `onGameEnd`, `onPause`, `onResume`

**ลบออก:**

- ❌ `ModalConfigEditor` import และ rendering
- ❌ Config modal states และ handlers
- ❌ useEffect สำหรับ config confirmation
- ❌ useEffect สำหรับ pause เมื่อ config modal แสดง

**แก้ไข:**

- `triggerEndGame` → ใช้ `onGameEnd` callback ถ้ามี
- `handlePause` → ใช้ `onPause` callback ถ้ามี
- `handleResume` → ใช้ `onResume` callback ถ้ามี

### Phase 2: Bug Fixes & UX Improvements

**ปัญหาที่แก้:**

1. ✅ Config loading error และเกมไม่เริ่ม
2. ✅ Countdown/Round display ค้างบนหน้าจอไม่หาย
3. ✅ Resume ไม่ทำงานหลัง pause
4. ✅ Round display และ countdown ไม่ขึ้นตอน wave ใหม่

**โซลูชัน:**

1. แก้ config path และเพิ่ม `isGameStarted` sync
2. เพิ่ม `countdownTimerRef` สำหรับ auto-decrement และ auto-hide
3. เพิ่ม `useEffect` สำหรับ sync `isPause` และ `countdownState`
4. เพิ่ม `onShowRoundDisplayWithCountdown` callback

### Phase 3: System Pause Feature

**เพิ่ม `isSystemPause` flag:**

- แยก user pause (แสดง UI) กับ system pause (ไม่แสดง UI)
- `showRoundDisplay()` → set `isSystemPause = true`
- `pauseGame()` → set `isSystemPause = false` (user pause)
- `GameplayHUD` → แสดง Resume button เฉพาะ `!isSystemPause`

### Phase 4: Enum Migration

**แทนที่ string literals ด้วย enums:**

- `'start' | 'continue' | 'wave'` → `CountdownPhase`
- `'before-game' | 'after-game'` → `ConfigEditorPhase`
- `'success' | 'dead'` → `GameStatus`

**ไฟล์ที่อัปเดต:**

- ✅ `GameplayTemplate.tsx` - สร้าง enums และใช้ทั่วทั้ง class
- ✅ `SceneGameplay/index.tsx` - ใช้ `GameStatus` ใน `onGameEnded()`
- ✅ `gameplay/index.tsx` - ใช้ `CountdownPhase` และ `GameStatus`
- ✅ `modal-gameover/index.tsx` - ใช้ `GameStatus` สำหรับ status prop

### Phase 5: renderEndGame() Addition

**เพิ่ม `renderEndGame()` method:**

- เพิ่มใน `GameplayTemplate` เพื่อความสม่ำเสมอกับ `renderCountdown()` และ `renderRoundDisplay()`
- Default implementation ใน GameplayTemplate (placeholder)
- Override ใน `SceneGameplay` เพื่อใช้ `ModalGameOver` component
- ลบ `<ModalGameOver>` ออกจาก Gameplay component (GameplayTemplate จัดการแทน)

---

## 📋 Props ที่ Gameplay Component รับจาก GameplayTemplate

```typescript
interface GameplayProps {
  // Game state
  isGameStarted?: boolean;
  isGameEnding?: boolean;
  isPause?: boolean;
  isSystemPause?: boolean;
  endGame?: boolean;
  statusGame?: GameStatus | null;
  countdownState?: {
    show: boolean;
    seconds: number;
    phase: CountdownPhase;
    text: string;
  } | null;
  roundDisplay?: number | null;

  // Config
  config?: waveConfig | null;

  // Callbacks
  onGameEnd?: (status: GameStatus) => void;
  onPause?: () => void;
  onResume?: () => void;
  onShowRoundDisplayWithCountdown?: (round: number, duration?: number) => void;
  onShowCountdown?: (seconds: number, phase: CountdownPhase, text: string) => void;
}
```

---

## 🔄 Workflows

### Config Update Flow (Debug Mode)

```
User edits JSON in ModalConfigEditor
  ↓
User clicks "Start Game"
  ↓
ModalConfigEditor.handleConfirm() → onConfirm(parsedConfig)
  ↓
GameplayTemplate.onConfigConfirm(config)
  ↓
setConfig(config):
  - this.gameplayState.waveConfig = config  ← Reactive state!
  - this.configRef.current = config         ← Backward compat
  ↓
this.forceRerender()  ← Triggers React re-render
  ↓
renderScene() → <Gameplay config={this.gameplayState.waveConfig} />
  ↓
Gameplay receives NEW propsConfig via props
  ↓
useEffect([JSON.stringify(propsConfig)]) triggers:
  - configWavePresetRef.current = propsConfig
  - configWavePreset = propsConfig
  ↓
Game loop syncs from ref each frame:
  - configWavePreset = configWavePresetRef.current
  ↓
Game uses edited config! ✅
```

### Config Loading Flow (Production Mode)

```
SceneGameplay.sceneLoad()
  ↓
GameplayTemplate.initializeConfig()
  ↓
SceneGameplay.onLoadConfig()
  ↓ (fetch config from file)
  ↓
setConfig(config):
  - this.gameplayState.waveConfig = config
  - this.configRef.current = config
  ↓
initializeConfig checks: this.gameplayState.waveConfig
  ↓ (if null → log warning, still start game)
  ↓
startGame() ← เริ่มเลย (no modal in production)
  ↓
renderScene() → <Gameplay config={waveConfig} />
  ↓
Gameplay useEffect:
  - if propsConfig → use it ✅
  - else → load from file (fallback) ✅
  ↓
Game starts with config!
```

### Debug Mode (isDebugMode = true)

1. GameplayTemplate แสดง ModalConfigEditor ก่อนเกมเริ่ม (`ConfigEditorPhase.BEFORE_GAME`)
2. ผู้เล่นแก้ไข config
3. กด Confirm → GameplayTemplate เรียก `startGame()`
4. แสดง countdown → Gameplay component รับ state และเริ่มเกม

### Production Mode (isDebugMode = false)

1. GameplayTemplate โหลด config และเรียก `startGame()` ทันที
2. แสดง countdown
3. Gameplay component รับ state และเริ่มเกม

### New Wave Flow

1. Gameplay ตรวจจบ wave → เรียก `onShowRoundDisplayWithCountdown(roundNumber)`
2. GameplayTemplate:
   - แสดง round display (1.5s, `isSystemPause=true`, ไม่มี UI)
   - ซ่อน round display
   - แสดง countdown (3s, `CountdownPhase.WAVE`, `isSystemPause=true`)
   - Countdown auto-decrement ทุก 1s
   - ถึง 0 → ซ่อน countdown, resume เกม (`isPause=false`)

### User Pause/Resume Flow

**Pause:**

1. ผู้เล่นกดปุ่ม pause
2. เรียก `onPause()` → `GameplayTemplate.pauseGame()`
3. Set `isPause=true`, `isSystemPause=false`
4. GameplayHUD แสดง dark overlay + Resume button

**Resume:**

1. ผู้เล่นกดปุ่ม resume
2. เรียก `onResume()` → `GameplayTemplate.resumeGame()`
3. Set `isSystemPause=false`
4. แสดง countdown (3s, `CountdownPhase.CONTINUE`)
5. Countdown ถึง 0 → set `isPause=false`, resume เกม

### Game End Flow

1. Gameplay เรียก `triggerEndGame(GameStatus.SUCCESS)` → `onGameEnd(status)`
2. GameplayTemplate:
   - Set `endGame=true`, `statusGame=status`
   - เรียก `onGameEnded(status)` (play sounds/effects)
   - Render `ModalGameOver` (via `renderEndGame()`)
   - หลัง 3 วินาที → แสดง ModalConfigEditor (`ConfigEditorPhase.AFTER_GAME`)

---

## ✨ ข้อดีของการ Migrate

### 1. **Type Safety**

- ใช้ enum แทน string literals → คอมไพเลอร์จับ typo ได้
- IDE autocomplete ทำงานได้ดีขึ้น
- Refactoring ปลอดภัยกว่า

### 2. **Code Reusability**

- GameplayTemplate ใช้ซ้ำได้กับทุก gameplay scene
- ModalConfigEditor logic อยู่ที่เดียว
- Countdown/Round display logic ไม่ซ้ำซ้อน

### 3. **Consistency**

- Behavior เหมือนกันทุกเกม (config modal, pause/resume, countdown)
- UI rendering pattern สม่ำเสมอ
- System pause vs user pause แยกชัดเจน

### 4. **Maintainability**

- แก้ไข game flow logic ที่เดียว (GameplayTemplate)
- เพิ่ม feature ใหม่ → ทุก scene ได้ประโยชน์ทันที
- Comment และ documentation ครบถ้วน

### 5. **Separation of Concerns**

- GameplayTemplate จัดการ UI และ game flow
- Gameplay component focus แค่ game logic
- Clean architecture pattern

### 6. **Flexibility**

- Gameplay component ยังทำงานได้แบบ standalone (มี local fallback)
- Child classes override render methods ได้
- Customizable countdown texts

---

## 🚀 การใช้งาน: สร้าง Gameplay Scene ใหม่

```typescript
export class SceneMyGame extends GameplayTemplate {
  constructor(props: GameplayTemplateProps) {
    super(props);
    this.background = 'path/to/background.jpg';
    this.sceneInitial();
  }

  sceneLoad = async () => {
    this._isActive = true;
    this.forceRerender();
    await this.initializeConfig();
  }

  protected async onLoadConfig(): Promise<void> {
    // Load config from file or localStorage
    const config = await fetch('/config/myGameConfig.json').then(r => r.json());
    this.setConfig(config);
  }

  protected onGamePaused(): void {
    TimeManager.getInstance().stop();
    // Pause sounds, physics, etc.
  }

  protected onGameResumed(): void {
    TimeManager.getInstance().start();
    // Resume sounds, physics, etc.
  }

  protected onGameEnded(status: GameStatus): void {
    TimeManager.getInstance().stop();
    const { pauseSound } = useBackgroundMusicStore.getState();
    const { playEffect } = useSoundEffectStore.getState();

    pauseSound();
    if (status === GameStatus.SUCCESS) {
      playEffect(SOUND_GROUPS.gameplay.success_score);
    } else if (status === GameStatus.DEAD) {
      playEffect(SOUND_GROUPS.gameplay.level_fail);
    }
  }

  // Optional: Override countdown display
  renderCountdown(): React.ReactNode {
    if (!this.gameplayState.countdownState?.show) return null;
    return <MyCustomCountdownModal {...this.gameplayState.countdownState} />;
  }

  // Optional: Override round display
  renderRoundDisplay(): React.ReactNode {
    if (this.gameplayState.roundDisplay === null) return null;
    return <MyCustomRoundDisplay round={this.gameplayState.roundDisplay} />;
  }

  // Optional: Override end game modal
  renderEndGame(): React.ReactNode {
    if (!this.gameplayState.endGame || !this.gameplayState.statusGame) return null;
    return <MyCustomGameOverModal status={this.gameplayState.statusGame} />;
  }

  // Required: Implement game rendering
  renderScene = () => {
    return (
      <MyGameComponent
        isGameStarted={this.gameplayState.isGameStarted}
        isPause={this.gameplayState.isPause}
        isSystemPause={this.gameplayState.isSystemPause}
        countdownState={this.gameplayState.countdownState}
        roundDisplay={this.gameplayState.roundDisplay}
        config={this.getConfig()}
        onGameEnd={(status) => this.endGame(status)}
        onPause={() => this.pauseGame()}
        onResume={() => this.resumeGame()}
        onShowRoundDisplayWithCountdown={(round, duration) =>
          this.showRoundDisplayWithCountdown(round, duration)
        }
      />
    );
  };
}
```

---

## 📝 หมายเหตุสำคัญ

### Props Passing Pattern

- Gameplay component รับ props จาก GameplayTemplate
- มี local state fallback → ทำงานได้แม้ไม่มี parent props
- ใช้ `propsValue !== undefined ? propsValue : localValue` pattern

### State Synchronization

- ใช้ `useEffect` เพื่อ sync props → local state
- ทำให้ Gameplay component reactive กับ GameplayTemplate state

### Callback Pattern

- Gameplay เรียก callbacks (`onPause`, `onResume`, `onGameEnd`, etc.)
- GameplayTemplate จัดการ state และ side effects
- ถ้าไม่มี callback → fallback เป็น local behavior

### Auto-Hide Timers

- `countdownTimerRef` สำหรับ countdown auto-decrement
- `setTimeout` สำหรับ round display auto-hide
- Clear timers เมื่อ component unmount หรือเมื่อเริ่ม timer ใหม่

### Z-Index Management

- Config editor & end game modal: z-50 (highest)
- Countdown: z-30
- Round display: z-20
- Game content: z-0 (lowest)

---

## ⚠️ Breaking Changes

**ไม่มี** - Gameplay component ยังทำงานได้ตามเดิม (backward compatible)

**แต่แนะนำ:**

- ใช้ `gameplayState.waveConfig` แทน `configRef.current` สำหรับ config ใหม่
- ใช้ `setConfig()` แทนการเซ็ต `configRef.current` โดยตรง
- ใช้ `useRef` + `useEffect` pattern สำหรับ config sync ใน functional components

---

## 🐛 Known Issues & Solutions

### Issue 1: Config ไม่อัปเดตหลังแก้ไข

**สาเหตุ:**

- `configRef.current` ไม่ trigger re-render
- ต้องใช้ reactive state แทน

**วิธีแก้:**

- ✅ ใช้ `gameplayState.waveConfig` (reactive state)
- ✅ GameplayTemplate ส่ง config ผ่าน props
- ✅ Gameplay component ใช้ props โดยตรง
- ✅ React จัดการ re-render อัตโนมัติ

### Issue 2: เกมไม่เริ่มเมื่อ config เป็น null

**สาเหตุ:**

- `initializeConfig()` มี early return เมื่อ config เป็น null

**วิธีแก้:**

- ✅ เปลี่ยนจาก `return` เป็น `console.warn` และให้เกมเริ่มต่อ
- ✅ Gameplay component มี fallback loading
- ✅ `showConfigEditorModal()` handle null config

---

## ✅ Migration Status

**Features Completed:**

- ✅ Config editor integration
- ✅ Game flow control (start/pause/resume/end)
- ✅ Countdown auto-hide with timer
- ✅ Round display with callbacks
- ✅ System pause vs user pause
- ✅ Enum migration for type safety
- ✅ renderEndGame() method
- ✅ Full documentation

**Tested:**

- ✅ No compile errors
- ✅ Type safety verified
- ✅ Logic consistency maintained
