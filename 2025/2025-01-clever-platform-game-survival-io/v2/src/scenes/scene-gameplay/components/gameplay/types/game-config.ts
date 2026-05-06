export interface GameConfigInterface {
  ScoreIncreasement: number;
  MultiplerScoreIncreasement: number;
  MultiplerScoreDecayRate: number;
  MaxMultiplerScore: number;
  ComboIncreaseJudgement: number;
  StartFruitAmount: number;
  StartBombAmount: number;
  FruitIncreaseAmount: number;
  BombIncreaseAmount: number;
  MaxBombAmount: number;
  MaxFruitAmount: number;
  FruitIncreasementPer: number;
  BombIncreasementPer: number;
  MaxGameTime: number;
  FruitMissAmount: number;
}

export type waveConfig = {
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
