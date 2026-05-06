import { create } from 'zustand';

interface StateValue {
  background: string;
}

interface State extends StateValue {
  set: <K extends keyof StateValue>(key: K, value: StateValue[K]) => void;
}

export const useSceneTemplateStore = create<State>((set) => ({
  background: '',
  set: (key, value) => set({ [key]: value }),
}));
