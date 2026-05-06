import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

import * as THREE from "three";
import DebugOverlay from "../global/components/debug";
import { playSound } from "../../utility/SoundController";
import createFirework from "./components/fruit-explosion";
import CreateNewFruit from "./components/fruit-entity";
import CreateNewBomb from "./components/bomb-entity";
import { useGameStore } from "../../store/gameStore";
import { SceneManager } from "../../utils/core-utils/scene/scene-manager";
import { SceneName } from "../../types/GameType";

// Game State Variable
let gameState = 0;
let waveTimeCount = 0;
let waveTimeMax = 0;
let waveTimeDelay = 1;
let lastTime = 0;

// Default Config
const gravity = 1;

let configWavePreset: waveConfig | null = null;

const UpdateUI: React.FC = () => {
  const gameCurrentTimeCount = useGameStore(
    (state) => state.gameCurrentTimeCount
  );
  const gameCurrentTimeMax = useGameStore((state) => state.gameCurrentTimeMax);
  const gameCurrentWave = useGameStore((state) => state.gameCurrentWave);

  return (
    <div className="timer">
      Wave : {gameCurrentWave + 1}
      <br />
      Time left: {(gameCurrentTimeMax - gameCurrentTimeCount).toFixed(2)}{" "}
      seconds
    </div>
  );
};

