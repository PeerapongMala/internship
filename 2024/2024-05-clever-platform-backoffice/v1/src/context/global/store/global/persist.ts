import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ICurriculum, IUserData } from '@domain/g00/g00-d00/local/type';
import { ISubject } from '@domain/g02/g02-d02/local/type';

// ============ State ==============
interface StateInterface {
  userData: IUserData | null;
  targetData: IUserData | null;
  accessToken: string | null;
  curriculumData: ICurriculum | null;
  subjectData: ISubject | null;
  isLoginAs: boolean;
  lineProviderToken: string | null;
  academiceYear: string | null;
  academicYearRangeData: TStoreAcademicYearRangeData | null;
  defaultAcademicYearRangeData: TStoreAcademicYearRangeData | null;
  platformId: string | null;
  subjectGroupId: string | null;
  yearId: string | null;
  classData?: TStoreClassData;
  lessonData?: TStoreLessonData[] | null;
  evaluationForm: TEvaluationForm | null;
}

// cant use method
const store = create(
  persist(
    (): StateInterface => ({
      userData: null,
      targetData: null,
      accessToken: null,
      lineProviderToken: null,
      curriculumData: null,
      subjectData: null,
      isLoginAs: false,
      academiceYear: null,
      academicYearRangeData: null,
      defaultAcademicYearRangeData: null,
      platformId: null,
      subjectGroupId: null,
      yearId: null,
      classData: undefined,
      lessonData: null,
      evaluationForm: null,
    }),
    {
      name: 'storage-user',
    },
  ),
);

// ============ Method ==============

interface MethodInterface {
  // ? UserData
  setUserData: (userData: IUserData | null) => void;
  setTargetData: (userData: any) => void;
  updateUserData: (payload: any) => void;
  clearUserData: () => void;

  // ? AccessToken
  setAccessToken: (token: string | null) => void;
  clearAccessToken: () => void;

  // ? CurriculumData
  setCurriculumData: (curriculumData: ICurriculum | null) => void;
  clearCurriculumData: () => void;

  // ? SubjectData
  setSubjectData: (subjectData: ISubject | null) => void;
  clearSubjectData: () => void;

  setPlatformId: (platformId: string | null) => void;
  setSubjectGroupId: (subjectGroupId: string | null) => void;
  setYearId: (yearId: string | null) => void;

  clearAll: () => void;

  setIsLoginAs: (isLoginAs: boolean) => void;

  setTeacherRoles: (teacherRoles: number[]) => void;
  // Line
  setLineProviderToken: (token: string | null) => void; // <--- NEW
  clearLineProviderToken: () => void; // <--- optional

  setAcademiceYear: (selectedAcademiceYear: string | null) => void;
  setAcademicYearRangeData: (
    selectedAcademiceYearRange: TStoreAcademicYearRangeData | null,
  ) => void;
  setDefaultAcademicYearRangeData: (
    selectedDefaultAcademiceYearRange: TStoreAcademicYearRangeData | null,
  ) => void;

  setClassData: (classes?: TStoreClassData) => void;
  setLessonData: (lesson?: TStoreLessonData[] | null) => void;
  setEvaluationForm: (data: TEvaluationForm | null) => void;
}

const method: MethodInterface = {
  setUserData: (userData: any) => {
    store.setState({ userData });
  },
  setTeacherRoles: (teacherRoles: number[]) => {
    const userData = store.getState().userData;
    store.setState({
      userData: { ...(userData as IUserData), teacher_roles: teacherRoles },
    });
  },
  setTargetData: (targetData: any) => {
    store.setState({ targetData });
  },
  updateUserData: (payload: Partial<IUserData>) => {
    store.setState((state: StateInterface) => ({
      userData: state.userData ? { ...state.userData, ...payload } : null,
    }));
  },
  clearUserData: () => {
    store.setState({ userData: null });
  },
  setAccessToken: (token: string | null) => {
    store.setState({ accessToken: token });
  },
  clearAccessToken: () => {
    store.setState({ accessToken: null });
  },
  setCurriculumData: (curriculumData: ICurriculum | null) => {
    store.setState({ curriculumData });
  },
  clearCurriculumData: () => {
    store.setState({ curriculumData: null });
  },
  setLineProviderToken: (token: string | null) => {
    store.setState({ lineProviderToken: token });
  },
  clearLineProviderToken: () => {
    store.setState({ lineProviderToken: null });
  },
  setPlatformId: (platformId: string | null) => {
    store.setState({ platformId });
  },
  setSubjectGroupId: (subjectGroupId: string | null) => {
    store.setState({ subjectGroupId });
  },
  setYearId: (yearId: string | null) => {
    store.setState({ yearId });
  },

  clearAll: () => {
    // store.setState({ userData: null });
    // store.setState({ accessToken: null });
    // store.setState({ curriculumData: null });
    store.setState(store.getInitialState());
  },
  setSubjectData: (subjectData: ISubject | null) => {
    store.setState({ subjectData });
  },
  clearSubjectData: () => {
    store.setState({ subjectData: null });
  },
  setIsLoginAs: (isLoginAs: boolean) => {
    store.setState({ isLoginAs });
  },
  setAcademiceYear: (academiceYear: string | null) => {
    store.setState({ academiceYear });
  },
  setAcademicYearRangeData: (academicYearRange: TStoreAcademicYearRangeData | null) => {
    store.setState({ academicYearRangeData: academicYearRange });
  },
  setDefaultAcademicYearRangeData: (
    defaultAcademicYearRange: TStoreAcademicYearRangeData | null,
  ) => {
    store.setState({ defaultAcademicYearRangeData: defaultAcademicYearRange });
  },
  setClassData: (classes?: TStoreClassData) => {
    store.setState({ classData: classes });
  },
  setLessonData: (lesson?: TStoreLessonData[] | null) => {
    store.setState({ lessonData: lesson });
  },
  setEvaluationForm: (data: TEvaluationForm | null) => {
    store.setState({ evaluationForm: data });
  },
};

// ============ Export ==============
export interface IStoreGlobalPersist {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreGlobalPersist = HelperZustand.StoreExport<
  IStoreGlobalPersist['StateInterface'],
  IStoreGlobalPersist['MethodInterface']
>(store, method);

export default StoreGlobalPersist;
