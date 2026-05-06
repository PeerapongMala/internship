# GameplayTemplate Usage Guide

## ภาพรวม

`GameplayTemplate` เป็น abstract class ที่ extend จาก `SceneTemplate` และรวม logic ร่วมกันสำหรับ gameplay scenes ทั้งหมด เช่น:

- **ModalConfigEditor Management** (ก่อนและหลังเกม)
- **Game Flow Control** (start, pause, resume, end)
- **Countdown Management** (auto-hide with timer)
- **Round Display** (with auto-hide)
- **End Game Modal** (customizable)
- **Config Loading & Storage**
- **System Pause vs User Pause** (แยก UI ชัดเจน)
- **Type Safety** (Enums for CountdownPhase, ConfigEditorPhase, GameStatus)

---

## 🎯 Enums

GameplayTemplate ใช้ enums เพื่อ type safety แทนการใช้ string literals:

```typescript
// Countdown phases
export enum CountdownPhase {
  START = 'start',       // Initial game start or wave start
  CONTINUE = 'continue', // Resume after user pause
  WAVE = 'wave',        // New wave starting (system pause)
}

// Config editor phases
export enum ConfigEditorPhase {
  BEFORE_GAME = 'before-game', // Show config editor before game starts
  AFTER_GAME = 'after-game',   // Show config editor after game ends
}

// Game end status
export enum GameStatus {
  SUCCESS = 'success', // Game completed successfully
  DEAD = 'dead',       // Game over (failed)
}
```

---

## การใช้งานสำหรับเกมใหม่

### 1. สร้าง Scene Class ที่ extend จาก GameplayTemplate

```typescript
import {
  GameplayTemplate,
  GameplayTemplateProps,
  GameStatus,
  CountdownPhase,
} from '@core-utils/scene/GameplayTemplate';
import { TimeManager } from '@core-utils/timer/time-manager';
import { useBackgroundMusicStore } from '@core-utils/sound/store/backgroundMusic';
import { useSoundEffectStore } from '@core-utils/sound/store/soundEffect';

export class SceneMyGame extends GameplayTemplate {
  constructor(props: GameplayTemplateProps) {
    super(props);
    this.background = 'path/to/background.jpg';
    this.sceneInitial();
  }

  // Override sceneLoad เพื่อ load config เมื่อ scene active
  sceneLoad = async () => {
    this._isActive = true;
    this.forceRerender();
    await this.initializeConfig();
  }

  // Implement: Load game config
  protected async onLoadConfig(): Promise<void> {
    let config = null;
    try {
      const response = await fetch('/config/myGameConfig.json');
      if (response.ok) {
        config = await response.json();
      }
    } catch (err) {
      console.error('Failed to load config:', err);
    }

    if (config) {
      this.setConfig(config);
    }
  }

  // Implement: เมื่อเกม pause
  protected onGamePaused(): void {
    TimeManager.getInstance().stop();
    const { pauseSound } = useBackgroundMusicStore.getState();
    pauseSound();
  }

  // Implement: เมื่อเกม resume
  protected onGameResumed(): void {
    TimeManager.getInstance().start();
    const { resumeSound } = useBackgroundMusicStore.getState();
    resumeSound();
  }

  // Implement: เมื่อเกมจบ (ใช้ GameStatus enum)
  protected onGameEnded(status: GameStatus): void {
    TimeManager.getInstance().stop();
    const { pauseSound } = useBackgroundMusicStore.getState();
    const { playEffect } = useSoundEffectStore.getState();

    pauseSound();
    if (status === GameStatus.SUCCESS) {
      playEffect('success_sound');
    } else if (status === GameStatus.DEAD) {
      playEffect('fail_sound');
    }
  }

  // Optional: Override countdown display
  renderCountdown(): React.ReactNode {
    if (!this.gameplayState.countdownState?.show) return null;

    const { seconds, text } = this.gameplayState.countdownState;
    return <CustomCountdownModal seconds={seconds} text={text} />;
  }

  // Optional: Override round display
  renderRoundDisplay(): React.ReactNode {
    if (this.gameplayState.roundDisplay === null) return null;

    return <CustomRoundDisplay round={this.gameplayState.roundDisplay} />;
  }

  // Optional: Override end game modal
  renderEndGame(): React.ReactNode {
    if (!this.gameplayState.endGame || !this.gameplayState.statusGame) return null;

    return <CustomGameOverModal status={this.gameplayState.statusGame} />;
  }

  // Required: Render game component
  renderScene = () => {
    return (
      <MyGameComponent
        isGameStarted={this.gameplayState.isGameStarted}
        isPause={this.gameplayState.isPause}
        isSystemPause={this.gameplayState.isSystemPause}
        countdownState={this.gameplayState.countdownState}
        roundDisplay={this.gameplayState.roundDisplay}
        endGame={this.gameplayState.endGame}
        statusGame={this.gameplayState.statusGame}
        config={this.getConfig()}
        onGameEnd={(status) => this.endGame(status)}
        onPause={() => this.pauseGame()}
        onResume={() => this.resumeGame()}
        onShowRoundDisplayWithCountdown={(round, duration) =>
          this.showRoundDisplayWithCountdown(round, duration)
        }
        onShowCountdown={(seconds, phase, text) =>
          this.showCountdown(seconds, phase, text)
        }
      />
    );
  };
}
```

