import { UserData } from '@domain/g02/g02-d01/local/type';
import { CharacterResponse, Pet } from '@domain/g03/g03-d04/local/types';
import { SettingsData } from '@domain/g03/g03-d10/g03-d10-p01-setting/type';
import { NORMAL_PRESET } from '@global/helper/download-config';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create, StoreApi, UseBoundStore } from 'zustand';
import { persist } from 'zustand/middleware';

// ============ State ==============
export interface UserPersistedData extends UserData {
  last_login?: string | null;
}

interface StateInterface {
  accessToken: string | null;
  adminId: string | null;
  adminFullname: string | null;
  userData: UserPersistedData | null;
  userDatas: UserPersistedData[];
  userAvatar?: CharacterResponse | null;
  userPet?: Pet | null;
  settings: SettingsData;
  // local app version e.g. '1.5.0.123-20260204', '1.5.0.123-20260204-beta'; 'none' when first time open
  localAppVersion: `${number}.${number}.${number}.${number}${string}` | 'none';
  visited: boolean; // for check if user already visited the app
  showMemoryInfo: boolean; // For showing memory info component
}

// cant use method
const store = create(
  persist(
    (): StateInterface => ({
      accessToken: null,
      adminId: null,
      adminFullname: null,
      userData: null,
      userDatas: [],
      userAvatar: null,
      userPet: null,
      settings: {
        enableBackgroundMusic: true,
        backgroundMusicVolumn: 50,
        enableSFXMusic: true,
        SFXVolumn: 50,
        enableSoundMusic: true,
        soundVolumn: 50,
        textLanguage: 'th',
        soundLanguage: 'th',
        fontSize: 2,
        enableGameplayModelRenderer: false,
        enableParticle: false,
        downloadConfig: NORMAL_PRESET,
      },
      localAppVersion: 'none',
      visited: false,
      showMemoryInfo: false, // For showing memory info component
    }),
    {
      name: 'storage-user',
      version: 1, // Increment this when adding new fields
      migrate: (persistedState: any, version: number) => {
        // Migration logic for adding downloadConfig to existing users
        if (version === 0) {
          // Old version without downloadConfig - use NORMAL preset as default
          return {
            ...persistedState,
            settings: {
              ...persistedState.settings,
              downloadConfig: NORMAL_PRESET,
            },
          };
        }
        return persistedState;
      },
    },
  ),
);

// ============ Method ==============

interface MethodInterface {
  login: (
    userData: Partial<UserData>,
    accessToken: string,
    adminAccount?: { adminId: string; adminFullname: string },
  ) => void;
  updateAccessToken: (accessToken: string) => void;
  setUserData: (userData: UserPersistedData | null) => void;
  addUserData: (userData: Partial<UserPersistedData>) => void;
  getUserDataByUniqueId: (
    studentId: string,
    schoolCode: string,
  ) => UserPersistedData | undefined;
  updateUserData: (payload: Partial<UserPersistedData>) => void;
  updateCurrentUserData: (payload: Partial<UserPersistedData>) => void;
  updateUserLastLogin: (lastLogin: Date) => void;
  removeUserData: (studentId: string | null) => void;
  setUserAvatar: (avatar: CharacterResponse | null) => void;
  setUserPet: (pet: Pet | null) => void;
  setSettings: (settings: SettingsData) => void;
  getSettings: () => SettingsData;
  updateSettings: (settings: Partial<SettingsData>) => void;
  setLocalAppVersion: (
    localAppVersion: `${number}.${number}.${number}.${number}${string}`,
  ) => void;
  setVisited: (visited: boolean) => void;
  setShowMemoryInfo: (showMemoryInfo: boolean) => void;
  clearAll: () => void;
  clearFields: <T extends keyof StateInterface>(...fields: T[]) => void;
}

