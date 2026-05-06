// Import
import { useCallback, useEffect, useRef, useState } from 'react';
import { SkillName, useSkillStore } from '@/store/skillStore';
import { useGameStore } from '@/store/gameStore';
import { useCharacterStore } from '@/store/characterStore';
import * as THREE from 'three';
import SkyboxHandler from '@/Utilities/SkyboxHandler';
import SkyboxPresets from '@class/SkyboxPresets';
import EntityHandler, { EntityObject } from '@class/EntityHandler';
import Enemy3DHandler from '@class/Enemy3DHandler';
import SkillPanel from './components/skillPanel';
import { RPG } from '@/Classes/Projectiles/rpg';
import { Fireball } from '@/Classes/Projectiles/Fireball';
import { Iceball } from '@/Classes/Projectiles/Iceball';
import { Drone } from '@/Classes/Projectiles/Drone';
import { Laser } from '@/Classes/Projectiles/Laser';
import { Molotov } from '@/Classes/Projectiles/Molotov';
import { GameplayHUD } from '../GameplayHUD';
import { useSceneGameplayStore } from '../../sceneGameplayStore';
import JoystickControl from '@core-utils/input-management/joystick/JoystickControl';
import KeyboardControl from '@core-utils/input-management/keyboard/KeyboardControl';
import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';
import { ModelFileLoader } from '@core-utils/3d/model-file-loader';
import { LoadFBXAnimation } from '@/context/global/components/animation-loader';
import { GameStatus, CountdownPhase } from '@core-utils/scene/GameplayTemplate';
import TimeManager from '@/utils/core-utils/timer/time-manager';
import { playSoundEffect } from '@/utils/core-utils/sound';
import { SOUND_GROUPS } from '@/assets/public-sound';

// Interface for Gameplay component props (from GameplayTemplate)
interface GameplayProps {
  config?: { waveList: any[] } | null;
  isGameStarted?: boolean;
  isPause?: boolean;
  isSystemPause?: boolean;
  isConfigEditorOpen?: boolean; // Added to detect if config editor is showing
  countdownState?: {
    show: boolean;
    seconds: number;
    phase: CountdownPhase;
    text: string;
  } | null;
  roundDisplay?: number | null;
  endGame?: boolean;
  statusGame?: GameStatus | null;
  onGameEnd?: (status: GameStatus) => void;
  onPause?: () => void;
  onResume?: () => void;
  onShowRoundDisplayWithCountdown?: (round: number, duration?: number) => void;
  onShowCountdown?: (seconds: number, phase: CountdownPhase, text: string) => void;
};

// Game State Variable
let gameState = 0;
let waveTimeCount = 0;
let waveTimeMax = 0;
// let waveTimeDelay = 1; // ❌ DEPRECATED - now handled by countdown
// let lastTime = 0;
const range = 20; // Increased for space gameplay (was 10)

let configWavePreset: { waveList: any[] } | undefined;

// export const createIceball = (props: {
//   loadedModel: THREE.Group;
//   scene: THREE.Scene;
// }) => {
//   const iceball = new Iceball({
//     spawnposition: {
//       x: props.loadedModel.position.x,
//       y: props.loadedModel.position.y + 1,
//       z: props.loadedModel.position.z,
//     },
//     angle: 0,
//     ProjectileOwner: props.loadedModel,
//   });
//   props.scene.add(iceball.getDisplayModel());
// };

// export const createDrone = (props: {
//   loadedModel: THREE.Group;
//   scene: THREE.Scene;
// }) => {
//   const iceball = new Drone({
//     spawnposition: {
//       x: props.loadedModel.position.x,
//       y: props.loadedModel.position.y + 1,
//       z: props.loadedModel.position.z,
//     },
//     angle: 0,
//     ProjectileOwner: props.loadedModel,
//     scene: props.scene,
//   });
//   console.log(iceball);
//   props.scene.add(iceball.getDisplayModel());
// };

export let createIceball = () => { };
export let createDrone = () => { };
export let playerEntityData: EntityHandler;

