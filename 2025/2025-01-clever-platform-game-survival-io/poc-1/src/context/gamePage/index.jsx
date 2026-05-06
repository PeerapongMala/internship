// Import
import React, { useEffect, useRef, useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useSkillStore } from "../../store/skillStore";
import { useGameStore } from "../../store/gameStore";
import * as THREE from "three";
import SkyboxHandler from "../../Utilities/SkyboxHandler";
import SkyboxPresets from "../../Classes/SkyboxPresets";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { Cube } from "../../Classes/CubeUltity";
import EntityHandler from "../../Classes/EntityHandler";
import { FetchArcadeConfig } from "../../Utilities/ArcadeGameAPI";
import { loadCharacter } from "../../Classes/CharacterLoader";
import { Keyboard } from "../../Classes/KeyboardListener";
import Enemy3DHandler from "../../Classes/Enemy3DHandler";
import JoystickControl from "../../Classes/JoystickControl";
import { RPG } from "../../Modules/Projectiles/rpg";
import { Fireball } from "../../Modules/Projectiles/Fireball";
import SkillPanel from "./components/skillPanel";
import { Iceball } from "../../Modules/Projectiles/Iceball";
import { Drone } from "../../Modules/Projectiles/Drone";
import { Laser } from "../../Modules/Projectiles/Laser";
import { Molotov } from "../../Modules/Projectiles/Molotov";
import { loadFBXModel } from "../global/components/character-loader";
import { LoadFBXAnimation } from "../global/components/animation-loader";

// Game State Variable
let gameState = 0;
let waveTimeCount = 0;
let waveTimeMax = 0;
let waveTimeDelay = 1;
let lastTime = 0;
const range = 10;

let configWavePreset = null;

