import { create } from 'zustand';

interface LoadingApiStateValue {
  apiLoadingList: string[];
}

interface LoadingApiState extends LoadingApiStateValue {
  set: <K extends keyof LoadingApiStateValue>(
    key: K,
    value: LoadingApiStateValue[K],
  ) => void;
  addLoading: (id: string) => void;
  removeLoading: (id: string) => void;
  resetLoading: () => void;
}

export const useLoadingApiStore = create<LoadingApiState>((set) => ({
  set: (key, value) => set({ [key]: value }),

  apiLoadingList: [],
  // Add an API key to the list if not already there
  addLoading: (id) =>
    set((state) =>
      state.apiLoadingList.includes(id)
        ? state
        : { apiLoadingList: [...state.apiLoadingList, id] },
    ),
  removeLoading: (id) =>
    set((state) => ({
      apiLoadingList: state.apiLoadingList.filter((item) => item !== id),
    })),
  resetLoading: () => set({ apiLoadingList: [] }),
}));