const GamePage: React.FC = () => {
  const navigate = useNavigate();

  // Ref
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const sceneRef = useRef<THREE.Scene>();
  const cameraRef = useRef<THREE.PerspectiveCamera>();
  const scoreRef = useRef(0); // Score
  const currentMultiplerScore = useRef(0); // Score
  const mouseRef = useRef(new THREE.Vector2());
  const isMouseDown = useRef(false);

  // State
  const [mousePosition, setMousePosition] = useState<THREE.Vector2>(); // Score
  const [gameStartTime, setGameStartTime] = useState<number | null>(null);
  const [isGameOver, setIsGameOver] = useState(false); // state สำหรับสถานะเกมจบ
  const [GameConfig, setGameConfig] = useState<GameConfigInterface>();

  const gameCurrentTimeCountSet =
    useGameStore.getState().gameCurrentTimeCountSet;
  const gameCurrentTimeMaxSet = useGameStore.getState().gameCurrentTimeMaxSet;
  const gameCurrentWaveSet = useGameStore.getState().gameCurrentWaveSet;
  const gameCurrentScoreSet = useGameStore.getState().gameCurrentScoreSet;
  const gameTotalTimeUsedSet = useGameStore.getState().gameTotalTimeUsedSet;

  // Functions
  const AddNewFruit = () => {
    const cube = CreateNewFruit();
    const originalXPos = Math.random() * 40 - 20;
    const originalYPos =
      ((canvasRef.current ? canvasRef.current.height : 0) /
        window.innerHeight) *
      (-19 + Math.random() * -10);
    cube.position.y = originalYPos;
    cube.position.x = originalXPos;
    cube.position.z = -5;
    if (cube && sceneRef.current) {
      sceneRef?.current.add(cube);
    }
    return {
      currentYLerp: 0,
      Object: cube,
      currentVelocityY: 0.8,
      currentVelocityX: Math.random() * 0.2 - 0.1,
      currentLifeSpanDelta: 0,
      lastraycastHitPosition: undefined,
      currentDistance: 0,
      entityType: "Fruit",
      statMultiplier: 1,
      scoreMultiplier: 1,
      originalXPos: originalXPos,
      originalYPos: originalYPos,
    };
  };

  const AddNewBomb = () => {
    const cube = CreateNewBomb();
    const originalXPos = Math.random() * 40 - 20;
    const originalYPos =
      ((canvasRef.current ? canvasRef.current.height : 0) /
        window.innerHeight) *
      (-19 + Math.random() * -10);
    cube.position.y = originalYPos;
    cube.position.x = originalXPos;
    cube.position.z = -5;
    if (cube && sceneRef.current) {
      sceneRef?.current.add(cube);
    }
    return {
      currentYLerp: 0,
      Object: cube,
      currentVelocityY: 0.8,
      currentLifeSpanDelta: 0,
      currentVelocityX: Math.random() * 0.2 - 0.1,
      lastraycastHitPosition: undefined,
      currentDistance: 0,
      entityType: "Bomb",
      statMultiplier: 1,
      originalXPos: originalXPos,
      originalYPos: originalYPos,
    };
  };

  const handleMouseMove = (event: MouseEvent) => {
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    if (canvasRef.current && cameraRef.current && sceneRef.current) {
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
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

  const helperConfigLoad = async (jsonName: string) => {
    let res = null;

    try {
      res = await fetch(jsonName);
    } catch (error) {
      console.error("Error loading " + jsonName + " :", error);
    }

    if (!res) {
      console.error("Error loading " + jsonName + " : no Res");
      return;
    }

    //==
    let data = null;
    console.log(res.body);
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error loading " + jsonName + " : res.json()", error);
    }

    return data;
  };

  // Load gameconfig.json
  const configGameConfigLoad = async () => {
    const data = await helperConfigLoad("src/config/gameconfig.json");
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

    gameState = 2;
  };

  const configWevePresetLoad = async () => {
    configWavePreset = await helperConfigLoad("src/config/wavepreset.json");
    if (!configWavePreset) {
      configWavePreset = {
        waveList: [
          {
            name: "wave1",
            waveDuration: 5,
            spawnList: [
              {
                timeAt: 1,
                objectList: [
                  {
                    type: "fruit",
                    amount: 5,
                    scoreMultiplier: 2,
                    statMultiplier: 1,
                  },
                  {
                    type: "bomb",
                    amount: 1,
                    scoreMultiplier: 2,
                    statMultiplier: 1,
                  },
                ],
              },
              {
                timeAt: 3,
                objectList: [
                  {
                    type: "fruit",
                    amount: 5,
                    statMultiplier: 2,
                  },
                  {
                    type: "bomb",
                    amount: 1,
                  },
                ],
              },
            ],
          },

          {
            name: "wave2",
            waveDuration: 6,
            spawnList: [
              {
                timeAt: 1,
                objectList: [
                  {
                    type: "fruit",
                    amount: 5,
                    scoreMultiplier: 2,
                    statMultiplier: 1,
                  },
                  {
                    type: "bomb",
                    amount: 5,
                    scoreMultiplier: 2,
                    statMultiplier: 1,
                  },
                ],
              },
              {
                timeAt: 3,
                objectList: [
                  {
                    type: "fruit",
                    amount: 5,
                  },
                  {
                    type: "bomb",
                    amount: 5,
                  },
                ],
              },
            ],
          },
        ],
      };
    }
    gameState = 4;
  };

  // Main game loop
  useEffect(() => {
    if (!sceneRef?.current) {
      const scene = new THREE.Scene();
      sceneRef.current = scene;

      // Load the background image
      const textureLoader = new THREE.TextureLoader();
      textureLoader.load("/bg.jpg", (texture) => {
        scene.background = texture;
      });

      // Lighting
      const light = new THREE.DirectionalLight(0xffffff, 1);
      light.position.y = 3;
      light.position.z = 1;
      light.castShadow = true;
      scene.add(light);
      scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    }

    if (!cameraRef?.current) {
      const camera = new THREE.PerspectiveCamera(
        75,
        window.innerWidth / window.innerHeight,
        0.1,
        1000
      );
      camera.position.z = 15;
      cameraRef.current = camera;
    }

    // if (!rendererRef?.current) {
    const renderer = new THREE.WebGLRenderer({ canvas: canvasRef.current! });
    renderer.setSize(window.innerWidth, window.innerHeight);

    let currentWave: number = 0;

    // Define Entity State
    const entityState: {
      Object: THREE.Object3D;
      currentVelocityY: number;
      currentVelocityX: number;
      lastraycastHitPosition: THREE.Vector2 | undefined;
      currentDistance: number;
      entityType: string;
      statMultiplier?: number;
      currentYLerp?: number;
      currentLifeSpanDelta: number;
      originalXPos: number;
      originalYPos: number;
    }[] = [];

    // Reset game state
    gameState = 0;
    currentWave = 0;

    let spawnCount: number = 0;
    let spawnMax: number = 0;
    let hoveredFruit: THREE.Object3D<THREE.Object3DEventMap> | unknown;
    const animate = (time: number) => {
      if (lastTime == 0) {
        lastTime = time;
      }
      const deltaTime = (time - lastTime) / 1000;

      // Switch case state
      switch (gameState) {
        case 0:
          configGameConfigLoad();
          gameState = 1;
          break;
        case 1:
          // wait for load
          break;
        case 2:
          configWevePresetLoad();
          gameState = 3;
          break;
        case 3:
          // wait for load
          break;
        case 4:
          // setup
          if (!configWavePreset) {
            return;
          }

          // spawn
          spawnCount = 0;
          spawnMax = configWavePreset.waveList[currentWave].spawnList.length;

          // Time
          console.log("Start Wave:", configWavePreset.waveList[currentWave]);
          waveTimeCount = 0;
          waveTimeMax = configWavePreset.waveList[currentWave].waveDuration;
          gameState = 5;
          console.log("Start Wave Time Max :", waveTimeMax);
          gameCurrentTimeMaxSet(waveTimeMax);
          break;
        case 5: {
          if (!configWavePreset) {
            return;
          }

          // Game Start
          waveTimeCount += deltaTime;

          const spawnList =
            configWavePreset.waveList[currentWave].spawnList[spawnCount];

          if (spawnCount < spawnMax) {
            if (waveTimeCount >= spawnList.timeAt) {
              console.log("spawnList", spawnList);
              playSound("sound/throw-fruit.ogg").play();
              spawnList.objectList.forEach((object) => {
                if (object.type === "fruit") {
                  for (let index = 0; index < object.amount; index++) {
                    const newFruit = AddNewFruit();
                    newFruit.scoreMultiplier = object.scoreMultiplier || 1;
                    newFruit.statMultiplier = object.statMultiplier || 1;
                    if (newFruit.Object && sceneRef?.current) {
                      sceneRef?.current.add(newFruit.Object);
                      entityState.push(newFruit);
                    }
                  }
                }

                if (object.type === "bomb") {
                  for (let index = 0; index < object.amount; index++) {
                    const newFruit = AddNewBomb();
                    newFruit.statMultiplier = object.statMultiplier || 1;
                    if (newFruit.Object && sceneRef?.current) {
                      sceneRef?.current.add(newFruit.Object);
                      entityState.push(newFruit);
                    }
                  }
                }
              });

              spawnCount += 1;
            }
          }

          // console.log("waveTimeCount", waveTimeCount);
          if (waveTimeCount >= waveTimeMax) {
            waveTimeCount = waveTimeMax;
            gameState = 6;
          }
          gameCurrentTimeCountSet(waveTimeCount);

          break;
        }
        case 6:
          console.log("case 6");
          if (!configWavePreset) {
            console.log("!configWavePreset");

            return;
          }

          if (currentWave + 1 >= configWavePreset.waveList.length) {
            gameState = 9;
            return;
          }

          currentWave += 1;
          gameCurrentWaveSet(currentWave);
          // มันเป็น wave สุดท้ายหรือยัง

          waveTimeMax = waveTimeDelay;
          waveTimeCount = 0;

          gameState = 7;
          break;
        case 7:
          waveTimeCount += deltaTime;
          if (waveTimeCount >= waveTimeMax) {
            waveTimeCount = waveTimeMax;
            gameState = 8;
          }
          break;
        case 8:
          gameState = 4;

          break;
        case 9:
          console.log("EndGame");
          gameState = 10;
          renderer.setAnimationLoop(null);
          // navigate("/gamesummary", {});
          SceneManager.getInstance().setScene(SceneName.SCORE);
          break;
      }

      // Entity Update
      if (gameState >= 5 && gameState <= 7) {
        entityState.forEach((entityElement) => {
          if (entityElement.Object.position.y <= -35) {
            sceneRef.current?.remove(entityElement.Object);
            entityState.splice(entityState.indexOf(entityElement), 1);

            if ((GameConfig?.FruitMissAmount || -1) == 0) {
              gameState = 9;
              return;
            }

            if (GameConfig?.FruitMissAmount) GameConfig.FruitMissAmount--;
            return;
          }

          if (entityElement.Object.children[1]) {
            entityElement.Object.children[1].rotation.z += 0.05;
          }

          // Update Entity velocity
          //entityElement.currentVelocityY -= deltaTime * gravity;
          entityElement.currentLifeSpanDelta +=
            deltaTime * (entityElement.statMultiplier || 0.5) * 0.5;
          // const velocity = Math.min(
          //   0.5,
          //   Math.max(-0.6, entityElement.currentVelocityY - deltaTime * gravity)
          // );

          // Update cube's position based on velocity
          // entityElement.Object.position.y += velocity;
          // entityElement.Object.position.x += entityElement.currentVelocityX;
          // entityElement.Object.position.y = 1.1;
          //console.log(entityElement.Object.position.y);

          const height = 30; // peak height of the arc
          const arcY =
            Math.sin(
              Math.PI * Math.min(entityElement.currentLifeSpanDelta, 1)
            ) * height;

          entityElement.Object.position.x += entityElement.currentVelocityX;
          entityElement.Object.position.y = entityElement.originalYPos + arcY;

          if (
            hoveredFruit === entityElement.Object.children[0] &&
            isMouseDown.current == true
          ) {
            // Check if there lastraycastHitposition
            if (!entityElement.lastraycastHitPosition) {
              return;
            }

            // Check if mouse distance is over 0.1
            const distance = mouseRef?.current.distanceTo(
              entityElement.lastraycastHitPosition
            );
            entityElement.currentDistance += distance;
            if (entityElement.currentDistance <= 0.1) {
              return;
            }

            // Check if it the bomb
            if (entityElement.entityType == "Bomb") {
              gameState = 9;
              sceneRef.current?.remove(entityElement.Object);
              entityState.splice(entityState.indexOf(entityElement), 1);
              if (sceneRef.current) {
                createFirework(sceneRef.current, entityElement.Object.position);
              }
              return;
            }

            // Fruit Slicing
            playSound("public/sound/splatter.ogg").play();
            if (sceneRef.current) {
              createFirework(sceneRef.current, entityElement.Object.position);
            }
            sceneRef.current?.remove(entityElement.Object);
            entityState.splice(entityState.indexOf(entityElement), 1);

            const CalculatedScore =
              (GameConfig ? GameConfig.ScoreIncreasement : 5) *
              (1 +
                Math.floor(
                  currentMultiplerScore.current /
                  (GameConfig ? GameConfig.ComboIncreaseJudgement : 500)
                ));

            gameCurrentScoreSet(
              useGameStore.getState().gameCurrentScore + CalculatedScore
            );
            currentMultiplerScore.current += GameConfig
              ? GameConfig.MultiplerScoreIncreasement
              : 250;
            return;
          } else {
            entityElement.currentDistance = 0;
          }

          entityElement.lastraycastHitPosition = mouseRef?.current.clone();
        });

        // Score Multiplier Update
        currentMultiplerScore.current -=
          deltaTime * (GameConfig ? GameConfig.MultiplerScoreDecayRate : 50);
        currentMultiplerScore.current = Math.max(
          Math.min(
            currentMultiplerScore.current,
            GameConfig ? GameConfig.MaxMultiplerScore : 2000
          ),
          0
        );
      }

      // Rendering
      if (renderer && sceneRef?.current && cameraRef?.current) {
        renderer.render(sceneRef?.current, cameraRef?.current);
      }

      // Reset Variable
      hoveredFruit = null;
      lastTime = time;
    };

    gameCurrentWaveSet(0);
    setGameStartTime(0);
    renderer.setAnimationLoop(animate);

    gameTotalTimeUsedSet(performance.now());
    // Add mouse move event listener
    window.addEventListener("mousemove", (event: MouseEvent) => {
      hoveredFruit = handleMouseMove(event);
    });

    window.addEventListener("mousedown", (event: MouseEvent) => {
      if (event.button != 0) {
        isMouseDown.current = false;
        return;
      }
      isMouseDown.current = true;
    });

    window.addEventListener("mouseup", (event: MouseEvent) => {
      if (event.button != 0) {
        isMouseDown.current = false;
        return;
      }
      isMouseDown.current = false;
    });

    // Clean up event listener on unmount
    return () => {
      window.removeEventListener("mousemove", () => { });
      window.removeEventListener("mousedown", () => { });
      window.removeEventListener("mouseup", () => { });
      renderer.setAnimationLoop(null);
    };
  }, []);

  return (
    <div>
      (
      <>
        <canvas ref={canvasRef}></canvas>
        <UpdateUI></UpdateUI>
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
      </>
      )
    </div>
  );
};

export default GamePage;
