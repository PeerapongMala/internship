import { useState, useEffect, useCallback } from 'react';

import { useWaveStore } from '@/store/waveStore';
import { useGameStore } from '@/store/gameStore';
import { WallEffect, WallWave } from './WallWave';
import { ObstacleWave } from './ObstacleWave';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { useTimerStore } from '@/store/timerStore';
import TimeManager from '@core-utils/timer/time-manager';
import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';

export interface WaveSpawnObjectInfo {
  type: 'wall' | 'obstacle';
  // left: {
  //   effect?: 'burst' | 'burstSpeed' | 'hp';
  //   value?: string;
  // };
  // right: {
  //   effect?: 'burst' | 'burstSpeed' | 'hp';
  //   value?: string;
  // };
  lane?: number;

  effect?: 'burst' | 'burstSpeed' | 'hp';
  value?: string;
  scoreMultiplier?: number;
  statMultiplier?: number;
}

export interface WaveConfigInfo {
  // speed: number;
  // duration: number;
  // waves: WaveObject[];
  waveList: WaveInfo[];
}

export interface WaveInfo {
  // waveDuration: number;
  spawnList: WaveSpawnInfo[];
}

export interface WaveSpawnInfo {
  distanceAt: number;
  objectList: WaveSpawnObjectInfo[];
}

export interface WallInfo {
  lane?: number;
  distanceAt: number;
  effect?: 'burst' | 'burstSpeed' | 'hp';
  value?: string;
}

export interface ObstacleInfo {
  lane?: number;
  distanceAt: number;
  scoreMultiplier?: number;
  statMultiplier?: number;
}

const WallSpawnList: WallInfo[] = [];
const ObstacleSpawnList: ObstacleInfo[] = [];

