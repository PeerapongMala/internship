import { create } from 'zustand';

export interface skillStore {
  currentSkillLevel: Record<string, number>;
  setSkillLevel: (skill: string, level: number) => void;

  currentFireballLevel: number;
  currentIceballLevel: number;
  currentRpgLevel: number;
  currentMolotovLevel: number;
  currentDroneLevel: number;
  currentLaserLevel: number;
  resetSkill: () => void;

  setLaserLevel: (level: number) => void;
  setRPGLevel: (level: number) => void;
  setFireballLevel: (level: number) => void;
  setIceBallLevel: (level: number) => void;
  setMolotovLevel: (level: number) => void;
  setDroneLevel: (level: number) => void;
}

interface CollectionStore {
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
    exp?: number;
    level?: number;
    stars?: number;
    lives?: number;
    seconds?: number;
  }) => void;
}

export const useCollectionStore = create<CollectionStore>((set) => ({
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
    if (props.level != undefined) set({ level: trim(props.level, 1) });
    if (props.lives != undefined) set({ lives: trim(props.lives, 0, 3) });
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

// import { create } from 'zustand';
// import { skillStore } from '../types/skillType';

// export const useSkillStore = create<skillStore>((set, get) => ({
//   currentSkillLevel: {
//     FIREBALL: 1,
//     ICEBALL: 0,
//     RPG: 0,
//     MOLOTOV: 0,
//     DRONE: 0,
//     LASER: 0,
//   },
//   setSkillLevel: (skill: string, level: number) => {
//     const currentSkill = get().currentSkillLevel;
//     const updatedSkill = { ...currentSkill, [skill]: level };
//     set({ currentSkillLevel: updatedSkill });
//   },

//   currentFireballLevel: 1,
//   currentIceballLevel: 0,
//   currentRpgLevel: 0,
//   currentMolotovLevel: 0,
//   currentDroneLevel: 0,
//   currentLaserLevel: 0,

//   resetSkill: () => {
//     // Reset all skill levels to 0
//     set({
//       currentFireballLevel: 1,
//       currentIceballLevel: 0,
//       currentRpgLevel: 0,
//       currentMolotovLevel: 0,
//       currentDroneLevel: 0,
//       currentLaserLevel: 0,
//     });
//   },

//   setLaserLevel: (level: number) => {
//     set({
//       currentLaserLevel: level,
//     });
//   },
//   setDroneLevel: (level) => {
//     set({
//       currentDroneLevel: level,
//     });
//   },
//   setMolotovLevel: (level) => {
//     set({
//       currentMolotovLevel: level,
//     });
//   },
//   setIceBallLevel: (level) => {
//     set({
//       currentIceballLevel: level,
//     });
//   },
//   setRPGLevel: (level) => {
//     set({
//       currentRpgLevel: level,
//     });
//   },
//   setFireballLevel: (level) => {
//     set({
//       currentFireballLevel: level,
//     });
//   },
// }));
