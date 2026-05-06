import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TFamily } from '../types/family';
import { set } from 'lodash';

type FamilyEditStore = {
  isEdit: boolean;
  setEdit: (status: boolean) => void;
};

export const useFamilyEditStore = create<FamilyEditStore>()(
  devtools((set) => ({
    isEdit: false,
    setEdit: (status) => set(() => ({ isEdit: status })),
  })),
);

type FamilyStore = {
  family: TFamily | undefined;
  setFamily: (family: TFamily) => void;
  removeMember: (memberId: string) => void;
};

export const useFamilyStore = create<FamilyStore>()(
  devtools((set) => ({
    family: undefined,
    setFamily: (family) => set(() => ({ family: family })),
    removeMember: (memberId) =>
      set((state) => {
        if (!state.family || !state.family.members) {
          return state;
        }

        return {
          family: {
            ...(state?.family ?? undefined),
            members: state.family.members.filter((member) => member.id !== memberId),
          },
        };
      }),
  })),
);