### 2. สร้าง Game Component ที่รับ Props จาก GameplayTemplate

```typescript
import { GameStatus, CountdownPhase } from '@core-utils/scene/GameplayTemplate';

interface MyGameComponentProps {
  // Game state from GameplayTemplate
  isGameStarted?: boolean;
  isPause?: boolean;
  isSystemPause?: boolean;
  countdownState?: {
    show: boolean;
    seconds: number;
    phase: CountdownPhase;
    text: string;
  } | null;
  roundDisplay?: number | null;
  endGame?: boolean;
  statusGame?: GameStatus | null;

  // Config
  config?: MyGameConfig | null;

  // Callbacks to GameplayTemplate
  onGameEnd?: (status: GameStatus) => void;
  onPause?: () => void;
  onResume?: () => void;
  onShowRoundDisplayWithCountdown?: (round: number, duration?: number) => void;
  onShowCountdown?: (seconds: number, phase: CountdownPhase, text: string) => void;
}

const MyGameComponent = ({
  isGameStarted,
  isPause,
  isSystemPause,
  config,
  onGameEnd,
  onPause,
  onResume,
  onShowRoundDisplayWithCountdown,
}: MyGameComponentProps) => {

  // เมื่อจบ wave และต้องการเริ่ม wave ใหม่
  const handleWaveComplete = () => {
    const nextWave = currentWave + 1;

    // แสดง round display (1.5s) → countdown (3s) → เริ่มเกม
    onShowRoundDisplayWithCountdown?.(nextWave);
  };

  // เมื่อต้องการจบเกม
  const handleGameOver = () => {
    onGameEnd?.(GameStatus.DEAD);
  };

  // เมื่อผ่านด่านสำเร็จ
  const handleLevelComplete = () => {
    onGameEnd?.(GameStatus.SUCCESS);
  };

  // เมื่อผู้เล่นกด pause
  const handleUserPause = () => {
    onPause?.();
  };

  return (
    <div>
      {/* Game HUD */}
      <GameHUD
        isPause={isPause}
        isSystemPause={isSystemPause} // ถ้า true = ไม่แสดงปุ่ม Resume
        onPause={handleUserPause}
        onResume={onResume}
      />

      {/* Game content */}
      {/* ... */}
    </div>
  );
};
```

---

## Features ที่ได้จาก GameplayTemplate

### 1. Config Editor Modal (Auto)

- **Debug Mode** (`VITE_DEBUG_MODE=true`): แสดง modal ก่อนเกมเริ่ม ให้แก้ไข config ได้
- **Production Mode**: ข้าม modal และเริ่มเกมทันที
- **หลังเกมจบ**: แสดง modal ให้ดาวน์โหลดหรือปรับ config (หลัง 3 วินาที)

**Config State Management:**

```typescript
// GameplayTemplate uses reactive state instead of ref
interface GameplayTemplateState {
  waveConfig: any | null; // ← Reactive config state
}

// Set config (triggers re-render)
setConfig(config: any) {
  this.gameplayState.waveConfig = config; // State update
  this.configRef.current = config;        // Backward compat
  this.forceRerender();                   // Re-render
}

// Get config
const config = this.getConfig();
// or
const config = this.gameplayState.waveConfig;
```

### 2. Countdown Management (Auto-Hide)

```typescript
// แสดง countdown พร้อม auto-hide
this.showCountdown(3, CountdownPhase.WAVE, 'เกมกำลังจะเริ่ม!');
// จะนับถอยหลัง 3 → 2 → 1 → ซ่อนอัตโนมัติ

// สำหรับ resume หลัง user pause
this.showCountdown(3, CountdownPhase.CONTINUE, 'เกมกำลังจะเริ่มต่อใน');

// Manual hide (ถ้าจำเป็น)
this.hideCountdown();
```

