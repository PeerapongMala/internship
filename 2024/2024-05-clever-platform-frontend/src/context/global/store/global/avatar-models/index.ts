import { createIndexedDBStorage } from '@store/storage'; // Assuming this helper exists
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand'; // Assuming this helper exists
import { create } from 'zustand';

// ========== Configuration ==========
const DB_NAME = 'clever-db-model-files'; // Your new DB name
const STORE_NAME = 'model-files'; // A specific store for models
const DB_VERSION = 1;

// ========== Interface ==========
// Defines the structure of data in the 'model-files' store
export interface IModelRecordSchema {
  modelKey: string; // The unique string key you want (e.g., "set1_character1_level5")
  originalUrl?: Blob | string; // Optional: Store the URL it came from
  value: Blob; // The FBX file content as a Blob
  addedTimestamp: number; // Optional: Track when it was added
  model_version_id: string;
}
export interface ModelData {
  model_id: string;
  model_version_id: string;
  url: string;
  size?: number;
  [key: string]: any;
}
// ========== Storage ==========
// Initialize the IndexedDB storage helper for the model files DB
const initialStorage = await createIndexedDBStorage<IModelRecordSchema>({
  dbName: DB_NAME,
  storeName: STORE_NAME,
  version: DB_VERSION,
  onUpgrade: (db) => {
    // Check if the store already exists before creating (good practice in onUpgrade)
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      const store = db.createObjectStore(STORE_NAME, {
        keyPath: 'modelKey', // Use 'modelKey' as the primary key
      });
      // Optional: Add an index if you need to query by originalUrl later
      // store.createIndex('originalUrl', 'originalUrl', { unique: false });
      console.log(`IndexedDB store "${STORE_NAME}" created/upgraded in DB "${DB_NAME}".`);
    }
  },
});

// ========== State ==========
interface StateInterface {
  // Only store the storage helper reference in Zustand state, not the Blobs
  storage: Awaited<ReturnType<typeof createIndexedDBStorage<IModelRecordSchema>>>;
}

