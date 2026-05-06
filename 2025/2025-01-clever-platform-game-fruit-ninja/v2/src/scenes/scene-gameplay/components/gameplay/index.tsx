import { useEffect, useRef, useState } from 'react';

import * as THREE from 'three';
import CreateNewTarget from './components/fruit-entity';
import CreateNewObstacle from './components/bomb-entity';
import { useGameStore } from '@/store/gameStore';
import { PUBLIC_ASSETS_LOCATION } from '@public-assets';
import { GameConfigInterface, waveConfig } from './types/game-config';
import { GameplayHUD } from '../GameplayHUD';
import { useSceneGameplayStore } from '@/scenes/scene-gameplay/sceneGameplayStore';
// import { useFixedUpdate } from '@core-utils/timer/time-provider/useFixedUpdate';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { TimeManager } from '@core-utils/timer/time-manager';
import { useSoundEffectStore } from '@core-utils/sound/store/soundEffect';
import { CreateNewExplosionCake } from './components/splatter-effect';
import { GameplayTrailEffect } from './components/gameplay-trail-effect';
import { useBackgroundMusicStore } from '@core-utils/sound/store/backgroundMusic';
import { useCallback } from 'react';
import { CreateNewExplosionCakeLove } from './components/love-effect';
import { SOUND_GROUPS } from '@assets/public-sound';
import { CountdownPhase, GameStatus } from '@core-utils/scene/GameplayTemplate';

// ========================================
// GameplayProps Interface
// ========================================
// Props passed from GameplayTemplate to control game flow
export interface GameplayProps {
  // Game state from GameplayTemplate
  isGameStarted?: boolean;
  isGameEnding?: boolean;
  isPause?: boolean;
  isSystemPause?: boolean; // True when paused by system (no UI), false when paused by user (show UI)
  endGame?: boolean;
  statusGame?: GameStatus | null;
  countdownState?: {
    show: boolean;
    seconds: number;
    phase: CountdownPhase;
    text: string;
  } | null;
  roundDisplay?: number | null;

  // Config from GameplayTemplate
  config?: waveConfig | null;

  // Callbacks to GameplayTemplate
  onGameEnd?: (status: GameStatus) => void;
  onPause?: () => void;
  onResume?: () => void;
  onShowRoundDisplayWithCountdown?: (round: number, duration?: number) => void;
  onShowCountdown?: (seconds: number, phase: CountdownPhase, text: string) => void;
}

// ========================================
// FlowState Enum
// ========================================
// Defines the state machine for the game flow, from loading configs to endgame.
// Each numeric value represents a step in the game loop.
enum FlowState {
  F0_LOAD_CONFIG = 0,
  F1_LOADING = 1,
  F2_CONFIG_LOADED = 2,
  F3_WAVE_PRESET_LOADED = 3,
  F4_SETUP_WAVE = 4,
  F5_WAVE_PLAYING = 5,
  F6_CHECK_IF_MORE_WAVE = 6,
  F7_SHOW_ROUND = 7,
  F8_WAVE_COUNTDOWN = 8,
  F9_CHECK_TIME_RUNOUT = 9,
  F10_ENDGAME = 10,
}

enum EntityType {
  TARGET = 'Target',
  OBSTACLE = 'Obstacle',
}

// ========================================
// EntityState Interface
// ========================================
// Stores the state of a single entity (fruit or bomb) in the game.
// Tracks position, velocity, lifespan, scoring, and type.
export interface EntityState {
  Object: THREE.Object3D; // The 3D object representing the entity
  originalXPos: number; // Spawn X position
  originalYPos: number; // Spawn Y position
  currentVelocityY: number; // Vertical velocity
  currentVelocityX: number; // Horizontal velocity
  lastRaycastHitPosition?: THREE.Vector2; // Last recorded mouse/touch hit position
  currentDistance: number; // Distance moved by mouse/touch during slicing
  entityType: EntityType; // 'Target' or 'Obstacle'
  currentLifeSpanDelta: number; // Normalized time for arc calculation
  statMultiplier?: number; // Used for physics/stat adjustment
  scoreMultiplier?: number; // Multiplier for scoring
  currentYLerp?: number; // Optional for animation
  scoreValue?: number; // Points awarded for slicing
  rotationVelocity: THREE.Vector3; // Natural rotation speeds for each axis
}

