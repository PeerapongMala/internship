import { createIndexedDBStorage } from '@store/storage';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create, StoreApi, UseBoundStore } from 'zustand';

// ========== Interface ============
interface IRecordSchema {
  lessonId: string;
  sublessonId: string;
  levelId: string;
  questionId: string;
  url: string;
  value: Blob;
}

interface IQueryRecordSchema {
  lessonId?: string | number;
  sublessonId?: string | number;
  levelId?: string | number;
  questionId?: string | number;
}

// =========== Storage =============
const dbName = 'clever-db-lesson-files';
const storeName = 'lesson-files';
const initialStorage = await createIndexedDBStorage<IRecordSchema>({
  dbName,
  storeName,
  version: 1,
  onUpgrade: (db) => {
    const store = db.createObjectStore(storeName, {
      keyPath: ['lessonId', 'sublessonId', 'levelId', 'questionId', 'url'],
    });
    store.createIndex('lessonId', 'lessonId', { unique: false, multiEntry: true });
    store.createIndex('sublessonId', 'sublessonId', { unique: false, multiEntry: true });
    store.createIndex('levelId', 'levelId', { unique: false, multiEntry: true });
    store.createIndex('questionId', 'questionId', { unique: false, multiEntry: true });
  },
});

// ============ State ==============
interface StateInterface {
  // note: no need to store blob in state memory,
  //       it'll drain all of memory
  // [destinateURL: string]: Blob | null;
  storage: Awaited<ReturnType<typeof createIndexedDBStorage<IRecordSchema>>>;
}

const store = create<StateInterface>(() => ({
  storage: initialStorage,
}));

// ============ Method ==============
interface MethodInterface {
  getItem: (url: string, query?: IQueryRecordSchema) => Promise<Blob | null>;
  existItem: (url: string, query?: IQueryRecordSchema) => Promise<boolean>;
  addItem: (
    url: string,
    query?: IQueryRecordSchema,
    base64Data?: string,
    blobData?: Blob,
  ) => Promise<void>;
  removeItem: (url: string, query?: IQueryRecordSchema) => Promise<void>;
  removeAllByLessonId: (lessonId: string) => Promise<void>;
  removeAllBySublessonId: (sublessonId: string) => Promise<void>;
  removeAllByQuery: (query: IQueryRecordSchema) => Promise<void>;
  // size: () => Promise<number>;
  getSizeFromLesson: (lessonId: string) => Promise<{ totalSize: number; fileCount: number }>;
  getSizeFromSublesson: (
    lessonId: string,
    sublessonId: string,
  ) => Promise<{ totalSize: number; fileCount: number }>;
  getAllByLevelId: (
    lessonId: string,
    sublessonId: string,
    levelId: string,
  ) => Promise<Array<{ data: Blob | null }>>;
  getAll: () => Promise<Array<{ data: Blob | null }>>;
}

