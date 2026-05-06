interface GameConfigInterface {
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

type gameFlow = {
  LOADING_GAME_CONFIG: 0;
  LOADING_WAVE_CONFIG: 1;
};

interface gameStore {}

export enum SceneName {
  APP = "",
  MENU = "MENU",
  GAME = "GAME",
  SCORE = "SCORE",
}
