import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from '@react-three/drei';
import { Canvas } from '@react-three/fiber';
import { GameEnvironment } from '@/components/environment/GameEnvironment';
import { CharacterData, SceneName } from '@/types/game';
import { KeyboardListener } from '@/utils/KeyboardListener';
import { stopAllSound } from '@/utils/SoundController';
import { TimeManager } from '@/utils/core-utils/timer/time-manager';
import { Character } from '@/components/Character';
import { Road } from '@/components/Road';
import { CharacterController } from '@/components/CharacterController';
import { Wave, WaveConfigInfo } from '@/components/Wave';
import { Physics } from '@react-three/rapier';
import { ProjectileHandler } from '@/components/ProjectileHandler';
import { ScoreDisplay } from '@/components/ScoreDisplay';
import { UI_HUD } from './components/ui-head-up-display';
import { useCharacterStore } from '@/store/characterStore';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import {
  GameplayTemplate,
  GameplayTemplateProps,
  GameStatus,
  CountdownPhase,
} from '@core-utils/scene/GameplayTemplate';
import { useSceneGameplayStore } from './sceneGameplayStore';
import { SceneManager } from '@core-utils/scene/scene-manager';
import { useSceneScoreStore } from '../scene-score/sceneScoreStore';
import { useTimerStore } from '@/store/timerStore';
import { EnvironmentEnum } from '@/components/environment/EnvironmentConfig';
import { useDebugStore } from './components/debug-tools/store/sceneGameplayDebugStore';
import { ModalCountdown } from './components/modal-countdown';
import { ModalEndgame } from './components/modal-endgame';
import { useArcadeStore } from '@core-utils/api/arcade/arcade-store';
import { API } from '@core-utils/api';
import { UI_Pause } from './components/ui-pause';
import JoystickControl from '@core-utils/input-management/joystick/JoystickControl';
import KeyboardControl from '@core-utils/input-management/keyboard/KeyboardControl';
import { pauseBackgroundMusic, resumeBackgroundMusic, playSoundEffect } from '@core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

// Props interface for GameSceneContent
interface GameSceneContentProps {
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
  isDebugMode?: boolean;

  // Config
  config?: WaveConfigInfo | null;

  // Callbacks to GameplayTemplate
  onGameEnd?: (status: GameStatus) => void;
  onPause?: () => void;
  onResume?: () => void;
  onShowRoundDisplayWithCountdown?: (round: number, duration?: number) => void;
  onShowCountdown?: (seconds: number, phase: CountdownPhase, text: string) => void;
}

const ROAD_CONFIG = {
  LANE_WIDTH: 30,
  LANE_AMOUNT: 3,
  // LAST_LANE_CENTER_OFFSET = LANE_WIDTH * (LANE_AMOUNT - 1) / 2
  BOUNDARY_LANE_OFFSET: (30 * (3 - 1)) / 2,
};