const Gameplay = ({
  config: propsConfig,
  isGameStarted, // Use this to control when game actually starts
  isPause,
  isConfigEditorOpen, // Detect if config editor is showing
  // isSystemPause,
  countdownState: _countdownState, // Reserved for future use (rendering in GameplayTemplate)
  roundDisplay: _roundDisplay, // Reserved for future use (rendering in GameplayTemplate)
  endGame: _endGame, // Reserved for future use (rendering in GameplayTemplate)
  statusGame: _statusGame, // Reserved for future use (rendering in GameplayTemplate)
  onGameEnd,
  onPause,
  onResume: _onResume, // Reserved for future use
  onShowRoundDisplayWithCountdown,
  onShowCountdown: _onShowCountdown, // Reserved for future use
}: GameplayProps) => {
  const { round, score, exp, level, seconds, timeString } = useSceneGameplayStore();

  const { preloadedModelUrl, isModelLoading: isModelPreloading } = useCharacterStore(); // ดึงโมเดลที่โหลดไว้

  // Debug: ดู preloaded model
  useEffect(() => {
    console.log('🎮 Gameplay Component Mounted');
    console.log('🎨 Preloaded model URL:', preloadedModelUrl);
    console.log('⏳ Is model preloading:', isModelPreloading);
  }, [preloadedModelUrl, isModelPreloading]);

  // Hook
  const gameCurrentTimeCountSet = useGameStore.getState().gameCurrentTimeCountSet;
  const gameCurrentTimeMaxSet = useGameStore.getState().gameCurrentTimeMaxSet;
  const gameCurrentWaveSet = useGameStore.getState().gameCurrentWaveSet;
  const setSceneProps = useSceneGameplayStore.getState().setProps; // เพิ่ม setter สำหรับ UI
  // Use isPause from props instead of useGameStore
  // const { isGamePaused, pauseGame } = useGameStore();

  // Use config from props with fallback loading
  useEffect(() => {
    const loadConfig = async () => {
      if (!propsConfig) {
        console.log('⚠️ No config from props, loading from file as fallback...');
        configWavePreset = await helperConfigLoad('/config/monsterwave.json');
        console.log('✅ Config loaded from file');
      } else {
        configWavePreset = propsConfig;
        console.log('✅ Using config from props');
      };
    };
    loadConfig();
  }, [propsConfig]);

  // ไม่ต้องมี state และ useEffect สำหรับโหลดโมเดลแล้ว
  // เพราะโมเดลถูกโหลดไว้แล้วที่หน้า main menu และเก็บใน characterStore

  // test
  // const [currentChar, setCurrentChar] =
  //   useState<THREE.Group<THREE.Object3DEventMap> | null>(null);

  // State
  const [isShowSkillPanel, setShowSkillPanel] = useState(false);

  // Reference
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  // const navigate = useNavigate();
  const characterRef = useRef<THREE.Object3D | null>(null);

  const mount = useRef<HTMLDivElement>(null);
  // const renderer = new THREE.WebGLRenderer({
  //   alpha: true,
  //   antialias: true,
  // });

  const inputDeltaRef = useRef({ x: 0, y: 0 });
  const currentWaveRef = useRef(0);
  const hasCalledGameEnd = useRef(false); // Track if onGameEnd was called
  const enemy3DHandlerRef = useRef<any>(null); // Store enemy handler reference

  // Use refs to track latest prop values for closures (fixedUpdate callback)
  const isGameStartedRef = useRef(isGameStarted);
  const isPauseRef = useRef(isPause);
  const isConfigEditorOpenRef = useRef(isConfigEditorOpen); const clamp = (value: number, min: number, max: number) =>
    Math.min(Math.max(value, min), max);
  const maxSpeed = 0.1;

  // Update refs when props change
  useEffect(() => {
    console.log('📦 Gameplay props updated - isGameStarted:', isGameStarted, 'isPause:', isPause, 'isConfigEditorOpen:', isConfigEditorOpen);
    isGameStartedRef.current = isGameStarted;
    isPauseRef.current = isPause;
    isConfigEditorOpenRef.current = isConfigEditorOpen;
  }, [isGameStarted, isPause, isConfigEditorOpen]);

  // Functions
  const handleInputMove = useCallback((dx: number, dy: number) => {
    inputDeltaRef.current = { x: dx, y: dy };
  }, []);

  const handleInputEnd = useCallback(() => {
    inputDeltaRef.current = { x: 0, y: 0 };
  }, []);

  // const handlePause = () => { };

  const handleSkillPanelShow = () => {
    TimeManager.getInstance().pause();
    // isPause = true;
    // isSystemPause = true;
    setShowSkillPanel(true);
  };

  const handleSkillPanelClose = () => {
    // Show round display with countdown for next wave
    console.log(`🔄 Wave ${currentWaveRef.current} completed! Starting wave ${currentWaveRef.current + 1}...`);
    setShowSkillPanel(false);
    onShowRoundDisplayWithCountdown?.(currentWaveRef.current + 1); // +1 เพื่อแสดงเลขรอบที่ถูกต้อง (1, 2, 3...)
  };

  const helperConfigLoad = async (jsonName: string | URL | Request) => {
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

  const configWevePresetLoad = async () => {
    configWavePreset = await helperConfigLoad('/config/monsterwave.json');
    console.log('Config wave preset loaded');
    gameState = 4;
  };

  // ฟังก์ชันหาศัตรูที่ใกล้ที่สุดหลายตัว
  const findNearbyEnemies = (range: number, count?: number) => {
    const enemies: { entityObj: EntityObject; distance: number }[] = [];

    if (characterRef.current && enemy3DHandlerRef.current) {
      // Use enemy3DHandler directly instead of window.entities for more accurate results
      const aliveEnemies = enemy3DHandlerRef.current.getEnemies();

      aliveEnemies.forEach((enemyModel: any) => {
        if (
          enemyModel.visible &&
          !enemyModel.EntityData?.isDied &&
          characterRef.current
        ) {
          const distance = characterRef.current.position.distanceTo(
            enemyModel.position,
          );
          enemies.push({
            entityObj: enemyModel as unknown as EntityObject,
            distance
          });
        }
      });
    }

    if (enemies.length === 0) return [];

    // เรียงลำดับจากใกล้สุดไปไกลสุด
    enemies.sort((a, b) => a.distance - b.distance);

    if (count === undefined) {
      return enemies.filter((e) => e.distance < range);
    } else {
      return enemies.slice(0, count);
    }
  }

  // ไม่มี useEffect สำหรับโหลดโมเดลแล้ว เพราะใช้โมเดลที่โหลดไว้จาก characterStore

  // Initial Effect
  useEffect(() => {
    // State Variables

    // Reset Game
    useSkillStore.getState().resetSkill();
    hasCalledGameEnd.current = false; // Reset game end flag

    // Install Three JS Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    // ไม่ตั้งค่า background texture เพื่อให้ Skybox ทำงาน
    // const textureLoader = new THREE.TextureLoader();
    // textureLoader.load(
    //   'public/bg.jpg', 
    //   (texture) => {
    //     scene.background = texture;
    //     console.log('Background texture loaded');
    //   },
    //   undefined,
    //   (error) => {
    //     console.warn('Failed to load background texture, using color instead:', error);
    //     scene.background = new THREE.Color(0x000033); // สีน้ำเงินเข้มสำรอง
    //   }
    // );

    let mixer: THREE.AnimationMixer | undefined;

    // Add Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.y = 3;
    light.position.z = 1;
    light.castShadow = true;
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // // Add Camera
    // const camera = new THREE.PerspectiveCamera(
    //   75,
    //   window.innerWidth / window.innerHeight,
    //   0.1,
    //   1000,
    // );
    // camera.position.z = 15;

    // const enemy3DHandler = new Enemy3DHandler(scene, 'enemy/zombie.fbx');
    const enemy3DHandler = new Enemy3DHandler(scene, PUBLIC_ASSETS_LOCATION.model.target.enemy);
    enemy3DHandlerRef.current = enemy3DHandler; // Store in ref for use in findNearbyEnemies

    // Add Renderer
    // if (!rendererRef.current) {
    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
    });
    // renderer.setSize(window.innerWidth, window.innerHeight);
    // document.body.appendChild(renderer.domElement);
    // rendererRef.current = renderer;

    let aspect = mount.current
      ? mount.current.clientWidth / mount.current.clientHeight
      : window.innerWidth / window.innerHeight;
    const camera = new THREE.PerspectiveCamera(75, aspect, 0.1, 1000);
    camera.position.z = 15;

    // Resize handling
    if (mount.current) {
      mount.current.innerHTML = '';
      mount.current.appendChild(renderer.domElement);
    }

    const resizeCanvas = () => {
      if (mount.current) {
        const width = mount.current.clientWidth;
        const height = mount.current.clientHeight;
        renderer.setSize(width, height);
        camera.aspect = width / height;
        camera.updateProjectionMatrix();
      }
    };

    const resizeObserver = new ResizeObserver(resizeCanvas);
    if (mount.current) resizeObserver.observe(mount.current);

    rendererRef.current = renderer;
    // }

    // // Orbitcontrol Camera
    // const controls = new OrbitControls(camera, rendererRef.current.domElement); // Create OrbitControls instance
    // controls.enableDamping = true;
    // controls.dampingFactor = 0.05;
    // controls.enableZoom = true;
    // controls.minDistance = 5;
    // controls.maxDistance = 50;
    // controls.enablePan = true;
    // camera.position.z = 5;
    // controls.update();

    // // Adding Ground to scene
    // const ground = new Cube({
    //   width: 50,
    //   height: 0.5,
    //   depth: 50,
    //   color: '#0369a1',
    //   position: {
    //     x: 0,
    //     y: -2,
    //     z: 0,
    //   },
    //   DoUseTexture: false,
    // });

    // ground.receiveShadow = true;
    // scene.add(ground);

    // ADDING GAME LIGHTING
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.y = 10;
    dirLight.position.z = 10;
    dirLight.castShadow = true;

    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;

    dirLight.shadow.camera.near = 0.5;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -50;
    dirLight.shadow.camera.right = 50;
    dirLight.shadow.camera.top = 50;
    dirLight.shadow.camera.bottom = -50;

    scene.add(dirLight);

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // New SkyBox
    const skyBox = new SkyboxHandler(scene);
    skyBox.createSkybox(SkyboxPresets.DayTime);

    // // Create Game SoundTrack
    // const audio = new Audio('audio/gameOst.mp3');
    // audio.loop = true;
    // audio.volume = 0.2;
    // audio.play().catch((error) => {
    //   console.error('Failed to play audio:', error);
    // });
    // audioRef.current = audio;

    // Game variables
    let spawnCount = 0;
    let spawnMax = 0;
    let shootStateArray = [
      { name: SkillName.FIREBALL, timeLeft: 1 },
      { name: SkillName.RPG, timeLeft: 2 },
      { name: SkillName.LASER, timeLeft: 4 },
      { name: SkillName.MOLOTOV, timeLeft: 2 },
    ];
    // Reset game state
    gameState = 0;
    currentWaveRef.current = 0;

    // 🌌 รีเซ็ต skybox position
    skyBox.resetSkyboxPosition();

    // Loop function
    // function animateScene(time: number) {
    //   if (lastTime == 0) {
    //     lastTime = time;
    //   }
    //   const deltaTime = (time - lastTime) / 1000;
    //   lastTime = time;

    //   // ป้องกัน deltaTime ที่ผิดปกติ
    //   if (deltaTime > 1 || deltaTime < 0) {
    //     lastTime = time;
    //     return;
    //   }

    // ตรวจสอบว่า renderer และ scene ยังทำงานอยู่
    if (!rendererRef.current || !sceneRef.current) {
      console.error('❌ Critical error - Missing renderer or scene!');
      return;
    }

    const timeManager = TimeManager.getInstance();
    timeManager.addRenderTarget(renderer, sceneRef.current, camera);

    const unsubFixedUpdate = timeManager.fixedUpdate((deltaTime) => {

      // 🛑 Don't start game loop until game is actually started (after config editor confirmation)
      if (!isGameStartedRef.current) {
        console.log('⏸️ Game not started yet, isGameStarted:', isGameStartedRef.current);
        return;
      }

      // 🛑 Pause everything if config editor is showing (debug mode)
      if (isConfigEditorOpenRef.current) {
        console.log('⏸️ Config editor is open');
        return;
      }

      // 🛑 Stop game loop if game has ended (SUCCESS or DEAD)
      if (gameState === 9 || gameState === 10) {
        return;
      }

      // Pause gameplay (but allow setup states 0-4 to continue)
      // Setup states (0-4): loading config, installing character, etc.
      // Gameplay states (5-8): wave setup, spawning enemies, etc.
      if (isPauseRef.current && gameState >= 5) {
        console.log('⏸️ Game paused at gameState:', gameState);
        return;
      }

      // console.log('Game loop running, gameState:', gameState, 'isPause:', isPauseRef.current);

      // Character อาจยังไม่ถูกสร้าง (อยู่ใน loading state)
      // ไม่ต้องเตือนในกรณีนี้ เพราะเป็นเรื่องปกติ

      const speedBalance = 1;
      if (
        !isPauseRef.current && // Don't move character when paused
        characterRef.current &&
        (inputDeltaRef.current.x !== 0 || inputDeltaRef.current.y !== 0)
      ) {
        const clampedX = clamp(
          inputDeltaRef.current.x * speedBalance,
          -maxSpeed,
          maxSpeed,
        );
        const clampedZ = clamp(
          inputDeltaRef.current.y * speedBalance,
          -maxSpeed,
          maxSpeed,
        );

        // Validate movement values before applying
        if (isNaN(clampedX) || isNaN(clampedZ)) {
          console.error('❌ Invalid movement values:', { clampedX, clampedZ, input: inputDeltaRef.current, speedBalance });
          return; // Skip this frame
        }

        // การเคลื่อนที่แบบอวกาศ - ไม่จำกัดด้วยแรงโน้มถ่วง
        characterRef.current.position.x += clampedX;
        characterRef.current.position.z += clampedZ;

        // 🌌 เคลื่อนที่ skybox ในทิศทางตรงกันข้าม เพื่อสร้าง parallax effect
        skyBox.moveSkybox(clampedX, 0, clampedZ);

        // ให้ตัวละครหันหน้าไปยังทิศทางที่กำลังเคลื่อนที่
        if (clampedX !== 0 || clampedZ !== 0) {
          // คำนวณมุมการหมุนจากทิศทางการเคลื่อนที่
          const targetAngle = Math.atan2(clampedX, clampedZ);
          const currentAngle = characterRef.current.rotation.y;

          // ฟังก์ชันสำหรับหาความแตกต่างของมุมที่สั้นที่สุด (ไม่หมุนรอบตัว)
          const angleDifference = (target: number, current: number) => {
            let diff = target - current;
            // ปรับให้อยู่ในช่วง -π ถึง π
            while (diff > Math.PI) diff -= 2 * Math.PI;
            while (diff < -Math.PI) diff += 2 * Math.PI;
            return diff;
          };

          // คำนวณมุมใหม่โดยหมุนไปทางที่ใกล้ที่สุด
          const diff = angleDifference(targetAngle, currentAngle);
          const newAngle = currentAngle + diff * 0.15; // ปรับความเร็วการหมุน

          characterRef.current.rotation.y = newAngle;
        }

        // จำกัดการเคลื่อนที่ภายในขอบเขตอวกาศ
        const spaceBounds = {
          minX: -200, maxX: 200,
          minZ: -200, maxZ: 200,
          minY: -50, maxY: 50
        };

        characterRef.current.position.x = THREE.MathUtils.clamp(
          characterRef.current.position.x,
          spaceBounds.minX,
          spaceBounds.maxX
        );

        characterRef.current.position.z = THREE.MathUtils.clamp(
          characterRef.current.position.z,
          spaceBounds.minZ,
          spaceBounds.maxZ
        );

        characterRef.current.position.y = THREE.MathUtils.clamp(
          characterRef.current.position.y,
          spaceBounds.minY,
          spaceBounds.maxY
        );
      }

      // Switch case state
      switch (gameState) {
        case 0: // Reset Skill
          //resetSkill();
          gameState = 2;
          break;
        case 1: // wait for load
          break;
        case 2: // Load Wave Config
          configWevePresetLoad();
          gameState = 3;
          break;
        case 3: // wait for load
          break;
        case 4: // install player character
          console.log('🎮 Game State 4: Installing player character');
          console.log('📊 Preloaded model URL:', preloadedModelUrl);
          console.log('📊 Is model preloading:', isModelPreloading);

          // ⏳ ถ้ายังโหลดอยู่ ให้รอ
          if (isModelPreloading) {
            console.log('⏳ Waiting for model to preload...');
            return; // รอให้โหลดเสร็จก่อน แต่ไม่เปลี่ยน gameState
          }

          // ถ้าโหลดเสร็จแล้ว ให้ป้องกันไม่ให้ทำงานซ้ำ
          gameState = 3; // ตั้งค่าเป็น 3 เพื่อป้องกันการทำงานซ้ำ

          /*
          const ModelPath =
            "character/set" +
            Config.avatar_id +
            "/character" +
            Config.model_id +
            "/level" +
            Config.level_id +
            ".fbx";
        */

          const onLoadComplete = (loadedModel: THREE.Object3D, group: THREE.Object3D) => {
            LoadFBXAnimation(
              // 'animation/Win.fbx',
              'animation/Idle.fbx',
              'mixamo.com',
              (animationClip: THREE.AnimationClip) => {
                loadedModel.animations.push(animationClip);
                mixer = new THREE.AnimationMixer(loadedModel);

                const findAnimationClip = animationClip; //clips.find((clip) => clip.name === 'IdleC');11
                //const clip = THREE.AnimationClip.findByName(clips, 'IdleC');
                if (findAnimationClip) {
                  const action = mixer.clipAction(findAnimationClip);
                  console.log('Attempt to play animation');
                  action.play();
                } else {
                  console.error('Animation clip not found');
                }

                mixer = mixer;
              },
              (error: any) => {
                console.error('Error loading animation:', error);
              },
            );

            characterRef.current = group;
            window.PlayerCharacter = group;
            // setPlayerCharacter(group);
            window.playerEntityData = new EntityHandler(group, true, 100); // Player มี HP 100

            // สร้าง Health Bar สำหรับ Player
            window.playerEntityData.createHealthBar(scene, {
              width: 2,
              height: 0.25,
              offsetY: 4.5,
            });

            // ป้องกันไม่ให้ player โดน projectile ของตัวเอง
            window.playerEntityData.EntityObject.OnTouch = function (TouchFrom: any) {
              // เช็คว่าเป็น projectile หรือไม่
              if (TouchFrom.IsProjectile) {
                console.log('🛡️ Player hit by projectile - IGNORED (friendly fire protection)');
                return; // ไม่ทำอะไร - ป้องกัน friendly fire
              }

              // ถ้าเป็นศัตรูจริงๆ ให้ทำงานตามปกติ
              if (TouchFrom.IsEnemy) {
                console.log('💔 Player hit by enemy!');
                // Handle enemy damage here if needed
              }
            };

            window.playerEntityData.onEntityDied = function () {
              console.log('💀 Player died! Game Over!');
              gameState = 10;
              // Trigger game over with DEAD status
              // onGameEnd?.(GameStatus.DEAD);
              if (!hasCalledGameEnd.current) {
                hasCalledGameEnd.current = true;
                onGameEnd?.(GameStatus.DEAD);
              }
            };
            window.playerEntityData.EntityObject.isPlayer = true;

            // window.
            createIceball = () => {
              // สร้าง ROWEL 8 ลูก แบบมุมกล่อง - หมุนพร้อมกันเป็นกล่องทั้งก้อน
              const cubeVertices = [
                { x: 1, y: 1, z: 1 }, { x: 1, y: 1, z: -1 },
                { x: 1, y: -1, z: 1 }, { x: 1, y: -1, z: -1 },
                { x: -1, y: 1, z: 1 }, { x: -1, y: 1, z: -1 },
                { x: -1, y: -1, z: 1 }, { x: -1, y: -1, z: -1 },
              ];

              // ใช้มุมเริ่มต้นเดียวกันสำหรับทั้งกล่อง
              const baseAngle = Math.random() * Math.PI * 2; // มุมเริ่มต้นสุ่ม

              cubeVertices.forEach((vertex) => {
                const iceball = new Iceball({
                  spawnposition: {
                    x: group.position.x,
                    y: group.position.y + 1,
                    z: group.position.z,
                  },
                  speed: 0.015,
                  angle: baseAngle, // ใช้มุมเดียวกันทุกลูก = หมุนพร้อมกันเป็นกล่อง
                  ProjectileOwner: group,
                  cubeOffset: vertex, // ตำแหน่งมุมกล่อง
                });
                scene.add(iceball.getDisplayModel());
              });
            };
            // createIceball({ group, scene });

            // window.
            createDrone = () => {
              const drone = new Drone({
                spawnposition: {
                  x: group.position.x,
                  y: group.position.y + 1,
                  z: group.position.z,
                },
                angle: 0,
                ProjectileOwner: group,
                scene: scene,
              });
              console.log(drone);
              scene.add(drone.getDisplayModel());

              void playSoundEffect(SOUND_GROUPS.sfx.drone);
            };
            // createDrone({ group, scene });

            gameState = 5;
            // setCurrentChar(group);
          };


          // ใช้โมเดลที่โหลดไว้แล้วจาก characterStore (ถ้ามี) หรือใช้ default model
          const ModelPath = preloadedModelUrl || PUBLIC_ASSETS_LOCATION.model.character.default;

          console.log('🎮 Loading character model:', ModelPath);
          console.log('📦 Model source:', preloadedModelUrl ? 'PRELOADED FROM API' : 'DEFAULT');

          // loadFBXModel(ModelPath, scene, (loadedModel) => {
          //   onLoadComplete(loadedModel, loadedModel);
          //   loadedModel.scale.set(0.025, 0.025, 0.025);
          //   loadedModel.rotation.set(0, 0, 0);
          // });

          //

          ModelFileLoader({
            src: ModelPath,
            modelType: 'fbx', // บังคับให้เป็น fbx เพราะ blob URL ไม่มีนามสกุล
            scale: 0.025,
            rotation: [0, 0, 0],  // ไม่หมุนที่ model
            debugEnabled: true,
            onLoadComplete: (loadedModel, group) => {
              // หมุน group แทน (หมุนทั้ง hierarchy)
              group.rotation.y = Math.PI; // 180 degrees

              console.debug('Loaded animations:', loadedModel.animations);

              // เพิ่ม group เข้า scene
              scene.add(group);

              // เรียก onLoadComplete เพื่อโหลด animation และตั้งค่าต่างๆ
              onLoadComplete(loadedModel, group);
            },
            onError: (error) => {
              console.error('❌ Error loading character model:', error);
              // ถ้าโหลดไม่สำเร็จ ให้ข้ามไป state ถัดไป
              gameState = 5;
            }
          });
          break;
        case 5: // setup wave preset
          if (!configWavePreset) {
            return;
          }

          // spawn
          spawnCount = 0;
          spawnMax = configWavePreset.waveList[currentWaveRef.current].spawnList.length;

          // Time
          console.log('Start Wave:', configWavePreset.waveList[currentWaveRef.current]);
          waveTimeCount = 0;
          waveTimeMax = configWavePreset.waveList[currentWaveRef.current].waveDuration;

          // อัพเดทเลขรอบที่แสดงบน UI (array index 0 = รอบที่ 1)
          gameCurrentWaveSet(currentWaveRef.current);
          setSceneProps({ round: currentWaveRef.current + 1 }); // +1 เพื่อแสดงเป็นเลขรอบที่เริ่ม 1

          gameState = 6;
          console.log('Start Wave Time Max :', waveTimeMax);
          gameCurrentTimeMaxSet(waveTimeMax);
          break;
        case 6: // Start wave
          if (!configWavePreset) {
            return;
          }

          // Game Start
          waveTimeCount += deltaTime;

          const spawnList = configWavePreset.waveList[currentWaveRef.current].spawnList[spawnCount];

          if (spawnCount < spawnMax) {
            if (waveTimeCount >= spawnList.timeAt) {
              spawnList.objectList.forEach((object: { amount: number }) => {
                for (let index = 0; index < object.amount; index++) {
                  // การสร้างศัตรูแบบอวกาศ - สามารถปรากฏในพื้นที่ 3 มิติ
                  const spawnRadius = 30; // รัศมีการสร้างรอบตัวละคร
                  const playerPos = characterRef.current?.position || new THREE.Vector3(0, 0, 0);

                  // สุ่มตำแหน่งรอบๆ ตัวละครในพื้นที่ทรงกลม
                  const angle1 = Math.random() * Math.PI * 2; // มุมในแนวราบ
                  const angle2 = (Math.random() - 0.5) * Math.PI * 0.5; // มุมในแนวตั้ง (-45 ถึง 45 องศา)

                  const distance = spawnRadius + Math.random() * 20; // ระยะห่างจากผู้เล่น

                  const RandomX = playerPos.x + Math.cos(angle1) * Math.cos(angle2) * distance;
                  const RandomY = playerPos.y + Math.sin(angle2) * distance;
                  const RandomZ = playerPos.z + Math.sin(angle1) * Math.cos(angle2) * distance;

                  // จำกัดให้อยู่ในขอบเขตของอวกาศ
                  const clampedX = THREE.MathUtils.clamp(RandomX, -200, 200);
                  const clampedY = THREE.MathUtils.clamp(RandomY, -50, 50);
                  const clampedZ = THREE.MathUtils.clamp(RandomZ, -200, 200);

                  enemy3DHandler.generateEnemy(
                    {
                      x: clampedX,
                      y: clampedY,
                      z: clampedZ,
                    },
                    // true
                  );
                }
              });

              spawnCount += 1;
            }
          }

          // Check if wave is complete (all spawns done and no enemies alive)
          const aliveEnemies = enemy3DHandler.getEnemies();
          const enemiesRemaining = aliveEnemies.length;
          const allSpawned = spawnCount >= spawnMax;

          // Debug: Log enemy status every few seconds
          if (Math.floor(waveTimeCount * 10) % 30 === 0) {
            console.log('🎯 Wave status - Enemies remaining:', enemiesRemaining, 'Spawned:', spawnCount, '/', spawnMax, 'Time:', waveTimeCount.toFixed(1));
            if (enemiesRemaining > 0 && enemiesRemaining <= 3) {
              // Log details of last few enemies
              aliveEnemies.forEach((enemy, idx) => {
                console.log(`  Enemy ${idx}: visible=${enemy.visible}, isDied=${enemy.EntityData?.isDied}, HP=${enemy.EntityData?.currentHP}`);
              });
            }
          }

          // Wave complete when: all enemies spawned AND all enemies defeated
          if (allSpawned && enemiesRemaining === 0) {
            console.log('✅ Wave complete! All spawns done and enemies defeated');
            waveTimeCount = waveTimeMax;
            gameState = 7;
          }
          gameCurrentTimeCountSet(waveTimeCount);
          setSceneProps({ seconds: waveTimeCount }); // Sync timer ไป HUD

          break;
        case 7: // Wave ended
          if (!configWavePreset) {
            console.log('!configWavePreset');

            return;
          }

          if (currentWaveRef.current + 1 >= configWavePreset.waveList.length) {
            // All waves completed - game success!
            console.log('🎉 All waves completed!');
            if (!hasCalledGameEnd.current) {
              hasCalledGameEnd.current = true;
              onGameEnd?.(GameStatus.SUCCESS);
            }
            gameState = 9;
            return;
            // break;
          }

          currentWaveRef.current += 1;
          gameCurrentWaveSet(currentWaveRef.current);
          setSceneProps({ round: currentWaveRef.current + 1 }); // อัพเดท UI: +1 เพื่อแสดงเป็นรอบที่ 2, 3, 4...

          handleSkillPanelShow();

          // มันเป็น wave สุดท้ายหรือยัง

          // waveTimeMax = waveTimeDelay;
          // waveTimeCount = 0;

          // gameState = 8;

          // Skip delay states and go directly to setup next wave
          // (countdown will handle the delay)
          gameState = 5; // Go back to setup wave preset
          break;
        case 8: // Increase wave (DEPRECATED - now handled by countdown)
          waveTimeCount += deltaTime;
          if (waveTimeCount >= waveTimeMax) {
            waveTimeCount = waveTimeMax;
            gameState = 9;
          }
          break;
        case 9: // Game Success - all waves completed
          // gameState = 5; // ❌ Don't restart - game is finished!
          // Stay in this state, game loop will stop due to early return check
          break;
        case 10: // Game Over (Player died)
          // gameState = 10; // ❌ Redundant
          // if (rendererRef.current) rendererRef.current.setAnimationLoop(null);
          // Notify parent scene about game over (DEAD) - only once
          if (!hasCalledGameEnd.current) {
            hasCalledGameEnd.current = true;
            onGameEnd?.(GameStatus.DEAD);
          }
          // Scene transition is now handled by GameplayTemplate
          // SceneManager.getInstance().setScene(SceneName.SCORE);
          break;
      }

      if (gameState >= 6 && gameState <= 8) {
        // Update Entity
        EntityHandler.update(deltaTime);

        // อัพเดท Health Bars ให้หันหน้าไปทางกล้อง
        if (window.entities && camera) {
          window.entities.forEach((entity) => {
            if (entity.healthBar && !entity.isDied) {
              entity.updateHealthBar(camera);
            }
          });
        }

        // อัปเดต projectiles และ objects ทั้งหมดที่มี OnUpdate
        // และเก็บรายการ objects ที่ต้องลบไปด้วย (เพื่อความปลอดภัย)
        if (sceneRef.current) {
          const scene = sceneRef.current;
          const objectsToRemove: THREE.Object3D[] = [];

          const safeTraverse = (root: THREE.Object3D) => {
            const stack: THREE.Object3D[] = [root];
            while (stack.length) {
              const obj = stack.pop();
              if (!obj) continue;

              // Run per-object update safely
              if ((obj as any).OnUpdate && typeof (obj as any).OnUpdate === 'function') {
                try {
                  (obj as any).OnUpdate(deltaTime);
                } catch (err) {
                  console.error('Error in OnUpdate:', err);
                }
              }

              // Removal conditions
              if ((obj as any).position) {
                const pos = (obj as any).position;
                if (Math.abs(pos.x) > 500 || Math.abs(pos.y) > 200 || Math.abs(pos.z) > 500) {
                  objectsToRemove.push(obj);
                }
              }
              if (obj.visible === false && obj.parent && obj !== scene) {
                objectsToRemove.push(obj);
              }

              // Push children safely
              const children = (obj as any).children;
              if (Array.isArray(children) && children.length) {
                for (let i = 0; i < children.length; i++) {
                  const child = children[i];
                  if (child) stack.push(child);
                }
              }
            }
          };

          try {
            safeTraverse(scene);
          } catch (err) {
            console.error('Safe traversal failed:', err);
          }

          // Cleanup removal
          for (const obj of objectsToRemove) {
            try {
              if (obj.parent) obj.parent.remove(obj);
            } catch (err) {
              console.error('Error removing object:', err);
            }
          }
          if (objectsToRemove.length > 0) {
            console.log('🧹 Cleaned up', objectsToRemove.length, 'objects (out-of-bounds or destroyed)');
          }
        }
      }

      // Handling Shooting
      shootStateArray.forEach((element) => {
        element.timeLeft -= deltaTime;

        if (element.timeLeft <= 0) {
          // Shooting time
          const closestEnemies = findNearbyEnemies(range);
          if (closestEnemies.length > 0 && characterRef.current) {
            switch (element.name) {
              case SkillName.FIREBALL:
                element.timeLeft = 1;
                try {
                  const newFireball = new Fireball({
                    spawnposition: characterRef.current.position,
                    //scene: scene,
                  });
                  scene.add(newFireball.getDisplayModel());
                } catch (error) {
                  console.error('❌ Error creating Fireball:', error);
                }
                break;
              case SkillName.RPG:
                element.timeLeft = 3;
                if (useSkillStore.getState().currentSkillLevel[SkillName.RPG] > 0) {
                  const newRPG = new RPG({
                    spawnposition: characterRef.current.position,
                    scene: scene,
                  });
                  scene.add(newRPG.getDisplayModel());
                }
                break;
              case SkillName.LASER:
                element.timeLeft = 4;
                if (useSkillStore.getState().currentSkillLevel[SkillName.LASER] > 0) {
                  const newLaser = new Laser({
                    spawnPosition: characterRef.current.position,
                    targetEntities: closestEnemies.map(enemy => enemy.entityObj),
                    scene: scene,
                  });
                  scene.add(newLaser.getDisplayModel());
                }
                break;
              case SkillName.MOLOTOV:
                element.timeLeft = 2;
                if (useSkillStore.getState().currentSkillLevel[SkillName.MOLOTOV] > 0) {
                  const newMolotov = new Molotov({
                    spawnPosition: closestEnemies[0].entityObj.position,
                    scene: scene,
                    camera: camera,
                  });
                  scene.add(newMolotov.getDisplayModel());
                }
                break;
              default:
                break;
            }
          }
        }
      });

      // Camera follow system - ติดตามตัวละครแบบ survival.io (ไม่หมุนกล้อง)
      if (characterRef.current && characterRef.current.parent) {
        // เช็คว่า character ยังอยู่ใน scene (ไม่ถูกลบออก)
        const playerPosition = characterRef.current.position;

        // Validate player position before using it
        if (isNaN(playerPosition.x) || isNaN(playerPosition.y) || isNaN(playerPosition.z)) {
          console.error('❌ Player position is NaN:', playerPosition);
          // Reset player position
          characterRef.current.position.set(0, 0, 0);
          return; // Skip camera update this frame
        }

        // กำหนดระยะห่างของกล้องจากตัวละคร (ลดความสูงและแหงนขึ้นเพื่อเห็นหน้าตัวละคร)
        const cameraOffset = new THREE.Vector3(0, 8, 15); // ลดความสูง y จาก 20 เป็น 8, เพิ่ม z เป็น 12
        const targetCameraPosition = new THREE.Vector3();
        targetCameraPosition.copy(playerPosition);
        targetCameraPosition.add(cameraOffset);

        // ขยายขอบเขตของโลกเกมเพื่อรองรับการเคลื่อนที่แบบอวกาศ
        const worldBounds = {
          minX: -200, maxX: 200,  // ขยายพื้นที่เคลื่อนที่
          minZ: -200, maxZ: 200,
          minY: -50, maxY: 50     // เพิ่มการเคลื่อนที่ในแนวตั้ง
        };
        const viewBoundary = 20; // เพิ่มระยะขอบ

        // จำกัดตำแหน่งกล้องไม่ให้เกินขอบเขต (รองรับ 3 มิติ)
        targetCameraPosition.x = THREE.MathUtils.clamp(
          targetCameraPosition.x,
          worldBounds.minX + viewBoundary,
          worldBounds.maxX - viewBoundary
        );

        targetCameraPosition.z = THREE.MathUtils.clamp(
          targetCameraPosition.z,
          worldBounds.minZ + viewBoundary,
          worldBounds.maxZ - viewBoundary
        );

        // เพิ่มการจำกัดความสูงสำหรับการเคลื่อนที่แบบอวกาศ
        targetCameraPosition.y = THREE.MathUtils.clamp(
          targetCameraPosition.y,
          worldBounds.minY + 8,  // ความสูงต่ำสุดของกล้อง
          worldBounds.maxY + 8   // ความสูงสูงสุดของกล้อง
        );

        // Validate target position before lerp
        if (isNaN(targetCameraPosition.x) || isNaN(targetCameraPosition.y) || isNaN(targetCameraPosition.z)) {
          console.error('❌ Target camera position is NaN after clamp:', targetCameraPosition);
          camera.position.set(0, 8, 15);
          camera.rotation.set(-0.3, 0, 0);
          return;
        }

        // การเคลื่อนที่กล้องแบบนุ่มนวล (เฉพาะตำแหน่ง ไม่หมุน)
        const smoothFactor = 0.05; // ค่าต่ำ = นุ่มนวลมาก, ค่าสูง = เร็วกว่า
        camera.position.lerp(targetCameraPosition, smoothFactor);

        // ปรับการหมุนของกล้องให้แหงนขึ้นเพื่อเห็นหน้าตัวละคร (มุมที่เหมาะสมสำหรับ space survival)
        camera.rotation.set(-0.3, 0, 0); // แหงนขึ้นประมาณ 17 องศา
      } else {
        // ถ้ายังไม่มีตัวละคร ใช้ตำแหน่งกล้องเริ่มต้น
        camera.position.set(0, 8, 15);
        camera.rotation.set(-0.3, 0, 0);
      }

      if (mixer) {
        mixer.update(deltaTime);
      }

      // ตรวจสอบและแก้ไขปัญหากล้องหรือ scene
      if (rendererRef.current && sceneRef.current && camera) {
        // ตรวจสอบว่า camera อยู่ในตำแหน่งที่เหมาะสม
        if (isNaN(camera.position.x) || isNaN(camera.position.y) || isNaN(camera.position.z)) {
          console.error('❌ Camera position is NaN, resetting...');
          camera.position.set(0, 8, 15);
          camera.rotation.set(-0.3, 0, 0);
        }

        // ตรวจสอบจำนวน children ใน scene
        if (sceneRef.current.children.length < 5) {
          console.warn('⚠️ Scene has too few children:', sceneRef.current.children.length);
        }

        // Render scene
        try {
          rendererRef.current.render(sceneRef.current, camera);
        } catch (error) {
          console.error('❌ Render error:', error);
        }
      } else {
        console.error('❌ Cannot render - missing components');
      }
    });

    // console.log('creating game loop');
    // rendererRef.current.setAnimationLoop(animateScene);

    // // ตรวจสอบ animation loop ทุก 5 วินาที
    // const loopCheckInterval = setInterval(() => {
    //   if (rendererRef.current && sceneRef.current) {
    //     console.log('Game loop is running, scene children:', sceneRef.current.children.length);
    //   } else {
    //     console.error('❌ Game loop stopped or missing components!');
    //   }
    // }, 5000);

    const cleanup = () => {
      unsubFixedUpdate();
      timeManager.removeRenderTarget(renderer);
      renderer.dispose();
      resizeObserver.disconnect();
    };

    return () => {
      // clearInterval(loopCheckInterval);

      cleanup();
      dispose();
    };
  }, []);

  const dispose = () => {
    console.log('🧹 Disposing game resources...');

    // ทำความสะอาด health bars
    if (window.entities) {
      window.entities.forEach((entity) => {
        if (entity.healthBar) {
          entity.removeHealthBar();
        }
      });
    }

    if (rendererRef.current) {
      rendererRef.current.setAnimationLoop(null);
      rendererRef.current.dispose();
      rendererRef.current = null;
    }

    if (sceneRef.current) {
      // ทำความสะอาด scene
      while (sceneRef.current.children.length > 0) {
        sceneRef.current.remove(sceneRef.current.children[0]);
      }
      sceneRef.current = null;
    }

    // if (audioRef.current) {
    //   audioRef.current.pause();
    //   audioRef.current.currentTime = 0;
    //   audioRef.current = null;
    // }

    console.log('✅ Game resources disposed');
  };

  return (
    // <div id='game-container' style={{ width: '100%', height: '100%' }}>
    <div className="absolute flex h-full w-full flex-col items-center justify-center">
      <div ref={mount} className="absolute h-full w-full" />
      <JoystickControl onJoystickMove={handleInputMove} onJoystickEnd={handleInputEnd} />
      <KeyboardControl
        onKeyboardMove={handleInputMove}
        onKeyboardEnd={handleInputEnd}
        speed={100}
      />
      <GameplayHUD
        isVisible={!isPause}
        round={round}
        score={score}
        exp={exp}
        level={level}
        seconds={seconds}
        timeString={timeString}
        onPauseClick={() => {
          void playSoundEffect(SOUND_GROUPS.sfx.ui_button);
          handleSkillPanelShow();
          onPause?.(); // Use onPause from props
        }}
      />
      {/* <SkillPanel isVisible={isPause || false} onClose={handleSkillPanelClose} /> */}
      <SkillPanel isVisible={isShowSkillPanel} onClose={handleSkillPanelClose} />
    </div>
  );
};

export default Gameplay;