const method: MethodInterface = {
  // this method is used to add user data, or update user data if it already exists
  login: (
    userData: Partial<UserData>,
    accessToken: string,
    adminAccount?: { adminId: string; adminFullname: string },
  ) => {
    // set accessToken
    store.setState({ accessToken });

    // set admin id and admin name if present
    if (adminAccount?.adminId && adminAccount?.adminFullname) {
      store.setState({
        adminId: adminAccount.adminId,
        adminFullname: adminAccount.adminFullname,
      });
    }

    // check if user data already exists in the store
    const existingUserData = store.getState().userDatas.find((record) => {
      return (
        record.student_id === userData.student_id &&
        record.school_code === userData.school_code
      );
    });
    // if user data already exists, update it
    if (existingUserData) {
      store.setState((state: StateInterface) => ({
        userDatas: state.userDatas.map((record) => {
          if (
            record.student_id === userData.student_id &&
            record.school_code === userData.school_code
          ) {
            return {
              ...record,
              ...userData,
            };
          }
          return record;
        }),
        userData: {
          ...state.userData,
          ...userData,
        } as UserData,
      }));
    } else {
      // if user data does not exist, add it
      store.setState((state: StateInterface) => ({
        userDatas: [...state.userDatas, userData as UserData],
        userData: {
          ...state.userData,
          ...userData,
        } as UserData,
      }));
    }
  },
  updateAccessToken: (accessToken: string) => {
    store.setState({ accessToken });
  },
  setUserData: (userData: UserData | null) => {
    store.setState({ userData });
  },
  addUserData: (userData: Partial<UserData>) => {
    store.setState((state: StateInterface) => ({
      userDatas: [...state.userDatas, userData as UserData],
      userData: userData as UserData,
    }));
  },
  getUserDataByUniqueId: (studentId: string, schoolCode: string) => {
    return store
      .getState()
      .userDatas.find(
        (userData) =>
          userData.student_id === studentId && userData.school_code === schoolCode,
      );
  },
  updateUserData: (payload: Partial<UserPersistedData>) => {
    store.setState((state: StateInterface) => ({
      userDatas: state.userDatas.map((userData) => {
        if (
          userData.student_id === payload.student_id &&
          userData.school_code === payload.school_code
        ) {
          return {
            ...userData,
            ...payload,
          };
        }
        return userData;
      }),
      userData: {
        ...state.userData,
        ...payload,
      } as UserPersistedData,
    }));
  },
  updateCurrentUserData: (payload: Partial<UserPersistedData>) => {
    // get current user data from store
    const currentUserData = store.getState().userData;
    // extract student_id and school_code from payload to avoid overwriting them
    const { student_id, school_code, ...rest } = payload;
    // update the user data in the store
    method.updateUserData({
      ...currentUserData,
      ...rest,
    });
  },
  updateUserLastLogin: (lastLogin: Date | string) => {
    if (lastLogin instanceof Date) {
      lastLogin = lastLogin.toISOString();
    }
    // update the last_login field in the current user data
    method.updateCurrentUserData({ last_login: lastLogin });
  },
  removeUserData: (studentId: string | null) => {
    store.setState((state: StateInterface) => ({
      userDatas: state.userDatas.filter((userData) => userData.student_id !== studentId),
    }));
  },
  setUserAvatar: (avatar: CharacterResponse | null) => {
    store.setState({ userAvatar: avatar });
  },
  setUserPet: (pet: Pet | null) => {
    store.setState({ userPet: pet });
  },
  setSettings: (settings: SettingsData) => {
    store.setState({ settings });
  },
  getSettings: () => {
    const settings = store.getState().settings;
    // Fallback: Ensure downloadConfig exists (for users with old localStorage)
    if (!settings.downloadConfig) {
      const defaultConfig = {
        sublessonConcurrency: 1,
        sublessonDelay: 200,
        levelDelay: 100,
        questionDelay: 150,
        assetConcurrency: 1,
      };
      // Update store with default config
      method.updateSettings({ downloadConfig: defaultConfig });
      return { ...settings, downloadConfig: defaultConfig };
    }
    return settings;
  },
  updateSettings: (settings: Partial<SettingsData>) => {
    store.setState((state: StateInterface) => ({
      ...state,
      settings: {
        ...state.settings,
        ...settings,
      },
    }));
  },
  setLocalAppVersion: (
    localAppVersion: `${number}.${number}.${number}.${number}${string}`,
  ) => {
    store.setState({ localAppVersion });
  },
  setVisited: (visited: boolean) => {
    store.setState({ visited });
  },
  setShowMemoryInfo: (showMemoryInfo: boolean) => {
    store.setState({ showMemoryInfo });
  },
  clearAll: () => {
    store.setState(store.getInitialState());
  },
  clearFields: (...fields) => {
    const initialState = store.getInitialState();
    const newState = { ...store.getState() };

    fields.forEach((field) => {
      newState[field] = initialState[field];
    });

    store.setState(newState);
  },
};

// ============ Export ==============
export interface IStoreGlobalPersist {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreGlobalPersist: {
  StateGet: (
    stateList: string[],
    shallowIs?: boolean,
  ) => IStoreGlobalPersist['StateInterface'];
  StateSet: (prop: Partial<IStoreGlobalPersist['StateInterface']>) => void;
  StateGetAllWithUnsubscribe: () => IStoreGlobalPersist['StateInterface'];
  MethodGet: () => IStoreGlobalPersist['MethodInterface'];
  StoreGet: () => UseBoundStore<StoreApi<IStoreGlobalPersist['StateInterface']>>;
} = HelperZustand.StoreExport<
  IStoreGlobalPersist['StateInterface'],
  IStoreGlobalPersist['MethodInterface']
>(store, method);

export default StoreGlobalPersist;
