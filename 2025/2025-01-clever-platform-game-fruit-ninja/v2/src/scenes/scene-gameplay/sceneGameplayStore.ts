import { create } from 'zustand';

interface SceneGameplayStore {
  round: number;
  score: number;
  exp: number;
  level: number;
  stars: number;
  lives: number;
  seconds: number;
  timeString: string;

  // timeScale: number; // 100 is normal speed, 10 is slow motion

  // อัพเดทค่า state หลายๆ ตัวพร้อมกัน
  // เช่น setProps({ score: 100, lives: 3 });
  // หรือ setProps({ seconds: 60, timeString: "01:00" });
  // หรือ setProps({ level: 2 });
  // หรือ setProps({}); // ไม่อัพเดทอะไรเลย
  // หรือ setProps({ round: 2, score: 200, exp: 50, level: 2, stars: 1, lives: 3, seconds: 90 });
  // เป็นต้น
  setProps: (props: {
    round?: number;
    score?: number;
    exp?: number;
    level?: number;
    stars?: number;
    lives?: number;
    seconds?: number;
    timeScale?: number;
  }) => void;
  reset: () => void;
}

export const useSceneGameplayStore = create<SceneGameplayStore>((set) => ({
  round: 1,
  score: 0,
  exp: 0,
  level: 1,
  stars: 0,
  lives: 3,
  seconds: 0,
  timeString: '00:00',

  // timeScale: 100, // 100 is normal speed, 10 is slow motion

  setProps: (props: {
    round?: number;
    score?: number;
    exp?: number;
    level?: number;
    stars?: number;
    lives?: number;
    seconds?: number;
    timeScale?: number;
  }) => {
    if (props.round != undefined) set({ round: trim(props.round, 1) });
    if (props.score != undefined) set({ score: trim(props.score, 0) });
    if (props.level != undefined) set({ level: trim(props.level, 1) });
    if (props.lives != undefined) set({ lives: trim(props.lives, 0, 3) });
    if (props.stars != undefined) set({ stars: trim(props.stars, 0, 3) });
    if (props.seconds != undefined) {
      // console.log('props.seconds', props.seconds);
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
    }
    // if (props.timeScale != undefined) set({ timeScale: trim(props.timeScale, 0, 200) });
  },
  reset: () =>
    set({
      round: 1,
      score: 0,
      lives: 3,
      seconds: 0,
      timeString: '00:00',
    }),
}));

function trim(
  number: number,
  min: number = Number.MIN_VALUE,
  max: number = Number.MAX_VALUE,
) {
  return number < min ? min : number > max ? max : number;
}
