/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";

interface UseIndexedDBProps {
  storeName: string;
}

export function useIndexedDB({ storeName }: UseIndexedDBProps) {
  const [isReady, setReady] = useState<boolean>(false);
  const [items, setItems] = useState<any[]>([]);

  // database store setting
  const dbName = `db-local`;
  const dbVersion = 1;
  // store settings
  // const storeName = `lessons`;

  useEffect(() => {
    function initDB(): Promise<boolean> {
      return new Promise((resolve) => {
        // open the connection
        const request = indexedDB.open(dbName, dbVersion);

        request.onupgradeneeded = () => {
          const db = request.result;
          // if the data object store doesn't exist, create it
          // we can put options keyPath to use data keys's values from keyPath as keys
          db.createObjectStore(storeName);
        };
        request.onsuccess = () => resolve(true);
        request.onerror = () => resolve(false);
      });
    }

    initDB().then(setReady);
  }, [dbName, storeName]);

  useEffect(() => {
    getAllItem().then((items) => {
      setItems(items);
    });
  }, []);

  function getAllItem() {
    return new Promise<any[]>((resolve, reject) => {
      // open the connection
      const request = indexedDB.open(dbName, dbVersion);

      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const res = store.getAll();

        res.onsuccess = () => {
          resolve(res.result);
        };
        res.onerror = () => {
          reject(request.error?.message ?? "Unknown error");
        };
      };

      request.onerror = () => {
        reject(request.error?.message ?? "Unknown error");
      };
    });
  }

  function getItem(key: string) {
    return new Promise<any>((resolve, reject) => {
      // open the connection
      const request = indexedDB.open(dbName, dbVersion);

      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(storeName, "readonly");
        const store = tx.objectStore(storeName);
        const res = store.get(key);

        res.onsuccess = () => {
          resolve(res.result);
        };
        res.onerror = () => {
          reject(request.error?.message ?? "Unknown error");
        };
      };

      request.onerror = () => {
        reject(request.error?.message ?? "Unknown error");
      };
    });
  }

  function addItem(item: any, key: string) {
    return new Promise<boolean>((resolve, reject) => {
      // open the connection
      const request = indexedDB.open(dbName, dbVersion);

      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);
        console.log(item, key);
        const res = store.add(item, key);

        res.onsuccess = () => {
          mutateItem();
          resolve(true);
        };
        res.onerror = () => {
          resolve(false);
        };
      };

      request.onerror = () => {
        reject(request.error?.message ?? "Unknown error");
      };
    });
  }

  function deleteItem(key: string) {
    return new Promise((resolve, reject) => {
      // open the connection
      const request = indexedDB.open(dbName, dbVersion);

      request.onsuccess = () => {
        const db = request.result;
        const tx = db.transaction(storeName, "readwrite");
        const store = tx.objectStore(storeName);

        const res = store.delete(key);

        res.onsuccess = () => {
          mutateItem();
          resolve(true);
        };
        res.onerror = () => {
          resolve(false);
        };
      };

      request.onerror = () => {
        reject(request.error?.message ?? "Unknown error");
      };
    });
  }

  async function mutateItem() {
    getAllItem().then((items) => {
      setItems(items);
    });
  }

  return { isReady, items, getAllItem, getItem, addItem, deleteItem };
}
