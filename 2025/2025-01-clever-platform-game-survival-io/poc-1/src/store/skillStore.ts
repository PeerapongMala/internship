import { create } from "zustand";
import { skillStore } from "../types/skillType";

export const useSkillStore = create<skillStore>((set, get) => ({
    currentFireballLevel: 1,
    currentIceBallLevel: 0,
    currentRPGLevel: 0,
    currentMolotovLevel: 0,
    currentDroneLevel: 0,
    currentLaserLevel: 0,

   resetSkill: () => {
     // Reset all skill levels to 0
     set({
        currentFireballLevel: 1,
        currentIceBallLevel: 0,
        currentRPGLevel: 0,
        currentMolotovLevel: 0,
        currentDroneLevel: 0,
        currentLaserLevel: 0,
     })
   },

  setLaserLevel: (level: number) => {
    set({
      currentLaserLevel: level,
     })
  },
   setDroneLevel: (level) => {
    set({
      currentDroneLevel: level,
     })
   },
   setMolotovLevel: (level) => {
       set({
        currentMolotovLevel: level,
       })
   },
   setIceBallLevel: (level) => {
     set({
        currentIceBallLevel: level,
       })
   },
   setRPGLevel: (level) => {
    set({
       currentRPGLevel: level,
      })
  },
  setFireballLevel: (level) => {
    set({
       currentFireballLevel: level,
      })
  },
}));