**Features:**

- ✅ Auto-decrement ทุก 1 วินาที
- ✅ Auto-hide เมื่อนับถึง 0
- ✅ สำหรับ `CountdownPhase.WAVE` จะ resume เกมอัตโนมัติ
- ✅ System pause ระหว่าง countdown (ไม่แสดง UI)

### 3. Round Display (Auto-Hide)

```typescript
// แสดงหมายเลข round พร้อม auto-hide
this.showRoundDisplay(2); // แสดง "Round 2" เป็นเวลา 1.5 วินาที

// Custom duration
this.showRoundDisplay(3, 2000); // แสดง 2 วินาที

// แสดงรอบ → countdown → เริ่มเกม (One-liner!)
this.showRoundDisplayWithCountdown(2);
// = showRoundDisplay(2) → wait 1.5s → showCountdown(3, WAVE, ...) → resume
```

**Features:**

- ✅ Auto-hide หลังจาก duration (default 1.5s)
- ✅ System pause ระหว่างแสดง (ไม่แสดง UI)
- ✅ `showRoundDisplayWithCountdown()` จัดการ flow ทั้งหมดให้

### 4. End Game Modal

```typescript
// จบเกมด้วย GameStatus enum
this.endGame(GameStatus.SUCCESS); // ชนะ
this.endGame(GameStatus.DEAD);    // แพ้

// GameplayTemplate จะ:
// 1. Set endGame = true, statusGame = status
// 2. เรียก onGameEnded(status) - play sounds/effects
// 3. Render modal via renderEndGame()
// 4. หลัง 3 วินาที → แสดง Config Editor (AFTER_GAME)
```

**Features:**

- ✅ `renderEndGame()` ที่ child class override ได้
- ✅ Auto-show config editor หลัง 3 วินาที
- ✅ Type-safe กับ GameStatus enum

### 5. Game Flow Control

```typescript
// เริ่มเกม (แสดง countdown ก่อนเริ่ม)
this.startGame();
// → showCountdown(3, CountdownPhase.WAVE, ...) → resume game

// Pause เกม (User pause)
this.pauseGame();
// → isPause = true, isSystemPause = false → แสดง UI

// Resume เกม (แสดง countdown ก่อน resume)
this.resumeGame();
// → showCountdown(3, CountdownPhase.CONTINUE, ...) → resume game

// Restart เกมด้วย config ใหม่ (save to localStorage + reload)
this.restartGameWithConfig(newConfig);
```

### 6. System Pause vs User Pause

**User Pause** (`isSystemPause = false`):

```typescript
this.pauseGame(); // ผู้เล่นกด pause
// → แสดง dark overlay + ปุ่ม Resume + UI controls
```

**System Pause** (`isSystemPause = true`):

```typescript
this.showRoundDisplay(2);     // หรือ
this.showCountdown(3, CountdownPhase.WAVE, '...');
// → แสดง dark overlay (ไม่มีปุ่ม Resume บัง)
```

ใน Game HUD:

```typescript
<GameHUD
  isPause={isPause}
  isSystemPause={isSystemPause}
  onResume={onResume}
/>

// Inside GameHUD:
{isPause && (
  <div className="overlay">
    {!isSystemPause && ( // แสดง UI เฉพาะ user pause
      <button onClick={onResume}>Resume</button>
    )}
  </div>
)}
```

### 7. Config Management

```typescript
// Get config
const config = this.getConfig();
// or
// Get config (from state)
const config = this.gameplayState.waveConfig;

// Set/Update config (updates both state and ref)
this.setConfig(newConfig);
// This will:
// 1. Set gameplayState.waveConfig = newConfig
// 2. Call forceRerender()

// ตรวจสอบว่าเกมเริ่มแล้วหรือยัง
const started = this.hasGameStarted();

// Set game started state (ใช้ manual ถ้าจำเป็น)
this.setGameStarted(true);
```

### 8. Game Component Config Handling

สำหรับ functional game component ที่ต้องการใช้ config:

```typescript
interface GameComponentProps {
  config?: MyGameConfig | null;
  // ... other props
}

const GameComponent = ({ config: propsConfig }: GameComponentProps) => {
  // ใช้ config จาก props โดยตรง
  let configWavePreset: waveConfig | null = propsConfig;

  // Fallback loading เมื่อ config เป็น null
  useEffect(() => {
    if (!propsConfig) {
      const loadConfig = async () => {
        console.log('Loading fallback config from file');
        const loadedConfig = await fetch('/config.json').then(r => r.json());
        configWavePreset = loadedConfig;
        console.log('✅ Fallback config loaded');
      };
      loadConfig();
    } else {
      configWavePreset = propsConfig;
      console.log('✅ Using config from props');
    }
  }, [propsConfig]);

  // ใช้ configWavePreset ใน game logic
  // React จะ re-render อัตโนมัติเมื่อ propsConfig เปลี่ยน

  return <div>...</div>;
};
```

