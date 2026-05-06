import { create } from 'zustand';
import {
  TObServerAccessSchool,
  TReqGetsArpObserverAccessListSchool,
} from '../api/helper/admin-report-permission';
import { TPagination } from '../types/pagination';
import API from '../api';
import config from '@core/config';

interface ObserverAccessStoreState {
  schools: TObServerAccessSchool[];
  pagination: TPagination;
  setSchools: (schools: TObServerAccessSchool[]) => void;
  resetPagination: () => void;
  fetchData: (id: number, params?: TReqGetsArpObserverAccessListSchool) => Promise<void>;
  changePage: (newPage: number) => void;
  changeLimit: (newLimit: number) => void;
}

const initialPagination: TPagination = {
  page: 1,
  limit: config.pagination.itemsPerPage,
  total_count: 0,
};

export const useObserverAccessSchoolStore = create<ObserverAccessStoreState>(
  (set, get) => ({
    schools: [],
    pagination: initialPagination,

    setSchools: (schools) => set({ schools }),

    resetPagination: () => set({ pagination: initialPagination }),

    fetchData: async (id: number, params) => {
      try {
        const { pagination } = get();
        const apiParams = {
          ...params,
          page: pagination.page,
          limit: pagination.limit,
        };

        const response =
          await API.adminReportPermissionAPI.GetsArpObserverAccessListSchool(
            id,
            apiParams,
          );

        set({
          schools: response.data,
          pagination: response._pagination,
        });
      } catch (error) {
        console.error('Error fetching school data:', error);
        throw error;
      }
    },

    changePage: (newPage) => {
      set((state) => ({
        pagination: {
          ...state.pagination,
          page: newPage,
        },
      }));
    },

    changeLimit: (newLimit) => {
      set((state) => ({
        pagination: {
          ...state.pagination,
          limit: newLimit,
        },
      }));
    },
  }),
);
