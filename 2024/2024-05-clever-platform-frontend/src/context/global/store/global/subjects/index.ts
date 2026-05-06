import { SubjectListItem } from '@domain/g02/g02-d02/local/type';
import { createKeyValStorage } from '@store/storage';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create, StoreApi, UseBoundStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ============ State ==============
interface StateInterface {
  currentSubject?: SubjectListItem;
  subjects: SubjectListItem[];
  isReady: boolean;
}

// ============ State ==============
const storeName = 'subjects';
const store = create(
  persist(
    (): StateInterface => ({
      isReady: false,
      currentSubject: undefined,
      subjects: [],
    }),
    {
      name: storeName,
      storage: createJSONStorage(() => createKeyValStorage()),
      partialize: (state) => {
        const { isReady, ...partial } = state;
        return partial;
      },
      onRehydrateStorage: () => {
        return (state, err) => {
          if (err) console.error('~ on rehydrate error', err);
          else {
            store.setState({ ...state, isReady: true });
          }
        };
      },
    },
  ),
);

// ============ Method ==============
interface MethodInterface {
  subjectSelect: (subject: SubjectListItem) => void;
  listSubjectSet: (subjects: SubjectListItem[]) => void;
  clearAll: () => void;
}

const method: MethodInterface = {
  subjectSelect: (subject: SubjectListItem) => {
    store.setState({ currentSubject: subject });
  },
  listSubjectSet: (subjects: SubjectListItem[]) => {
    store.setState((state) => {
      return { ...state, subjects };
    });
  },
  clearAll: () => {
    store.setState(store.getInitialState());
  },
};

// ============ Export ==============
export interface IStoreSubjects {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreSubjects: {
  StateGet: <K extends keyof IStoreSubjects['StateInterface']>(
    stateList: K[],
    shallowIs?: boolean,
  ) => Pick<IStoreSubjects['StateInterface'], K>;
  StateSet: (prop: Partial<IStoreSubjects['StateInterface']>) => void;
  StateGetAllWithUnsubscribe: () => IStoreSubjects['StateInterface'];
  MethodGet: () => IStoreSubjects['MethodInterface'];
  StoreGet: () => UseBoundStore<StoreApi<IStoreSubjects['StateInterface']>>;
} = HelperZustand.StoreExport<
  IStoreSubjects['StateInterface'],
  IStoreSubjects['MethodInterface']
>(store, method);

export default StoreSubjects;