**Key Points:**

- ✅ ใช้ config จาก props โดยตรง - ง่ายและชัดเจน
- ✅ React state management จัดการ re-render ให้
- ✅ Provide fallback loading when config is null
- ✅ ไม่ต้องใช้ useRef - ลด complexity

---

## การ Customize

### 1. Custom Countdown Text

```typescript
export class SceneMyGame extends GameplayTemplate {
  constructor(props: GameplayTemplateProps) {
    super(props);

    // Override countdown texts
    this.countdownTexts = {
      countdown_start: 'Get Ready!',
      countdown_continue: 'Resuming in',
    };
  }
}
```

### 2. Custom Countdown UI

```typescript
export class SceneMyGame extends GameplayTemplate {
  // Override renderCountdown method
  protected renderCountdown(): React.ReactNode {
    if (!this.gameplayState.countdownState?.show) {
      return null;
    }

    const { seconds, text, phase } = this.gameplayState.countdownState;

    return (
      <div className="custom-countdown">
        <h1>{text}</h1>
        <div className="number">{seconds}</div>
        {phase === CountdownPhase.WAVE && <p>New Wave!</p>}
      </div>
    );
  }
}
```

### 3. Custom Round Display

```typescript
export class SceneMyGame extends GameplayTemplate {
  // Override renderRoundDisplay method
  protected renderRoundDisplay(): React.ReactNode {
    if (this.gameplayState.roundDisplay === null) {
      return null;
    }

    return (
      <div className="custom-round-display">
        <h2>Level {this.gameplayState.roundDisplay}</h2>
        <p>Get Ready!</p>
      </div>
    );
  }
}
```

### 4. Custom End Game Modal

```typescript
import { ModalGameOver } from './components/ModalGameOver';

export class SceneMyGame extends GameplayTemplate {
  // Override renderEndGame method
  protected renderEndGame(): React.ReactNode {
    if (!this.gameplayState.endGame || !this.gameplayState.statusGame) {
      return null;
    }

    return <ModalGameOver status={this.gameplayState.statusGame} />;
  }
}
```

---

## Render Order & Z-Index

GameplayTemplate render UI elements ตามลำดับนี้ (z-index จากน้อยไปมาก):

```typescript
render = () => {
  return (
    <>
      {this._isActive && (
        <div className="game-container">
          <div className="background" />         {/* z-0 */}
          {this.content}                         {/* z-0 */}
          {this.renderScene()}                   {/* z-0: Game content */}
          {this.renderCountdown()}               {/* z-30: Countdown */}
          {this.renderRoundDisplay()}            {/* z-20: Round display */}
          {this.renderEndGame()}                 {/* z-50: End game modal */}
          {this.props.children}
        </div>
      )}
      {this.renderConfigEditor()}                {/* z-50: Config editor */}
    </>
  );
};
```

**Z-Index Priority:**

1. **z-50**: Config Editor & End Game Modal (highest - ด้านบนสุด)
2. **z-30**: Countdown Modal
3. **z-20**: Round Display
4. **z-0**: Game Content (lowest)

---

## Debug Mode

กำหนดใน `.env`:

```
VITE_DEBUG_MODE=true
```

เมื่อเปิด debug mode:

- ✅ แสดง Config Editor Modal ก่อนเกมเริ่ม
- ✅ สามารถแก้ไข config แบบ real-time
- ✅ ดาวน์โหลด config ที่แก้ไขแล้วเป็นไฟล์ JSON
- ✅ ทดสอบเกมด้วย config ต่างๆ ได้ง่าย

---

## Abstract Methods ที่ต้อง Implement

เมื่อสร้าง class ที่ extend จาก GameplayTemplate ต้อง implement methods เหล่านี้:

```typescript
export abstract class GameplayTemplate {
  // Load game config (required)
  protected abstract onLoadConfig(): Promise<void>;

  // เมื่อเกม pause (required)
  protected abstract onGamePaused(): void;

  // เมื่อเกม resume (required)
  protected abstract onGameResumed(): void;

  // เมื่อเกมจบ (required)
  protected abstract onGameEnded(status: GameStatus): void;

  // Render game content (required)
  protected abstract renderScene(): React.ReactNode;
}
```

