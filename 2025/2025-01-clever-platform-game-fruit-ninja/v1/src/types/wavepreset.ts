type waveConfig = {
  waveList: wavePreset[];
};

type wavePreset = {
  name: string;
  waveDuration: number;
  spawnList: waveSpawnList[];
};

type waveSpawnList = {
  timeAt: number;
  objectList: spawnObjectList[];
};

type spawnObjectList = {
  type: string;
  amount: number;
  scoreMultiplier?: number;
  statMultiplier?: number;
};
