import { create } from 'zustand';
import {
  ELaoType,
  TLaoSchoolAffiliations,
  transformLaoSchoolAffiliation,
  transformSchoolAffiliation,
  TSchoolAffiliations,
} from '../api/helper/school_affiliation';
import API from '../api';
import { AffiliationGroupType } from '@domain/g01/g01-d02/local/type';

interface SchoolAffiliationStoreState {
  pri: TSchoolAffiliations[];
  gov: TSchoolAffiliations[];
  isFetching: boolean;
  fetchData: () => void;
  hasData: () => boolean;
  reset: () => void;

  schoolAffiliationList: TSchoolAffiliations[];
  schoolAffiliationGroups: string[];
  fetchAllSchoolAffiliation: () => Promise<void>;
}

export const useSchoolAffiliationStore = create<SchoolAffiliationStoreState>(
  (set, get) => ({
    pri: [],
    gov: [],
    isFetching: false,

    fetchData: async () => {
      try {
        set(() => ({ isFetching: true }));
        const govJob = API.schoolAffiliationAPI.GetAllSchoolAffiliations({
          status: 'enabled',
          type: 'รัฐ',
        });
        const priJob = API.schoolAffiliationAPI.GetAllSchoolAffiliations({
          status: 'enabled',
          type: 'เอกชน',
        });

        const [govRes, priRes] = await Promise.all([govJob, priJob]);

        set(() => ({
          gov: govRes
            .map((res) => res.data.map((data) => transformSchoolAffiliation(data)))
            .flat()
            .sort((a, b) => a.name.localeCompare(b.name)),
          pri: priRes
            .map((res) => res.data.map((resData) => transformSchoolAffiliation(resData)))
            .flat()
            .sort((a, b) => a.name.localeCompare(b.name)),
        }));
      } catch (error) {
        console.error('Error fetching school affiliations:', error);
      }

      set(() => ({ isFetching: false }));
    },

    hasData: () => {
      const state = get();
      return state.pri.length > 0 || state.gov.length > 0;
    },

    reset: () =>
      set(() => ({
        pri: [],
        gov: [],
      })),

    schoolAffiliationList: [],
    schoolAffiliationGroups: [],
    fetchAllSchoolAffiliation: async () => {
      const data = await API.schoolAffiliationAPI.GetAllSchoolAffiliations({
        status: 'enabled',
      });

      const result = data
        .map((res) => res.data.map((resData) => transformSchoolAffiliation(resData)))
        .flat()
        .sort((a, b) => a.name.localeCompare(b.name));

      // const uniqueGroups = [
      //   ...new Set(result.map((item) => item.school_affiliation_group)),
      // ];
      const type: AffiliationGroupType[] = [
        AffiliationGroupType.OBEC,
        AffiliationGroupType.DOE,
        AffiliationGroupType.OPEC,
        AffiliationGroupType.LAO,
        AffiliationGroupType.OTHER,
      ];

      set({
        schoolAffiliationList: result,
        schoolAffiliationGroups: type,
      });
    },
  }),
);

interface LaoSchoolAffiliationStoreState {
  laoData: Record<ELaoType, TLaoSchoolAffiliations[]>;
  isFetching: boolean;
  fetchData: () => void;
  hasData: () => boolean;
  reset: () => void;
}

export const useLaoSchoolAffiliationStore = create<LaoSchoolAffiliationStoreState>(
  (set, get) => ({
    laoData: {
      [ELaoType.PAO]: [],
      [ELaoType.SAO]: [],
      [ELaoType.CityMunicipality]: [],
      [ELaoType.SubdistrictMunicipality]: [],
      [ELaoType.DistrictMunicipality]: [],
    },
    isFetching: false,

    fetchData: async () => {
      try {
        set(() => ({ isFetching: true }));

        // Create fetch promises for all LAO types
        const fetchPromises = Object.values(ELaoType).map((laoType) =>
          API.schoolAffiliationAPI.GetAllLaoSchoolAffiliations({
            lao_type: laoType,
            status: 'enabled',
          }),
        );

        const results = await Promise.all(fetchPromises);

        // Transform and sort data for each LAO type
        const newData = Object.values(ELaoType).reduce(
          (acc, laoType, index) => {
            acc[laoType] = results[index]
              .flatMap((res) => res.data.map(transformLaoSchoolAffiliation))
              .sort((a, b) => a.name.localeCompare(b.name));
            return acc;
          },
          {} as Record<ELaoType, TLaoSchoolAffiliations[]>,
        );

        set(() => ({ laoData: newData }));
      } catch (error) {
        console.error('Error fetching LAO school affiliations:', error);
      }

      set(() => ({ isFetching: false }));
    },

    hasData: () => {
      const state = get();
      return Object.values(state.laoData).some((arr) => arr.length > 0);
    },

    reset: () =>
      set(() => ({
        laoData: {
          [ELaoType.PAO]: [],
          [ELaoType.SAO]: [],
          [ELaoType.CityMunicipality]: [],
          [ELaoType.SubdistrictMunicipality]: [],
          [ELaoType.DistrictMunicipality]: [],
        },
      })),
  }),
);
