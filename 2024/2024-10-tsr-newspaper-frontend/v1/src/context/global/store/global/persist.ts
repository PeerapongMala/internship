import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// ============ State ==============
interface StateInterface {
  userData: any;
  accessToken : string | null;
  role : string | null;
}

// cant use method
const store = create(
  persist(
    (): StateInterface => ({
      userData: null,
      accessToken: null,
      role: null,
    }),
    {
      name: 'storage-user',
    },
  ),
);

// ============ Method ==============



interface MethodeInterface {
  setUserData: (userData: any) => void;
  updateUserData: (payload: any) => void;
  AccessTokenSet: (accessToken: string) => void;
  RoleSet:(role: string) =>void;
}

const method: MethodeInterface = {
  setUserData: (userData: any) => {
    store.setState({ userData });
  },
  updateUserData: (payload: any) => {
    store.setState((state: StateInterface) => ({
      userData: {
        ...state.userData,
        payload,
      },
    }));
  },
  AccessTokenSet: (accessToken: string) => {
    store.setState({ accessToken });
  },
  RoleSet: (role: string) => {
    store.setState({ role });
    },
};

// ============ Export ==============
export interface IStoreGlobalPersist {
  StateInterface: StateInterface;
  MethodeInterface: MethodeInterface;
}

const StoreGlobalPersist = HelperZustand.StoreExport<
  IStoreGlobalPersist['StateInterface'],
  IStoreGlobalPersist['MethodeInterface']
>(store, method);

export default StoreGlobalPersist;