const GamePage = () => {
  // Hook
  const gameCurrentTimeCountSet =
    useGameStore.getState().gameCurrentTimeCountSet;
  const gameCurrentTimeMaxSet = useGameStore.getState().gameCurrentTimeMaxSet;
  const gameCurrentWaveSet = useGameStore.getState().gameCurrentWaveSet;
  const { isSkillLearnable, isGamePaused } = useGameStore();
  // test
  const [currentChar, setCurrentChar] = useState(null);

  // Reference
  const sceneRef = useRef(null);
  const rendererRef = useRef(null);
  const animationIdRef = useRef(null);
  const audioRef = useRef(null);
  const navigate = useNavigate();
  const characterRef = useRef(null);

  // Functions
  const handlePause = () => {};

  const handleSkillPanelClose = () => {};

  const helperConfigLoad = async (jsonName) => {
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
    try {
      data = await res.json();
    } catch (error) {
      console.error("Error loading " + jsonName + " : res.json()", error);
    }

    return data;
  };

  // Load gameconfig.json
  const configGameConfigLoad = async () => {
    //const data = await helperConfigLoad("config/gameconfig.json");
    //const {} = data;

    gameState = 2;
  };

  const configWevePresetLoad = async () => {
    configWavePreset = await helperConfigLoad("/config/monsterwave.json");
    console.log("Config wave preset loaded");
    gameState = 4;
  };

  // Find Enemy
  const findEnemyInRange = (range) => {
    let closestEnemy = null;
    let closestDistance = range;

    window.entities.forEach((entity) => {
      if (entity.EntityObject.IsEnemy) {
        const distance = characterRef.current.position.distanceTo(
          entity.EntityObject.position
        );
        if (distance < closestDistance) {
          closestDistance = distance;
          closestEnemy = entity.EntityObject;
        }
      }
    });

    return closestEnemy;
  };

  // Initial Effect
  useEffect(() => {
    // State Variables

    // Reset Game
    useSkillStore.getState().resetSkill();

    // Install Three JS Scene
    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const textureLoader = new THREE.TextureLoader();
    textureLoader.load("public/bg.jpg", (texture) => {
      scene.background = texture;
    });

    let mixer;

    // Add Lighting
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.y = 3;
    light.position.z = 1;
    light.castShadow = true;
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));

    // Add Camera
    const camera = new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.z = 15;

    const enemy3DHandler = new Enemy3DHandler(scene, "enemy/zombie.fbx");

    // Add Renderer
    if (!rendererRef.current) {
      const renderer = new THREE.WebGLRenderer({
        alpha: true,
        antialias: true,
      });
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.body.appendChild(renderer.domElement);
      rendererRef.current = renderer;
    }

    // Orbitcontrol Camera
    const controls = new OrbitControls(camera, rendererRef.current.domElement); // Create OrbitControls instance
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = true;
    controls.minDistance = 5;
    controls.maxDistance = 50;
    controls.enablePan = true;
    camera.position.z = 5;
    controls.update();

    // Adding Ground to scene
    const ground = new Cube({
      width: 50,
      height: 0.5,
      depth: 50,
      color: "#0369a1",
      position: {
        x: 0,
        y: -2,
        z: 0,
      },
      DoUseTexture: false,
    });

    ground.receiveShadow = true;
    scene.add(ground);

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
    skyBox.createSkybox(SkyboxPresets.Field);

    // Create Game SoundTrack
    const audio = new Audio("audio/gameOst.mp3");
    audio.loop = true;
    audio.volume = 0.2;
    audio.play().catch((error) => {
      console.error("Failed to play audio:", error);
    });
    audioRef.current = audio;

    // Game variables
    let spawnCount = 0;
    let spawnMax = 0;
    let currentWave = 0;
    let shootStateArray = [
      { name: "fireball", timeLeft: 1 },
      { name: "rpg", timeLeft: 2 },
      { name: "laser", timeLeft: 4 },
      { name: "molotov", timeLeft: 2 },
    ];
    // Reset game state
    gameState = 0;
    currentWave = 0;

    // Loop function
    function animateScene(time) {
      if (lastTime == 0) {
        lastTime = time;
      }
      const deltaTime = (time - lastTime) / 1000;
      lastTime = time;

      if (useGameStore.getState().isGamePaused) {
        return;
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
          gameState = 3;
          const Config = FetchArcadeConfig();

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
          const ModelPath = "character/set2/character1/level1.fbx";
          loadFBXModel(ModelPath, scene, (loadedModel) => {
            loadedModel.scale.set(0.025, 0.025, 0.025);
            loadedModel.rotation.set(0, 0, 0);
            LoadFBXAnimation(
              "animation/Win.fbx",
              "mixamo.com",
              (animationClip) => {
                loadedModel.animations.push(animationClip);
                mixer = new THREE.AnimationMixer(loadedModel);

                const findAnimationClip = animationClip; //clips.find((clip) => clip.name === 'IdleC');11
                //const clip = THREE.AnimationClip.findByName(clips, 'IdleC');
                if (findAnimationClip) {
                  const action = mixer.clipAction(findAnimationClip);
                  console.log("Attempt to play animation");
                  action.play();
                } else {
                  console.error("Animation clip not found");
                }

                mixer = mixer;
              },
              (error) => {
                console.error("Error loading animation:", error);
              }
            );

            characterRef.current = loadedModel;
            window.PlayerCharacter = loadedModel;
            window.playerEntityData = new EntityHandler(loadedModel, true);
            window.playerEntityData.EntityObject.OnTouch = function () {};
            window.playerEntityData.onEntityDied = function () {
              gameState = 10;
            };
            window.playerEntityData.EntityObject.isPlayer = true;
            window.createIceball = () => {
              const iceball = new Iceball({
                spawnposition: {
                  x: loadedModel.position.x,
                  y: loadedModel.position.y + 1,
                  z: loadedModel.position.z,
                },
                angle: 0,
                ProjectileOwner: loadedModel,
              });
              scene.add(iceball.DisplayModel);
            };

            window.createDrone = () => {
              const iceball = new Drone({
                spawnposition: {
                  x: loadedModel.position.x,
                  y: loadedModel.position.y + 1,
                  z: loadedModel.position.z,
                },
                angle: 0,
                ProjectileOwner: loadedModel,
                scene: scene,
              });
              console.log(iceball);
              scene.add(iceball.DisplayModel);
            };

            gameState = 5;
            setCurrentChar(loadedModel);
          });

          break;
        case 5: // setup wave preset
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
          gameState = 6;
          console.log("Start Wave Time Max :", waveTimeMax);
          gameCurrentTimeMaxSet(waveTimeMax);
          break;
        case 6: // Start wave
          if (!configWavePreset) {
            return;
          }

          // Game Start
          waveTimeCount += deltaTime;

          const spawnList =
            configWavePreset.waveList[currentWave].spawnList[spawnCount];

          if (spawnCount < spawnMax) {
            if (waveTimeCount >= spawnList.timeAt) {
              spawnList.objectList.forEach((object) => {
                for (let index = 0; index < object.amount; index++) {
                  const RandomX1 = (Math.random() - 0.5) * ground.width;
                  const RandomZ1 = (Math.random() - 0.5) * ground.depth;

                  let RandomX2, RandomZ2;
                  do {
                    RandomX2 = (Math.random() - 0.5) * ground.width;
                    RandomZ2 = (Math.random() - 0.5) * ground.depth;
                  } while (
                    Math.abs(RandomX2 - RandomX1) < 2 &&
                    Math.abs(RandomZ2 - RandomZ1) < 2
                  );

                  enemy3DHandler.generateEnemy(
                    {
                      x: RandomX2,
                      y: 0,
                      z: RandomZ2,
                    },
                    true
                  );
                }
              });

              spawnCount += 1;
            }
          }

          // console.log("waveTimeCount", waveTimeCount);
          if (
            waveTimeCount >= waveTimeMax &&
            enemy3DHandler.enemies.length <= 0
          ) {
            waveTimeCount = waveTimeMax;
            gameState = 7;
          }
          gameCurrentTimeCountSet(waveTimeCount);

          break;
        case 7: // Wave ended
          if (!configWavePreset) {
            console.log("!configWavePreset");

            return;
          }

          if (currentWave + 1 >= configWavePreset.waveList.length) {
            gameState = 10;
            return;
          }

          currentWave += 1;
          gameCurrentWaveSet(currentWave);
          // มันเป็น wave สุดท้ายหรือยัง

          waveTimeMax = waveTimeDelay;
          waveTimeCount = 0;

          gameState = 8;
          break;
        case 8: // Increase wave
          waveTimeCount += deltaTime;
          if (waveTimeCount >= waveTimeMax) {
            waveTimeCount = waveTimeMax;
            gameState = 9;
          }
          break;
        case 9: // set to game state 4
          gameState = 5;

          break;
        case 10: // Game Over
          console.log("EndGame");
          gameState = 10;
          rendererRef.current.setAnimationLoop(null);
          navigate("/startPage", {});
          break;
      }

      if (gameState >= 6 && gameState <= 8) {
        // Update Entity
        EntityHandler.update();
        // Shooting
      }

      // Handling Shooting
      shootStateArray.forEach((element, index) => {
        element.timeLeft -= deltaTime;

        if (element.timeLeft <= 0) {
          // Shooting time
          const closestEnemy = findEnemyInRange(range);
          if (closestEnemy) {
            const spawnLocation = {
              x: window.PlayerCharacter.position.x,
              y: window.PlayerCharacter.position.y,
              z: window.PlayerCharacter.position.z,
            };
            switch (element.name) {
              case "fireball":
                element.timeLeft = 1;
                const newFireball = new Fireball({
                  spawnposition: spawnLocation,
                });
                scene.add(newFireball.DisplayModel);
                break;
              case "rpg":
                element.timeLeft = 3;
                if (useSkillStore.getState().currentRPGLevel > 0) {
                  const newRPG = new RPG({
                    spawnposition: spawnLocation,
                    scene: scene,
                  });
                  scene.add(newRPG.DisplayModel);
                }
                break;
              case "laser":
                element.timeLeft = 4;
                if (useSkillStore.getState().currentLaserLevel > 0) {
                  const newRPG = new Laser({
                    spawnposition: closestEnemy.position,
                    scene: scene,
                  });
                  scene.add(newRPG.DisplayModel);
                }
                break;
              case "molotov":
                element.timeLeft = 2;
                if (useSkillStore.getState().currentMolotovLevel > 0) {
                  const newRPG = new Molotov({
                    spawnposition: closestEnemy.position,
                    scene: scene,
                    camera: camera,
                  });
                  scene.add(newRPG.DisplayModel);
                }
                break;
              default:
                break;
            }
          }
        }
      });
      camera.position.set(0, 20, 10);
      camera.rotation.set(-(3.14 / 2) + 0.9, 0, 0);
      if (mixer) {
        mixer.update(deltaTime);
      }
      rendererRef.current.render(scene, camera);
    }

    console.log("creating game loop");
    rendererRef.current.setAnimationLoop(animateScene);

    return () => {
      rendererRef.current.setAnimationLoop(null);
      rendererRef.current.dispose();
      /*
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      while (scene.children.length > 0) {
        scene.remove(scene.children[0]);
      }*/
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.currentTime = 0;
      }
      //window.removeEventListener("resize", handleResize);
      //window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <div id="game-container" style={{ width: "100%", height: "100%" }}>
      {/*<JoystickControl playerCharacter={characterRef.current} />*/}
      <JoystickControl playerCharacter={currentChar} />
      <SkillPanel
        isVisible={isSkillLearnable}
        onClose={handleSkillPanelClose}
      />
    </div>
  );
};

export default GamePage;