const store = create<StateInterface>(() => ({
  storage: initialStorage,
}));

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

  /** Gets all model metadata without loading blobs into memory */
  getAllMetadata: () => Promise<Omit<IModelRecordSchema, 'value'>[]>;

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
    console.warn('⚠️ getAll() loads ALL blobs into memory! Consider using getAllMetadata() or getAllKeys() instead.');
    const { storage } = store.getState();
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
    const { storage } = store.getState(); // No need for await here if Zustand setup is sync

    console.log(`Attempting to fetch model from URL: ${url}`);
    try {
      let blob: Blob;
      let originalUrlBlob: Blob | undefined;

      if (typeof url === 'string') {
        console.log(`Attempting to fetch model from URL: ${url}`);
        const response = await fetch(url);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch model. Status: ${response.status} ${response.statusText}`,
          );
        }

        let arrayBuffer: ArrayBuffer | null = await response.arrayBuffer();
        blob = new Blob([arrayBuffer], {
          type: response.headers.get('content-type') || 'application/octet-stream',
        });

        // Clear arrayBuffer reference to free memory
        arrayBuffer = null;

        originalUrlBlob = new Blob([url], { type: 'text/plain' });
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

      // Clear blob reference immediately after storing to IndexedDB
      (record as any).value = null;
      blob = null as any;

      console.log(`Model with key "${modelKey}" added to IndexedDB.`);

      // Force GC if available
      if (typeof (globalThis as any).gc === 'function') {
        (globalThis as any).gc();
      }
    } catch (error) {
      console.error(`Error adding item with key "${modelKey}":`, error);
      throw error;
    }
  },

  getItem: async (modelKey: string): Promise<Blob | null> => {
    const { storage } = store.getState();
    const data = await storage.getItem(modelKey); // getItem using the primary key
    return data?.value ?? null; // Return the Blob or null
  },

  existItem: async (modelKey: string): Promise<boolean> => {
    const { storage } = store.getState();
    try {
      const db = await storage.getDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      // Use count to check existence without loading the blob
      const count = await objectStore.count(modelKey);
      return count > 0;
    } catch (error) {
      console.error(`Error checking existence of ${modelKey}:`, error);
      return false;
    }
  },

  removeItem: async (modelKey: string): Promise<void> => {
    const { storage } = store.getState();
    await storage.removeItem(modelKey); // removeItem using the primary key
    console.log(`Model with key "${modelKey}" removed from IndexedDB.`);
  },

  getSize: async (modelKey: string): Promise<number> => {
    const { storage } = store.getState();
    try {
      const db = await storage.getDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const record = await objectStore.get(modelKey);

      if (record?.value?.size) {
        const size = record.value.size;
        // Clear blob reference immediately
        (record as any).value = null;
        return size;
      }
      return 0;
    } catch (error) {
      console.error(`Error getting size for ${modelKey}:`, error);
      return 0;
    }
  },

  getTotalSize: async (): Promise<number> => {
    const { storage } = store.getState();
    try {
      const db = await storage.getDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);

      let totalSize = 0;
      let cursor = await objectStore.openCursor();

      while (cursor) {
        const record = cursor.value;
        // Only read the size property, don't keep reference to blob
        if (record.value?.size) {
          totalSize += record.value.size;
        }
        // Clear reference immediately
        (record as any).value = null;
        cursor = await cursor.continue();
      }

      return totalSize;
    } catch (error) {
      console.error('Error calculating total size:', error);
      return 0;
    }
  },

  getAllKeys: async (): Promise<string[]> => {
    const { storage } = store.getState();
    try {
      const db = await storage.getDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);

      const keys: string[] = [];
      // Use cursor to iterate keys only, without loading any record data
      let cursor = await objectStore.openKeyCursor();

      while (cursor) {
        keys.push(cursor.key as string);
        cursor = await cursor.continue();
      }

      return keys;
    } catch (error) {
      console.error('Error getting all keys:', error);
      return [];
    }
  },

  getAllMetadata: async (): Promise<Omit<IModelRecordSchema, 'value'>[]> => {
    const { storage } = store.getState();
    try {
      const db = await storage.getDB();

      // First get all keys only (very lightweight)
      const keys = await db.getAllKeys(STORE_NAME);
      const metadata: Omit<IModelRecordSchema, 'value'>[] = [];

      // Create transaction and collect all get promises before awaiting
      // This ensures the transaction stays active for all operations
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);

      // Collect all promises first (don't await in loop)
      const getPromises = keys.map(key => objectStore.get(key));

      // Wait for all to complete (transaction stays active)
      const records = await Promise.all(getPromises);

      // Process results after transaction completes
      for (const record of records) {
        if (record) {
          metadata.push({
            modelKey: record.modelKey,
            originalUrl: record.originalUrl,
            addedTimestamp: record.addedTimestamp,
            model_version_id: record.model_version_id,
          });
          // Clear reference immediately to allow GC
          (record as any).value = null;
        }
      }

      return metadata;
    } catch (error) {
      console.error('Error getting all metadata:', error);
      return [];
    }
  },

  getVersion: async (modelKey: string): Promise<string | null> => {
    const { storage } = store.getState();
    try {
      const db = await storage.getDB();
      const transaction = db.transaction(STORE_NAME, 'readonly');
      const objectStore = transaction.objectStore(STORE_NAME);
      const record = await objectStore.get(modelKey);

      if (record) {
        const version = record.model_version_id || null;
        // Clear blob reference immediately to free memory
        (record as any).value = null;
        return version;
      }
      return null;
    } catch (error) {
      console.error(`Error getting version for ${modelKey}:`, error);
      return null;
    }
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
    const { storage } = store.getState();
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
    const { storage } = store.getState();
    try {
      const db = await storage.getDB();
      const currentModelMap = new Map(
        currentModels.map((m) => [m.model_id, m.model_version_id]),
      );

      let deletedCount = 0;
      let freedSpace = 0;
      let processedCount = 0;

      console.log(`🧹 [clearOutdatedModels] Starting memory-safe deletion...`);

      // Use cursor to process one record at a time (memory-safe)
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      let cursor = await objectStore.openCursor();

      while (cursor) {
        const record = cursor.value;
        processedCount++;

        // ลบเฉพาะโมเดลที่ยังมีอยู่ใน API แต่เวอร์ชั่นไม่ตรง
        if (
          currentModelMap.has(record.modelKey) &&
          currentModelMap.get(record.modelKey) !== record.model_version_id
        ) {
          const size = record.value?.size || 0;
          freedSpace += size;
          deletedCount++;

          console.log(
            `🗑️ [clearOutdatedModels] Deleting outdated: ${record.modelKey} (${(size / 1024 / 1024).toFixed(2)} MB)`,
          );

          // Delete via cursor
          await cursor.delete();
        }

        // Clear blob reference immediately
        (record as any).value = null;

        // Give GC time to run every 5 records
        if (processedCount % 5 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        cursor = await cursor.continue();
      }

      console.log(
        `✅ [clearOutdatedModels] Deleted ${deletedCount} outdated models, freed ${(freedSpace / 1024 / 1024).toFixed(2)} MB`,
      );

      return { deletedCount, freedSpace };
    } catch (error) {
      console.error('Failed to clear outdated models:', error);
      throw error;
    }
  },

  clearOrphanedModels: async (
    currentModels: ModelData[],
  ): Promise<{ deletedCount: number; freedSpace: number }> => {
    const { storage } = store.getState();
    try {
      const db = await storage.getDB();
      const currentModelIds = new Set(currentModels.map((m) => m.model_id));

      let deletedCount = 0;
      let freedSpace = 0;
      let processedCount = 0;

      console.log(`🧹 [clearOrphanedModels] Starting memory-safe deletion...`);

      // Use cursor to process one record at a time (memory-safe)
      const transaction = db.transaction(STORE_NAME, 'readwrite');
      const objectStore = transaction.objectStore(STORE_NAME);
      let cursor = await objectStore.openCursor();

      while (cursor) {
        const record = cursor.value;
        processedCount++;

        // ลบเฉพาะโมเดลที่ไม่มีใน API (orphaned)
        if (!currentModelIds.has(record.modelKey)) {
          const size = record.value?.size || 0;
          freedSpace += size;
          deletedCount++;

          console.log(
            `🗑️ [clearOrphanedModels] Deleting orphaned: ${record.modelKey} (${(size / 1024 / 1024).toFixed(2)} MB)`,
          );

          // Delete via cursor
          await cursor.delete();
        }

        // Clear blob reference immediately
        (record as any).value = null;

        // Give GC time to run every 5 records
        if (processedCount % 5 === 0) {
          await new Promise((resolve) => setTimeout(resolve, 50));
        }

        cursor = await cursor.continue();
      }

      console.log(
        `✅ [clearOrphanedModels] Deleted ${deletedCount} orphaned models, freed ${(freedSpace / 1024 / 1024).toFixed(2)} MB`,
      );

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
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

// Use the helper to export the store and methods together
const StoreModelFile = HelperZustand.StoreExport<
  IStoreModelFile['StateInterface'],
  IStoreModelFile['MethodInterface']
>(store, method);
export const StoreModelFileMethods = method;
export default StoreModelFile;
