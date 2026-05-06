import { createIndexedDBStorage } from './storage';

// ========== Configuration ==========
const DB_NAME = 'clever-db-model-files'; // Your new DB name
const STORE_NAME = 'model-files'; // A specific store for models
const DB_VERSION = 1;

// ========== Interface ==========
// Defines the structure of data in the 'model-files' store
interface IModelRecordSchema {
  modelKey: string; // The unique string key you want (e.g., "set1_character1_level5")
  originalUrl?: Blob | string; // Optional: Store the URL it came from
  value: Blob; // The FBX file content as a Blob
  addedTimestamp: number; // Optional: Track when it was added
  model_version_id: string;
}
interface ModelData {
  model_id: string;
  model_version_id: string;
  url: string;
  size?: number;
  [key: string]: any;
}
// ========== Storage ==========
// Lazy initialize the IndexedDB storage helper without top-level await
type StorageHelper = Awaited<
  ReturnType<typeof createIndexedDBStorage<IModelRecordSchema>>
>;
let storageInstancePromise: Promise<StorageHelper> | null = null;
const getStorage = (): Promise<StorageHelper> => {
  if (!storageInstancePromise) {
    storageInstancePromise = createIndexedDBStorage<IModelRecordSchema>({
      dbName: DB_NAME,
      storeName: STORE_NAME,
      version: DB_VERSION,
      onUpgrade: (db) => {
        // Check if the store already exists before creating (good practice in onUpgrade)
        if (!db.objectStoreNames.contains(STORE_NAME)) {
          // const store = db.createObjectStore(STORE_NAME, {
          //   keyPath: 'modelKey', // Use 'modelKey' as the primary key
          // });
          // Optional: Add an index if you need to query by originalUrl later
          // store.createIndex('originalUrl', 'originalUrl', { unique: false });
          console.log(
            `IndexedDB store "${STORE_NAME}" created/upgraded in DB "${DB_NAME}".`,
          );
        }
      },
    });
  }
  return storageInstancePromise;
};

// ========== Method ==========
interface MethodInterface {
  getAll: () => Promise<IModelRecordSchema[]>;
  /** Adds a model Blob fetched from a URL, associated with a modelKey. */
  addItem: (
    modelKey: string,
    url: Blob | string,
    model_version_id?: string,
    blob?: Blob,
  ) => Promise<void>;
  /** Retrieves a model Blob using its unique modelKey. */
  getItem: (modelKey: string) => Promise<Blob | null>;
  /** Checks if a model exists for the given modelKey. */
  existItem: (modelKey: string) => Promise<boolean>;
  /** Removes a model from storage using its modelKey. */
  removeItem: (modelKey: string) => Promise<void>;
  /** Calculates the size of a specific stored model. */
  getSize: (modelKey: string) => Promise<number>;
  /** Calculates the total size of all stored models. */
  getTotalSize: () => Promise<number>;
  /** Gets all stored model keys */
  getAllKeys: () => Promise<string[]>;

  getVersion: (modelKey: string) => Promise<string | null>;

  checkModelsVersion: (models: ModelData[]) => Promise<{
    hasAllModels: boolean;
    needsUpdate: boolean;
    missingModels: ModelData[];
    outdatedModels: ModelData[];
  }>;

  clearAll: () => Promise<void>;

  /**
   * ล้างเฉพาะโมเดลที่เวอร์ชั่นไม่ตรงกับ API
   * @param currentModels รายการโมเดลปัจจุบันจาก API
   */
  clearOutdatedModels: (currentModels: ModelData[]) => Promise<{
    deletedCount: number;
    freedSpace: number;
  }>;

  /**
   * ล้างเฉพาะโมเดลที่ไม่มีใน API
   * @param currentModels รายการโมเดลปัจจุบันจาก API
   */
  clearOrphanedModels: (currentModels: ModelData[]) => Promise<{
    deletedCount: number;
    freedSpace: number;
  }>;
}