// Functional component for hooks and rendering
function GameSceneContent({
  config: propsConfig,
  isGameStarted,
  isPause,
  isSystemPause,
  isDebugMode,
  onGameEnd,
  onPause,
  onResume,
  onShowRoundDisplayWithCountdown,
}: GameSceneContentProps) {
  const { round, score, seconds, timeString, setProps } = useSceneGameplayStore();
  // const { setProps: setResult } = useSceneScoreStore();
  const { roadEnable, cameraZoomEnable, cameraRotateEnable, wireframeEnable } =
    useDebugStore();

  const sceneRef = useRef(new THREE.Scene());
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.Camera | null>(null);
  const characterDataRef = useRef<CharacterData | null>(null);
  const keyboardRef = useRef<KeyboardListener | null>(null);
  const animationFrameRef = useRef<number>(0);
  const { characterPosition } = useCharacterStore();

  // Refs for input controls
  const joystickInputRef = useRef({ dx: 0, dy: 0 });
  const keyboardInputRef = useRef({ dx: 0, dy: 0 });

  // Joystick handlers
  const handleJoystickMove = (dx: number, dy: number) => {
    joystickInputRef.current.dx = dx;
    joystickInputRef.current.dy = dy;
  };

  const handleJoystickEnd = () => {
    joystickInputRef.current.dx = 0;
    joystickInputRef.current.dy = 0;
  };

  // Keyboard handlers
  const handleKeyboardMove = (dx: number, dy: number) => {
    keyboardInputRef.current.dx = dx;
    keyboardInputRef.current.dy = dy;
  };

  const handleKeyboardEnd = () => {
    keyboardInputRef.current.dx = 0;
    keyboardInputRef.current.dy = 0;
  };

  // Use config from props directly
  let configWavePreset: WaveConfigInfo | null = propsConfig ?? null;

  //#region Timehandler
  // Temporary timehandler to store the current timer.

  const { elapsedTime, isRunning, updateTime, startTimer, stopTimer, resetTimer } =
    useTimerStore();

  // Fallback loading when config is null
  useEffect(() => {
    if (!propsConfig) {
      const loadConfig = async () => {
        try {
          const response = await fetch(PUBLIC_ASSETS_LOCATION.config.waveConfig);
          if (response.ok) {
            const loadedConfig = await response.json();
            configWavePreset = loadedConfig;
            console.log('✅ Fallback: Loaded config from file');
          }
        } catch (err) {
          console.error('Failed to load config:', err);
        }
      };
      loadConfig();
    } else {
      configWavePreset = propsConfig;
      console.log('✅ Using config from props');
    }
  }, [propsConfig]);

  // Reset timer when game starts
  useEffect(() => {
    if (isGameStarted) {
      resetTimer();
      console.log('🔄 Timer reset (game started)');
    }
  }, [isGameStarted, resetTimer]);

  // Start/stop timer based on pause state
  useEffect(() => {
    const timeManager = TimeManager.getInstance();

    // Start timer when game is not paused and TimeManager is playing
    if (!isPause && !isSystemPause && timeManager.isPlaying()) {
      startTimer();
      console.log('▶️ Timer started');
    } else {
      stopTimer();
      console.log('⏸️ Timer stopped');
    }
  }, [isPause, isSystemPause, startTimer, stopTimer]);

  useEffect(() => {
    let lastTime = performance.now();

    const updateTimer = () => {
      // Update store with elapsed time
      setProps({ seconds: elapsedTime });

      const timeManager = TimeManager.getInstance();
      if (isRunning && timeManager.isPlaying()) {
        const currentTime = performance.now();
        const deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
        updateTime(deltaTime);
        lastTime = currentTime;
      }
    };

    const intervalId = setInterval(updateTimer, 100); // Update every 100ms for smooth countdown

    return () => clearInterval(intervalId);
  }, [
    isRunning,
    elapsedTime,
    updateTime,
    setProps,
  ]);

  // Handle page visibility change (tab switch, minimize browser)
  useEffect(() => {
    const handleVisibilityChange = () => {
      const timeManager = TimeManager.getInstance();

      if (document.hidden) {
        // Browser tab hidden - pause if game is playing
        if (timeManager.isPlaying() && !isPause) {
          console.log('🔒 Browser tab hidden - auto pausing game');
          if (onPause) {
            onPause();
          }
        }
      } else {
        // Browser tab visible again
        console.log('👁️ Browser tab visible again');
        // Don't auto-resume - let user decide via pause button
        // This prevents unexpected resume when user switches back
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isPause, onPause]);

  //#endregion Timehandler

  const handlerWaveCompleted = () => {
    // Save result to score store
    // setResult({ round: round, score: score, seconds: seconds });

    // Call GameplayTemplate's endGame with success status
    if (onGameEnd) {
      onGameEnd(GameStatus.SUCCESS);
    }
  };

  const handleGameOver = () => {
    // Save result to score store (elapsed time = time used)
    // setResult({ round: round, score: score, seconds: elapsedTime });

    // Call GameplayTemplate's endGame with dead status
    if (onGameEnd) {
      onGameEnd(GameStatus.DEAD);
    }
  };

  // Handle wave transition - show round display and countdown
  const handleWaveTransition = (waveNumber: number) => {
    console.log(`🎮 Starting wave ${waveNumber} transition...`);

    // Update round in store
    setProps({ round: waveNumber });

    // Skip round display for first wave (game start already has countdown)
    if (waveNumber === 1) {
      console.log('⏭️  Skipping round display for wave 1 (game start)');
      return;
    }

    // Call GameplayTemplate's showRoundDisplayWithCountdown
    // This will: show "Round X" (1.5s) → countdown "3, 2, 1" (3s) → resume game
    if (onShowRoundDisplayWithCountdown) {
      onShowRoundDisplayWithCountdown(waveNumber, 1.5);
    }
  };

  // Cleanup function
  const cleanup = () => {
    if (rendererRef.current) {
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    // Clean up scene
    sceneRef.current.traverse((object) => {
      if (object instanceof THREE.Mesh) {
        if (object.geometry) object.geometry.dispose();
        if (object.material) {
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
      }
    });

    // Clean up refs
    if (characterDataRef.current?.DisplayModel) {
      characterDataRef.current.DisplayModel = null;
    }
    if (keyboardRef.current) {
      keyboardRef.current.cleanup();
    }

    // Cancel animation frame
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    stopAllSound();
  };

  useEffect(() => {
    return () => {
      cleanup();

      // Cleanup TimeManager
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        TimeManager.getInstance().removeRenderTarget(rendererRef.current);
      }
    };
  }, []);

  return (
    <div className="relative flex h-screen w-full items-center justify-center overflow-hidden">
      <Canvas
        shadows
        camera={{
          position: [0.00, 46.25, 48.75],
          fov: 75,
          near: 0.5,
          far: 400,
        }}
        onCreated={({ gl, scene, camera }: { gl: THREE.WebGLRenderer; scene: THREE.Scene; camera: THREE.Camera }) => {
          rendererRef.current = gl;
          sceneRef.current = scene;
          cameraRef.current = camera;

          // Register with TimeManager
          const timeManager = TimeManager.getInstance();
          timeManager.addRenderTarget(gl, scene, camera);
          console.log('✅ Render target registered with TimeManager');
        }}
      >
        <GameEnvironment preset={EnvironmentEnum.SPACE} />
        <Physics>
          <CharacterController
            boundaryLaneOffset={ROAD_CONFIG.BOUNDARY_LANE_OFFSET}
            enableWireframe={wireframeEnable}
            joystickInputRef={joystickInputRef}
            keyboardInputRef={keyboardInputRef}
          >
            <Character characterChoice={2} />
          </CharacterController>
          <ProjectileHandler followPosition={characterPosition} />
          <Wave
            lanes={ROAD_CONFIG.LANE_AMOUNT}
            laneWidth={ROAD_CONFIG.LANE_WIDTH}
            config={configWavePreset}
            enableWireframe={wireframeEnable}
            onObstacleDestroyed={() => setProps({ score: score + 1 })}
            onWaveCompleted={handlerWaveCompleted}
            onPlayerDead={handleGameOver}
            onWaveTransition={handleWaveTransition}
          />
        </Physics>
        {roadEnable && <Road lanes={ROAD_CONFIG.LANE_AMOUNT} laneWidth={ROAD_CONFIG.LANE_WIDTH} />}
        <ambientLight intensity={0.5} />
        <directionalLight position={[0, 3, 1]} intensity={1} castShadow />
        <OrbitControls
          enableDamping
          dampingFactor={0.25}
          enableZoom={cameraZoomEnable}
          enableRotate={cameraRotateEnable}
          enablePan={false}
          onChange={(e) => {
            if (e?.target && e?.target.object) {
              useDebugStore.getState().set('cameraPosition', e?.target.object?.position);
            }
          }}
        />
      </Canvas>

      <JoystickControl
        onJoystickMove={handleJoystickMove}
        onJoystickEnd={handleJoystickEnd}
        disabled={isPause || isSystemPause}
      />

      <KeyboardControl
        onKeyboardMove={handleKeyboardMove}
        onKeyboardEnd={handleKeyboardEnd}
        speed={1}
      />

      <UI_HUD
        round={round}
        score={score}
        seconds={seconds}
        timeString={timeString}
        isPause={isPause}
        onPause={onPause}
        onResume={onResume}
      />
      <UI_Pause isVisible={isPause && !isSystemPause} onResume={onResume} />
      {isDebugMode && <ScoreDisplay />}
    </div>
  );
}

// Class that extends GameplayTemplate and delegates rendering to the functional component
export class SceneGameplay extends GameplayTemplate {
  constructor(props: GameplayTemplateProps) {
    super(props);
    this.background = PUBLIC_ASSETS_LOCATION.image.background.gameplay;

    // Set onGameEndCallback to navigate to score scene
    this.gameplayProps.onGameEndCallback = async (_status: GameStatus) => {
      // Get data from gameplay store
      const { round, score, seconds } = useSceneGameplayStore.getState();

      // Submit result to API before navigating to score scene
      const { playToken } = useArcadeStore.getState();
      if (playToken) {
        try {
          const res = await API.arcade.SubmitResult({
            play_token: playToken,
            score,
            wave: round,
            time_used: Math.floor(seconds),
          });
          if (res.status_code === 200) {
            console.log('Score submitted successfully');
          } else {
            console.log('Failed to submit score:', res.message);
          }
        } catch (err) {
          console.error('Failed to submit result:', err instanceof Error ? err.message : 'Unknown error');
          // TODO: Handle submission error (e.g., show notification, retry, etc.)
        }
      }

      // Set data to score store
      const { setProps } = useSceneScoreStore.getState();
      setProps({ round, score, seconds });

      // Navigate to score scene
      SceneManager.getInstance().setScene(SceneName.SCORE);

      // TODO:
      // Reset gameplay store for next game
      // const { reset } = useSceneGameplayStore.getState();
      // reset();
    };

    this.gameplayProps.onCounting = (_second: number) => {
      void playSoundEffect(SOUND_GROUPS.sfx.count);
    }

    this.sceneInitial();
  }

  // Override sceneLoad to load config when scene becomes active
  sceneLoad = async () => {
    this._isActive = true;
    this.forceRerender();

    // Start TimeManager when scene loads
    const timeManager = TimeManager.getInstance();
    if (!timeManager.running) {
      timeManager.start();
      console.log('✅ TimeManager started');
    }

    // In debug mode, pause immediately before showing config editor
    if (this.isDebugMode) {
      timeManager.pause();
      console.log('🔒 Debug mode: Game paused before config editor');
    }

    await this.initializeConfig();
  };

  // Implement: Load game config
  protected async onLoadConfig(): Promise<void> {
    let config: WaveConfigInfo | null = null;
    if (!config) {
      try {
        const response = await fetch(PUBLIC_ASSETS_LOCATION.config.waveConfig);
        if (response.ok) {
          config = await response.json();
          console.log('✅ Loaded config from file');
        }
      } catch (err) {
        console.error('Failed to load wave config:', err);
      }
    }

    if (config) {
      this.setConfig(config);
    }
  }

  // Implement: When game is paused
  protected onGamePaused(): void {
    // Pause TimeManager to stop all game updates
    TimeManager.getInstance().pause();
    pauseBackgroundMusic();
    console.log('⏸️ Game paused - TimeManager paused');
  }

  // Implement: When game is resumed
  protected onGameResumed(): void {
    // Resume TimeManager to continue game updates
    TimeManager.getInstance().resume();
    resumeBackgroundMusic();
    console.log('▶️ Game resumed - TimeManager resumed');
  }

  // Implement: When game ends
  protected onGameEnded(status: GameStatus): void {
    // Pause TimeManager
    TimeManager.getInstance().pause();

    // Handle sound effects based on status
    if (status === GameStatus.SUCCESS) {
      void playSoundEffect(SOUND_GROUPS.sfx.endgame);
      console.log('🎉 Game completed successfully!');
    } else if (status === GameStatus.DEAD) {
      void playSoundEffect(SOUND_GROUPS.sfx.endgame);
      console.log('💀 Game over!');
    }
  }

  protected countdownTexts = {
    countdown_start: 'เตรียมตัว! ความสนุกเริ่มขึ้นแล้วใน',
    countdown_continue: 'เกมกำลังจะเริ่มต่อใน',
  };

  renderCountdown(): React.ReactNode {
    if (!this.gameplayState.countdownState?.show) {
      return null;
    }

    const { seconds, text } = this.gameplayState.countdownState;

    return (
      <ModalCountdown
        seconds={seconds}
        text={text}
      />
    );

    // return (
    //   <ModalCountdown
    //     seconds={3}
    //     text={this.countdownTexts.countdown_start}
    //   />
    // );
    // return <ModalEndgame status={this.gameplayState.statusGame || GameStatus.SUCCESS} />;
  }

  renderRoundDisplay(): React.ReactNode {
    if (this.gameplayState.roundDisplay === null) {
      return null;
    }

    const texts = {
      round: 'รอบที่ ',
    };

    // Combine text and number into single string for proper centering
    const displayText = `${texts.round}${this.gameplayState.roundDisplay}`;

    return (
      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black bg-opacity-70">
        <div className="relative flex flex-col items-center justify-center">
          {/* Shadow/Stroke layer */}
          <div
            className="font-kanit absolute text-center text-[50px] font-bold text-transparent [-webkit-text-stroke:18px_#8F3F16]"
            aria-hidden="true"
          >
            {displayText}
          </div>
          {/* Main text layer */}
          <div className="font-kanit relative text-center text-[50px] font-bold text-white">
            {displayText}
          </div>
        </div>
      </div>
    );
  }

  renderEndGame(): React.ReactNode {
    if (!this.gameplayState.endGame || this.gameplayState.statusGame === null) {
      return null;
    }

    return <ModalEndgame status={this.gameplayState.statusGame} />;
  }

  // Required: Render game component
  renderScene = () => {
    return (
      <GameSceneContent
        // Pass game state from GameplayTemplate
        isGameStarted={this.gameplayState.isGameStarted}
        isPause={this.gameplayState.isPause}
        isSystemPause={this.gameplayState.isSystemPause}
        isDebugMode={this.isDebugMode}
        countdownState={this.gameplayState.countdownState}
        roundDisplay={this.gameplayState.roundDisplay}
        endGame={this.gameplayState.endGame}
        statusGame={this.gameplayState.statusGame}
        // Pass config
        config={this.gameplayState.waveConfig}
        // Callbacks to GameplayTemplate
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
