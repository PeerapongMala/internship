import { useState, useEffect, useCallback } from 'react';

import { useWaveStore } from '@/store/waveStore';
import { useGameStore } from '@/store/gameStore';
import { WallEffect, WallWave } from './WallWave';
import { ObstacleWave } from './ObstacleWave';
import { useLeaderboardStore } from '@/store/leaderboardStore';
import { useTimerStore } from '@/store/timerStore';
import { SceneName } from '@/types/game';
import { SceneManager } from '@core-utils/scene/scene-manager';
import { PUBLIC_ASSETS_LOCATION } from '@/assets/public-assets-locations';

export interface WaveObject {
  type: 'wall' | 'obstacle';
  left: {
    effect?: 'burst' | 'burstSpeed' | 'hp';
    value?: string;
  };
  right: {
    effect?: 'burst' | 'burstSpeed' | 'hp';
    value?: string;
  };
}

export interface WaveData {
  speed: number;
  duration: number;
  waves: WaveObject[];
}

const WallSpawnList: any[] = [];
const ObstacleSpawnList: any[] = [];
export function Wave() {
  const { isPlaying, pauseGame, score, setBurstCount, burstCount } = useGameStore();
  const { currentWave, setWave } = useWaveStore();
  const { currentPlayer, addToLeaderboard } = useLeaderboardStore();
  const { timeRemaining } = useTimerStore();

  const [, setWaveComplete] = useState(false);
  const [wallsComplete, setWallsComplete] = useState(false);
  const [obstaclesComplete, setObstaclesComplete] = useState(false);
  const [, setCurrentWaveIndex] = useState(0);
  const [waveData, setWaveData] = useState<WaveData | null>(null);

  const waveFile = PUBLIC_ASSETS_LOCATION.config.waveConfig;

  // Function to load wave data from JSON file
  const installWaveData = useCallback(async () => {
    try {
      const response = await fetch(waveFile);
      const data = await response.json();
      console.log('Found Data', data.waveList);

      let currentSpawnDelay = 0;
      data.waveList.forEach((wave: any) => {
        wave.spawnList.forEach((spawn: any) => {
          spawn.objectList.forEach((object: any) => {
            if (object.type === 'wall') {
              WallSpawnList.push({
                distanceAt: currentSpawnDelay + spawn.distanceAt,
                buffType: object.effect,
                value: object.value,
              });
            } else if (object.type === 'obstacle') {
              ObstacleSpawnList.push({
                distanceAt: spawn.distanceAt,
                scoreMultiplier: object.scoreMultiplier,
                statMultiplier: object.statMultiplier,
              });
            }
          });
        });
        currentSpawnDelay += wave.waveDuration;
        console.log('CurrentSpawnDelay: ' + currentSpawnDelay);
      });

      setWaveData(data);
    } catch (error) {
      console.error(`Failed to load wave file:`, error);
    }
  }, [waveFile]);

  useEffect(() => {
    if (!isPlaying) {
      setWallsComplete(false);
      setObstaclesComplete(false);
      setWaveComplete(false);
      setWave(0); // Reset to first wave when game starts
      return;
    }
    installWaveData();
  }, [isPlaying]);

  useEffect(() => {
    if (!isPlaying) return;

    // Check wave completion based on what's in the current wave
    const isWaveComplete = wallsComplete && obstaclesComplete;

    if (isWaveComplete) {
      console.log('Wave complete! Moving to next wave...');
      setWaveComplete(true);
      console.log('Wave complete! Loading next wave...');
      setWallsComplete(false);
      setObstaclesComplete(false);
      setCurrentWaveIndex((prev) => prev + 1);

      pauseGame();
      if (currentPlayer) {
        currentPlayer.score = score;
        currentPlayer.lastCountdownTime = timeRemaining;
        addToLeaderboard(currentPlayer);
      }
      SceneManager.getInstance().setScene(SceneName.SCORE);
    }
  }, [wallsComplete, obstaclesComplete, isPlaying, currentWave, setWave]);

  const handleWallComplete = () => {
    console.log('Wall wave complete - current wave:', currentWave);
    setWallsComplete(true);
  };

  const handleObstacleComplete = () => {
    console.log('Obstacle wave complete - current wave:', currentWave);
    setObstaclesComplete(true);
  };

  if (!isPlaying) return null;
  if (!waveData) return null;

  return (
    <>
      <WallWave
        //wave={wallWaveData}

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
              break;
            default:
              break;
          }
        }}
        wave={WallSpawnList}
        onWaveComplete={handleWallComplete}
      />

      <ObstacleWave
        wave={ObstacleSpawnList}
        //onPlayerCollision={handleObstacleComplete}
        onWaveComplete={handleObstacleComplete}
      />
    </>
  );
}
