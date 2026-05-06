import { TLessonMeta } from '@domain/g01/g01-d04/local/types/lesson-meta';
import {
  LessonEntity,
  MonsterItemList,
  SublessonEntity,
} from '@domain/g04/g04-d01/local/type';
import { debugLog, warnAlways } from '@global/helper/debug-logger';
import { createKeyValStorage } from '@store/storage';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import StoreLessonFile from '../lesson-files';
import StoreLevel from '../level';
import StoreSublessons from '../sublessons';

// ============ State ==============
interface StateInterface {
  store: {
    [lessonId: string]: LessonEntity | undefined;
  };
  lessonMeta: TLessonMeta[];
  monsters: {
    [lessonId: string]: MonsterItemList[] | undefined;
  };
  // Track lessons that are currently being downloaded (incomplete)
  // Now includes timestamp for timeout detection
  downloadingLessons: {
    [lessonId: string]:
      | {
          inProgress: boolean;
          startTime: number; // Unix timestamp in milliseconds
        }
      | undefined;
  };
  // 🆕 Track individual sublessons being downloaded
  downloadingSublessons: {
    [sublessonId: string]:
      | {
          lessonId: string;
          inProgress: boolean;
          startTime: number;
          progress: number; // 0-100
        }
      | undefined;
  };
  isReady: boolean;
  loadingIs: boolean;
}

