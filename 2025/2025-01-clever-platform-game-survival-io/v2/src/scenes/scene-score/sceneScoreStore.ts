import { create } from 'zustand';

interface SceneScoreStore {
  round: number;
  score: number;
  exp: number;
  level: number;
  stars: number;
  lives: number;
  seconds: number;
  timeString: string;

  setProps: (props: {
    round?: number;
    score?: number;
    level?: number;
    stars?: number;
    lives?: number;
    seconds?: number;
  }) => void;
}

export const useSceneScoreStore = create<SceneScoreStore>((set, get) => ({
  round: 1,
  score: 0,
  exp: 0,
  level: 1,
  stars: 0,
  lives: 3,
  seconds: 0,
  timeString: '00:00',

  setProps: (props: {
    round?: number;
    score?: number;
    exp?: number;
    level?: number;
    stars?: number;
    lives?: number;
    seconds?: number;
  }) => {
    if (props.round != undefined) set({ round: trim(props.round, 1) });
    if (props.score != undefined) set({ score: trim(props.score, 0) });
    if (props.exp != undefined) set({ exp: trim(props.exp, 0) });
    if (props.level != undefined) set({ level: trim(props.level, 1) });
    if (props.lives != undefined) set({ stars: trim(props.lives, 0, 3) });
    if (props.stars != undefined) set({ stars: trim(props.stars, 0, 3) });
    if (props.seconds != undefined) {
      // Ensure seconds is not negative
      const trimmedSeconds = trim(props.seconds, 0);
      set({
        seconds: trimmedSeconds,
        timeString: `${Math.floor(trimmedSeconds / 60)
          .toString()
          .padStart(2, '0')}:${Math.floor(trimmedSeconds % 60)
          .toString()
          .padStart(2, '0')}`,
      });
      console.log(get().timeString, 'timeString');
    }
  },
}));

function trim(
  number: number,
  min: number = Number.MIN_VALUE,
  max: number = Number.MAX_VALUE,
) {
  return number < min ? min : number > max ? max : number;
}