---

## Migration จากเกมเดิม

หากต้องการย้าย logic จาก Gameplay component เดิมมาใช้ GameplayTemplate:

### ขั้นตอนที่ 1: Update Imports

```typescript
// เปลี่ยนจาก string literals
import {
  GameplayTemplate,
  GameplayTemplateProps,
  GameStatus,           // ← เพิ่ม
  CountdownPhase,       // ← เพิ่ม
  ConfigEditorPhase,    // ← เพิ่ม (ถ้าใช้)
} from '@core-utils/scene/GameplayTemplate';
```

### ขั้นตอนที่ 2: แทนที่ String Literals ด้วย Enums

```typescript
// ❌ เก่า
onGameEnded(status: 'success' | 'dead'): void {
  if (status === 'success') { ... }
}

// ใหม่
onGameEnded(status: GameStatus): void {
  if (status === GameStatus.SUCCESS) { ... }
}

// ❌ เก่า
triggerEndGame('dead');

// ใหม่
triggerEndGame(GameStatus.DEAD);
```

### ขั้นตอนที่ 3: ย้าย Config Loading

1. ลบ `configWevePresetLoad` ออกจาก Gameplay component
2. ย้ายไปใส่ใน `onLoadConfig()` ของ Scene class

### ขั้นตอนที่ 4: ลบ Config Modal States

ลบ states เหล่านี้จาก Gameplay component:

```typescript
// ❌ ลบออก
const [showConfigEditor, setShowConfigEditor] = useState(false);
const [configEditorPhase, setConfigEditorPhase] = useState('before-game');
const [editableConfig, setEditableConfig] = useState(null);
```

### ขั้นตอนที่ 5: ลบ Modal Handlers

ลบ handlers เหล่านี้:

```typescript
// ❌ ลบออก
const handleConfigConfirm = useCallback(...);
const handleConfigDownload = useCallback(...);
```

### ขั้นตอนที่ 6: ลบ Modal Rendering

ลบการ render modal ที่ท้าย component:

```typescript
// ❌ ลบออก
{showConfigEditor && editableConfig && (
  <ModalConfigEditor ... />
)}

// ❌ ลบออก (ย้ายไป SceneGameplay.renderEndGame())
{endGame && statusGame !== null && (
  <ModalGameOver status={statusGame} />
)}
```

### ขั้นตอนที่ 7: Setup Config ใน Game Component

**ใช้ config จาก props โดยตรง:**

```typescript
interface GameplayProps {
  config?: waveConfig | null;
  // ... other props
  onShowRoundDisplayWithCountdown?: (round: number, duration?: number) => void;
  onShowCountdown?: (seconds: number, phase: CountdownPhase, text: string) => void;
}

const Gameplay = ({ config: propsConfig, ...otherProps }: GameplayProps) => {
  // ใช้ config จาก props โดยตรง
  let configWavePreset: waveConfig | null = propsConfig;

  // Fallback loading เมื่อ config เป็น null
  useEffect(() => {
    if (!propsConfig) {
      const loadConfig = async () => {
        const loadedConfig = await helperConfigLoad('/config.json');
        configWavePreset = loadedConfig;
        console.log('✅ Fallback config loaded');
      };
      loadConfig();
    }
  }, [propsConfig]);

  // ใช้ configWavePreset ใน game logic
  // React จะ re-render อัตโนมัติเมื่อ propsConfig เปลี่ยน
};
```

### ขั้นตอนที่ 8: เรียก Callbacks เมื่อจบ wave

```typescript
// เรียกใช้เมื่อจบ wave
const handleWaveComplete = () => {
  onShowRoundDisplayWithCountdown?.(nextWave);
};
```

### ขั้นตอนที่ 9: ลบ import ที่ไม่ใช้

```typescript
// ❌ ลบออก
import { ModalConfigEditor } from '@core-utils/ui/modal-config-editor';
import { ModalGameOver } from './components/modal-gameover'; // ถ้าย้ายไป Scene แล้ว
```

---

## สรุป

✅ **ข้อดี:**

