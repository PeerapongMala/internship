// stores/form-store.ts
import { create } from 'zustand';
import { TObserverAccesses } from '../helpers/admin-report-permission';
import { EAdminReportPermissionStatus } from '../enums/admin-permission';
import API from '../api';

interface AdminReportPermissionFormStoreState {
  formData: TObserverAccesses;
  isFetching: boolean;
  updateField: <K extends keyof TObserverAccesses>(
    field: K,
    value: TObserverAccesses[K],
  ) => void;
  reset: () => void;
  fetchAdminReportPermission: (id: number) => Promise<void>;
}

const initialFormState: TObserverAccesses = {
  name: '',
  accessName: '',
  status: EAdminReportPermissionStatus.DRAFT,
};

const useObserverAccessFormStore = create<AdminReportPermissionFormStoreState>((set) => ({
  formData: { ...initialFormState },
  isFetching: false,

  updateField: (field, value) => {
    set((state) => {
      if (field === 'accessName') {
        return {
          formData: {
            ...state.formData,
            [field]: value,
            districtZone: undefined,
            areaOffice: undefined,
            districtGroup: undefined,
            district: undefined,
            schoolAffiliationType: undefined,
            schoolAffiliationId: undefined,
          },
        };
      }

      return {
        formData: {
          ...state.formData,
          [field]: value,
        },
      };
    });
  },

  reset: () => set({ formData: { ...initialFormState } }),

  fetchAdminReportPermission: async (id) => {
    set({ isFetching: true });
    try {
      const data = await API.adminReportPermissionAPI.GetAdminReportPermission(id);

      set({
        formData: {
          id: data.id,
          accessName: data.access_name,
          name: data.name,
          status: data.status,
          areaOffice: data.area_office,
          district: data.district,
          districtGroup: data.district_group,
          districtZone: data.district_zone,
          schoolAffiliationId: data.school_affiliation_id,
          updatedAt: data.updated_at,
          updatedBy: data.updated_by,
        },
      });
    } catch (error) {
      console.error('Failed to fetch permission:', error);
      throw error;
    } finally {
      set({ isFetching: false });
    }
  },
}));

export default useObserverAccessFormStore;
