import useObserverAccessFormStore from './observer-access-form';
import { useObserverAccessSchoolStore } from './observer-access-school';
import { useObserverSelectSchoolListStore } from './observer-school-list';
import {
  useLaoSchoolAffiliationStore,
  useSchoolAffiliationStore,
} from './school-affiliation';

const useStore = {
  observerAccessForm: useObserverAccessFormStore,
  observerAccessSchool: useObserverAccessSchoolStore,
  observerAccessSchoolList: useObserverSelectSchoolListStore,
  schoolAffiliation: useSchoolAffiliationStore,
  schoolLaoAffiliation: useLaoSchoolAffiliationStore,
};

export default useStore;