- ✅ **Type Safety** - ใช้ enums แทน string literals
- ✅ **Code Reusability** - ใช้ซ้ำได้กับทุก gameplay scene
- ✅ **Consistency** - Behavior เหมือนกันทุกเกม
- ✅ **Auto-Hide** - Countdown และ Round display ซ่อนอัตโนมัติ
- ✅ **System/User Pause** - แยก UI ชัดเจน (มี/ไม่มีปุ่ม)
- ✅ **Easy to Maintain** - แก้ไข logic ที่เดียว
- ✅ **Built-in Debug Tools** - Config editor ใน debug mode
- ✅ **Customizable** - Override render methods ได้ทุกส่วน
- ✅ **Reactive Config** - ใช้ state แทน ref → auto re-render
- ✅ **Simple Config Handling** - ใช้ props โดยตรง ไม่ต้อง useRef
- ✅ **Fallback Loading** - โหลด config จากไฟล์ถ้า props เป็น null

⚠️ **ข้อควรระวัง:**

- ⚠️ ต้อง implement abstract methods ทั้งหมด
- ⚠️ Config format ต้องเป็น JSON
- ⚠️ ต้องใช้ร่วมกับ SceneManager
- ⚠️ ต้องใช้ enums แทน string literals

🔑 **Config Management Best Practices:**

1. **ใน Scene Class:** ใช้ `setConfig()` แทนการเซ็ต ref โดยตรง
2. **ใน Game Component:** ใช้ config จาก props โดยตรง
3. **Fallback:** โหลดจากไฟล์เมื่อ props เป็น null
4. **React Handles Re-render:** ไม่ต้องจัดการ re-render manually
5. **Fallback:** โหลดจากไฟล์เมื่อ props เป็น null

---

## ตัวอย่างเกมที่ใช้ GameplayTemplate

- **`SceneGameplay`** (Fruit Ninja concept game)
- ✅ Full implementation พร้อม custom UI
- Custom countdown modal
- Custom round display
- Custom game over modal
- System pause integration

---

## Reference Quick Links

### Game Flow Methods

- `startGame()` - เริ่มเกม (แสดง countdown ก่อน)
- `pauseGame()` - หยุดเกม (user pause, แสดง UI)
- `resumeGame()` - เล่นต่อ (แสดง countdown ก่อน)
- `endGame(status)` - จบเกม

### Countdown & Display Methods

- `showCountdown(seconds, phase, text)` - แสดง countdown + auto-hide
- `hideCountdown()` - ซ่อน countdown (manual)
- `showRoundDisplay(round, duration?)` - แสดงรอบ + auto-hide
- `hideRoundDisplay()` - ซ่อน round display (manual)
- `showRoundDisplayWithCountdown(round, duration?)` - แสดงรอบ → countdown → resume

### Config Methods

- `getConfig()` - ดึง config
- `setConfig(config)` - ตั้ง config
- `hasGameStarted()` - เช็คว่าเกมเริ่มหรือยัง
- `setGameStarted(started)` - ตั้งค่า game started

### Render Methods (Override ได้)

- `renderCountdown()` - แสดง countdown UI
- `renderRoundDisplay()` - แสดง round display UI
- `renderEndGame()` - แสดง end game modal
- `renderConfigEditor()` - แสดง config editor (auto)
- `renderScene()` - แสดง game content (required)

---

## การใช้งานสำหรับเกมใหม่

### 1. สร้าง Scene Class ที่ extend จาก GameplayTemplate

```typescript
import {
  GameplayTemplate,
  GameplayTemplateProps,
} from '@core-utils/scene/GameplayTemplate';
import { TimeManager } from '@core-utils/timer/time-manager';
import { useBackgroundMusicStore } from '@core-utils/sound/store/backgroundMusic';
import { useSoundEffectStore } from '@core-utils/sound/store/soundEffect';

export class SceneMyGame extends GameplayTemplate {
  constructor(props: GameplayTemplateProps) {
    super(props);
    this.background = 'path/to/background.jpg';
    this.sceneInitial();
  }

  // Override sceneLoad เพื่อ load config เมื่อ scene active
  sceneLoad = async () => {
    this._isActive = true;
    this.forceRerender();
    await this.initializeConfig();
  }

  // Implement: Load game config
  protected async onLoadConfig(): Promise<void> {
    let config = null;
    try {
      const response = await fetch('/config/myGameConfig.json');
      if (response.ok) {
        config = await response.json();
      }
    } catch (err) {
      console.error('Failed to load config:', err);
    }

    if (config) {
      this.setConfig(config);
    }
  }

  // Implement: เมื่อเกม pause
  protected onGamePaused(): void {
    TimeManager.getInstance().stop();
    const { pauseSound } = useBackgroundMusicStore.getState();
    pauseSound();
  }

  // Implement: เมื่อเกม resume
  protected onGameResumed(): void {
    TimeManager.getInstance().start();
    const { resumeSound } = useBackgroundMusicStore.getState();
    resumeSound();
  }

  // Implement: เมื่อเกมจบ
  protected onGameEnded(status: 'success' | 'dead'): void {
    TimeManager.getInstance().stop();
    const { pauseSound } = useBackgroundMusicStore.getState();
    const { playEffect } = useSoundEffectStore.getState();

    pauseSound();
    if (status === 'success') {
      playEffect('success_sound');
    } else {
      playEffect('fail_sound');
    }
  }

  // Render game component
  renderScene = () => {
    return <MyGameComponent />;
  };
}
```

