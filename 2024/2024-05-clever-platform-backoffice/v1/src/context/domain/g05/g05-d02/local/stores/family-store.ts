import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { TFamily, TFamilyMember, TFamilyMemberUpdateTask } from '../types/family';
import RestAPIAnnounceReward from '@domain/g04/g04-d01/local/api/group/annoucement/reward/restapi';
import { EFamilyTaskType } from '../enums/family';

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

  updateMemberTask: TFamilyMemberUpdateTask[];
  addUpdateMemberTask: (task: TFamilyMemberUpdateTask) => void;
  clearUpdateMemberTask: () => void;
};

export const useFamilyStore = create<FamilyStore>()(
  devtools((set, get) => ({
    family: undefined,
    setFamily: (family) => set(() => ({ family: family })),
    removeMember: (memberId) => {
      get().addUpdateMemberTask({ user_id: memberId, task: EFamilyTaskType.DELETE });

      set((state) => {
        if (!state.family || !state.family.members) {
          return state;
        }

        return {
          family: {
            ...(state?.family ?? undefined),
            members: state.family.members.filter((member) => member.user_id !== memberId),
          },
        };
      });
    },
    updateMemberTask: [],
    addUpdateMemberTask: (task) => {
      set((state) => {
        let updatedTask = [...state.updateMemberTask];

        if (task.task === EFamilyTaskType.TRANSFER_OWNER) {
          updatedTask = updatedTask.filter(
            (task) => task.task !== EFamilyTaskType.TRANSFER_OWNER,
          );
        }

        updatedTask.push(task);

        return { updateMemberTask: updatedTask };
      });
    },
    clearUpdateMemberTask: () => set((state) => ({ updateMemberTask: [] })),
  })),
);