const storeName = 'lessons';
const store = create(
  persist(
    (): StateInterface => ({
      isReady: false,
      store: {},
      lessonMeta: [],
      monsters: {},
      downloadingLessons: {},
      downloadingSublessons: {},
      loadingIs: false,
    }),
    {
      name: storeName,
      storage: createJSONStorage(() => createKeyValStorage()),
      partialize: (state) => {
        const { isReady, ...partial } = state;
        return partial;
      },
      merge: (persistedState: any, currentState: StateInterface) => {
        // Handle legacy data migration
        const merged = {
          ...currentState,
          ...persistedState,
        };

        // Migrate downloadingLessons from old boolean format to new object format
        if (persistedState?.downloadingLessons) {
          const migrated: StateInterface['downloadingLessons'] = {};

          for (const [lessonId, value] of Object.entries(
            persistedState.downloadingLessons,
          )) {
            if (typeof value === 'boolean') {
              // Old format: boolean -> migrate to new format
              if (value === true) {
                migrated[lessonId] = {
                  inProgress: true,
                  startTime: Date.now(), // Use current time as fallback
                };
                warnAlways(
                  `🔄 Migrated legacy download flag for lesson ${lessonId} from boolean to object format`,
                );
              }
              // If false, don't migrate (treat as not downloading)
            } else if (
              value &&
              typeof value === 'object' &&
              'inProgress' in value &&
              'startTime' in value
            ) {
              // New format: already correct
              migrated[lessonId] = value as { inProgress: boolean; startTime: number };
            }
          }

          merged.downloadingLessons = migrated;
        } else {
          // No downloadingLessons in persisted state -> use empty object
          merged.downloadingLessons = {};
        }

        return merged;
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
  all: () => {
    [lessonId: string]: LessonEntity | undefined;
  };
  get: (lessonId: string) => LessonEntity | undefined;
  exist: (lessonId: string) => boolean;
  add: (lesson: LessonEntity) => void;
  remove: (lessonId: string) => void;

  setLessonMeta: (meta: TLessonMeta[]) => void;
  getLessonMeta: () => TLessonMeta[];
  removeLessonMetaBySubjectId: (subjectId: number) => void;

  addMonsters: (lessonId: string, monsters: MonsterItemList[]) => void;
  getMonsters: (lessonId: string) => MonsterItemList[] | undefined;
  removeMonsters: (lessonId: string) => void;
  setLessonLoading: (loadingIs: boolean) => void;
  isLessonComplete: (lessonId: string) => boolean;
  setDownloadInProgress: (lessonId: string, inProgress: boolean) => void;
  isDownloadInProgress: (lessonId: string) => boolean;
  isLessonDataComplete: (lessonId: string) => boolean;
  cleanupStaleDownloadFlags: () => void;
  // 🆕 Partial download management
  hasAnySublessonDownloaded: (lessonId: string) => boolean;
  getDownloadedSublessonCount: (lessonId: string) => number;
  // 🆕 Sublesson download state management
  setSublessonDownloadInProgress: (
    sublessonId: string,
    lessonId: string,
    inProgress: boolean,
    progress?: number,
  ) => void;
  isSublessonDownloadInProgress: (sublessonId: string) => boolean;
  getSublessonDownloadProgress: (sublessonId: string) => number;
  cleanupStaleSublessonDownloadFlags: () => void;
}

const method: MethodInterface = {
  all: () => {
    return store.getState().store;
  },
  get: (lessonId: string) => {
    const lesson = store.getState().store[lessonId];
    return lesson;
  },
  exist: (lessonId: string) => {
    return store.getState().store[lessonId] !== undefined;
  },
  add: (lesson: LessonEntity) => {
    store.setState((state) => ({
      ...state,
      store: {
        ...state.store,
        [lesson.id]: lesson,
      },
    }));
  },
  remove: (lessonId: string) => {
    const lesson = store.getState().store[lessonId];
    if (lesson) {
      // 1. Remove related sublessons (which will also remove their levels via StoreSublessons.remove())
      const sublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);
      sublessons.forEach((sublesson: SublessonEntity) => {
        StoreSublessons.MethodGet().remove(sublesson.id);
      });
      // 2. Remove any orphan levels that might not have been cleaned up (defensive cleanup)
      StoreLevel.MethodGet().removeLevelsForLesson(lessonId);
      // 3. Remove sublesson assets
      StoreLessonFile.MethodGet().removeAllByLessonId(lessonId);
      // 4. Remove lesson data and download progress flag
      store.setState((state) => {
        delete state.store[lessonId];
        delete state.downloadingLessons[lessonId];
        return { ...state };
      });
      debugLog(`🗑️ Removed lesson ${lessonId} and all related data`);
    }
  },

  setLessonMeta: (meta: TLessonMeta[]) => {
    store.setState({ lessonMeta: meta });
  },
  getLessonMeta: () => {
    return store.getState().lessonMeta;
  },
  removeLessonMetaBySubjectId: (subjectId: number) => {
    store.setState((state) => {
      const updatedMeta = state.lessonMeta.filter((meta) => {
        const shouldKeep = meta.subject_id !== subjectId;
        if (!shouldKeep) {
          console.log(
            `   Removing subject: ${meta.subject_name} (subject_id: ${meta.subject_id})`,
          );
        }
        return shouldKeep;
      });

      return { ...state, lessonMeta: updatedMeta };
    });
  },

  addMonsters: (lessonId: string, monsters: MonsterItemList[]) => {
    store.setState((state) => {
      const existingMonsters = state.monsters[lessonId] || [];
      return {
        ...state,
        monsters: {
          ...state.monsters,
          [lessonId]: [...monsters],
        },
      };
    });
  },
  getMonsters: (lessonId: string) => {
    return store.getState().monsters[lessonId];
  },
  removeMonsters: (lessonId: string) => {
    store.setState((state) => {
      delete state.monsters[lessonId];
      return { ...state };
    });
  },
  setLessonLoading: (loadingIs: boolean) => {
    store.setState(() => ({ loadingIs }));
  },
  setDownloadInProgress: (lessonId: string, inProgress: boolean) => {
    if (inProgress) {
      // Set flag with timestamp
      store.setState((state) => ({
        ...state,
        downloadingLessons: {
          ...state.downloadingLessons,
          [lessonId]: {
            inProgress: true,
            startTime: Date.now(),
          },
        },
      }));
      debugLog(
        `📝 setDownloadInProgress(${lessonId}): true (started at ${new Date().toISOString()})`,
      );
    } else {
      // Clear flag completely
      store.setState((state) => {
        const { [lessonId]: removed, ...rest } = state.downloadingLessons;
        return {
          ...state,
          downloadingLessons: rest,
        };
      });
      debugLog(`📝 setDownloadInProgress(${lessonId}): false (cleared)`);
    }
  },
  isDownloadInProgress: (lessonId: string) => {
    const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
    const status = store.getState().downloadingLessons[lessonId];

    if (!status) return false;

    const now = Date.now();
    const elapsed = now - status.startTime;

    // Check if timeout exceeded
    if (elapsed > TIMEOUT_MS) {
      warnAlways(
        `⚠️ Download flag for lesson ${lessonId} exceeded timeout (${Math.round(elapsed / 60000)} minutes)`,
      );
      // Auto-cleanup will be called elsewhere
      return false;
    }

    return status.inProgress === true;
  },
  cleanupStaleDownloadFlags: () => {
    const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
    const now = Date.now();

    store.setState((state) => {
      const cleaned = { ...state.downloadingLessons };
      let cleanedCount = 0;

      for (const [lessonId, status] of Object.entries(cleaned)) {
        if (status && status.startTime) {
          const elapsed = now - status.startTime;
          if (elapsed > TIMEOUT_MS) {
            delete cleaned[lessonId];
            cleanedCount++;
            debugLog(
              `🧹 Cleaned stale download flag for lesson ${lessonId} (${Math.round(elapsed / 60000)} minutes old)`,
            );
          }
        }
      }

      if (cleanedCount > 0) {
        debugLog(`🧹 Cleaned ${cleanedCount} stale download flag(s)`);
      }

      return { ...state, downloadingLessons: cleaned };
    });
  },
  // Check if lesson data is complete (ignoring download flag)
  isLessonDataComplete: (lessonId: string) => {
    const lesson = store.getState().store[lessonId];
    if (!lesson) {
      debugLog(`🔍 isLessonDataComplete(${lessonId}): lesson not found`);
      return false;
    }

    const sublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);
    if (sublessons.length === 0) {
      debugLog(`🔍 isLessonDataComplete(${lessonId}): no sublessons`);
      return false;
    }

    const result = sublessons.every((sublesson: any) => {
      const levels = StoreLevel.MethodGet().getLevelsForSublesson(sublesson.id);
      // ✅ FIXED: Some levels can be intro/summary without questions
      // Check for total questions instead of requiring ALL levels to have questions
      const hasLevels = levels && levels.length > 0;

      // Count total questions across all levels
      const totalQuestions =
        levels?.reduce((sum, level) => {
          return sum + (level.questionList?.length || 0);
        }, 0) || 0;
      const hasEnoughQuestions = totalQuestions > 0;

      // Check languages object exists and not empty
      const hasLanguages =
        sublesson.languages && Object.keys(sublesson.languages).length > 0;

      if (!hasLanguages) {
        debugLog(
          `🔍 isLessonDataComplete - Sublesson ${sublesson.id}: NO languages object (incomplete)`,
        );
        return false;
      }

      const languageStatuses = Object.values(sublesson.languages);

      // ✅ Check that at least one language is fully downloaded
      // 🆕 RELAXED CHECK: We only check if at least one language is downloaded
      // We don't check if other languages are incomplete - a sublesson is playable
      // as long as one language is fully downloaded, regardless of other languages
      const hasDownloadedAssets = languageStatuses.some(
        (status) => status === 'DOWNLOADED',
      );

      debugLog(`🔍 isLessonDataComplete - Sublesson ${sublesson.id}:`, {
        hasLevels,
        hasEnoughQuestions,
        totalQuestions,
        hasLanguages,
        hasDownloadedAssets,
        languages: sublesson.languages,
        result: hasLevels && hasEnoughQuestions && hasDownloadedAssets,
      });

      return hasLevels && hasEnoughQuestions && hasDownloadedAssets;
    });

    debugLog(`🔍 isLessonDataComplete(${lessonId}): ${result}`);
    return result;
  },
  // Check if lesson is complete (including download flag check)
  isLessonComplete: (lessonId: string) => {
    const lesson = store.getState().store[lessonId];
    if (!lesson) {
      return false;
    }

    // ⚠️ If download is in progress, lesson is NOT complete
    if (method.isDownloadInProgress(lessonId)) {
      return false;
    }

    const sublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);
    if (sublessons.length === 0) {
      return false;
    }

    const result = sublessons.every((sublesson: any) => {
      const levels = StoreLevel.MethodGet().getLevelsForSublesson(sublesson.id);
      // ✅ FIXED: Some levels can be intro/summary without questions
      // Check for total questions instead of requiring ALL levels to have questions
      const hasLevels = levels && levels.length > 0;

      // Count total questions across all levels
      const totalQuestions =
        levels?.reduce((sum, level) => {
          return sum + (level.questionList?.length || 0);
        }, 0) || 0;
      const hasEnoughQuestions = totalQuestions > 0;

      // Check languages object exists and not empty
      const hasLanguages =
        sublesson.languages && Object.keys(sublesson.languages).length > 0;

      if (!hasLanguages) {
        return false;
      }

      const languageStatuses = Object.values(sublesson.languages);

      // ✅ Check that at least one language is fully downloaded
      // 🆕 RELAXED CHECK: We only check if at least one language is downloaded
      // We don't check if other languages are incomplete - a sublesson is playable
      // as long as one language is fully downloaded, regardless of other languages
      const hasDownloadedAssets = languageStatuses.some(
        (status) => status === 'DOWNLOADED',
      );

      return hasLevels && hasEnoughQuestions && hasDownloadedAssets;
    });

    return result;
  },
  // 🆕 Partial download management methods
  hasAnySublessonDownloaded: (lessonId: string): boolean => {
    const sublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);
    if (sublessons.length === 0) return false;

    return sublessons.some((sublesson: any) => {
      return StoreSublessons.MethodGet().isSublessonComplete(sublesson.id);
    });
  },
  getDownloadedSublessonCount: (lessonId: string): number => {
    const sublessons = StoreSublessons.MethodGet().getFromLessonId(lessonId);
    if (sublessons.length === 0) return 0;

    return sublessons.filter((sublesson: any) => {
      return StoreSublessons.MethodGet().isSublessonComplete(sublesson.id);
    }).length;
  },
  // 🆕 Sublesson download state management
  setSublessonDownloadInProgress: (
    sublessonId: string,
    lessonId: string,
    inProgress: boolean,
    progress: number = 0,
  ) => {
    if (inProgress) {
      store.setState((state) => ({
        ...state,
        downloadingSublessons: {
          ...state.downloadingSublessons,
          [sublessonId]: {
            lessonId,
            inProgress: true,
            startTime: Date.now(),
            progress,
          },
        },
      }));
      debugLog(
        `📝 setSublessonDownloadInProgress(${sublessonId}): true (progress: ${progress}%)`,
      );
    } else {
      store.setState((state) => {
        const { [sublessonId]: removed, ...rest } = state.downloadingSublessons;
        return {
          ...state,
          downloadingSublessons: rest,
        };
      });
      debugLog(`📝 setSublessonDownloadInProgress(${sublessonId}): false (cleared)`);
    }
  },
  isSublessonDownloadInProgress: (sublessonId: string): boolean => {
    const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
    const status = store.getState().downloadingSublessons[sublessonId];

    if (!status) return false;

    const now = Date.now();
    const elapsed = now - status.startTime;

    if (elapsed > TIMEOUT_MS) {
      warnAlways(
        `⚠️ Download flag for sublesson ${sublessonId} exceeded timeout (${Math.round(elapsed / 60000)} minutes)`,
      );
      return false;
    }

    return status.inProgress === true;
  },
  getSublessonDownloadProgress: (sublessonId: string): number => {
    const status = store.getState().downloadingSublessons[sublessonId];
    return status?.progress || 0;
  },
  cleanupStaleSublessonDownloadFlags: () => {
    const TIMEOUT_MS = 30 * 60 * 1000; // 30 minutes
    const now = Date.now();

    store.setState((state) => {
      const cleaned = { ...state.downloadingSublessons };
      let cleanedCount = 0;

      for (const [sublessonId, status] of Object.entries(cleaned)) {
        if (status && status.startTime) {
          const elapsed = now - status.startTime;
          if (elapsed > TIMEOUT_MS) {
            delete cleaned[sublessonId];
            cleanedCount++;
            debugLog(
              `🧹 Cleaned stale download flag for sublesson ${sublessonId} (${Math.round(elapsed / 60000)} minutes old)`,
            );
          }
        }
      }

      if (cleanedCount > 0) {
        debugLog(`🧹 Cleaned ${cleanedCount} stale sublesson download flag(s)`);
      }

      return { ...state, downloadingSublessons: cleaned };
    });
  },
};

// ============ Export ==============
export interface IStoreLessons {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreLessons = HelperZustand.StoreExport<
  IStoreLessons['StateInterface'],
  IStoreLessons['MethodInterface']
>(store, method);

export default StoreLessons;