### 2. เข้าถึง GameplayTemplate Methods จาก Game Component

```typescript
const MyGameComponent = () => {
  // ใน game component สามารถเรียกใช้ methods เหล่านี้ผ่าน parent class:

  // เมื่อต้องการจบเกม
  const handleGameOver = () => {
    // เรียกผ่าน SceneManager หรือ context
    sceneInstance.endGame('dead');
  };

  // เมื่อต้องการ pause เกม
  const handlePause = () => {
    sceneInstance.pauseGame();
  };

  // เมื่อต้องการ resume เกม
  const handleResume = () => {
    sceneInstance.resumeGame();
  };

  return (
    <div>
      {/* Game content */}
    </div>
  );
};
```

## Features ที่ได้จาก GameplayTemplate

### 1. Config Editor Modal (Auto)

- **Debug Mode**: แสดง modal ก่อนเกมเริ่ม ให้แก้ไข config ได้
- **Production Mode**: ข้าม modal และเริ่มเกมทันที
- **หลังเกมจบ**: แสดง modal ให้ดาวน์โหลดหรือปรับ config

### 2. Countdown Management

```typescript
// แสดง countdown 3 วินาที
this.showCountdown(3, 'wave', 'เกมกำลังจะเริ่ม!');

// ซ่อน countdown
this.hideCountdown();
```

### 3. Round Display

```typescript
// แสดงหมายเลข round
this.showRoundDisplay(2); // แสดง "Round 2"

// ซ่อน round display
this.hideRoundDisplay();
```

### 4. Game Flow Control

```typescript
// เริ่มเกม
this.startGame();

// Pause เกม
this.pauseGame();

// Resume เกม
this.resumeGame();

// จบเกม
this.endGame('success'); // หรือ 'dead'
```

### 5. Config Management

```typescript
// Get config
const config = this.getConfig();

// Set/Update config
this.setConfig(newConfig);

// ตรวจสอบว่าเกมเริ่มแล้วหรือยัง
const started = this.hasGameStarted();

// Set game started state
this.setGameStarted(true);
```

## การ Customize

### 1. Custom Countdown Text

```typescript
export class SceneMyGame extends GameplayTemplate {
  constructor(props: GameplayTemplateProps) {
    super(props);

    // Override countdown texts
    this.countdownTexts = {
      countdown_start: 'Get Ready!',
      countdown_continue: 'Resuming in',
    };
  }
}
```

### 2. Custom Countdown UI

```typescript
export class SceneMyGame extends GameplayTemplate {
  // Override renderCountdown method
  protected renderCountdown(): React.ReactNode {
    if (!this.gameplayState.countdownState?.show) {
      return null;
    }

    const { seconds, text } = this.gameplayState.countdownState;

    return (
      <div className="custom-countdown">
        <h1>{text}</h1>
        <div className="number">{seconds}</div>
      </div>
    );
  }
}
```

### 3. Custom Round Display

```typescript
export class SceneMyGame extends GameplayTemplate {
  // Override renderRoundDisplay method
  protected renderRoundDisplay(): React.ReactNode {
    if (this.gameplayState.roundDisplay === null) {
      return null;
    }

    return (
      <div className="custom-round-display">
        <h2>Level {this.gameplayState.roundDisplay}</h2>
      </div>
    );
  }
}
```

## Debug Mode

กำหนดใน `.env`:

```
VITE_DEBUG_MODE=true
```

เมื่อเปิด debug mode:

- จะแสดง Config Editor Modal ก่อนเกมเริ่ม
- สามารถแก้ไข config แบบ real-time
- ดาวน์โหลด config ที่แก้ไขแล้วเป็นไฟล์ JSON

## Migration จากเกมเดิม

หากต้องการย้าย logic จาก Gameplay component เดิมมาใช้ GameplayTemplate:

### ขั้นตอนที่ 1: Update Imports

