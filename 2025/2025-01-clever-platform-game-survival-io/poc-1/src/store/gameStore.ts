import { create } from "zustand";
import { gameStore } from "../types/gameType";

export const useGameStore = create<gameStore>((set, get) => ({
    currentExp: 0,
    currentLevel: 1,
    isGamePaused: false,
    gameCurrentWave: 0,
    gameCurrentTimeCount: 0,
    gameCurrentTimeMax: 0,
    isSkillLearnable: false,
    gameCurrentWaveSet: (i: number) => set({ gameCurrentWave: i }),
    gameCurrentTimeCountSet: (i: number) => set({ gameCurrentTimeCount: i }),
    gameCurrentTimeMaxSet: (i: number) => set({ gameCurrentTimeMax: i }),
    setExp: (exp: number) => {
        set({ currentExp: get().currentExp + exp });
        if (get().currentExp >= get().currentLevel * 50) {
            console.log("Level Up")
            set({ currentExp: 0, currentLevel: get().currentLevel + 1 });

            console.log("Setting game pause")
            set({isGamePaused: true, isSkillLearnable: true})
        }
    },
    pauseGame: () => {
        set({ isGamePaused: true });
    },

    resumeGame: () => {
        set({ isGamePaused: false });
    },
    closeSkillPanel: () => { 
        
        set({ isSkillLearnable: false ,isGamePaused: false});  // Close skill panel when game resumes
    }
}));
