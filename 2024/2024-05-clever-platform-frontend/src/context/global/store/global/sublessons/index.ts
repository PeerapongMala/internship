import {
  Language,
  LevelList,
  QuestionDetails,
  SublessonEntity,
  SublessonLanguageSoundPack,
  SublessonLanguageSoundType,
  TextTranslation,
  TranslationChoice,
} from '@domain/g04/g04-d01/local/type';
import { debugError, debugLog, debugWarn } from '@global/helper/debug-logger';
import { getDownloadConfig } from '@global/helper/download-config';
import { retryAsyncOperation } from '@global/helper/retry';
import { shouldRetryError } from '@global/helper/shouldRetryError';
import { createKeyValStorage } from '@store/storage';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import StoreLessonFile from '../lesson-files';
import StoreLevel from '../level';

// ============ Types ==============
export interface FailedAsset {
  url: string;
  error: string;
  type: 'critical' | 'non-critical'; // critical = images (show warning), non-critical = audio (skip silently)
  assetType: 'image' | 'audio'; // What kind of asset it is
  source?: 'base64' | 'zip' | 'url'; // 🆕 แหล่งที่มาของ asset
}

// 🆕 Audio URL info สำหรับเก็บรายการไฟล์เสียงที่ต้องดาวน์โหลดแยก
export interface AudioUrlInfo {
  url: string;
  language: string;
  field: string; // เช่น 'command_text', 'description_text', 'text_choices'
  questionId: number;
  levelId: number;
}

export interface SublessonDownloadState {
  isDownloading: boolean;
  progress: number; // 0-100
  error?: string;
  failedAssets?: FailedAsset[]; // 🆕 Track which specific assets failed for warning modal
  audioUrls?: AudioUrlInfo[]; // 🆕 รายการ URL ไฟล์เสียงสำหรับดาวน์โหลดแยก (ไม่โหลดอัตโนมัติ)
}

// ============ State ==============
interface StateInterface {
  store: {
    [sublessonId: string]: SublessonEntity | undefined;
  };
  currentSublesson?: SublessonEntity;
  // 🆕 Track download states for individual sublessons
  downloadStates: {
    [sublessonId: string]: SublessonDownloadState | undefined;
  };
  isReady: boolean;
}