export function Wave({
  enableWireframe,
  onObstacleDestroyed,
  onWaveCompleted,
  onPlayerDead,
  onWaveTransition,
  config,
  lanes,
  laneWidth,
}: {
  enableWireframe?: boolean;
  onObstacleDestroyed?: () => void;
  onWaveCompleted?: () => void;
  onPlayerDead?: () => void; // Called when player hits obstacle
  onWaveTransition?: (waveNumber: number) => void; // Called when starting new wave
  config?: WaveConfigInfo | null;
  lanes: number;
  laneWidth: number;
}) {
  const { setBurstCount, burstCount, setBurstSpeed, burstSpeed } = useGameStore();
  const { setWave } = useWaveStore();

  const [, setWaveComplete] = useState(false);
  const [wallsComplete, setWallsComplete] = useState(false);
  const [obstaclesComplete, setObstaclesComplete] = useState(false);
  const [currentWaveIndex, setCurrentWaveIndex] = useState(0);
  const [waveData, setWaveData] = useState<WaveConfigInfo | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);

  // Function to load specific wave data
  const loadWaveByIndex = useCallback((waveIndex: number, configData: WaveConfigInfo) => {
    if (!configData.waveList || waveIndex >= configData.waveList.length) {
      console.log('⚠️ No more waves available, game completed!');
      return false;
    }

    // Clear previous wave data
    WallSpawnList.length = 0;
    ObstacleSpawnList.length = 0;

    const wave = configData.waveList[waveIndex];
    console.log(`📋 Loading wave ${waveIndex + 1}/${configData.waveList.length}`);

    // Load spawn data for this specific wave
    wave.spawnList.forEach((spawn: WaveSpawnInfo) => {
      spawn.objectList.forEach((object: WaveSpawnObjectInfo) => {
        if (object.type === 'wall') {
          WallSpawnList.push({
            lane: object.lane,
            distanceAt: spawn.distanceAt,
            effect: object.effect,
            value: object.value,
          });
        } else if (object.type === 'obstacle') {
          ObstacleSpawnList.push({
            lane: object.lane,
            distanceAt: spawn.distanceAt,
            scoreMultiplier: object.scoreMultiplier,
            statMultiplier: object.statMultiplier,
          });
        }
      });
    });

    console.log(`✅ Wave ${waveIndex + 1} loaded: ${WallSpawnList.length} walls, ${ObstacleSpawnList.length} obstacles`);
    return true;
  }, []);

  // Function to load wave data from JSON file or use provided config
  const installWaveData = useCallback(async () => {
    try {
      let data: WaveConfigInfo;

      // Use config from props if available, otherwise load from file
      if (config) {
        data = config;
        console.log('✅ Using wave config from props');
      } else {
        const response = await fetch(PUBLIC_ASSETS_LOCATION.config.waveConfig);
        data = await response.json();
        console.log('✅ Loaded wave config from file');
      }

      setWaveData(data);

      // Load first wave
      const loaded = loadWaveByIndex(0, data);
      if (loaded) {
        setCurrentWaveIndex(0);
        setWave(1); // Wave number starts from 1

        // Call transition callback for first wave
        if (onWaveTransition) {
          onWaveTransition(1);
        }
      }
    } catch (error) {
      console.error(`Failed to load wave file:`, error);
    }
  }, [config, loadWaveByIndex, setWave, onWaveTransition]);

  useEffect(() => {
    const timeManager = TimeManager.getInstance();
    // Only reset when game truly stops (not just pause for countdown)
    if (!timeManager.isPlaying() && !isInitialized) {
      // Game stopped - reset everything
      setWallsComplete(false);
      setObstaclesComplete(false);
      setWaveComplete(false);
      setWave(0);
      setIsInitialized(false);
      return;
    }

    // Game is playing and not initialized yet - load wave data
    if (timeManager.isPlaying() && !isInitialized) {
      installWaveData();
      setIsInitialized(true);
    }
  }, [isInitialized, installWaveData, setWave]);

  useEffect(() => {
    // Check wave completion based on what's in the current wave
    // This should work even when paused because we need to detect completion
    const isWaveComplete = wallsComplete && obstaclesComplete;

    // console.log('🔍 Wave completion check:', {
    //   wallsComplete,
    //   obstaclesComplete,
    //   isWaveComplete,
    //   currentWaveIndex,
    //   totalWaves: waveData?.waveList.length
    // });

    if (isWaveComplete && waveData) {
      console.log(`🎉 Wave ${currentWaveIndex + 1} complete!`);
      setWaveComplete(true);

      // Reset completion flags immediately to prevent re-triggering
      setWallsComplete(false);
      setObstaclesComplete(false);

      const nextWaveIndex = currentWaveIndex + 1;

      // Check if there are more waves
      if (nextWaveIndex < waveData.waveList.length) {
        console.log(`📢 Preparing next wave: ${nextWaveIndex + 1}/${waveData.waveList.length}`);

        // Load next wave
        const loaded = loadWaveByIndex(nextWaveIndex, waveData);
        if (loaded) {
          setCurrentWaveIndex(nextWaveIndex);
          setWave(nextWaveIndex + 1); // Wave number starts from 1

          // Call transition callback to show round display + countdown
          if (onWaveTransition) {
            onWaveTransition(nextWaveIndex + 1);
          }
        }
      } else {
        // All waves completed - game finished successfully!
        console.log('🏆 All waves completed! Game finished!');

        // Save score to leaderboard
        TimeManager.getInstance().pause();
        const { currentPlayer, addToLeaderboard } = useLeaderboardStore.getState();
        const { score } = useGameStore.getState();
        const { elapsedTime } = useTimerStore.getState();

        if (currentPlayer) {
          currentPlayer.score = score;
          currentPlayer.lastCountdownTime = elapsedTime; // เวลาที่เล่นไป
          addToLeaderboard(currentPlayer);
        }

        // Notify game completion
        if (onWaveCompleted) {
          onWaveCompleted();
        }
      }
    }
  }, [
    wallsComplete,
    obstaclesComplete,
    currentWaveIndex,
    waveData,
    loadWaveByIndex,
    setWave,
    onWaveTransition,
    onWaveCompleted,
  ]);

  const handleWallCompleted = () => {
    console.log(`✅ Walls completed for wave ${currentWaveIndex + 1}`);
    setWallsComplete(true);
  };

  const handleObstacleCompleted = () => {
    console.log(`✅ Obstacles completed for wave ${currentWaveIndex + 1}`);
    setObstaclesComplete(true);
  };

  // Don't unmount when paused - just stop updates via TimeManager
  // if (!isPlaying) return null;
  if (!waveData) return null;

  return (
    <>
      <WallWave
        lanes={lanes}
        laneWidth={laneWidth}
        //wave={wallWaveData}
        enableWireframe={enableWireframe}
        onCollision={(effectData: WallEffect) => {
          switch (effectData.type) {
            case 'hp':
              console.log('Player took hp from wall');
              break;
            case 'burst':
              console.log('Player took burst from wall');
              setBurstCount(burstCount + effectData.value);
              break;
            case 'burstSpeed':
              console.log('Player took burstSpeed from wall');
              setBurstSpeed(burstSpeed + effectData.value);
              break;
            default:
              break;
          }
        }}
        wave={WallSpawnList}
        waveIndex={currentWaveIndex}
        onWaveCompleted={() => {
          handleWallCompleted();
        }}
      />

      <ObstacleWave
        lanes={lanes}
        laneWidth={laneWidth}
        wave={ObstacleSpawnList}
        waveIndex={currentWaveIndex}
        onPlayerCollision={() => {
          // Character hit obstacle - Game Over!
          console.log('💀 Player collision with obstacle - Game Over!');
          TimeManager.getInstance().pause();

          const { currentPlayer, addToLeaderboard } = useLeaderboardStore.getState();
          const { score } = useGameStore.getState();
          const { elapsedTime } = useTimerStore.getState();

          if (currentPlayer) {
            currentPlayer.score = score;
            currentPlayer.lastCountdownTime = elapsedTime; // เวลาที่เล่นไป
            addToLeaderboard(currentPlayer);
          }
          // Notify game over (DEAD)
          if (onPlayerDead) {
            onPlayerDead();
          }
        }}
        onObstacleDestroyed={onObstacleDestroyed}
        onWaveCompleted={() => {
          handleObstacleCompleted();
        }}
      />
    </>
  );
}
