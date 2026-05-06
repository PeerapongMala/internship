import { usePhorpor6BreadcrumInfoStore } from './breadcrum-info';
import { useStudentDetailStore } from './student-detail';

const useStore = {
  breadcrum: usePhorpor6BreadcrumInfoStore,
  studentDetail: useStudentDetailStore,
};

export default useStore;