const storeName = 'sublessons';
const store = create(
  persist(
    (): StateInterface => ({
      isReady: false,
      store: {},
      currentSublesson: undefined,
      downloadStates: {},
    }),
    {
      name: storeName,
      storage: createJSONStorage(() => createKeyValStorage({})),
      partialize: (state) => {
        // 🔥 OPTIMIZATION: Strip heavy level data before persisting
        // This prevents 200-500MB memory spike on app start
        const { isReady, ...rest } = state;

        // Strip out questionList from each level (keep only metadata)
        const lightweightStore: StateInterface['store'] = {};
        Object.entries(state.store).forEach(([id, sublesson]) => {
          if (sublesson) {
            // Strip questionList from each level
            const lightLevels = sublesson.levels?.map((level) => ({
              ...level,
              questionList: [], // 🔥 Don't persist questions - they're in StoreLevel
            }));

            lightweightStore[id] = {
              ...sublesson,
              levels: lightLevels,
            };
          }
        });

        // 🔥 Strip audioUrls from downloadStates to prevent massive memory usage
        const lightweightDownloadStates: StateInterface['downloadStates'] = {};
        Object.entries(state.downloadStates).forEach(([id, downloadState]) => {
          if (downloadState) {
            lightweightDownloadStates[id] = {
              ...downloadState,
              audioUrls: [], // 🔥 Don't persist audioUrls - will be rebuilt on demand
            };
          }
        });

        return {
          ...rest,
          store: lightweightStore,
          downloadStates: lightweightDownloadStates,
        };
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
// 🔥 Per-lesson Map to prevent duplicate downloads and avoid race conditions
// Each lesson has its own Set of downloaded URLs, preventing cross-lesson interference
const downloadedUrlsByLesson = new Map<string, Set<string>>();

// 🧠 Memory limit for URL cache per lesson - REDUCED from 5000 to 1000 to save memory
// Each URL is approximately 100-200 bytes, so 1000 URLs ≈ 100-200KB per lesson
const MAX_CACHED_URLS_PER_LESSON = 1000;

// 🧠 Auto-cleanup: Remove oldest cached URLs when limit is exceeded
function cleanupUrlCache(lessonId: string) {
  const urlSet = downloadedUrlsByLesson.get(lessonId);
  if (!urlSet || urlSet.size <= MAX_CACHED_URLS_PER_LESSON) return;

  // Convert to array, keep last MAX_CACHED_URLS_PER_LESSON items
  const urlArray = Array.from(urlSet);
  const newSet = new Set(urlArray.slice(-MAX_CACHED_URLS_PER_LESSON));
  downloadedUrlsByLesson.set(lessonId, newSet);

  debugLog(
    `🧹 [cleanupUrlCache] Trimmed lesson ${lessonId} cache from ${urlArray.length} to ${newSet.size} URLs`,
  );
}

interface MethodInterface {
  sublessonSelect: (sublesson: SublessonEntity) => void;
  get: (sublessonId: string) => SublessonEntity | undefined;
  getFromLessonId: (lessonId: string) => SublessonEntity[];
  // getLevels: (sublessonId: string) => LevelList[];
  getLevelsByStudent: (sublessonId: string, studentId: string) => LevelList[];
  exist: (sublessonId: string) => boolean;
  add: (sublesson: SublessonEntity) => void;
  addLevels: (sublessonId: string, levels: LevelList[], studentId: string) => void;
  update: (sublesson: SublessonEntity) => void;
  setLevelStar: (
    sublessonId: string,
    levelId: string,
    star: number,
    time_used: number,
    studentId: string,
  ) => void;
  downloadLevelAssets: (
    sublessonId: string,
    language?: Language,
    localAssets?: Map<string, Blob>,
  ) => Promise<void>;
  remove: (sublessonId: string) => void;
  removeLevelAssets: (sublessonId: string, language?: Language) => Promise<void>;
  clearDownloadedUrls: (lessonId: string) => void; // NEW: per-lesson clear
  getDownloadedUrls: (lessonId: string) => Set<string>; // NEW: per-lesson getter
  isSublessonComplete: (sublessonId: string) => boolean; // NEW: check if sublesson is fully downloaded
  // 🆕 Download state management
  setSublessonDownloadState: (sublessonId: string, state: SublessonDownloadState) => void;
  getSublessonDownloadState: (sublessonId: string) => SublessonDownloadState | undefined;
  clearSublessonDownloadState: (sublessonId: string) => void;
  // 🆕 Audio download management - สำหรับดาวน์โหลดเสียงแยกต่างหาก
  getAudioUrls: (sublessonId: string) => AudioUrlInfo[];
  rebuildAudioUrls: (sublessonId: string) => AudioUrlInfo[]; // 🆕 สร้าง audioUrls จากข้อมูลใน store (กรณีกลับมาเปิดใหม่)
  downloadAudioFiles: (sublessonId: string, audioUrls?: AudioUrlInfo[]) => Promise<void>;
  // 🆕 Update sublesson's updated_at timestamp from API response
  updateSublessonUpdatedAt: (sublessonId: string, newUpdatedAt: Date) => void;
}

const method: MethodInterface = {
  sublessonSelect: (sublesson: SublessonEntity) => {
    store.setState({ currentSublesson: sublesson });
  },

  get: (sublessonId: string) => {
    const sublesson = store.getState().store[sublessonId];
    return sublesson;
  },
  getFromLessonId: (lessonId: string | number) => {
    const state = store.getState();
    const result = Object.values(state.store)
      .filter((sublesson) => {
        // 🔧 Use loose comparison to handle type mismatch (string vs number)
        // This fixes count reset bug after navigation where lessonId type may differ
        return sublesson?.lesson_id == lessonId;
      })
      .map((sublesson) => sublesson as SublessonEntity);

    // 🔍 Debug: Log languages status (disabled to prevent memory issues from excessive logging)
    // Uncomment only when debugging specific issues
    // debugLog(`🔍 getFromLessonId(${lessonId}):`, result.map(s => ({
    //   id: s.id,
    //   languages: s.languages
    // })));

    return result;
  },
  // getLevels: (sublessonId: string) => {
  //   const sublesson = store.getState().store[sublessonId];
  //   return sublesson?.levels || [];
  // },
  getLevelsByStudent: (sublessonId: string, studentId: string) => {
    const sublesson = store.getState().store[sublessonId];
    return sublesson?.levels_by_student?.[studentId] || [];
  },
  exist: (sublessonId: string) => {
    return store.getState().store[sublessonId] !== undefined;
  },
  add: (sublesson: SublessonEntity) => {
    const key: any = sublesson.id || sublesson.sub_lesson_id;
    store.setState((state) => ({
      ...state,
      store: {
        ...state.store,
        [key]: {
          ...sublesson,
          updated_at: sublesson.updated_at,
          sub_lesson_id: sublesson.sub_lesson_id,
          lesson_id: sublesson.lesson_id,
          sub_lesson_name: sublesson.sub_lesson_name,
        },
      },
    }));
  },
  update: (updatedSublesson: SublessonEntity) => {
    const key: any = updatedSublesson.id || updatedSublesson.sub_lesson_id;
    store.setState((state) => {
      const currentSublesson = state.store[key];

      // Merge existing data with updated data
      const mergedSublesson = {
        ...currentSublesson,
        ...updatedSublesson,
        // Preserve these special fields if not provided in update
        levels: updatedSublesson.levels ?? currentSublesson?.levels,
        levels_by_student:
          updatedSublesson.levels_by_student ?? currentSublesson?.levels_by_student,
        languages: updatedSublesson.languages ?? currentSublesson?.languages,
        updated_at: updatedSublesson.updated_at,
      };

      return {
        ...state,
        store: {
          ...state.store,
          [key]: mergedSublesson,
        },
      };
    });
  },
  addLevels: (sublessonId: string, levels: LevelList[], studentId: string) => {
    const sublesson = store.getState().store[sublessonId];
    if (sublesson) {
      store.setState((state) => ({
        ...state,
        store: {
          ...state.store,
          [sublesson.id]: {
            ...sublesson,
            levels: levels,
            levels_by_student: {
              ...sublesson.levels_by_student,
              [studentId]: levels,
            },
          },
        },
      }));
    }
  },

  setLevelStar: (
    sublessonId: string,
    levelId: string,
    star: number,
    time_used: number,
    studentId: string,
  ) => {
    const sublesson = store.getState().store[sublessonId];
    if (sublesson) {
      // Get levels specific to the student
      let levels = sublesson.levels_by_student?.[studentId] || [];
      levels = (sublesson?.levels_by_student?.[studentId] || []).map((level) => {
        if (level.id.toString() == levelId) {
          // Only update the star if the new star is greater than the existing star
          const newStar = star > (level.star ?? 0) ? star : (level.star ?? 0);
          return { ...level, star: newStar, time_used: time_used.toString() };
        }
        return level;
      });

      const findLevel = levels.find((level) => level.id.toString() == levelId);
      if (findLevel && star > 0) {
        const findNextLevel = levels.find((level) => level.level == findLevel?.level + 1);
        if (findNextLevel) {
          levels = levels.map((level) => {
            if (level.level == findNextLevel.level) {
              return { ...level, status: 'unlock' };
            }
            return level;
          });
        }
      }
      // Update the state for the specific student
      store.setState((state) => ({
        ...state,
        store: {
          ...state.store,
          [sublesson.id]: {
            ...sublesson,
            levels_by_student: {
              ...sublesson.levels_by_student,
              [studentId]: levels,
            },
          },
        },
      }));
    }
  },
  downloadLevelAssets: async (
    sublessonId: string,
    language?: Language,
    localAssets?: Map<string, Blob>,
  ) => {
    const downloadStartTime = Date.now();
    console.log(
      `🔵 [downloadLevelAssets] STARTING for sublesson ${sublessonId}, language: ${language}`,
    );
    if (localAssets) {
      console.log(
        `📦 [downloadLevelAssets] Received ${localAssets.size} local assets from ZIP`,
      );
    } else {
      console.warn(`⚠️ [downloadLevelAssets] No local assets received!`);
    }
    debugLog(`📥 Starting asset download for sublesson ${sublessonId}`, { language });

    // 🔥 Clear previous download state before starting new download
    method.setSublessonDownloadState(sublessonId, {
      isDownloading: true,
      progress: 0,
      error: undefined,
      failedAssets: [],
      audioUrls: [],
    });

    // OPTIMIZATION: Sequential download per question to prevent memory overflow on mobile
    const MAX_RETRIES = 3;
    const RETRY_DELAY_MS = 1000;

    // Get download configuration (adjustable in download-config.ts)
    const downloadConfig = getDownloadConfig();
    const DELAY_BETWEEN_QUESTIONS_MS = downloadConfig.questionDelay;
    const sublesson = store.getState().store[sublessonId];

    // 🔥 Get full level details directly from StoreLevel (no need for sublesson.levels)
    const levels = StoreLevel.MethodGet().getLevelsForSublesson(sublessonId) || [];

    // 🔥 EARLY RETURN: If no levels or no questions, skip asset download
    if (levels.length === 0) {
      console.log(
        `⏭️ [downloadLevelAssets] No levels found for sublesson ${sublessonId}, skipping`,
      );
      return;
    }

    const totalQuestions = levels.reduce(
      (sum, level) => sum + (level.questionList?.length || 0),
      0,
    );
    if (totalQuestions === 0) {
      console.log(
        `⏭️ [downloadLevelAssets] No questions found in ${levels.length} levels for sublesson ${sublessonId}, skipping`,
      );
      return;
    }

    console.log(
      `📊 [downloadLevelAssets] Processing ${levels.length} levels with ${totalQuestions} total questions`,
    );

    const currentLanguageStatus: SublessonLanguageSoundPack =
      sublesson?.languages ?? ({} as SublessonLanguageSoundPack);

    const addDefaultToLanguageStatus = (language: SublessonLanguageSoundType) => {
      if (!currentLanguageStatus[language]) {
        currentLanguageStatus[language] = 'UNDOWNLOADED';
      }
    };

    // 🔥 Get lesson-specific URL cache to prevent race conditions
    const lessonId = sublesson?.lesson_id?.toString() || '';
    const downloadedUrls = method.getDownloadedUrls(lessonId);

    // Track download statistics for reporting
    const failedDownloads: FailedAsset[] = []; // 🆕 Now includes criticality info
    let totalAssets = 0;
    let successfulAssets = 0;
    let base64Assets = 0; // 🆕 Track assets using base64 data (new format)
    let urlAssets = 0; // 🆕 Track assets using URL download (old format)

    // 🔥 CRITICAL: Don't collect audio URLs during download - too much memory
    // Audio URLs will be rebuilt from stored data when needed
    // const collectedAudioUrls: AudioUrlInfo[] = [];

    // 🔥 OPTIMIZATION: Pre-compute asset lookup map to avoid O(n²) complexity
    // This converts 250,000 iterations to ~500 for 500 assets
    const assetKeyLookup = new Map<string, string>();
    if (localAssets) {
      const startLookup = Date.now();
      for (const key of localAssets.keys()) {
        const lowerKey = key.toLowerCase();
        const normalized = lowerKey.split('.').slice(0, -1).join('.') || lowerKey;

        // Store multiple lookup keys pointing to the original key
        assetKeyLookup.set(lowerKey, key); // exact lowercase
        assetKeyLookup.set(normalized, key); // normalized (no extension)
        assetKeyLookup.set(key, key); // original key (case-sensitive)
      }
      console.log(
        `📊 Built asset lookup map: ${assetKeyLookup.size} entries in ${Date.now() - startLookup}ms`,
      );
    }

    // Helper function to download a single asset
    const downloadAsset = async (
      oldUrl: string,
      query: any,
      base64Data?: string,
      assetType: 'image' | 'audio' = 'image', // 🆕 Track asset type
      fieldContext?: string, // เช่น 'image_description_url', 'image_hint_url', 'image_url', 'speech_url'
    ) => {
      if (!oldUrl) return; // Skip empty URLs

      // 🔥 Early exit: Skip if already downloaded (before counting)
      if (downloadedUrls.has(oldUrl)) {
        return; // Already downloaded, skip entirely
      }

      let url = oldUrl;

      // Replace asset URL endpoint if env vars are configured
      if (import.meta.env.VITE_REPLACE_URL_FROM && import.meta.env.VITE_REPLACE_URL_TO) {
        const replaceSources = String(import.meta.env.VITE_REPLACE_URL_FROM).split(',');
        const matchedSource = replaceSources.find((source) => oldUrl.startsWith(source));

        if (matchedSource) {
          url = import.meta.env.VITE_REPLACE_URL_TO + oldUrl.slice(matchedSource.length);
        }
      }

      totalAssets++; // Count only new assets

      // 🆕 สร้าง Contextual Key ที่รวมข้อมูลเพิ่มเติม
      let contextualKey = url?.split('/').pop()?.split('?')[0] || '';
      const rawKey = contextualKey;
      contextualKey = decodeURIComponent(contextualKey);

      // 🆕 สร้าง key สำหรับการแมทช์ที่ละเอียดกว่า
      // ใช้ fieldContext + key เป็นตัวระบุบริบท
      const matchingKeyBase = fieldContext
        ? `${fieldContext}_${contextualKey}`
        : contextualKey;

      // 🔍 Debug: Log the matching key being used
      console.log(`🔍 Matching Key Base: ${matchingKeyBase}`);

      // 🆕 Check strictly for local assets from ZIP first (User request: use key to match)
      let matchedBlob: Blob | undefined;

      if (localAssets && contextualKey) {
        // 🔥 OPTIMIZED: Use pre-computed lookup map instead of O(n) loop
        const lowerUrlKey = contextualKey.toLowerCase();
        const normalizedUrlKey =
          lowerUrlKey.split('.').slice(0, -1).join('.') || lowerUrlKey;

        // 1. Try exact contextual key match first (if fieldContext provided)
        if (fieldContext) {
          const exactContextKey = matchingKeyBase;
          const originalKey = assetKeyLookup.get(exactContextKey);
          if (originalKey) {
            matchedBlob = localAssets.get(originalKey);
            console.log(`📦 Matched exact contextual key: ${exactContextKey}`);
          }
        }

        // 2. Try direct O(1) lookups in order of preference
        if (!matchedBlob) {
          // Try exact lowercase match
          let originalKey = assetKeyLookup.get(lowerUrlKey);
          if (originalKey) {
            matchedBlob = localAssets.get(originalKey);
            console.log(`📦 Matched exact key (case-insensitive): ${originalKey}`);
          }

          // Try normalized match (without extension)
          if (!matchedBlob) {
            originalKey = assetKeyLookup.get(normalizedUrlKey);
            if (originalKey) {
              matchedBlob = localAssets.get(originalKey);
              console.log(`📦 Matched normalized key: ${originalKey}`);
            }
          }
        }

        // 3. Fallback: Pattern matching (only if direct lookups fail)
        // This is still O(n) but only runs as last resort
        if (!matchedBlob) {
          let debugIteration = 0;

          for (const [lookupKey, originalKey] of assetKeyLookup.entries()) {
            // Skip if we already checked this key
            if (lookupKey === lowerUrlKey || lookupKey === normalizedUrlKey) continue;

            debugIteration++;

            // Flattened path matching (endings) - ตรวจสอบว่าชื่อไฟล์ลงท้ายด้วย UUID (ไม่รวม extension)
            // ต้องตัด extension ออกก่อน
            const lookupKeyWithoutExt = lookupKey.split('.').slice(0, -1).join('.') || lookupKey;
            if (
              lookupKeyWithoutExt.endsWith(lowerUrlKey) ||
              lookupKeyWithoutExt.endsWith('_' + lowerUrlKey) ||
              lookupKeyWithoutExt.endsWith(normalizedUrlKey)
            ) {
              matchedBlob = localAssets.get(originalKey);
              console.log(
                `📦 Matched flattened ZIP filename: ${originalKey} for URL key: ${contextualKey}`,
              );
              break;
            }

            // 🔍 DEBUG: แสดง log สำหรับ 3 ครั้งแรกของ contains check
            if (debugIteration <= 3) {
              const includesResult = lookupKey.includes(lowerUrlKey);
              console.log(`🔍 [Contains] #${debugIteration}: "${lookupKey}".includes("${lowerUrlKey}") = ${includesResult}`);
            }

            // Contains check (แบบหลวมที่สุด)
            if (
              lookupKey.includes(lowerUrlKey) ||
              (lowerUrlKey.length > 5 && lowerUrlKey.includes(lookupKey))
            ) {
              // Validate asset type matches context
              if (
                fieldContext &&
                fieldContext.includes('image') &&
                !originalKey.toLowerCase().endsWith('.jpg') &&
                !originalKey.toLowerCase().endsWith('.png')
              ) {
                console.warn(
                  `⚠️ Potential mismatch: Image context (${fieldContext}) but key ends with non-image extension: ${originalKey}`,
                );
                continue; // ข้ามไป ไม่ใช่รูปภาพ
              }
              matchedBlob = localAssets.get(originalKey);
              console.log(
                `📦 Matched loose key: ${originalKey} for URL key: ${contextualKey}`,
              );
              break;
            }
          }

          // 🔍 DEBUG: แสดง log ถ้า pattern matching หาไม่เจออะไรเลย
          if (!matchedBlob && debugIteration > 0) {
            console.warn(`⚠️ [Pattern Match] ตรวจสอบแล้ว ${debugIteration} keys, ไม่เจอที่ตรงกับ "${lowerUrlKey}"`);
          }
        }

        if (matchedBlob) {
          debugLog(
            `📦 Matched local asset from ZIP for key: ${contextualKey} (with context: ${fieldContext}) (${matchedBlob?.size} bytes)`,
          );
        } else {
          // 🔍 DEBUG: หา ZIP keys ที่มี UUID เดียวกันเพื่อช่วย debug
          const keysWithUuid = Array.from(localAssets.keys()).filter((k) =>
            k.toLowerCase().includes(contextualKey.toLowerCase()),
          );

          console.warn(
            `⚠️ [ASSET MATCH FAILURE] No local match for URL: ${url}`,
            `\n📍 Location: Lesson ${query?.lessonId}, Sublesson ${query?.sublessonId}, Level ${query?.levelId}, Question ${query?.questionId}`,
            `\n🔑 URL Key: ${contextualKey}`,
            `\n📝 Field Context: ${fieldContext}`,
            `\n📦 ZIP Keys with same UUID (${keysWithUuid.length}):`,
            keysWithUuid.length > 0 ? keysWithUuid : '(none found)',
            `\n📊 Total ZIP entries: ${localAssets.size}`,
            `\n📋 Sample ZIP keys (first 10):`,
            Array.from(localAssets.keys()).slice(0, 10),
          );
        }
      }

      try {
        await retryAsyncOperation(
          () =>
            StoreLessonFile.MethodGet().addItem(
              url,
              query,
              base64Data,
              matchedBlob, // 🆕 Pass matched blob if available
            ),
          MAX_RETRIES,
          RETRY_DELAY_MS,
          shouldRetryError,
        );
        // ✅ Only add to Set after successful download
        // 🔥 FIXED: Enforce cache limit with LRU eviction
        if (downloadedUrls.size >= MAX_CACHED_URLS_PER_LESSON) {
          debugWarn(
            `⚠️ URL cache for lesson ${lessonId} reached limit (${MAX_CACHED_URLS_PER_LESSON} URLs). Clearing 50% oldest entries...`,
          );
          // Clear 50% of the cache (LRU approximation - Set maintains insertion order)
          const urlsToDelete = Math.floor(downloadedUrls.size * 0.5);
          const urlIterator = downloadedUrls.values();
          for (let i = 0; i < urlsToDelete; i++) {
            const urlToDelete = urlIterator.next().value;
            if (urlToDelete) downloadedUrls.delete(urlToDelete);
          }
          console.log(
            `🧹 Cleared ${urlsToDelete} URLs from cache for lesson ${lessonId}`,
          );
        }
        downloadedUrls.add(url);
        successfulAssets++;

        // 🆕 Track which format was used
        if (base64Data) {
          base64Assets++;
        } else {
          urlAssets++;
        }
      } catch (error) {
        // ❌ Track failed download for reporting
        const errorMessage = error instanceof Error ? error.message : String(error);

        // 🆕 Categorize failure: images are critical (show warning), audio is non-critical (skip silently)
        const isCritical = assetType === 'image';

        failedDownloads.push({
          url,
          error: errorMessage,
          type: isCritical ? 'critical' : 'non-critical',
          assetType,
        });

        const criticalityLabel = isCritical
          ? '🔴 CRITICAL (will warn user)'
          : '🟡 NON-CRITICAL (skip silently)';
        debugWarn(
          `⚠️ Failed to download ${criticalityLabel} ${assetType}: ${url}`,
          errorMessage,
        );
        // Note: Not adding to downloadedUrls, so retry attempts will try again
      }
    };

    // if sublesson's levels not found, return
    if (!levels) return;

    for (const levelDetails of levels || []) {
      const level = StoreLevel.MethodGet().getLevel(levelDetails.id.toString());

      // if level found, proceed to download assets
      if (level) {
        console.log(
          `📝 [Level ${level.id}] Processing assets for Lesson ${level.lesson_id}, Sublesson ${level.sub_lesson_id}`,
        );

        const query = {
          lessonId: level.lesson_id,
          sublessonId: level.sub_lesson_id,
          levelId: level.id,
        };

        // add available level languages support for translation ('en', 'th', 'zh')
        if (level.language?.language)
          addDefaultToLanguageStatus(
            level.language.language as SublessonLanguageSoundType,
          );
        level.language?.translations.forEach((lang) => {
          addDefaultToLanguageStatus(lang as SublessonLanguageSoundType);
        });

        // Determine language with proper type checking (declare outside try for catch access)
        let levelLanguage: SublessonLanguageSoundType =
          (language as SublessonLanguageSoundType) ??
          (level.language?.language as SublessonLanguageSoundType);

        // Validate language is supported
        if (
          !level.language?.translations.includes(levelLanguage) &&
          levelLanguage !== level.language?.language
        ) {
          levelLanguage = level.language?.language as SublessonLanguageSoundType;
        }

        // Type guard to ensure levelLanguage is valid
        const languageKey = levelLanguage as keyof SublessonLanguageSoundPack;

        try {
          // Process each question sequentially to prevent memory overflow on mobile
          const questions = level.questionList || [];
          for (let qIndex = 0; qIndex < questions.length; qIndex++) {
            const question = questions[qIndex];
            const questionQuery = { ...query, questionId: question.id };

            // 🔍 Debug: Log question structure (only first question of first level)
            if (
              level.id === levels[0]?.id &&
              level.questionList &&
              question.id === level.questionList[0]?.id
            ) {
              console.log('🔍 Sample question structure:', {
                hasImageDescUrl: !!question?.image_description_url,
                hasImageDescData: !!(question as any)?.image_description_url_data,
                hasImageHintUrl: !!question?.image_hint_url,
                hasImageHintData: !!(question as any)?.image_hint_url_data,
                questionKeys: Object.keys(question).filter(
                  (k) => k.includes('url') || k.includes('data'),
                ),
              });
            }

            // Image description
            if (question?.image_description_url) {
              // 🆕 Check for base64 data field first (new format)
              const base64Data = (question as any)?.image_description_url_data;
              await downloadAsset(
                question.image_description_url,
                questionQuery,
                base64Data,
                'image',
                'image_description_url',
              );
            }

            // Image hint
            if (question?.image_hint_url) {
              // 🆕 Check for base64 data field first (new format)
              const base64Data = (question as any)?.image_hint_url_data;
              await downloadAsset(
                question.image_hint_url,
                questionQuery,
                base64Data,
                'image',
                'image_hint_url',
              );
            }

            // Audio assets for text translations
            const questionTextTranslationField: (keyof QuestionDetails)[] = [
              'command_text',
              'description_text',
              'hint_text',
              'correct_text',
              'wrong_text',
            ];
            for (const field of questionTextTranslationField) {
              const translation = question[field] as TextTranslation;
              if (!translation?.translations) continue;

              const speechUrl = translation.translations[languageKey]?.speech_url;
              if (speechUrl) {
                // 🔥 REMOVED: Don't collect audio URLs - saves memory
                // collectedAudioUrls.push({
                //   url: speechUrl,
                //   language: languageKey,
                //   field: field,
                //   questionId: question.id,
                //   levelId: level.id,
                // });

                // 🆕 Check for base64 data field first (new format)
                const base64Data = (translation.translations[languageKey] as any)
                  ?.speech_url_data;

                // 🔍 Debug: Log first audio field to see structure
                if (
                  level.id === levels[0]?.id &&
                  level.questionList &&
                  question.id === level.questionList[0]?.id &&
                  field === 'command_text'
                ) {
                  console.log('🔍 Sample audio translation:', {
                    field,
                    language: languageKey,
                    hasSpeechUrl: !!speechUrl,
                    hasSpeechData: !!base64Data,
                    translationKeys: Object.keys(
                      translation.translations[languageKey] || {},
                    ),
                  });
                }

                await downloadAsset(speechUrl, questionQuery, base64Data, 'audio'); // 🆕 Audio is critical
              }
            }

            // Image choices
            if (question?.image_choices?.length > 0) {
              for (const choice of question.image_choices) {
                const translationChoice = choice as TranslationChoice;
                const imageUrl = translationChoice.image_url;
                if (imageUrl) {
                  // 🆕 Check for base64 data field first (new format)
                  const base64Data = (translationChoice as any)?.image_url_data;
                  await downloadAsset(imageUrl, questionQuery, base64Data, 'image');
                }
              }
            }

            // Text choices with audio
            if (
              question.question_type !== 'input' &&
              question?.text_choices?.length > 0
            ) {
              const isTranslationChoice =
                question.text_choices[0].hasOwnProperty('translations');
              if (isTranslationChoice) {
                for (const choice of question.text_choices) {
                  const translationChoice = choice as TranslationChoice;
                  const speechUrl =
                    translationChoice.translations[languageKey]?.speech_url;
                  if (speechUrl) {
                    // 🔥 REMOVED: Don't collect audio URLs - saves memory
                    // collectedAudioUrls.push({
                    //   url: speechUrl,
                    //   language: languageKey,
                    //   field: 'text_choices',
                    //   questionId: question.id,
                    //   levelId: level.id,
                    // });
                    // 🆕 Check for base64 data field first (new format)
                    const base64Data = (
                      translationChoice.translations[languageKey] as any
                    )?.speech_url_data;
                    await downloadAsset(
                      speechUrl,
                      questionQuery,
                      base64Data,
                      'audio',
                      'speech_url',
                    ); // 🆕 Audio is critical
                  }
                }
              }
            }

            // Small delay between questions to allow garbage collection on mobile
            // Skip delay after last question to save time
            if (qIndex < questions.length - 1) {
              await new Promise((resolve) =>
                setTimeout(resolve, DELAY_BETWEEN_QUESTIONS_MS),
              );
            }
          }

          // ✅ Update language status based on download results
          // 🆕 NEW LOGIC: All failures are playable, but images trigger warning modal
          const imageFailures = failedDownloads.filter((f) => f.assetType === 'image');
          const audioFailures = failedDownloads.filter((f) => f.assetType === 'audio');

          // Always mark as DOWNLOADED - all failures are non-blocking
          currentLanguageStatus[languageKey] = 'DOWNLOADED';

          if (failedDownloads.length > 0) {
            if (imageFailures.length > 0 && audioFailures.length > 0) {
              // Both types failed
              debugWarn(
                `⚠️ Level ${level.id} downloaded with warnings - ${imageFailures.length} images and ${audioFailures.length} audio files failed (lesson still playable):`,
                failedDownloads.map((f) => ({
                  url: f.url,
                  error: f.error,
                  type: f.assetType,
                })),
              );
            } else if (imageFailures.length > 0) {
              // Only images failed - will show warning modal
              debugWarn(
                `⚠️ Level ${level.id} downloaded with warnings - ${imageFailures.length} images failed (will show warning modal):`,
                imageFailures.map((f) => ({ url: f.url, error: f.error })),
              );
            } else {
              // Only audio failed - silently skip
              debugWarn(
                `⚠️ Level ${level.id} downloaded with warnings - ${audioFailures.length} audio files failed (skipped silently):`,
                audioFailures.map((f) => ({ url: f.url, error: f.error })),
              );
            }
          } else {
            // ✅ SUCCESS: All assets succeeded
            debugLog(`✅ Level ${level.id} fully downloaded for language ${languageKey}`);
          }
        } catch (err) {
          // Critical error in level processing (not asset download)
          debugError('Critical error processing level assets:', err);
          // Mark as partially downloaded rather than throwing
          currentLanguageStatus[languageKey] = 'PARTIAL';

          // Only throw if it's a critical error that prevents level from working
          // For now, we continue to allow partial downloads
          debugWarn(
            `⚠️ Level ${level.id} has critical errors but will be marked as available`,
          );
        }
      }
    }

    // if language status is not empty, update sublesson download status
    if (currentLanguageStatus && sublesson) {
      store.setState((state) => {
        const existingSublesson = state.store[sublesson.id];
        if (!existingSublesson) return state;

        return {
          ...state,
          store: {
            ...state.store,
            [sublesson.id]: {
              ...existingSublesson,
              languages: currentLanguageStatus,
            },
          },
        };
      });
    }

    // 📊 Download summary report
    const downloadDuration = ((Date.now() - downloadStartTime) / 1000).toFixed(2);
    const successRate =
      totalAssets > 0 ? ((successfulAssets / totalAssets) * 100).toFixed(1) : '0';

    console.log(`📊 [DOWNLOAD SUMMARY] Sublesson ${sublessonId}:`, {
      totalAssets,
      successfulAssets,
      failedAssets: failedDownloads.length,
      successRate: `${successRate}%`,
      base64Assets: `${base64Assets} (new format)`,
      urlAssets: `${urlAssets} (old format)`,
      duration: `${downloadDuration}s`,
    });

    debugLog(`📊 Download Summary for sublesson ${sublessonId}:`, {
      totalAssets,
      successfulAssets,
      failedAssets: failedDownloads.length,
      successRate: `${successRate}%`,
      base64Assets: `${base64Assets} (new format)`, // 🆕 Show base64 usage
      urlAssets: `${urlAssets} (old format)`, // 🆕 Show URL download usage
      duration: `${downloadDuration}s`,
      status: currentLanguageStatus,
    });

    // 🆕 Log format usage percentage
    if (totalAssets > 0) {
      const base64Percentage = ((base64Assets / totalAssets) * 100).toFixed(1);
      const urlPercentage = ((urlAssets / totalAssets) * 100).toFixed(1);
      console.log(
        `📦 Format usage: ${base64Percentage}% base64 (new), ${urlPercentage}% URL (old)`,
      );
    }

    if (failedDownloads.length > 0) {
      debugError(`❌ Failed downloads (${failedDownloads.length}):`, failedDownloads);

      // 🆕 Store failed assets in download state for warning modal
      const currentState = method.getSublessonDownloadState(sublessonId);

      // 🔍 Log what we're storing
      const imageFailures = failedDownloads.filter((f) => f.assetType === 'image');
      const audioFailures = failedDownloads.filter((f) => f.assetType === 'audio');
      console.log(`📝 Storing failed assets for sublesson ${sublessonId}:`, {
        totalFailures: failedDownloads.length,
        imageFailures: imageFailures.length,
        audioFailures: audioFailures.length,
        failures: failedDownloads,
      });

      method.setSublessonDownloadState(sublessonId, {
        isDownloading: currentState?.isDownloading ?? false,
        progress: currentState?.progress ?? 100,
        error: currentState?.error,
        failedAssets: failedDownloads, // Store for modal to display
        audioUrls: [], // 🔥 Empty - will rebuild from store when needed
      });

      console.log(
        `✅ Stored ${failedDownloads.length} failed assets in download state (${imageFailures.length} images, ${audioFailures.length} audio)`,
      );
    } else {
      // ✅ Clear failed assets if download is now complete
      const currentState = method.getSublessonDownloadState(sublessonId);
      if (currentState?.failedAssets && currentState.failedAssets.length > 0) {
        console.log(
          `🧹 [CLEARING] Previous failed assets for sublesson ${sublessonId}:`,
          currentState.failedAssets,
        );
        method.setSublessonDownloadState(sublessonId, {
          isDownloading: currentState.isDownloading,
          progress: currentState.progress,
          error: currentState.error,
          failedAssets: [], // Clear previous failures
          audioUrls: [], // 🔥 Empty - will rebuild from store when needed
        });
        console.log(
          `✅ Cleared ${currentState.failedAssets.length} previous failed assets from download state`,
        );
      } else {
        console.log(
          `ℹ️ [NO CLEAR] No failed assets to clear for sublesson ${sublessonId}`,
        );
      }
    }

    // 🧠 Final memory summary after download
    if ('memory' in performance) {
      const mem = (performance as any).memory;
      const usedMB = (mem.usedJSHeapSize / (1024 * 1024)).toFixed(2);
      const totalMB = (mem.totalJSHeapSize / (1024 * 1024)).toFixed(2);
      console.log(`🧠 [Memory] AFTER download sublesson ${sublessonId}:`);
      console.log(`  📊 JS Heap: ${usedMB} MB used / ${totalMB} MB total`);
      console.log(
        `  💡 NOTE: This is total app memory, NOT just this sublesson's assets`,
      );
      console.log(
        `  💡 To see actual IndexedDB size, check browser DevTools → Application → IndexedDB`,
      );
    }

    console.log(`🔵 [downloadLevelAssets] FINISHED for sublesson ${sublessonId}`);
  },
  remove: (sublessonId: string) => {
    const sublesson = store.getState().store[sublessonId];
    if (sublesson) {
      // 1. Remove all levels for this sublesson
      StoreLevel.MethodGet().removeLevelsForSublesson(sublesson.id);
      // 2. Remove sublesson assets
      StoreLessonFile.MethodGet().removeAllBySublessonId(sublesson.id);
      // 3. Remove sublesson data
      store.setState((state) => {
        delete state.store[sublessonId];
        return { ...state };
      });
      debugLog(`🗑️ Removed sublesson ${sublessonId}, its levels, and all its assets`);
    }
  },
  removeLevelAssets: async (sublessonId: string, language?: Language) => {
    const sublesson = store.getState().store[sublessonId];
    const levels = StoreLevel.MethodGet().getLevelsForSublesson(sublessonId);

    // if sublesson's levels or sublesson language pack not found, return
    // note: this intended to solve the issue when sublesson language pack is not found and accidently add its status to store
    const isSoundLanguageFound =
      sublesson?.languages &&
      sublesson?.languages[language as SublessonLanguageSoundType];
    if (!levels || levels.length === 0 || !isSoundLanguageFound) return;

    console.log(
      `🗑️ [removeLevelAssets] Starting cleanup for sublesson ${sublessonId}, language ${language}`,
    );

    // 🧠 Log memory BEFORE deletion
    if ('memory' in performance) {
      const mem = (performance as any).memory;
      const usedMB = (mem.usedJSHeapSize / (1024 * 1024)).toFixed(2);
      console.log(`🧠 [Memory] BEFORE cleanup: ${usedMB} MB JS Heap`);
    }

    // 🔥 Step 1: Delete all files from IndexedDB for this sublesson
    await StoreLessonFile.MethodGet().removeAllBySublessonId(sublessonId);
    console.log(`  ✅ Removed IndexedDB files for sublesson ${sublessonId}`);

    // 🔥 Step 2: Clear questionList from StoreLevel (this can hold large arrays in memory!)
    if (levels && levels.length > 0) {
      for (const level of levels) {
        // Clear questionList to free memory
        StoreLevel.MethodGet().clearQuestionList(String(level.id));
      }
      console.log(`  ✅ Cleared ${levels.length} questionLists from StoreLevel`);
    }

    // 🔥 Step 3: Clear downloaded URLs cache for this lesson
    if (sublesson.lesson_id) {
      method.clearDownloadedUrls(String(sublesson.lesson_id));
      console.log(`  ✅ Cleared downloaded URLs cache for lesson ${sublesson.lesson_id}`);
    }

    // 🔥 Step 4: Clear download state
    method.clearSublessonDownloadState(sublessonId);
    console.log(`  ✅ Cleared download state for sublesson ${sublessonId}`);

    // 🧠 Log memory AFTER deletion
    if ('memory' in performance) {
      const mem = (performance as any).memory;
      const usedMB = (mem.usedJSHeapSize / (1024 * 1024)).toFixed(2);
      console.log(`🧠 [Memory] AFTER cleanup: ${usedMB} MB JS Heap`);
    }

    // update sublesson download status for that language sound pack
    if (language) {
      const languageStatus: SublessonLanguageSoundPack = {
        ...sublesson.languages,
        [language]: 'UNDOWNLOADED',
      };
      store.setState((state) => ({
        ...state,
        store: {
          ...state.store,
          [sublesson.id]: { ...sublesson, languages: languageStatus },
        },
      }));
    }

    console.log(`🗑️ [removeLevelAssets] Cleanup completed for sublesson ${sublessonId}`);
  },
  clearDownloadedUrls: (lessonId: string) => {
    const urlSet = downloadedUrlsByLesson.get(lessonId);
    const size = urlSet?.size || 0;
    downloadedUrlsByLesson.delete(lessonId);
    debugLog(`🧹 Cleared ${size} URLs from lesson ${lessonId} cache`);
  },
  getDownloadedUrls: (lessonId: string) => {
    if (!downloadedUrlsByLesson.has(lessonId)) {
      downloadedUrlsByLesson.set(lessonId, new Set<string>());
    }
    // 🧠 Auto-cleanup when accessing cache
    cleanupUrlCache(lessonId);
    return downloadedUrlsByLesson.get(lessonId)!;
  },
  isSublessonComplete: (sublessonId: string): boolean => {
    const sublesson = store.getState().store[sublessonId];
    if (!sublesson) {
      return false;
    }

    // Check if levels exist with valid questions
    // ✅ FIXED: Some levels can be intro/summary without questions
    // Check for total questions instead of requiring ALL levels to have questions
    const levels = StoreLevel.MethodGet().getLevelsForSublesson(sublessonId);
    const hasValidLevels = levels && levels.length > 0;

    if (!hasValidLevels) {
      return false;
    }

    // Count total questions across all levels
    const totalQuestions =
      levels?.reduce((sum, level) => {
        return sum + (level.questionList?.length || 0);
      }, 0) || 0;

    const hasEnoughQuestions = totalQuestions > 0;

    if (!hasEnoughQuestions) {
      return false;
    }

    // Check languages object exists
    if (!sublesson.languages || Object.keys(sublesson.languages).length === 0) {
      return false;
    }

    const languageStatuses = Object.values(sublesson.languages);

    // ✅ At least one language must be 'DOWNLOADED'
    // 🆕 RELAXED CHECK: We only check if at least one language is downloaded
    // We don't check if other languages are incomplete - a sublesson is playable
    // as long as one language is fully downloaded, regardless of other languages
    const hasDownloadedLanguage = languageStatuses.some(
      (status) => status === 'DOWNLOADED',
    );

    const isComplete = hasValidLevels && hasEnoughQuestions && hasDownloadedLanguage;

    // 🔧 Log only when needed (disabled by default to prevent memory issues)
    // Uncomment for debugging
    // debugLog(`🔍 isSublessonComplete(${sublessonId}):`, {
    //   hasValidLevels,
    //   hasEnoughQuestions,
    //   totalQuestions,
    //   levelCount: levels?.length || 0,
    //   hasDownloadedLanguage,
    //   languages: sublesson.languages,
    //   result: isComplete,
    // });

    return isComplete;
  },
  // 🆕 Download state management methods
  setSublessonDownloadState: (
    sublessonId: string,
    downloadState: SublessonDownloadState,
  ) => {
    store.setState((state) => ({
      ...state,
      downloadStates: {
        ...state.downloadStates,
        [sublessonId]: downloadState,
      },
    }));
    debugLog(`📝 setSublessonDownloadState(${sublessonId}):`, downloadState);
  },
  getSublessonDownloadState: (
    sublessonId: string,
  ): SublessonDownloadState | undefined => {
    return store.getState().downloadStates[sublessonId];
  },
  clearSublessonDownloadState: (sublessonId: string) => {
    store.setState((state) => {
      const { [sublessonId]: removed, ...rest } = state.downloadStates;
      return {
        ...state,
        downloadStates: rest,
      };
    });
    debugLog(`🧹 clearSublessonDownloadState(${sublessonId})`);
  },

  // 🆕 Audio download management - สำหรับดาวน์โหลดเสียงแยกต่างหาก
  getAudioUrls: (sublessonId: string): AudioUrlInfo[] => {
    const downloadState = store.getState().downloadStates[sublessonId];
    const existing = downloadState?.audioUrls || [];

    if (existing.length > 0) return existing;

    // 🆕 หากไม่มี audioUrls (เช่น refresh หน้า) ให้ rebuild จากข้อมูล levels ใน store
    const rebuilt = method.rebuildAudioUrls(sublessonId);
    if (rebuilt.length === 0) return existing;

    // เก็บลง downloadState เพื่อให้ persisted
    method.setSublessonDownloadState(sublessonId, {
      isDownloading: downloadState?.isDownloading ?? false,
      progress: downloadState?.progress ?? 100,
      error: downloadState?.error,
      failedAssets: downloadState?.failedAssets ?? [],
      audioUrls: rebuilt,
    });

    return rebuilt;
  },

  rebuildAudioUrls: (sublessonId: string): AudioUrlInfo[] => {
    const levels = StoreLevel.MethodGet().getLevelsForSublesson(sublessonId);
    if (!levels || levels.length === 0) return [];

    // 🔥 CRITICAL: Safety limit to prevent memory explosion with many lessons
    const MAX_AUDIO_URLS = 5000;
    const audioSet = new Set<string>();
    const collected: AudioUrlInfo[] = [];

    const textFields: (keyof QuestionDetails)[] = [
      'command_text',
      'description_text',
      'hint_text',
      'correct_text',
      'wrong_text',
    ];

    for (const level of levels) {
      // 🔥 Stop early if we hit the limit
      if (collected.length >= MAX_AUDIO_URLS) {
        console.warn(
          `⚠️ Reached MAX_AUDIO_URLS limit (${MAX_AUDIO_URLS}) for sublesson ${sublessonId}`,
        );
        break;
      }

      // Level already has full details including questionList
      if (!level) continue;

      for (const question of level.questionList || []) {
        // text fields
        for (const field of textFields) {
          const translation = question[field] as TextTranslation;
          if (!translation?.translations) continue;

          for (const [langKey, value] of Object.entries(translation.translations)) {
            const speechUrl = (value as any)?.speech_url as string | undefined;
            if (!speechUrl) continue;
            const dedupKey = `${speechUrl}|${langKey}`;
            if (audioSet.has(dedupKey)) continue;
            audioSet.add(dedupKey);
            collected.push({
              url: speechUrl,
              language: langKey,
              field: field,
              questionId: question.id,
              levelId: level.id,
            });

            // 🔥 Check limit after adding
            if (collected.length >= MAX_AUDIO_URLS) break;
          }
          if (collected.length >= MAX_AUDIO_URLS) break;
        }

        // text choices
        if (question.question_type !== 'input' && question?.text_choices?.length > 0) {
          const isTranslationChoice =
            question.text_choices[0].hasOwnProperty('translations');
          if (isTranslationChoice) {
            for (const choice of question.text_choices) {
              const translationChoice = choice as TranslationChoice;
              for (const [langKey, value] of Object.entries(
                translationChoice.translations || {},
              )) {
                const speechUrl = (value as any)?.speech_url as string | undefined;
                if (!speechUrl) continue;
                const dedupKey = `${speechUrl}|${langKey}`;
                if (audioSet.has(dedupKey)) continue;
                audioSet.add(dedupKey);
                collected.push({
                  url: speechUrl,
                  language: langKey,
                  field: 'text_choices',
                  questionId: question.id,
                  levelId: level.id,
                });

                // 🔥 Check limit after adding
                if (collected.length >= MAX_AUDIO_URLS) break;
              }
              if (collected.length >= MAX_AUDIO_URLS) break;
            }
          }
        }
        if (collected.length >= MAX_AUDIO_URLS) break;
      }
    }

    if (collected.length > 0) {
      console.log(
        `🎵 Rebuilt ${collected.length} audio URLs from stored levels for sublesson ${sublessonId}`,
      );
    }

    return collected;
  },

  downloadAudioFiles: async (sublessonId: string, audioUrls?: AudioUrlInfo[]) => {
    const urlsToDownload = audioUrls || method.getAudioUrls(sublessonId);

    if (urlsToDownload.length === 0) {
      console.log(`ℹ️ No audio files to download for sublesson ${sublessonId}`);
      return;
    }

    console.log(
      `🎵 Starting download of ${urlsToDownload.length} audio files for sublesson ${sublessonId}...`,
    );

    const sublesson = store.getState().store[sublessonId];
    const lessonId = sublesson?.lesson_id?.toString() || '';
    const downloadedUrls = method.getDownloadedUrls(lessonId);

    let successCount = 0;
    let failCount = 0;

    // ดาวน์โหลดเสียงทีละไฟล์เพื่อป้องกัน memory overflow บน mobile
    for (const audioInfo of urlsToDownload) {
      // ข้ามไฟล์ที่ดาวน์โหลดแล้ว
      if (downloadedUrls.has(audioInfo.url)) {
        successCount++;
        continue;
      }

      try {
        const query = {
          lessonId: lessonId,
          sublessonId: sublessonId,
          levelId: audioInfo.levelId.toString(),
          questionId: audioInfo.questionId.toString(),
        };

        await retryAsyncOperation(
          () => StoreLessonFile.MethodGet().addItem(audioInfo.url, query),
          3,
          1000,
          shouldRetryError,
        );

        downloadedUrls.add(audioInfo.url);
        successCount++;
      } catch (error) {
        failCount++;
        debugWarn(`⚠️ Failed to download audio: ${audioInfo.url}`, error);
      }

      // delay เล็กน้อยระหว่างไฟล์
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    console.log(
      `🎵 Audio download complete for sublesson ${sublessonId}: ${successCount} success, ${failCount} failed`,
    );
  },
  // 🆕 Update sublesson's updated_at timestamp from API response (for v2 endpoint sync)
  updateSublessonUpdatedAt: (sublessonId: string, newUpdatedAt: Date) => {
    const sublesson = store.getState().store[sublessonId];
    if (sublesson) {
      const isoString = newUpdatedAt.toISOString();
      store.setState((state) => ({
        ...state,
        store: {
          ...state.store,
          [sublessonId]: {
            ...sublesson,
            updated_at: isoString,
          },
        },
      }));
      debugLog(`⏰ Updated sublesson ${sublessonId} timestamp to ${isoString}`);
    } else {
      debugWarn(`⚠️ Sublesson ${sublessonId} not found in store`);
    }
  },
};

// ============ Export ==============
export interface IStoreSublessons {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreSublessons = HelperZustand.StoreExport<
  IStoreSublessons['StateInterface'],
  IStoreSublessons['MethodInterface']
>(store, method);

export default StoreSublessons;