const method: MethodInterface = {
  getItem: async (url: string, query: IQueryRecordSchema = {}) => {
    const { storage } = await store.getState();
    const { lessonId = '', sublessonId = '', levelId = '', questionId = '' } = query;
    const data = await storage.getItem([lessonId, sublessonId, levelId, questionId, url]); // make sure everything convert to string
    return data?.value ? data.value : null;
  },
  existItem: async (url: string, query: IQueryRecordSchema = {}) => {
    return method.getItem(url, query) !== null;
  },
  addItem: async (
    url: string,
    query: IQueryRecordSchema = {},
    base64Data?: string,
    blobData?: Blob,
  ) => {
    const { storage } = await store.getState();
    const { lessonId = '', sublessonId = '', levelId = '', questionId = '' } = query;

    // ⭐ Check if file already exists in IndexedDB to avoid duplicate downloads
    const existingItem = await method.getItem(url, query);
    if (existingItem) {
      // File already cached - skip download
      return;
    }

    let blob: Blob;

    if (blobData) {
      // 🆕 Check if blob data is provided directly (from ZIP extraction)
      console.log(`📦 Using provided Blob data for: ${url.substring(0, 50)}...`);
      blob = blobData;
    } else if (base64Data) {
      // 🆕 If base64 data is provided, convert it to blob directly (no download needed)
      console.log(`📦 Using base64 data (new format) for: ${url.substring(0, 50)}...`);

      // Extract base64 string from data URL format: "data:;base64,{base64_string}"
      const base64String = base64Data.split(',')[1];
      if (!base64String) {
        throw new Error('Invalid base64 data format');
      }

      // Convert base64 to blob
      const byteCharacters = atob(base64String);
      const byteNumbers = new Array(byteCharacters.length);
      for (let i = 0; i < byteCharacters.length; i++) {
        byteNumbers[i] = byteCharacters.charCodeAt(i);
      }
      const byteArray = new Uint8Array(byteNumbers);
      blob = new Blob([byteArray]);
      console.log(`✅ Converted base64 to blob (${blob.size} bytes)`);
    } else if (url.startsWith('https://') || url.startsWith('http://')) {
      // 📥 Fallback: Download from URL (backward compatibility)
      console.log(`🌐 Downloading from URL (old format): ${url.substring(0, 50)}...`);

      const res = await fetch(url, {
        method: 'GET',
        // mode: 'no-cors', // note: no-cors mode to prevent CORS error
      });
      if (!res.ok) {
        const error: any = new Error(`Failed to fetch file (HTTP ${res.status})`);
        error.status = res.status; // ใส่ status ไว้ใน error object
        throw error;
      }
      blob = await res.blob();
      console.log(`✅ Downloaded from URL (${blob.size} bytes)`);
    } else {
      // Neither base64 data nor valid URL
      return;
    }

    // Save blob to IndexedDB
    await storage.setItem({
      lessonId: lessonId.toString(),
      sublessonId: sublessonId.toString(),
      levelId: levelId.toString(),
      questionId: questionId.toString(),
      url,
      value: blob,
    });

    // 🔥 CRITICAL: Null blob reference immediately after saving to free memory
    blob = null as any;
  },
  removeItem: async (url: string, query: IQueryRecordSchema = {}) => {
    const { storage } = await store.getState();
    const { lessonId = '', sublessonId = '', levelId = '', questionId = '' } = query;
    await storage.removeItem([lessonId, sublessonId, levelId, questionId, url]); // make sure everything convert to string
  },
  removeAllByLessonId: async (lessonId: string) => {
    // 🔥 MEMORY OPTIMIZATION: Delete in chunks to prevent 500MB memory spike
    // This is the PRIMARY cause of memory spike when deleting lessons!
    // Deleting 10,000-15,000 files (500MB+) in ONE transaction causes massive spike

    const CHUNK_SIZE = 100; // Delete 100 files per transaction
    const DELAY_MS = 50; // 50ms delay for GC

    let totalDeleted = 0;
    let hasMore = true;

    console.log(`🗑️ [Chunked] Deleting files for lesson ${lessonId}...`);

    while (hasMore) {
      const db = await store.getState().storage.getDB();
      const tx = db.transaction(storeName, 'readwrite');
      const index = tx.objectStore(storeName).index('lessonId');

      let deletedInChunk = 0;
      let cursor = await index.openCursor(IDBKeyRange.only(lessonId));

      while (cursor && deletedInChunk < CHUNK_SIZE) {
        await cursor.delete();
        deletedInChunk++;
        totalDeleted++;
        cursor = await cursor.continue();
      }

      // 🔥 CRITICAL: Wait for transaction to complete and release memory
      await tx.done;

      // If we deleted less than CHUNK_SIZE, we're done
      hasMore = deletedInChunk === CHUNK_SIZE;

      if (hasMore) {
        console.log(`🗑️ [Chunked] Deleted ${totalDeleted} files so far...`);
        // Allow GC to run between chunks
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
    }

    console.log(`✅ [Chunked] Deleted ${totalDeleted} files for lesson ${lessonId}`);
  },
  removeAllBySublessonId: async (sublessonId: string) => {
    // 🔥 MEMORY OPTIMIZATION: Delete in chunks to prevent memory spike
    // Problem: Deleting 300+ files in one transaction can cause memory pressure
    // Solution: Delete in chunks of 100 files, with small delays for GC

    const CHUNK_SIZE = 100; // Delete 100 files per transaction
    const DELAY_MS = 50; // 50ms delay between chunks for GC

    let totalDeleted = 0;
    let hasMore = true;

    console.log(`🗑️ Starting chunked deletion for sublesson ${sublessonId}`);

    while (hasMore) {
      const db = await store.getState().storage.getDB();
      const tx = db.transaction(storeName, 'readwrite');
      const index = tx.objectStore(storeName).index('sublessonId');

      let deletedInChunk = 0;
      let cursor = await index.openCursor(IDBKeyRange.only(sublessonId));

      // Delete up to CHUNK_SIZE files in this transaction
      while (cursor && deletedInChunk < CHUNK_SIZE) {
        await cursor.delete();
        deletedInChunk++;
        totalDeleted++;
        cursor = await cursor.continue();
      }

      await tx.done;

      // If we deleted less than CHUNK_SIZE, we're done
      hasMore = deletedInChunk === CHUNK_SIZE;

      if (hasMore) {
        console.log(`🗑️ [Chunked] Deleted ${totalDeleted} files so far for sublesson ${sublessonId}...`);
        // Allow GC to run between chunks
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
    }

    console.log(`✅ [Chunked] Deleted ${totalDeleted} files for sublesson ${sublessonId}`);
  },
  removeAllByQuery: async (query: IQueryRecordSchema) => {
    // 🔥 MEMORY OPTIMIZATION: Delete in chunks to prevent 500MB memory spike
    // Problem: Deleting 10,000-15,000 files in one transaction causes massive memory spike
    // Solution: Delete in chunks of 100 files, with small delays for GC

    const CHUNK_SIZE = 100; // Delete 100 files per transaction
    const DELAY_MS = 50; // 50ms delay between chunks for GC

    let totalDeleted = 0;
    let hasMore = true;

    console.log(`🗑️ Starting chunked deletion with query:`, query);

    while (hasMore) {
      const db = await store.getState().storage.getDB();
      const tx = db.transaction(storeName, 'readwrite');
      const objectStore = tx.objectStore(storeName);

      let deletedInChunk = 0;
      let cursor = await objectStore.openCursor();

      while (cursor && deletedInChunk < CHUNK_SIZE) {
        const record = cursor.value as IRecordSchema;
        // Check if record matches query
        const matches =
          (!query.lessonId || record.lessonId === query.lessonId.toString()) &&
          (!query.sublessonId || record.sublessonId === query.sublessonId.toString()) &&
          (!query.levelId || record.levelId === query.levelId.toString()) &&
          (!query.questionId || record.questionId === query.questionId.toString());

        if (matches) {
          await cursor.delete();
          deletedInChunk++;
          totalDeleted++;
        }

        cursor = await cursor.continue();
      }

      // 🔥 CRITICAL: Wait for transaction to complete before next chunk
      await tx.done;

      // If we deleted less than CHUNK_SIZE, we're done
      hasMore = deletedInChunk === CHUNK_SIZE;

      if (hasMore) {
        console.log(`🗑️ Deleted ${totalDeleted} files so far, continuing...`);
        // Small delay to allow GC to run
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
    }

    console.log(`✅ Deleted ${totalDeleted} files matching query`);
  },
  getSizeFromLesson: async (lessonId: string) => {
    // 🔥 CRITICAL FIX: Don't load ALL blobs into memory!
    // Old code loaded ALL files causing heap to spike 300MB -> 500MB+
    const db = await store.getState().storage.getDB();
    const tx = db.transaction(storeName, 'readonly');
    const index = tx.objectStore(storeName).index('lessonId');

    let totalSize = 0;
    let fileCount = 0;
    let cursor = await index.openCursor(IDBKeyRange.only(lessonId));

    while (cursor) {
      const record = cursor.value as IRecordSchema;
      if (record?.value?.size) {
        totalSize += record.value.size;
        fileCount++;
      }
      cursor = await cursor.continue();
    }

    // 🔥 FIXED: Explicitly wait for transaction to complete
    await tx.done;

    return { totalSize, fileCount };
  },
  getSizeFromSublesson: async (lessonId: string, sublessonId: string) => {
    // 🔥 CRITICAL FIX: Don't load ALL blobs into memory!
    const db = await store.getState().storage.getDB();
    const tx = db.transaction(storeName, 'readonly');
    const objectStore = tx.objectStore(storeName);

    let totalSize = 0;
    let fileCount = 0;
    let cursor = await objectStore.openCursor();

    while (cursor) {
      const record = cursor.value as IRecordSchema;
      // Match both lessonId and sublessonId
      if (
        record.lessonId === lessonId.toString() &&
        record.sublessonId === sublessonId.toString()
      ) {
        if (record?.value?.size) {
          totalSize += record.value.size;
          fileCount++;
        }
      }
      cursor = await cursor.continue();
    }

    // 🔥 FIXED: Explicitly wait for transaction to complete
    await tx.done;

    return { totalSize, fileCount };
  },
  getAllByLevelId: async (lessonId: string, sublessonId: string, levelId: string) => {
    const db = await store.getState().storage.getDB();
    const tx = db.transaction(storeName, 'readonly');
    const objectStore = tx.objectStore(storeName);

    const files: Array<{ data: Blob | null }> = [];
    let cursor = await objectStore.openCursor();

    while (cursor) {
      const record = cursor.value as IRecordSchema;
      if (
        record.lessonId === lessonId.toString() &&
        record.sublessonId === sublessonId.toString() &&
        record.levelId === levelId.toString()
      ) {
        files.push({ data: record.value });
      }
      cursor = await cursor.continue();
    }

    await tx.done;
    return files;
  },
  getAll: async () => {
    const db = await store.getState().storage.getDB();
    const tx = db.transaction(storeName, 'readonly');
    const objectStore = tx.objectStore(storeName);

    const files: Array<{ data: Blob | null }> = [];
    let cursor = await objectStore.openCursor();

    while (cursor) {
      const record = cursor.value as IRecordSchema;
      files.push({ data: record.value });
      cursor = await cursor.continue();
    }

    await tx.done;
    return files;
  },
};

// ============ Export ==============
export interface IStoreLessonFile {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreLessonFile: {
  StateGet: (
    stateList: string[],
    shallowIs?: boolean,
  ) => IStoreLessonFile['StateInterface'];
  StateSet: (prop: Partial<IStoreLessonFile['StateInterface']>) => void;
  StateGetAllWithUnsubscribe: () => IStoreLessonFile['StateInterface'];
  MethodGet: () => IStoreLessonFile['MethodInterface'];
  StoreGet: () => UseBoundStore<StoreApi<IStoreLessonFile['StateInterface']>>;
} = HelperZustand.StoreExport<
  IStoreLessonFile['StateInterface'],
  IStoreLessonFile['MethodInterface']
>(store, method);

export default StoreLessonFile;
