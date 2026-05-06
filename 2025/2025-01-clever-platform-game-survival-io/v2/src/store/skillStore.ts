import { create } from 'zustand';
import {
  setAvailableCardLevel,
  getAvailableCardLevel,
  resetAvailableCardLevels,
} from '@/scenes/scene-gameplay/components/gameplay/components/skillPanel/upgrade-cards/available-card';
import { SkillName } from '@/types/skillType';

// Re-export SkillName for backward compatibility
export { SkillName };

export interface skillStore {
  // A version bump to trigger subscribers when skill levels (stored in AvailableCardInfo) change
  skillVersion: number;
  setSkillLevel: (skill: SkillName, level: number) => void;
  resetSkill: () => void;
  getSkillLevel: (skill: SkillName) => number;
  // For backward compatibility - returns all current skill levels from AvailableCardInfo
  currentSkillLevel: Record<SkillName, number>;
}

// Helper to get all current skill levels from AvailableCardInfo
const getAllSkillLevels = (): Record<SkillName, number> => ({
  FIREBALL: getAvailableCardLevel(SkillName.FIREBALL),
  ICEBALL: getAvailableCardLevel(SkillName.ICEBALL),
  RPG: getAvailableCardLevel(SkillName.RPG),
  MOLOTOV: getAvailableCardLevel(SkillName.MOLOTOV),
  DRONE: getAvailableCardLevel(SkillName.DRONE),
  LASER: getAvailableCardLevel(SkillName.LASER),
});

export const useSkillStore = create<skillStore>((set) => ({
  skillVersion: 0,
  currentSkillLevel: getAllSkillLevels(),
  setSkillLevel: (skill: SkillName, level: number) => {
    setAvailableCardLevel(skill, level);
    set((state) => ({
      skillVersion: state.skillVersion + 1,
      currentSkillLevel: getAllSkillLevels(),
    }));
  },
  resetSkill: () => {
    resetAvailableCardLevels();
    // Override initial design: FIREBALL starts at level 1
    setAvailableCardLevel(SkillName.FIREBALL, 1);
    set((state) => ({
      skillVersion: state.skillVersion + 1,
      currentSkillLevel: getAllSkillLevels(),
    }));
  },
  getSkillLevel: (skill: SkillName) => getAvailableCardLevel(skill),
}));

// import { create } from 'zustand';
// import { setAvailableCardLevel, getAvailableCardLevel, resetAvailableCardLevels } from '@/scenes/scene-gameplay/components/gameplay/components/skillPanel/upgrade-cards/available-card';

// export enum SkillName {
//   ICEBALL = 'ICEBALL',
//   RPG = 'RPG',
//   FIREBALL = 'FIREBALL',
//   DRONE = 'DRONE',
//   MOLOTOV = 'MOLOTOV',
//   LASER = 'LASER',
// }

// export interface skillStore {
//   // A version bump to trigger subscribers when skill levels (stored in AvailableCardInfo) change
//   skillVersion: number;
//   setSkillLevel: (skill: SkillName, level: number) => void;
//   resetSkill: () => void;
//   getSkillLevel: (skill: SkillName) => number;
// }

// export const useSkillStore = create<skillStore>((set) => ({
//   skillVersion: 0,
//   setSkillLevel: (skill: SkillName, level: number) => {
//     setAvailableCardLevel(skill, level);
//     set((state) => ({ skillVersion: state.skillVersion + 1 }));
//   },
//   resetSkill: () => {
//     resetAvailableCardLevels();
//     // Override initial design: FIREBALL starts at level 1
//     setAvailableCardLevel(SkillName.FIREBALL, 1);
//     set((state) => ({ skillVersion: state.skillVersion + 1 }));
//   },
//   getSkillLevel: (skill: SkillName) => getAvailableCardLevel(skill),
// }));
