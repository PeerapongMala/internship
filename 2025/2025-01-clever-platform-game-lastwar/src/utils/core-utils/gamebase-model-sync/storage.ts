import { IDBPDatabase, openDB } from 'idb';
import { createStore, del, get, set } from 'idb-keyval';
import secureLocalStorage from 'react-secure-storage';
import { StateStorage } from 'zustand/middleware';

interface ICreateKeyValStorageOptions {
  dbName?: string;
}

// =========== Storage =============

// a simple storage for key-value pair
export function createKeyValStorage(options?: ICreateKeyValStorageOptions): StateStorage {
  const store = createStore(options?.dbName || 'clever-db', 'keyval-store');
  return {
    getItem: async (name: string): Promise<string | null> => {
      return (await get(name, store)) || null;
    },
    setItem: async (name: string, value: string): Promise<void> => {
      await set(name, value, store);
    },
    removeItem: async (name: string): Promise<void> => {
      await del(name, store);
    },
  };
}

// a IndexedDB storage for custom store
export const createIndexedDBStorage = async <T>(option: {
  dbName?: string;
  storeName?: string;
  version?: number;
  onUpgrade?: (db: IDBPDatabase) => void;
}): Promise<{
  getItem: (name: IDBValidKey) => Promise<T | null>;
  setItem: (value: any, name?: IDBValidKey) => Promise<void>;
  removeItem: (name: IDBValidKey) => Promise<void>;
  getDB: () => IDBPDatabase;
}> => {
  const dbName = option?.dbName || 'clever-db';
  const storeName = option?.storeName || 'clever-store';
  const dbVersion = option?.version || 1;
  const db = await openDB(dbName, dbVersion, {
    upgrade: (db) => {
      if (option.onUpgrade) option.onUpgrade(db);
    },
  });
  return {
    getItem: async (name: IDBValidKey) => {
      return ((await db.get(storeName, name)) as T) ?? null;
    },
    setItem: async (value: T, name?: IDBValidKey) => {
      await db.put(storeName, value, name);
    },
    removeItem: async (name: IDBValidKey) => {
      await db.delete(storeName, name);
    },
    getDB: () => db,
  };
};

// =========== Secure Storage =============
export const SecureStorage = {
  getItem: (name: string): any | null => {
    return secureLocalStorage.getItem(name) as any | null;
  },
  setItem: (name: string, value: any): void => {
    secureLocalStorage.setItem(name, value);
  },
  removeItem: (name: string): void => {
    secureLocalStorage.removeItem(name);
  },
};

export const defaultStorage = createKeyValStorage();