```typescript
// เปลี่ยนจาก string literals
import {
  GameplayTemplate,
  GameplayTemplateProps,
  GameStatus,           // ← เพิ่ม
  CountdownPhase,       // ← เพิ่ม
  ConfigEditorPhase,    // ← เพิ่ม (ถ้าใช้)
} from '@core-utils/scene/GameplayTemplate';
```

### ขั้นตอนที่ 2: แทนที่ String Literals ด้วย Enums

```typescript
// ❌ เก่า
onGameEnded(status: 'success' | 'dead'): void {
  if (status === 'success') { ... }
}

// ใหม่
onGameEnded(status: GameStatus): void {
  if (status === GameStatus.SUCCESS) { ... }
}

// ❌ เก่า
triggerEndGame('dead');

// ใหม่
triggerEndGame(GameStatus.DEAD);
```

### ขั้นตอนที่ 3: ย้าย Config Loading

1. ลบ `configWevePresetLoad` ออกจาก Gameplay component
2. ย้ายไปใส่ใน `onLoadConfig()` ของ Scene class

**ใน SceneGameplay:**

```typescript
protected async onLoadConfig(): Promise<void> {
  let config: waveConfig | null = null;

  try {
    const response = await fetch(PUBLIC_ASSETS_LOCATION.config.waveConfig);
    if (response.ok) {
      config = await response.json();
    }
  } catch (err) {
    console.error('Failed to load config:', err);
  }

  // Use setConfig() to update both state and ref
  this.setConfig(config);
}
```

### ขั้นตอนที่ 4: ลบ Config Modal States

ลบ states เหล่านี้จาก Gameplay component:

```typescript
// ❌ ลบออก
const [showConfigEditor, setShowConfigEditor] = useState(false);
const [configEditorPhase, setConfigEditorPhase] = useState('before-game');
const [editableConfig, setEditableConfig] = useState(null);
```

### ขั้นตอนที่ 5: ลบ Modal Handlers

ลบ handlers เหล่านี้:

```typescript
// ❌ ลบออก
const handleConfigConfirm = useCallback(...);
const handleConfigDownload = useCallback(...);
```

### ขั้นตอนที่ 6: ลบ Modal Rendering

ลบการ render modal ที่ท้าย component:

```typescript
// ❌ ลบออก
{showConfigEditor && editableConfig && (
  <ModalConfigEditor ... />
)}

// ❌ ลบออก (ย้ายไป SceneGameplay.renderEndGame())
{endGame && statusGame !== null && (
  <ModalGameOver status={statusGame} />
)}
```

### ขั้นตอนที่ 7: Setup Config Sync ใน Game Component

**เพิ่ม useRef และ useEffect สำหรับ config:**

```typescript
interface GameplayProps {
  config?: waveConfig | null;
  // ... other props
}

const Gameplay = ({ config: propsConfig }: GameplayProps) => {
  // Use ref to persist config across re-renders
  const configWavePresetRef = useRef<waveConfig | null>(propsConfig);
  let configWavePreset = configWavePresetRef.current;

  // Sync config from props with deep comparison
  useEffect(() => {
    const loadConfig = async () => {
      if (propsConfig) {
        configWavePresetRef.current = propsConfig;
        configWavePreset = propsConfig;
        console.log('🔄 Config synced from props:', propsConfig);
      } else {
        // Fallback: load from file
        const loadedConfig = await fetch('/config.json').then(r => r.json());
        configWavePresetRef.current = loadedConfig;
        configWavePreset = loadedConfig;
        console.log('✅ Fallback config loaded');
      }
    };
    loadConfig();
  }, [JSON.stringify(propsConfig)]); // Deep comparison!

  // In game loop: sync from ref each frame
  useEffect(() => {
    const timeManager = TimeManager.getInstance();
    const unsubscribe = timeManager.fixedUpdate((dt) => {
      // Sync from ref to get latest config
      configWavePreset = configWavePresetRef.current;

      // ... rest of game loop using configWavePreset
    });

    return () => unsubscribe();
  }, []);

  // ...
};
```

### ขั้นตอนที่ 8: เพิ่ม Callbacks ใน Props

## สรุป

✅ **ข้อดี:**

- Code reusability สูง
- Consistent behavior ทุกเกม
- Easy to maintain
- Built-in debug tools

⚠️ **ข้อควรระวัง:**

- ต้อง implement abstract methods ทั้งหมด
- Config format ต้องเป็น JSON
- ต้องใช้ร่วมกับ SceneManager

## ตัวอย่างเกมที่ใช้ GameplayTemplate

- `SceneGameplay` (Fruit Ninja game) - ตัวอย่างอ้างอิง
