import dayjs from 'dayjs';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const defaultStartDate = dayjs().subtract(1, 'month').startOf('month').toISOString();
const defaultEndDate = dayjs().subtract(1, 'month').endOf('month').toISOString();

interface DateRangeStore {
  startDate: string | null;
  endDate: string | null;
  setStartDate: (date: string | null) => void;
  setEndDate: (date: string | null) => void;
  resetDates: () => void;
}

export const useDateRangeStore = create<DateRangeStore>()(
  persist(
    (set) => ({
      startDate: defaultStartDate,
      endDate: defaultEndDate,
      setStartDate: (date) => set({ startDate: date }),
      setEndDate: (date) => set({ endDate: date }),
      resetDates: () => set({ startDate: null, endDate: null }),
    }),
    {
      name: 'date-range-storage', // unique name for localStorage
      partialize: (state) => ({
        startDate: state.startDate,
        endDate: state.endDate,
      }),
    },
  ),
);

interface SchoolStatDateRangeStore {
  startDate?: string;
  endDate?: string;
  setStartDate: (date?: string) => void;
  setEndDate: (date?: string) => void;
}

export const useSchoolStatDateRangeStore = create<SchoolStatDateRangeStore>((set) => ({
  startDate: undefined,
  endDate: undefined,
  setStartDate: (date) => set({ startDate: date }),
  setEndDate: (date) => set({ endDate: date }),
}));