const method: MethodInterface = {
  getAll: async (): Promise<IModelRecordSchema[]> => {
    const storage = await getStorage();
    try {
      const db = await storage.getDB();
      const allRecords = await db.getAll(STORE_NAME);
      return allRecords as IModelRecordSchema[];
    } catch (error) {
      console.error('Error getting all records:', error);
      return [];
    }
  },
  addItem: async (modelKey: string, url: string | Blob, model_version_id?: string) => {
    const storage = await getStorage();

    console.log(`Attempting to fetch model from URL: ${url}`);
    try {
      let blob: Blob;
      // let originalUrlBlob: Blob | undefined;

      if (typeof url === 'string') {
        console.log(`Attempting to fetch model from URL: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch model. Status: ${response.status} ${response.statusText}`,
          );
        }

        const arrayBuffer = await response.arrayBuffer();
        blob = new Blob([arrayBuffer], {
          type: response.headers.get('content-type') || 'application/octet-stream',
        });

        // originalUrlBlob = new Blob([url], { type: 'text/plain' });
      } else {
        blob = url;
      }

      if (blob.size === 0 || blob.type.includes('text/html')) {
        throw new Error('Fetched content is not valid');
      }

      const record: IModelRecordSchema = {
        modelKey,
        model_version_id: model_version_id || '',
        originalUrl: url,
        value: blob,
        addedTimestamp: Date.now(),
      };

      await storage.setItem(record);
      console.log(`Model with key "${modelKey}" added to IndexedDB.`);
    } catch (error) {
      console.error(`Error adding item with key "${modelKey}":`, error);
      throw error;
    }
  },

  getItem: async (modelKey: string): Promise<Blob | null> => {
    const storage = await getStorage();
    const data = await storage.getItem(modelKey); // getItem using the primary key
    return data?.value ?? null; // Return the Blob or null
  },

  existItem: async (modelKey: string): Promise<boolean> => {
    // More efficient: Use getDB and count or getKeys if available in helper
    // For simplicity using getItem here:
    const item = await method.getItem(modelKey);
    return item !== null;
  },

  removeItem: async (modelKey: string): Promise<void> => {
    const storage = await getStorage();
    await storage.removeItem(modelKey); // removeItem using the primary key
    console.log(`Model with key "${modelKey}" removed from IndexedDB.`);
  },

  getSize: async (modelKey: string): Promise<number> => {
    const blob = await method.getItem(modelKey);
    return blob?.size ?? 0;
  },

  getTotalSize: async (): Promise<number> => {
    const storage = await getStorage();
    // Assumes storage helper has a method like getAll() or similar
    // Or get the raw DB instance to iterate
    try {
      const db = await storage.getDB(); // Assumes getDB() exists
      const allRecords = await db.getAll(STORE_NAME);
      return allRecords.reduce(
        (sum: number, record: IModelRecordSchema) => sum + (record.value?.size ?? 0),
        0,
      );
    } catch (error) {
      console.error('Error calculating total size:', error);
      return 0;
    }
  },

  getAllKeys: async (): Promise<string[]> => {
    const storage = await getStorage();
    try {
      const db = await storage.getDB(); // Assumes getDB() exists
      const keys = await db.getAllKeys(STORE_NAME);
      // IDBValidKey[] needs casting if you are sure they are strings
      return keys as string[];
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  },

  getVersion: async (modelKey: string): Promise<string | null> => {
    const storage = await getStorage();
    const data = await storage.getItem(modelKey);
    return data?.model_version_id || null;
  },
  checkModelsVersion: async (
    models: ModelData[],
  ): Promise<{
    hasAllModels: boolean;
    needsUpdate: boolean;
    missingModels: ModelData[];
    outdatedModels: ModelData[];
  }> => {
    const missingModels: ModelData[] = [];
    const outdatedModels: ModelData[] = [];

    for (const model of models) {
      try {
        const cachedVersion = await method.getVersion(model.model_id);

        if (!cachedVersion) {
          missingModels.push(model);
        } else if (cachedVersion !== model.model_version_id) {
          outdatedModels.push(model);
        }
      } catch (error) {
        console.error(`Error checking model ${model.model_id}:`, error);
        missingModels.push(model);
      }
    }

    return {
      hasAllModels: missingModels.length === 0 && outdatedModels.length === 0,
      needsUpdate: missingModels.length > 0 || outdatedModels.length > 0,
      missingModels,
      outdatedModels,
    };
  },
  clearAll: async (): Promise<void> => {
    const storage = await getStorage();
    try {
      const db = await storage.getDB();
      await db.clear(STORE_NAME);
      console.log('Cleared ALL models from storage');
    } catch (error) {
      console.error('Failed to clear all models:', error);
      throw error;
    }
  },

  // ล้างเฉพาะเวอร์ชั่นไม่ตรง
  clearOutdatedModels: async (
    currentModels: ModelData[],
  ): Promise<{ deletedCount: number; freedSpace: number }> => {
    const storage = await getStorage();
    try {
      const db = await storage.getDB();
      const allRecords = await db.getAll(STORE_NAME);
      const currentModelMap = new Map(
        currentModels.map((m) => [m.model_id, m.model_version_id]),
      );

      let deletedCount = 0;
      let freedSpace = 0;

      for (const record of allRecords) {
        // ลบเฉพาะโมเดลที่ยังมีอยู่ใน API แต่เวอร์ชั่นไม่ตรง
        if (
          currentModelMap.has(record.modelKey) &&
          currentModelMap.get(record.modelKey) !== record.model_version_id
        ) {
          await storage.removeItem(record.modelKey);
          freedSpace += record.value?.size || 0;
          deletedCount++;
        }
      }

      return { deletedCount, freedSpace };
    } catch (error) {
      console.error('Failed to clear outdated models:', error);
      throw error;
    }
  },

  clearOrphanedModels: async (
    currentModels: ModelData[],
  ): Promise<{ deletedCount: number; freedSpace: number }> => {
    const storage = await getStorage();
    try {
      const db = await storage.getDB();
      const allRecords = await db.getAll(STORE_NAME);
      const currentModelIds = new Set(currentModels.map((m) => m.model_id));

      let deletedCount = 0;
      let freedSpace = 0;

      for (const record of allRecords) {
        if (!currentModelIds.has(record.modelKey)) {
          await storage.removeItem(record.modelKey);
          freedSpace += record.value?.size || 0;
          deletedCount++;
        }
      }

      console.log(`Cleared ${deletedCount} orphaned models, freed ${freedSpace} bytes`);
      return { deletedCount, freedSpace };
    } catch (error) {
      console.error('Failed to clear orphaned models:', error);
      throw error;
    }
  },
};

// ========== Export ==========
// Define interfaces for export clarity
export interface IStoreModelFile {
  MethodInterface: MethodInterface;
}

export const StoreModelFileMethods = method;
