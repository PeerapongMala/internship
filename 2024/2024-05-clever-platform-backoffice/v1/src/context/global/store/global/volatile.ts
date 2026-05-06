import { IManageYear } from '@domain/g02/g02-d02/local/type';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create } from 'zustand';

// ============ State (Volatile) ==============
interface StateInterface {
  yearData: IManageYear;
  lessonId: number;
  lessonData: any;
  sublessonData: any;
  phorpor5Tabs: any;
}

// Volatile Store
const volatileStore = create<StateInterface>(() => ({
  yearData: {
    platform_id: 0,
    admin_login_as: null,
    created_at: null,
    created_by: null,
    curriculum_group_id: 0,
    id: 0,
    seed_year_id: 0,
    status: 'enabled',
    updated_at: null,
    updated_by: null,
    seed_year_name: '',
    seed_year_short_name: '',
    subjects: [],
  },
  lessonId: 0,
  lessonData: null,
  sublessonData: null,
  phorpor5Tabs: [],
}));

// ============ Method (Volatile) ==============
interface MethodInterface {
  setYearData: (yearData: IManageYear) => void;
}
interface MethodInterface {
  setLessonId: (lessonId: number) => void;
}
interface MethodInterface {
  setLessonData: (lessonData: any) => void;
}
interface MethodInterface {
  setSublessonData: (sublessonData: any) => void;
}

interface MethodInterface {
  setPhorpor5Tabs: (phorpor5Tabs: any) => void;
}

const volatileMethod: MethodInterface = {
  setYearData: (yearData: IManageYear) => {
    volatileStore.setState({ yearData });
  },
  setLessonId: (lessonId: number) => {
    volatileStore.setState({ lessonId });
  },
  setLessonData: (lessonData: any) => {
    volatileStore.setState({ lessonData });
  },
  setSublessonData: (sublessonData: any) => {
    volatileStore.setState({ sublessonData });
  },
  setPhorpor5Tabs: (phorpor5Tabs: any) => {
    volatileStore.setState({ phorpor5Tabs });
  },
};

// ============ Export ==============
export interface IStoreVolatile {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreGlobalVolatile = HelperZustand.StoreExport<
  IStoreVolatile['StateInterface'],
  IStoreVolatile['MethodInterface']
>(volatileStore, volatileMethod);

export default StoreGlobalVolatile;