const Gameplay = (props: GameplayProps = {}) =>
// Destructure props from GameplayTemplate
{
  const {
    isGameStarted: propsIsGameStarted = false,
    isGameEnding: _propsIsGameEnding = false,
    isPause: propsIsPause = false,
    isSystemPause: propsIsSystemPause = false,
    endGame: _propsEndGame = false,
    statusGame: _propsStatusGame = null,
    countdownState: propsCountdownState = null,
    roundDisplay: propsRoundDisplay = null,
    config: propsConfig = null,
    onGameEnd,
    onPause,
    onResume,
    onShowRoundDisplayWithCountdown,
    onShowCountdown,
  } = props;

  const texts = {
    countdown_start: 'ภารกิจรอบใหม่ เริ่มแล้ว!',
    countdown_continue: 'เกมกำลังจะเริ่มต่อใน',
  };

  // const navigate = useNavigate();

  // Check if debug mode is enabled
  const isDebugMode = import.meta.env.VITE_DEBUG_CODE ===
    new URLSearchParams(window.location.search).get('debugCode');

  // Game State Variable
  let gameState = 0;
  let waveTimeCount = 0;
  let waveTimeMax = 0;
  let countdownTimer = 1;

  // Config management: use ref to persist across re-renders
  // Will be synced from propsConfig or loaded as fallback
  const configWavePresetRef = useRef<waveConfig | null>(propsConfig);
  // Convenience variable for game loop (sync from ref)
  let configWavePreset = configWavePresetRef.current;

  // Stores for game score/time tracking
  const { round, score, lives, seconds, timeString, setProps, reset } =
    useSceneGameplayStore();
  const { pauseSound, resumeSound } = useBackgroundMusicStore();
  const { playEffect } = useSoundEffectStore();

  // ------------------------------
  // Stores & Refs
  // ------------------------------
  // scene, camera, renderer, and entity state references
  // Used for Three.js rendering and game logic

  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  // const canvasRef = useRef<HTMLCanvasElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const currentMultiplerScore = useRef(0); // Score
  const entiesStateRef = useRef<EntityState[]>([]);
  const controlsRef = useRef<OrbitControls | null>(null);

  // Input tracking
  const mouseRef = useRef(new THREE.Vector2());
  const isMouseDown = useRef(false);

  // Score, lives, and multipliers
  const scoreRef = useRef(0);
  const livesRef = useRef(3);
  const timeRef = useRef(0);

  const roundDisplayTimerRef = useRef<number | null>(null);
  const isGameStarted = useRef(false);
  const isGameEnding = useRef(false); // Flag to prevent multiple endgame triggers

  // State
  const [, setMousePosition] = useState<THREE.Vector2>(); // Score
  const [, setGameStartTime] = useState<number | null>(null);
  const [GameConfig, setGameConfig] = useState<GameConfigInterface>();

  // Use local state for pause and countdown if not provided by props
  const [localIsPause, setLocalIsPause] = useState<boolean>(false);
  const isPause = propsIsPause !== undefined ? propsIsPause : localIsPause;

  const [localCountdownState, setLocalCountdownState] = useState<{
    show: boolean;
    seconds: number;
    phase: CountdownPhase;
    text: string;
  } | null>(null);
  const countdownState = propsCountdownState !== undefined ? propsCountdownState : localCountdownState;

  const [localRoundDisplay, setLocalRoundDisplay] = useState<number | null>(null);
  const roundDisplay = propsRoundDisplay !== undefined ? propsRoundDisplay : localRoundDisplay;

  // Note: endGame and statusGame are passed from GameplayTemplate but not used here
  // because ModalGameOver is now rendered by GameplayTemplate.renderEndGame()
  // These are kept for potential standalone usage
  // const endGame = propsEndGame;
  // const statusGame = propsStatusGame;

  const gameCurrentTimeCountSet = useGameStore.getState().gameCurrentTimeCountSet;
  const gameCurrentTimeMaxSet = useGameStore.getState().gameCurrentTimeMaxSet;
  const gameTotalTimeUsedSet = useGameStore.getState().gameTotalTimeUsedSet;
  // const gameCurrentWaveSet = useGameStore.getState().gameCurrentWaveSet;
  // const gameCurrentScoreSet = useGameStore.getState().gameCurrentScoreSet;

  const trailPointsRef = useRef<THREE.Vector3[]>([]);

  useGameStore();

  // ------------------------------
  // Game End Trigger
  // ------------------------------
  const triggerEndGame = useCallback((status: GameStatus) => {
    // Prevent multiple triggers
    if (isGameEnding.current) return;
    isGameEnding.current = true;

    // Use onGameEnd callback if provided by GameplayTemplate
    if (onGameEnd) {
      onGameEnd(status);
    } else {
      // Fallback to local behavior if not using GameplayTemplate
      pauseSound();
      if (status === GameStatus.SUCCESS) {
        playEffect(SOUND_GROUPS.sfx.success_score);
      } else if (status === GameStatus.DEAD) {
        playEffect(SOUND_GROUPS.sfx.level_fail);
      }
    }
  }, [onGameEnd, pauseSound, playEffect]);

  // Mock create explosion rainbow for cake

  // ------------------------------
  // Responsive Spawn Area Calculation
  // ------------------------------
  // Calculates safe spawn bounds based on camera frustum and screen dimensions
  // Objects spawn from bottom of screen and have maximum height limit to avoid UI overlap
  const getResponsiveSpawnBounds = () => {
    if (!cameraRef.current || !canvasRef.current) {
      // Fallback to original spawn area if camera/canvas not available
      return {
        minX: -10,
        maxX: 10,
        minY: -35, // Spawn from bottom
        maxY: -5, // Maximum height limit
        safeMargin: 2,
      };
    }

    const camera = cameraRef.current;
    const canvas = canvasRef.current;

    // Calculate visible area at spawn depth (z = -5)
    const distance = Math.abs(-5 - camera.position.z); // Distance from camera to spawn plane
    const vFOV = (camera.fov * Math.PI) / 180; // Convert to radians
    const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
    const visibleWidth = visibleHeight * camera.aspect;

    // UI considerations
    const uiTopHeight = 150; // Height of top UI in pixels
    const canvasHeight = canvas.clientHeight;
    const canvasWidth = canvas.clientWidth;

    // Convert UI pixel height to world units
    const uiHeightInWorld = (uiTopHeight / canvasHeight) * visibleHeight;

    // Enhanced horizontal margins - increased safety margins to prevent objects from floating off-screen
    const horizontalMarginPixels = 80; // Increased from 20px to 80px margin on each side
    const horizontalMarginWorld = (horizontalMarginPixels / canvasWidth) * visibleWidth;

    // Additional safety buffer for object size and movement
    const objectSafetyBuffer = visibleWidth * 0.08; // 8% of screen width as safety buffer
    const totalHorizontalMargin = horizontalMarginWorld + objectSafetyBuffer;

    // Calculate safe spawn area with enhanced margins
    const safeWidth = visibleWidth - totalHorizontalMargin * 2;

    // Spawn positioning: Start from bottom of screen, limit maximum height to 75%
    const screenBottom = -(visibleHeight / 2); // Bottom edge of visible area
    const spawnBottom = screenBottom - 5; // Spawn from below visible area (like original)

    // Maximum height calculation - prevent objects from reaching UI area
    const maxVisibleHeight = visibleHeight / 2 - uiHeightInWorld - visibleHeight * 0.05; // Top boundary minus UI and buffer
    const maxAllowedHeight = maxVisibleHeight * 0.75; // Limit to 75% of safe visible height

    return {
      minX: -safeWidth / 2,
      maxX: safeWidth / 2,
      minY: spawnBottom, // Spawn from bottom (below screen)
      maxY: maxAllowedHeight, // Maximum height objects can reach
      safeMargin: Math.min(safeWidth / 10, 4), // Increased clustering prevention margin
      uiTopHeight: uiHeightInWorld,
      horizontalSafetyMargin: totalHorizontalMargin, // Store for debugging
      debugInfo: {
        visibleWidth,
        visibleHeight,
        safeWidth,
        screenBottom,
        spawnBottom,
        maxAllowedHeight,
        uiHeightInWorld,
        horizontalMarginPixels,
        objectSafetyBuffer,
        totalHorizontalMargin,
      },
    };
  };

  // Track recently spawned positions to avoid clustering
  const recentSpawnPositions = useRef<{ x: number; y: number; time: number }[]>([]);

  // Generate a spawn position that doesn't conflict with recent spawns
  // Spawns from bottom of screen with horizontal distribution and clustering prevention
  const generateSafeSpawnPosition = () => {
    const bounds = getResponsiveSpawnBounds();
    const currentTime = performance.now();
    const maxAttempts = 12;

    // Clean up old spawn positions (older than 1.5 seconds)
    recentSpawnPositions.current = recentSpawnPositions.current.filter(
      (pos) => currentTime - pos.time < 1500,
    );

    // Enhanced debug logging - shows actual spawn range and safety margins
    console.log('Enhanced Spawn bounds:', {
      x: `${bounds.minX.toFixed(2)} to ${bounds.maxX.toFixed(2)} (safe width: ${(bounds.maxX - bounds.minX).toFixed(2)})`,
      y: `${bounds.minY.toFixed(2)} (spawn from bottom)`,
      maxHeight: `${bounds.maxY.toFixed(2)} (height limit)`,
      safeMargin: bounds.safeMargin.toFixed(2),
      horizontalSafety: bounds.horizontalSafetyMargin?.toFixed(2) || 'N/A',
      recentSpawns: recentSpawnPositions.current.length,
    });

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      // Generate horizontal position with good distribution
      const x = bounds.minX + Math.random() * (bounds.maxX - bounds.minX);
      // Always spawn from bottom area - slightly randomized starting position
      const y = bounds.minY + Math.random() * 3; // Small variation at bottom spawn area

      // Check if this position conflicts with recent spawns
      const hasConflict = recentSpawnPositions.current.some((pos) => {
        const distance = Math.sqrt((x - pos.x) ** 2 + (y - pos.y) ** 2);
        return distance < bounds.safeMargin;
      });

      if (!hasConflict) {
        // Add this position to recent spawns
        recentSpawnPositions.current.push({ x, y, time: currentTime });
        return { x, y };
      }
    }

    // Fallback: use horizontal grid-based positioning at bottom
    const gridCols = 5; // More horizontal divisions
    const cellWidth = (bounds.maxX - bounds.minX) / gridCols;

    // Find least recently used horizontal position
    const gridCells = [];
    for (let col = 0; col < gridCols; col++) {
      const cellCenterX = bounds.minX + (col + 0.5) * cellWidth;
      // All fallback spawns from bottom area
      const y = bounds.minY + Math.random() * 2;

      // Find most recent spawn in this horizontal cell
      const cellSpawns = recentSpawnPositions.current.filter((pos) => {
        const inX =
          pos.x >= bounds.minX + col * cellWidth &&
          pos.x < bounds.minX + (col + 1) * cellWidth;
        return inX;
      });

      const lastSpawnTime =
        cellSpawns.length > 0 ? Math.max(...cellSpawns.map((s) => s.time)) : 0;

      gridCells.push({
        x: cellCenterX + (Math.random() - 0.5) * cellWidth * 0.7, // Random within cell
        y: y,
        lastSpawnTime,
      });
    }

    // Sort by least recently used and pick the best option
    gridCells.sort((a, b) => a.lastSpawnTime - b.lastSpawnTime);
    const chosen = gridCells[0];

    recentSpawnPositions.current.push({ x: chosen.x, y: chosen.y, time: currentTime });
    return { x: chosen.x, y: chosen.y };
  };

  // ------------------------------
  // Entity Spawning
  // ------------------------------
  // Adds a new target entity to the scene (spawns from bottom of screen)
  const AddNewTarget = (index: number) => {
    const cube = CreateNewTarget(index);
    const spawnPos = generateSafeSpawnPosition();
    const bounds = getResponsiveSpawnBounds();

    //Calculate the actual max visible height from the camera 
    const camera = cameraRef.current;
    const canvas = canvasRef.current;
    let maxVisibleHeightReal = bounds.maxY; // fallback

    if (camera && canvas) {
      // Calculate visible height based on camera FOV and distance
      const distance = Math.abs(-5 - camera.position.z);
      const vFOV = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;

      // Deduct UI height (top HUD area) from visible space
      const uiTopHeight = 150;
      const uiHeightInWorld = (uiTopHeight / canvas.clientHeight) * visibleHeight;
      maxVisibleHeightReal = visibleHeight / 2 - uiHeightInWorld - visibleHeight * 0.05;
    }

    // Determine spawn and trajectory parameters 
    const spawnYBase = bounds.minY;
    const actualSpawnY = spawnPos.y;

    // Define height range (fruit flies higher than bombs)
    const minHeight = spawnYBase + 15;
    const maxHeight = maxVisibleHeightReal * 0.9; // 90% of visible height
    const targetMaxY = minHeight + Math.random() * Math.max(0, maxHeight - minHeight);

    const gravity = 0.01;
    const initialVelocityY = Math.sqrt(2 * gravity * (targetMaxY - spawnYBase));

    cube.position.set(spawnPos.x, actualSpawnY, -5);

    if (cube && sceneRef.current) {
      sceneRef.current.add(cube);
    }

    const entityState: EntityState = {
      currentYLerp: 0,
      Object: cube,
      currentVelocityY: initialVelocityY,
      currentVelocityX: Math.random() * 0.15 - 0.075,
      currentLifeSpanDelta: 0,
      lastRaycastHitPosition: undefined,
      currentDistance: 0,
      entityType: EntityType.TARGET,
      statMultiplier: 1,
      scoreMultiplier: 1,
      originalXPos: spawnPos.x,
      originalYPos: actualSpawnY,
      rotationVelocity: new THREE.Vector3(
        0, // (Math.random() - 0.5) * 0.20, // X-axis: สุ่มทิศทางซ้าย/ขวา (ช้ากว่าผลไม้นิดหน่อย)
        0, // (Math.random() - 0.5) * 0.15, // Y-axis: สุ่มทิศทางซ้าย/ขวา
        Math.random() - 0.5, //* 0.25  // Z-axis: สุ่มทิศทางซ้าย/ขวา
      ),
    };
    return entityState;
  };

  // Adds a new obstacle entity to the scene (spawns from bottom of screen)
  const AddNewObstacle = (index: number) => {
    const cube = CreateNewObstacle(index);
    const spawnPos = generateSafeSpawnPosition();
    const bounds = getResponsiveSpawnBounds();

    // Calculate the actual max visible height from the camera 
    const camera = cameraRef.current;
    const canvas = canvasRef.current;
    let maxVisibleHeightReal = bounds.maxY; // fallback

    if (camera && canvas) {
      const distance = Math.abs(-5 - camera.position.z);
      const vFOV = (camera.fov * Math.PI) / 180;
      const visibleHeight = 2 * Math.tan(vFOV / 2) * distance;
      const uiTopHeight = 150;
      const uiHeightInWorld = (uiTopHeight / canvas.clientHeight) * visibleHeight;
      maxVisibleHeightReal = visibleHeight / 2 - uiHeightInWorld - visibleHeight * 0.05;
    }
    // ========================================================

    // Determine spawn and trajectory parameters
    const spawnYBase = bounds.minY;
    const actualSpawnY = spawnPos.y;

    // Bombs fly slightly lower than fruits
    const minHeight = spawnYBase + 10; // lower minimum height than fruits
    const maxHeight = maxVisibleHeightReal * 0.85; // 85% of visible height
    const targetMaxY = minHeight + Math.random() * Math.max(0, maxHeight - minHeight);

    const gravity = 0.01;
    const initialVelocityY = Math.sqrt(2 * gravity * (targetMaxY - spawnYBase));

    cube.position.set(spawnPos.x, actualSpawnY, -5);

    if (cube && sceneRef.current) {
      sceneRef.current.add(cube);
    }

    const entityState: EntityState = {
      currentYLerp: 0,
      Object: cube,
      currentVelocityY: initialVelocityY,
      currentVelocityX: Math.random() * 0.15 - 0.075,
      currentLifeSpanDelta: 0,
      lastRaycastHitPosition: undefined,
      currentDistance: 0,
      entityType: EntityType.OBSTACLE,
      statMultiplier: 1,
      originalXPos: spawnPos.x,
      originalYPos: actualSpawnY,
      rotationVelocity: new THREE.Vector3(
        0, // (Math.random() - 0.5) * 0.20, // X-axis: สุ่มทิศทางซ้าย/ขวา (ช้ากว่าผลไม้นิดหน่อย)
        0, // (Math.random() - 0.5) * 0.15, // Y-axis: สุ่มทิศทางซ้าย/ขวา
        Math.random() - 0.5, //* 0.25  // Z-axis: สุ่มทิศทางซ้าย/ขวา
      ),
    };
    return entityState;
  };

  // const handleMouseMove = (event: MouseEvent) => {
  //   const raycaster = new THREE.Raycaster();
  //   const mouse = new THREE.Vector2();
  //   if (canvasRef.current && cameraRef.current && sceneRef.current) {
  //     mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  //     mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
  //     setMousePosition(mouse);
  //     mouseRef.current = mouse;
  //     raycaster.setFromCamera(mouse, cameraRef.current);

  //     const intersects = raycaster.intersectObjects(sceneRef.current.children);
  //     if (intersects.length > 0) {
  //       const intersectedObject = intersects[0].object as THREE.Mesh;
  //       return intersectedObject;
  //     } else {
  //       return null;
  //     }
  //   } else {
  //     return null;
  //   }
  // };

  // ------------------------------
  // Game Config Loading
  // ------------------------------
  // Loads JSON config files for gameplay parameters and wave presets
  // with default fallback values

  const helperConfigLoad = async (jsonName: string) => {
    try {
      let res = await fetch(jsonName);
      if (!res) {
        console.error('Error loading ' + jsonName + ' : no Res');
        return;
      }

      console.log(res.body);

      try {
        let data = await res.json();
        return data;
      } catch (error) {
        console.error('Error loading ' + jsonName + ' : res.json()', error);
        return;
      }
    } catch (error) {
      console.error('Error loading ' + jsonName + ' :', error);
      return;
    }
  };

  // Load gameconfig.json
  const configGameConfigLoad = async () => {
    const data = await helperConfigLoad(PUBLIC_ASSETS_LOCATION.config.gameConfig);
    const {
      ScoreIncreasement,
      MultiplerScoreIncreasement,
      MultiplerScoreDecayRate,
      MaxMultiplerScore,
      ComboIncreaseJudgement,
      StartFruitAmount,
      StartBombAmount,
      FruitIncreaseAmount,
      BombIncreaseAmount,
      MaxBombAmount,
      MaxFruitAmount,
      FruitIncreasementPer,
      BombIncreasementPer,
      MaxGameTime,
      FruitMissAmount,
    } = data || {
      ScoreIncreasement: 5,
      MultiplerScoreIncreasement: 250,
      MultiplerScoreDecayRate: 50,
      MaxMultiplerScore: 2000,
      ComboIncreaseJudgement: 500,

      StartFruitAmount: 1,
      StartBombAmount: 0,
      FruitIncreaseAmount: 1,
      BombIncreaseAmount: 1,
      MaxBombAmount: 3,
      MaxFruitAmount: 7,
      FruitIncreasementPer: 3,
      BombIncreasementPer: 5,

      FruitMissAmount: 0,
      MaxGameTime: 120,
    };
    setGameConfig({
      ScoreIncreasement: ScoreIncreasement || 5,
      MultiplerScoreIncreasement: MultiplerScoreIncreasement || 250,
      MultiplerScoreDecayRate: MultiplerScoreDecayRate || 50,
      MaxMultiplerScore: MaxMultiplerScore || 2000,

      ComboIncreaseJudgement: ComboIncreaseJudgement || 500,
      StartFruitAmount: StartFruitAmount || 1,
      StartBombAmount: StartBombAmount || 0,
      FruitIncreaseAmount: FruitIncreaseAmount || 1,
      BombIncreaseAmount: BombIncreaseAmount || 1,
      MaxBombAmount: MaxBombAmount || 3,
      MaxFruitAmount: MaxFruitAmount || 7,
      FruitIncreasementPer: FruitIncreasementPer || 3,
      BombIncreasementPer: BombIncreasementPer || 5,
      MaxGameTime: (MaxGameTime || 120) * 1000,
      FruitMissAmount: FruitMissAmount || -1,
    });

    gameState = FlowState.F2_CONFIG_LOADED;
  };

  // Note: configWavePresetLoad() removed - config now comes from props
  // The waveConfig is loaded in SceneGameplay.onLoadConfig() and passed via props

  // -----------------------------------
  // useEffect: Initialize Game Scene
  // -----------------------------------
  // - Sets up Three.js scene, camera, renderer, lighting
  // - Sets up event listeners for mouse/touch input
  // - Starts main game loop using TimeManager's fixed update
  // - Manages game state, waves, entity updates, scoring, and endgame
  useEffect(() => {
    // Load game config only (waveConfig comes from props)
    const initializeConfig = async () => {
      await configGameConfigLoad();
      console.log('🎮 Game config loaded, waveConfig from props:', propsConfig);
    };
    initializeConfig();
  }, []);

  // Watch for config changes from GameplayTemplate (CRITICAL!)
  // Also load fallback config if propsConfig is null
  // Use JSON.stringify to detect actual config changes (not just reference changes)
  useEffect(() => {
    const loadConfig = async () => {
      if (propsConfig) {
        // Use config from GameplayTemplate (edited or loaded)
        configWavePresetRef.current = propsConfig;
        configWavePreset = propsConfig;
        // Update game state to indicate wave config is loaded
        if (gameState < FlowState.F3_WAVE_PRESET_LOADED) {
          gameState = FlowState.F3_WAVE_PRESET_LOADED;
        }
        console.log('🔄 Config synced from props:', propsConfig);
        console.log('   Wave count:', propsConfig.waveList?.length);
        console.log('   Game state:', gameState);
      } else {
        // Fallback: Load config from file if not provided by GameplayTemplate
        console.log('⚠️ propsConfig is null, loading fallback config from file');
        try {
          const loadedConfig = await helperConfigLoad(PUBLIC_ASSETS_LOCATION.config.waveConfig);
          if (loadedConfig) {
            configWavePresetRef.current = loadedConfig;
            configWavePreset = loadedConfig;
            if (gameState < FlowState.F3_WAVE_PRESET_LOADED) {
              gameState = FlowState.F3_WAVE_PRESET_LOADED;
            }
            console.log('✅ Fallback config loaded from file:', loadedConfig);
            console.log('   Wave count:', loadedConfig.waveList?.length);
          } else {
            console.error('❌ Failed to load fallback config');
          }
        } catch (error) {
          console.error('❌ Error loading fallback config:', error);
        }
      }
    };

    loadConfig();
  }, [JSON.stringify(propsConfig)]);

  // Sync isGameStarted from props (when GameplayTemplate controls game start)
  useEffect(() => {
    if (propsIsGameStarted !== undefined && propsIsGameStarted !== isGameStarted.current) {
      isGameStarted.current = propsIsGameStarted;
      console.log('Game started from GameplayTemplate:', propsIsGameStarted);
    }
  }, [propsIsGameStarted]);

  // Sync isPause from props to local state
  useEffect(() => {
    if (propsIsPause !== undefined) {
      setLocalIsPause(propsIsPause);
      console.log('isPause synced from GameplayTemplate:', propsIsPause);
    }
  }, [propsIsPause]);

  // Sync countdownState from props to local state
  useEffect(() => {
    if (propsCountdownState !== undefined) {
      setLocalCountdownState(propsCountdownState);
      console.log('countdownState synced from GameplayTemplate:', propsCountdownState);
    }
  }, [propsCountdownState]);

  useEffect(() => {
    // reset state first time
    reset();
    scoreRef.current = 0;
    livesRef.current = 3;
    timeRef.current = 0;
    currentMultiplerScore.current = 0;
    isGameEnding.current = false; // Reset endgame flag

    // create scene
    if (!sceneRef?.current) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Load the background image
      const textureLoader = new THREE.TextureLoader();
      // textureLoader.load("/image/background/gameplay--bg.jpg", (texture) => {
      const url = PUBLIC_ASSETS_LOCATION.image.background.transparent;
      // const url = "/image/background/8x8-transparent-bg.png";
      textureLoader.load(url, (texture) => {
        scene.background = texture;
      });

      // Balanced Lighting Setup for Comfortable Gameplay
      // Main directional light (pleasant and clear)
      const mainLight = new THREE.DirectionalLight(0xffffff, 2.2);
      mainLight.position.set(5, 8, 3);
      mainLight.castShadow = false; // No shadows for brighter scene
      scene.add(mainLight);

      // Fill light from opposite side (warmer tone for depth)
      const fillLight = new THREE.DirectionalLight(0xfff4e6, 1.5);
      fillLight.position.set(-3, 4, 2);
      fillLight.castShadow = false;
      scene.add(fillLight);

      // Moderate ambient light for overall illumination
      const ambientLight = new THREE.AmbientLight(0xffffff, 1.8);
      scene.add(ambientLight);

      // Hemisphere light for natural color variation
      const hemisphereLight = new THREE.HemisphereLight(0x87ceeb, 0xffffff, 1.2);
      hemisphereLight.position.set(0, 20, 0);
      scene.add(hemisphereLight);
    }

    // if (!cameraRef?.current) {
    //   const camera = new THREE.PerspectiveCamera(
    //     75,
    //     window.innerWidth / window.innerHeight,
    //     0.1,
    //     1000,
    //   );
    //   camera.position.z = 15;
    //   cameraRef.current = camera;
    // }

    // if (!rendererRef?.current) {
    // const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    // rendererRef.current = renderer;
    // renderer.setSize(window.innerWidth, window.innerHeight);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.3; // Balanced exposure for comfortable viewing
    renderer.shadowMap.enabled = false; // Disabled for brighter scene
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    let aspect = canvasRef.current
      ? canvasRef.current.clientWidth / canvasRef.current.clientHeight
      : window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 15;
    // Always set cameraRef to current camera (fixes StrictMode/remount issues)
    cameraRef.current = camera;

    // Resize handling
    if (canvasRef.current) {
      canvasRef.current.innerHTML = '';
      canvasRef.current.appendChild(renderer.domElement);
    }

    const resizeCanvas = () => {
      if (canvasRef.current && cameraRef.current) {
        const width = canvasRef.current.clientWidth;
        const height = canvasRef.current.clientHeight;
        renderer.setSize(width, height);
        // Update cameraRef.current (not local camera) to ensure Trail Effect uses updated projection
        cameraRef.current.aspect = width / height;
        cameraRef.current.updateProjectionMatrix();
      }
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (canvasRef.current) resizeObserver.observe(canvasRef.current);

    rendererRef.current = renderer;

    // # region
    if (rendererRef?.current) {
      // Grid Debug line middle
      // const grid = new THREE.GridHelper(10, 10, 0x444444, 0x222222);
      // grid.position.y = 0;
      // sceneRef.current.add(grid);

      // const debugObject = AddNewFruit(3);
      // const debugObject = AddNewBomb();
      // debugObject.Object.position.set(0, 0, 0);
      // const rotationCal = - Math.PI / 4;
      // debugObject.Object.rotation.set(rotationCal, rotationCal, rotationCal);
      // sceneRef.current.add(debugObject.Object);

      const controls = new OrbitControls(cameraRef?.current, renderer.domElement);
      controlsRef.current = controls;
    }
    // # endregion

    let currentWave: number = 0;

    // Reset game state
    gameState = FlowState.F0_LOAD_CONFIG;
    currentWave = 0;

    let spawnCount: number = 0;
    let spawnMax: number = 0;
    let hoveredFruit: THREE.Object3D<THREE.Object3DEventMap> | unknown;

    setProps({ lives: 3 });

    // const scaledDeltaTime = () => {
    //   timeScaleRef.current = timeScale;
    //   return (fixedDeltaTime * timeScaleRef.current) / 100;
    // };

    // #region - Main game loop
    // const animate = (timeAnimate: number) => {
    //   if (lastFrameTime == 0) {
    //     lastFrameTime = timeAnimate;
    //   }
    //   // const animate = (dt: number) => {
    //   const dt = (timeAnimate - lastFrameTime) / 1000;
    const timeManager = TimeManager.getInstance();
    timeManager.addRenderTarget(renderer, sceneRef.current, camera);
    const unsubFixedUpdate = timeManager.fixedUpdate((dt) => {
      // Sync config from ref at the start of each frame (to get latest changes)
      configWavePreset = configWavePresetRef.current;

      // const scaledDeltaTime = fixedDeltaTime * timeScale / 100;
      const scaledDeltaTime = () => dt;

      // Allow config loading states to run even when game hasn't started
      // Only block gameplay states before game start
      if (!isGameStarted.current && gameState > FlowState.F3_WAVE_PRESET_LOADED) return;

      // Switch case state
      switch (gameState) {
        case FlowState.F0_LOAD_CONFIG:
          // Config already loaded in initial useEffect, skip to wave setup
          if (configWavePreset) {
            gameState = FlowState.F3_WAVE_PRESET_LOADED;
          }
          break;
        case FlowState.F1_LOADING:
          // wait for load (not used anymore)
          break;
        case FlowState.F2_CONFIG_LOADED:
          // Config already loaded, skip
          if (configWavePreset) {
            gameState = FlowState.F3_WAVE_PRESET_LOADED;
          }
          break;
        case FlowState.F3_WAVE_PRESET_LOADED:
          // wait for load
          if (configWavePreset) {
            // In production mode or when game is started (debug mode after confirm)
            if (!isDebugMode || isGameStarted.current) {
              // Start the game - wave countdown will be the initial countdown
              isGameStarted.current = true;
              countdownTimer = 3;
              if (setLocalCountdownState) {
                setLocalCountdownState({
                  show: true,
                  seconds: 3,
                  phase: CountdownPhase.WAVE,
                  text: texts.countdown_start,
                });
              }
              gameState = FlowState.F8_WAVE_COUNTDOWN;
            }
            // In debug mode, wait for user to confirm config in modal (handled by GameplayTemplate)
            // GameplayTemplate will set isGameStarted when config is confirmed
          }
          break;
        case FlowState.F4_SETUP_WAVE:
          // setup
          if (!configWavePreset) {
            return;
          }

          // spawn
          spawnCount = 0;
          spawnMax = configWavePreset.waveList[currentWave].spawnList.length;

          // Time
          console.log('Start Wave:', configWavePreset.waveList[currentWave]);
          waveTimeCount = 0;

          // wave time max
          waveTimeMax = configWavePreset.waveList[currentWave].waveDuration;
          gameState = FlowState.F5_WAVE_PLAYING;
          console.log('Start Wave Time Max :', waveTimeMax);
          gameCurrentTimeMaxSet(waveTimeMax);
          break;
        case FlowState.F5_WAVE_PLAYING: {
          if (!configWavePreset) {
            return;
          }

          // Game Start
          waveTimeCount += scaledDeltaTime();

          const spawnList =
            configWavePreset.waveList[currentWave].spawnList[spawnCount];

          if (spawnCount < spawnMax) {
            if (waveTimeCount >= spawnList.timeAt) {
              console.log('spawnList', spawnList);

              // sound throw cake
              playEffect(SOUND_GROUPS.sfx.throw_cake, { volume: 70 });
              spawnList.objectList.forEach((object) => {
                // Spawn target
                if (object.type === 'target') {
                  const newTarget = AddNewTarget(object.model);
                  newTarget.scoreValue = object.score || 10;
                  if (newTarget.Object && sceneRef?.current) {
                    sceneRef?.current.add(newTarget.Object);
                    entiesStateRef.current.push(newTarget);
                  }
                }

                // Spawn obstacle
                if (object.type === 'obstacle') {
                  const newObstacle = AddNewObstacle(object.model);
                  if (newObstacle.Object && sceneRef?.current) {
                    sceneRef?.current.add(newObstacle.Object);
                    entiesStateRef.current.push(newObstacle);
                  }
                }
              });

              spawnCount += 1;
            }
          }

          // console.log("waveTimeCount", waveTimeCount);
          if (waveTimeCount >= waveTimeMax) {
            waveTimeCount = waveTimeMax;

            if (entiesStateRef.current.length === 0) {
              console.log('Wave Complete!');
              gameState = FlowState.F6_CHECK_IF_MORE_WAVE;
            }
          }
          gameCurrentTimeCountSet(waveTimeCount);
          // setProps({ seconds: gameCurrentTimeMax - gameCurrentTimeCount });
          // setProps({ seconds: (performance.now() - gameTotalTimeUsed) / 1000 });

          if (waveTimeCount < waveTimeMax) {
            timeRef.current += scaledDeltaTime();
          }
          setProps({ seconds: timeRef.current });

          break;
        }
        case FlowState.F6_CHECK_IF_MORE_WAVE:
          console.log(
            'case 6 - currentWave:',
            currentWave,
            'total waves:',
            configWavePreset?.waveList?.length || 0,
          );

          if (!configWavePreset) {
            console.log('!configWavePreset');
            return;
          }

          // ตรวจสอบว่า currentWave เป็นตัวสุดท้ายหรือยัง
          if (currentWave >= configWavePreset.waveList.length - 1) {
            console.log('All waves completed!');
            triggerEndGame(GameStatus.SUCCESS);
            return;
          }

          currentWave += 1;
          setProps({ round: currentWave + 1 });

          countdownTimer = 3;
          // กำหนดค่าให้ตัวนับเวลา

          // Use callback if provided by GameplayTemplate
          if (onShowRoundDisplayWithCountdown) {
            // GameplayTemplate handles round display + countdown automatically
            onShowRoundDisplayWithCountdown(currentWave + 1, 1.5);
            // Skip F7 and F8, go directly to waiting state
            gameState = FlowState.F7_SHOW_ROUND;
          } else {
            setLocalRoundDisplay(currentWave + 1);
            gameState = FlowState.F7_SHOW_ROUND;
          }

          break;
        case FlowState.F7_SHOW_ROUND:
          // When using GameplayTemplate callbacks, skip local timing
          // GameplayTemplate handles timing via showRoundDisplayWithCountdown
          if (onShowRoundDisplayWithCountdown) {
            // Wait for both roundDisplay and countdownState to be hidden
            if (!roundDisplay && (!countdownState || !countdownState.show)) {
              // Both displays finished, move to setup wave
              gameState = FlowState.F4_SETUP_WAVE;
            }
          } else {
            // Local mode - handle timing manually
            if (!roundDisplayTimerRef.current) {
              roundDisplayTimerRef.current = scaledDeltaTime(); // เริ่มจับเวลา
            } else {
              roundDisplayTimerRef.current += scaledDeltaTime();
              if (roundDisplayTimerRef.current >= 1.5) {
                // จบการแสดงรอบ  เริ่มนับถอยหลัง
                countdownTimer = 3;

                setLocalCountdownState({
                  show: true,
                  seconds: 3,
                  phase: CountdownPhase.WAVE,
                  text: texts.countdown_start,
                });

                setLocalRoundDisplay(null);
                roundDisplayTimerRef.current = null;
                gameState = FlowState.F8_WAVE_COUNTDOWN;
              }
            }
          }
          break;
        case FlowState.F8_WAVE_COUNTDOWN:
          // Only handle local countdown if NOT using GameplayTemplate callbacks
          if (!onShowCountdown) {
            if (countdownTimer > 0) {
              // ลดค่าเวลาลงตามเวลาจริงที่ผ่านไปในแต่ละเฟรม
              countdownTimer -= scaledDeltaTime();

              // คำนวณเลขวินาทีที่จะแสดงผลบน UI (ปัดขึ้นเสมอ)
              const currentSecond = Math.ceil(countdownTimer);

              // อัปเดต UI เฉพาะตอนที่ตัวเลขวินาทีเปลี่ยนจริงๆ เพื่อประสิทธิภาพ
              if (countdownState?.seconds !== currentSecond) {
                setLocalCountdownState({
                  show: true,
                  seconds: currentSecond,
                  phase: CountdownPhase.WAVE,
                  text: texts.countdown_start,
                });
              }
            }

            // เมื่อนับเวลาถอยหลังจนเสร็จ (หรือน้อยกว่า 0)
            if (countdownTimer <= 0 && countdownTimer !== -1) {
              countdownTimer = -1;
              setLocalCountdownState(null);
              gameState = FlowState.F4_SETUP_WAVE;
            }
          } else {
            // When using GameplayTemplate, wait for countdown to finish
            // GameplayTemplate auto-decrements and hides countdown
            if (!countdownState || !countdownState.show) {
              // Countdown finished by GameplayTemplate
              gameState = FlowState.F4_SETUP_WAVE;
            }
          }
          break;
        case FlowState.F9_CHECK_TIME_RUNOUT:
          waveTimeCount += scaledDeltaTime();
          if (waveTimeCount >= waveTimeMax) {
            waveTimeCount = waveTimeMax;
            gameState = 8;
          }
          break;
        case 8:
          gameState = FlowState.F4_SETUP_WAVE;

          break;
        case FlowState.F10_ENDGAME:
          console.log('EndGame');
          timeManager.stop(); // หยุด loop
          // setEndGame is no longer needed - handled by triggerEndGame callback

          gameState = 10;
          // renderer.setAnimationLoop(null);

          // navigate("/gamesummary", {});
          // SceneManager.getInstance().setScene(SceneName.SCORE);
          break;
        case 10:
          // wait for navigate
          break;
        default:
          break;
      }

      // Entity Update
      if (gameState >= 5 && gameState <= 7) {
        entiesStateRef.current.forEach((entityElement) => {
          if (entityElement.Object.position.y <= -35) {
            sceneRef.current?.remove(entityElement.Object);
            entiesStateRef.current.splice(
              entiesStateRef.current.indexOf(entityElement),
              1,
            );

            if ((GameConfig?.FruitMissAmount || -1) == 0) {
              triggerEndGame(GameStatus.DEAD);
              timeManager.stop();
              return;
            }

            if (GameConfig?.FruitMissAmount) GameConfig.FruitMissAmount--;
            return;
          }

          // if (entityElement.Object.children[1]) {
          //   entityElement.Object.children[1].rotation.z += 0.05;
          // }
          if (entityElement.Object) {
            // Multi-axis rotation with random directions (left/right spinning)
            // entityElement.Object.rotation.x += entityElement.rotationVelocity.x * scaledDeltaTime();
            // entityElement.Object.rotation.y += entityElement.rotationVelocity.y * scaledDeltaTime();
            entityElement.Object.rotation.z +=
              entityElement.rotationVelocity.z * scaledDeltaTime() * 5;

            // // Add enhanced wobble effect for more natural movement
            // const wobbleIntensity = 0.008;
            // const timeBasedWobble = entityElement.currentLifeSpanDelta * 6;
            // entityElement.Object.rotation.x += Math.sin(timeBasedWobble * 2.1) * wobbleIntensity;
            // entityElement.Object.rotation.y += Math.sin(timeBasedWobble * 1.8) * wobbleIntensity;
            // entityElement.Object.rotation.z += Math.cos(timeBasedWobble * 2.5) * wobbleIntensity;
          }

          // Update Entity velocity
          //entityElement.currentVelocityY -= deltaTime * gravity;
          entityElement.currentLifeSpanDelta +=
            scaledDeltaTime() * (entityElement.statMultiplier || 0.5) * 0.5;
          // const velocity = Math.min(
          //   0.5,
          //   Math.max(-0.6, entityElement.currentVelocityY - deltaTime * gravity)
          // );

          // Update cube's position based on velocity
          // entityElement.Object.position.y += velocity;
          // entityElement.Object.position.x += entityElement.currentVelocityX;
          // entityElement.Object.position.y = 1.1;
          //console.log(entityElement.Object.position.y);

          // Physics: Apply gravity and update position
          entityElement.currentVelocityY -= 0.01; // gravity
          // entityElement.Object.position.y += entityElement.currentVelocityY;
          // entityElement.Object.position.x += entityElement.currentVelocityX;
          entityElement.Object.position.y += entityElement.currentVelocityY * scaledDeltaTime() * 50;
          entityElement.Object.position.x += entityElement.currentVelocityX * scaledDeltaTime() * 50;

          if (
            hoveredFruit === entityElement.Object.children[0] &&
            isMouseDown.current == true
          ) {
            // Check if there lastraycastHitposition
            if (!entityElement.lastRaycastHitPosition) {
              return;
            }

            // Check if mouse distance is over 0.1
            const distance = mouseRef?.current.distanceTo(
              entityElement.lastRaycastHitPosition,
            );
            entityElement.currentDistance += distance;
            if (entityElement.currentDistance <= 0.1) {
              return;
            }

            // Check if it the obstacle
            if (entityElement.entityType == EntityType.OBSTACLE) {
              // gameState = 9;
              livesRef.current -= 1;
              setProps({ lives: livesRef.current });

              // hit bomb
              playEffect(SOUND_GROUPS.sfx.hit_bomb, { volume: 70 });
              setTimeout(() => {
                playEffect(SOUND_GROUPS.sfx.health_drop, { volume: 50 });
              }, 200);
              sceneRef.current?.remove(entityElement.Object);
              entiesStateRef.current.splice(
                entiesStateRef.current.indexOf(entityElement),
                1,
              );
              if (sceneRef.current) {
                {
                  /* TODO: Change Explosion Effect */
                }
                CreateNewExplosionCake(
                  entityElement.Object.position,
                  sceneRef.current,
                  PUBLIC_ASSETS_LOCATION.model.effect.smoke,
                );
                // color bomb black
                // const color = 0x333333;
                // createFirework(sceneRef.current, entityElement.Object.position, {
                //   color,
                //   count: 28,
                //   particleSize: 0.18,
                //   speed: 0.8,
                //   gravity: -0.03,
                //   lifetime: 1.2,
                // });
              }
              return;
            }

            // Fruit Slicing
            playEffect(SOUND_GROUPS.sfx.hit_cake, { volume: 70 });
            setTimeout(() => {
              playEffect(SOUND_GROUPS.sfx.get_score, { volume: 20 });
            }, 200);
            if (sceneRef.current) {
              {
                /* TODO: Change Cake Effect */
              }
              CreateNewExplosionCakeLove(
                entityElement.Object.position,
                sceneRef.current,
              );
            }
            sceneRef.current?.remove(entityElement.Object);
            entiesStateRef.current.splice(
              entiesStateRef.current.indexOf(entityElement),
              1,
            );

            const baseScore =
              entityElement.scoreValue || GameConfig?.ScoreIncreasement || 5;
            const comboMultiplier =
              1 +
              Math.floor(
                currentMultiplerScore.current /
                (GameConfig?.ComboIncreaseJudgement || 500),
              );

            const CalculatedScore = baseScore * comboMultiplier;

            scoreRef.current += CalculatedScore;
            // gameCurrentScoreSet(
            //   useGameStore.getState().gameCurrentScore + CalculatedScore
            // );
            setProps({ score: scoreRef.current });
            currentMultiplerScore.current += GameConfig
              ? GameConfig.MultiplerScoreIncreasement
              : 250;
            if (GameConfig?.MaxMultiplerScore) {
              currentMultiplerScore.current = Math.min(
                currentMultiplerScore.current,
                GameConfig.MaxMultiplerScore,
              );
            }
            return;
          } else {
            entityElement.currentDistance = 0;
          }

          entityElement.lastRaycastHitPosition = mouseRef?.current.clone();
        });

        // Score Multiplier Decay (ลด combo ช้าๆ เมื่อไม่ slice)
        currentMultiplerScore.current -=
          scaledDeltaTime() * (GameConfig ? GameConfig.MultiplerScoreDecayRate : 150);
        currentMultiplerScore.current = Math.max(currentMultiplerScore.current, 0);

        // Score Multiplier Update
        // currentMultiplerScore.current -=
        //   scaledDeltaTime() * (GameConfig ? GameConfig.MultiplerScoreDecayRate : 50);
        // currentMultiplerScore.current = Math.max(
        //   Math.min(
        //     currentMultiplerScore.current,
        //     GameConfig ? GameConfig.MaxMultiplerScore : 2000,
        //   ),
        //   0,
        // );
      }

      if (
        gameState >= FlowState.F5_WAVE_PLAYING &&
        gameState <= FlowState.F9_CHECK_TIME_RUNOUT
      ) {
        // check time run out เวลาเล่น
        if (GameConfig && timeRef.current >= GameConfig.MaxGameTime / 1000) {
          triggerEndGame(GameStatus.SUCCESS);
          timeManager.stop();
          return;
        }

        // check lives  ชีวิต
        if (livesRef.current <= 0) {
          triggerEndGame(GameStatus.DEAD);
          timeManager.stop();
          return;
        }
      }

      // Rendering
      // if (renderer && sceneRef?.current && cameraRef?.current) {
      //   renderer.render(sceneRef?.current, cameraRef?.current);
      // }

      // Reset Variable
      hoveredFruit = null;
      //   lastFrameTime = timeAnimate;
      // };
    });
    // #endregionn - Main game loop

    // gameCurrentWaveSet(0);
    // setProps({ round: 0 });

    setGameStartTime(0);
    // renderer.setAnimationLoop(animate);
    timeManager.start();

    gameTotalTimeUsedSet(performance.now());
    setProps({ seconds: 0 });

    // Add mouse and touch event listeners
    const handle_Mouse_and_Touch_Move = (clientX: number, clientY: number) => {
      const raycaster = new THREE.Raycaster();
      const mouse = new THREE.Vector2();
      if (rendererRef.current && cameraRef.current && sceneRef.current) {
        // Use actual canvas element bounds (not container div) for correct position after resize
        const rect = rendererRef.current.domElement.getBoundingClientRect();
        mouse.x = ((clientX - rect.left) / rect.width) * 2 - 1;
        mouse.y = -((clientY - rect.top) / rect.height) * 2 + 1;
        setMousePosition(mouse);
        mouseRef.current = mouse;
        raycaster.setFromCamera(mouse, cameraRef.current);

        const intersects = raycaster.intersectObjects(sceneRef.current.children);
        if (intersects.length > 0) {
          const intersectedObject = intersects[0].object as THREE.Mesh;
          return intersectedObject;
        } else {
          return null;
        }
      } else {
        return null;
      }
    };

    // Mouse events
    window.addEventListener('mousemove', (event: MouseEvent) => {
      hoveredFruit = handle_Mouse_and_Touch_Move(event.clientX, event.clientY);
    });

    window.addEventListener('mousedown', (event: MouseEvent) => {
      if (event.button != 0) {
        isMouseDown.current = false;
        return;
      }
      isMouseDown.current = true;
    });

    window.addEventListener('mouseup', (event: MouseEvent) => {
      if (event.button != 0) {
        isMouseDown.current = false;
        return;
      }
      isMouseDown.current = false;
    });

    // Touch events
    window.addEventListener('touchmove', (event: TouchEvent) => {
      if (event.touches.length > 0) {
        const touch = event.touches[0];
        // event.preventDefault();
        hoveredFruit = handle_Mouse_and_Touch_Move(touch.clientX, touch.clientY);
      }
    });

    window.addEventListener('touchstart', () => {
      isMouseDown.current = true;
    });

    window.addEventListener('touchend', () => {
      isMouseDown.current = false;
    });

    const cleanup = () => {
      // Any additional cleanup logic can go here
      window.removeEventListener('mousemove', () => { });
      window.removeEventListener('mousedown', () => { });
      window.removeEventListener('mouseup', () => { });

      window.removeEventListener('touchmove', () => { });
      window.removeEventListener('touchstart', () => { });
      window.removeEventListener('touchend', () => { });

      // renderer.setAnimationLoop(null);

      unsubFixedUpdate();
      timeManager.removeRenderTarget(renderer);
      renderer.dispose();
      resizeObserver.disconnect();
    };
    // window.addEventListener('visibilitychange', () => {
    //   if (document.visibilityState === 'hidden') {
    //     cleanup();
    //   }
    // });
    // window.addEventListener('pagehide', cleanup);
    // window.addEventListener('beforeunload', cleanup);
    // window.addEventListener('unload', cleanup);

    // Clean up event listener on unmount
    return cleanup;
  }, []);

  // -----------------------------------
  // Pause / Resume Handlers
  // -----------------------------------
  const handlePause = useCallback(() => {
    if (onPause) {
      onPause();
    } else {
      setLocalIsPause(true);
      TimeManager.getInstance().stop();
      pauseSound();
    }
  }, [onPause, pauseSound]);

  const handleResume = useCallback(() => {
    if (onResume) {
      onResume();
    } else {
      setLocalIsPause(false);
      resumeSound();
      setLocalCountdownState({
        show: true,
        seconds: 3,
        phase: CountdownPhase.CONTINUE,
        text: texts.countdown_continue,
      });
    }
  }, [onResume, resumeSound, texts.countdown_continue]);

  // const handleHUDResume = useCallback(() => {
  //   setIsCountdownActive(true)
  //   setIsPause(false)
  // }, []);
  // const handleCountdownFinished = useCallback(() => {
  //   TimeManager.getInstance().start();
  //   setIsCountdownActive(false);
  //   handleGameStart();

  //   // if (phase === 'continue') resumeSound();
  //   // else playSound(SOUND_GROUPS.bg.cookie_and_candy_1 as SoundKey);
  //   // setVolume(10);

  // }, []);

  useEffect(() => {
    // Only run local countdown logic if NOT using props from GameplayTemplate
    if (propsCountdownState !== undefined) return;

    if (!countdownState || !countdownState.show) return;

    if (countdownState.seconds <= 0) {
      setLocalCountdownState(null);
      TimeManager.getInstance().start();
      resumeSound();
      return;
    }

    const timer = setTimeout(() => {
      setLocalCountdownState((prev: any) => prev ? {
        ...prev,
        seconds: prev.seconds - 1
      } : null);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdownState, resumeSound, propsCountdownState]);

  // -----------------------------------
  // Resume game if not paused (no longer pause for config editor - handled by GameplayTemplate)
  // -----------------------------------
  useEffect(() => {
    // Resume game if not paused by user and game has started
    if (!isPause && isGameStarted.current && !countdownState?.show) {
      TimeManager.getInstance().start();
      resumeSound();
    }
  }, [countdownState, isPause, pauseSound, resumeSound]);

  return (
    <>
      <div className="relative flex h-screen w-full items-center justify-center overflow-hidden select-none">
        {/* Unified Countdown Modal for pause/resume and wave transitions */}
        {/* {countdownState && countdownState.show && (
          <CountdownModal
            seconds={countdownState.seconds}
            // phase={countdownState.phase === 'wave' ? 'start' : countdownState.phase}
            text={countdownState.text}
            onFinish={() => {
              // if (countdownState.phase === 'continue') resumeSound();
              // else playSound(SOUND_GROUPS.bg.cookie_and_candy_1);
              resumeSound();
            }}
          />
        )} */}

        {/* Game over modal - Now handled by GameplayTemplate.renderEndGame() */}
        {/* {endGame && statusGame !== null && <ModalGameOver status={statusGame} />} */}

        {/* Round display */}
        {/* {roundDisplay !== null && (
          <div className="bg-opacity-70 pointer-events-none absolute inset-0 z-20 flex items-center justify-center bg-black">
            <div className="flex flex-col items-center justify-center">
              <img src={`${PUBLIC_ASSETS_LOCATION.image.round_label}`} alt="" />
              <div className="font-cherry-bomb-one w-[200px] text-center text-[86px] font-bold text-[#fe679a] [-webkit-text-stroke:1px_#ffffff]">
                {roundDisplay}
              </div>
            </div>
          </div>
        )} */}

        <div
          className="absolute inset-0 bg-cover bg-bottom"
          style={{
            backgroundImage: `url(${PUBLIC_ASSETS_LOCATION.image.background.gameplay})`,
          }}
        />
        {/* Canvas for Three.js */}
        {/* <canvas ref={canvasRef} className="absolute inset-0"></canvas> */}
        <div ref={canvasRef} className="absolute inset-0 h-full w-full border-0" />
        {/* Gameplay trail effect */}
        {/* TODO: Change Trail Effect */}
        <GameplayTrailEffect
          sceneRef={sceneRef}
          cameraRef={cameraRef}
          mouseRef={mouseRef}
          isMouseDown={isMouseDown}
          trailPointsRef={trailPointsRef}
          color="#ff80c0"
        />
        <GameplayHUD
          round={round}
          score={score}
          seconds={seconds}
          timeString={timeString}
          lives={lives}
          isPause={isPause}
          isSystemPause={propsIsSystemPause}
          onPause={handlePause}
          onResume={handleResume}
        />
        {/* <GameSummary /> */}
        {/* <UpdateUI></UpdateUI> */}
        {/*<DebugOverlay
            debugInfo={{
              score: scoreRef.current,
              mousePosition: mousePosition,
              comboMultiplier:
                1 +
                Math.floor(
                  currentMultiplerScore.current /
                    (GameConfig ? GameConfig.ComboIncreaseJudgement : 500)
                ),
              currentMultiplerScore: currentMultiplerScore.current,
            }}
          />*/}
      </div>

      {/* Config Editor Modal is now handled by GameplayTemplate */}
    </>
  );
};

export default Gameplay;
