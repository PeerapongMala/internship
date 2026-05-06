import { create } from 'zustand';
import {
  TObserverSchool,
  TReqGetsArpSchoolList,
} from '../api/helper/admin-report-permission';
import { TPagination } from '../types/pagination';
import API from '../api';
import config from '@core/config';

interface ObserverSelectSchoolListStoreState {
  schools: TObserverSchool[];
  pagination: TPagination;

  setSchools: (schools: TObserverSchool[]) => void;
  resetPagination: () => void;
  fetchSchoolData: (
    params?: Omit<TReqGetsArpSchoolList, 'page' | 'limit'>,
  ) => Promise<void>;
  changePage: (newPage: number) => void;
  changeLimit: (newLimit: number) => void;

  selectedSchoolIds: number[];
  setSelectedSchoolIds: (schoolId: number[]) => void;
  selectedFetchAllSchoolSelection: (
    observerId: number,
    params?: TReqGetsArpSchoolList,
  ) => Promise<void>;
  selectedToggleSchoolSelection: (id: number) => void;
  selectedClearSelectedSchools: () => void;
}

const initialPagination: TPagination = {
  page: 1,
  limit: config.pagination.itemsPerPage,
  total_count: 0,
};

export const useObserverSelectSchoolListStore =
  create<ObserverSelectSchoolListStoreState>((set, get) => ({
    schools: [],
    pagination: initialPagination,
    selectedSchoolIds: [],
    filter: {},

    setSchools: (schools) => set({ schools }),

    resetPagination: () => set({ pagination: initialPagination }),

    fetchSchoolData: async (params) => {
      try {
        const { pagination } = get();
        const apiParams = {
          ...params,
          page: pagination.page,
          limit: pagination.limit,
        };

        const response = await API.adminReportPermissionAPI.GetsArpSchoolList(apiParams);

        set({
          schools: response.data,
          pagination: response._pagination,
        });
      } catch (error) {
        console.error('Error fetching school list:', error);
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
      get().fetchSchoolData();
    },

    changeLimit: (newLimit) => {
      set((state) => ({
        pagination: {
          ...state.pagination,
          limit: newLimit,
          page: 1,
        },
      }));
      get().fetchSchoolData();
    },

    selectedFetchAllSchoolSelection: async (observerId, params) => {
      try {
        const { pagination } = get();
        const limit = pagination.limit;
        const allSchoolIds: number[] = [];

        const firstPageResponse =
          await API.adminReportPermissionAPI.GetsArpObserverAccessListSchool(observerId, {
            ...params,
            page: pagination.page,
            limit,
          });

        const total_count = firstPageResponse._pagination.total_count;
        const totalPages = Math.ceil(total_count / limit);

        // Collect IDs from the first page
        const firstPageIds = firstPageResponse.data.map((school) => school.id);
        allSchoolIds.push(...firstPageIds);

        // Fetch remaining pages (if any) using a for loop
        for (let page = 2; page <= totalPages; page++) {
          const apiParams = {
            ...params,
            page,
            limit,
          };

          const response =
            await API.adminReportPermissionAPI.GetsArpSchoolList(apiParams);
          const ids = response.data.map((school) => school.id);
          allSchoolIds.push(...ids);
        }

        // Update the state with all collected school IDs
        set({ selectedSchoolIds: allSchoolIds });
      } catch (error) {
        console.error('Error fetching all schools:', error);
        throw error;
      }
    },

    setSelectedSchoolIds: (schoolId) => {
      set({ selectedSchoolIds: schoolId });
    },

    selectedToggleSchoolSelection: (id) => {
      set((state) => {
        const exists = state.selectedSchoolIds.includes(id);
        return {
          selectedSchoolIds: exists
            ? state.selectedSchoolIds.filter((item) => item !== id)
            : [...state.selectedSchoolIds, id],
        };
      });
    },

    selectedClearSelectedSchools: () => set({ selectedSchoolIds: [] }),
  }));
