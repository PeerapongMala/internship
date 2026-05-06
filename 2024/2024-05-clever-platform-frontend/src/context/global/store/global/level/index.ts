import { UserWithPinDataResponse } from '@domain/g02/g02-d01/local/type';
import {
  LevelSubmitData,
  LevelSubmitDataResponse,
  LevelSubmitDataWithLevelId,
} from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import { LevelDetails, QueryId, QuestionDetails } from '@domain/g04/g04-d03/local/type';
import { debugLog } from '@global/helper/debug-logger';
import { createKeyValStorage, SecureStorage } from '@store/storage';
import HelperZustand from 'skillvir-architecture-helper/library/universal-helper/zustand';
import { create, StoreApi, UseBoundStore } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

// ============ State ==============
interface StateInterface {
  levels: { [levelId: string]: LevelDetails | undefined };
  selectedLevelId?: string;
  currentLevel?: LevelDetails;
  currentQuestionList?: QuestionDetails[];
  currentQuestion?: QuestionDetails;
  currentQuestionIndex?: number;
  questionCount?: number;
  currentScore?: { correct: number; wrong: number; total: number };
  levelSubmitResults?: LevelSubmitDataWithLevelId;
  queryId?: QueryId;
  homeworkId?: number;
  inputValue?: string;
}

const initialState: StateInterface = {
  levels: {},
  selectedLevelId: undefined,
  currentLevel: undefined,
  currentQuestionList: undefined,
  currentQuestion: undefined,
  currentQuestionIndex: -1,
  questionCount: 0,
  currentScore: { correct: 0, wrong: 0, total: 0 },
  levelSubmitResults: {},
  queryId: undefined,
  homeworkId: undefined,
  inputValue: undefined,
};

const storeName = 'level';
const store = create<StateInterface, any>(
  persist(() => initialState, {
    name: storeName,
    storage: createJSONStorage(() => createKeyValStorage({})),
    partialize: (state) => {
      // ✅ Persist levels (with questionList) but not game state
      // This allows offline access while keeping memory manageable
      return {
        levels: state.levels, // Persist all levels with questions
        // Don't persist: currentLevel, currentQuestionList, selectedLevelId, etc.
      };
    },
  }),
);

const storeSecure = create<StateInterface, any>(
  persist(() => initialState, {
    name: storeName,
    storage: createJSONStorage(() => SecureStorage),
  }),
);

// ============ Method ==============
interface MethodInterface {
  getLevels: () => { [levelId: string]: LevelDetails | undefined };
  addLevel: (level: LevelDetails) => void;
  addQuestionList: (levelId: string, questionList: QuestionDetails[]) => void;
  getLevel: (levelId: string) => LevelDetails | undefined;
  getQuestionList: (levelId: string) => QuestionDetails[] | undefined;
  // selectedLevel: (levelId: string) => void;
  getCurrentLevel: () => LevelDetails | undefined;
  randomQuestions: (levelId: string, count: number, questionId?: number) => void;
  getCurrentQuestionList: () => QuestionDetails[] | undefined;
  selectedQuestion: (levelId: string, questionId: number) => void;
  nextQuestion: () => void;
  setIsCorrect: (levelId: string, questionId: number, isCorrect: boolean) => void;
  updateSumScore: () => void;
  addLevelSubmitResults: (
    levelSubmitData: LevelSubmitData,
    student: UserWithPinDataResponse,
    isUpload: boolean,
    adminId?: string | null,
  ) => void;
  getLevelSubmitResults: () => LevelSubmitDataWithLevelId | undefined;
  updateLevelSubmitResults: (levelSubmitResults: LevelSubmitDataResponse) => void;
  setQueryId: (queryId: QueryId) => void;
  setHomeworkId: (homeworkId: number | undefined) => void;
  setInputValue: (inputValue: string) => void;
  clearAll: () => void;
  clearSelectedLevel: () => void;
  State: StateInterface;
  hasLevels: (sublessonId: string) => boolean;
  isLevelComplete: (levelId: string) => boolean;
  getLevelsForSublesson: (sublessonId: string) => LevelDetails[];
  removeLevelsForSublesson: (sublessonId: string) => void;
  removeLevelsForLesson: (lessonId: string) => void;
  clearQuestionList: (levelId: string) => void;
  addLevelsBatch: (levels: LevelDetails[]) => void;
}

const method: MethodInterface = {
  getLevels: () => {
    return store.getState().levels;
  },

  addLevel: (level: LevelDetails) => {
    store.setState((state) => ({
      ...state,
      levels: { ...state.levels, [level.id]: level },
    }));
  },
  addQuestionList: (levelId: string, questionList: QuestionDetails[]) => {
    store.setState((state) => {
      const level = state.levels[levelId];
      if (!level) return state;
      // 🔥 FIX: Copy array to prevent external mutations from affecting store
      level.questionList = [...questionList];

      if (!level.questionList) return state;

      const total = level.questionList.length;

      return {
        ...state,
        levels: { ...state.levels, [levelId]: level },
        currentScore: { correct: 0, wrong: 0, total },
      };
    });
  },
  getLevel: (levelId: string) => {
    return store.getState().levels[levelId];
  },
  getQuestionList: (levelId: string) => {
    const level = store.getState().levels[levelId];
    return level?.questionList;
  },
  // selectedLevel: (levelId: string) => {
  //   store.setState((state) => {
  //     const level = state.levels[levelId];
  //     if (!level) return state;
  //     return { ...state, selectedLevelId: levelId, currentLevel: level };
  //   });
  // },
  getCurrentLevel: () => {
    const state = store.getState();
    return state.selectedLevelId ? state.levels[state.selectedLevelId] : undefined;
  },
  randomQuestions: (levelId: string, count: number, questionId?: number) => {
    const level = store.getState().levels[levelId];
    if (!level || !level.questionList) return;

    // Separate the question with the specified questionId
    let prioritizedQuestion: QuestionDetails | undefined;
    const remainingQuestions = level.questionList.filter((q) => {
      if (q.id === questionId) {
        prioritizedQuestion = q;
        return false;
      }
      return true;
    });

    // Shuffle the remaining questions
    const shuffled = remainingQuestions.sort(() => 0.5 - Math.random());

    // Add the prioritized question to the start of the list if it exists
    const selectedQuestions = prioritizedQuestion
      ? [prioritizedQuestion, ...shuffled.slice(0, count - 1)]
      : shuffled.slice(0, count);

    level.questionList = level.questionList.map((q) => {
      return { ...q, isCorrect: undefined };
    });

    const totalCount =
      count > level.questionList.length ? level.questionList.length : count;

    store.setState({
      currentScore: { correct: 0, wrong: 0, total: totalCount },
    });
    return selectedQuestions;
  },
  getCurrentQuestionList: () => {
    return store.getState().currentQuestionList;
  },
  selectedQuestion: (levelId: string, questionId: number) => {
    const level = store.getState().levels[levelId];
    if (!level || !level.questionList) return;

    const question = level.questionList.find((q) => q.id === questionId);
    if (question) {
      store.setState({ currentQuestion: question });
    }
  },
  setIsCorrect: (levelId: string, questionId: number, isCorrect: boolean) => {
    store.setState((state) => {
      const level = state.levels[levelId];
      if (!level || !level.questionList) return state;

      const updatedQuestionList = level.questionList.map((question) => {
        if (question.id === questionId) {
          return { ...question, isCorrect };
        }
        return question;
      });

      return {
        ...state,
        levels: {
          ...state.levels,
          [levelId]: { ...level, questionList: updatedQuestionList },
        },
      };
    });
  },
  updateSumScore: () => {
    store.setState((state) => {
      if (state.currentQuestion === undefined) return state;
      const level = state.levels[state.selectedLevelId || ''];
      if (!level || !level.questionList || !state.questionCount) return state;
      // const total = level.questionList.length;
      const correct = level.questionList.filter((q) => q.isCorrect === true).length;
      const wrong = level.questionList.filter((q) => q.isCorrect === false).length;
      const totalCount =
        state.questionCount > level.questionList.length
          ? level.questionList.length
          : state.questionCount;
      return {
        ...state,
        currentScore: { correct, wrong, total: totalCount },
      };
    });
  },
  nextQuestion: () => {
    store.setState((state) => {
      if (state.currentQuestionIndex === undefined) return state;
      const nextIndex = state.currentQuestionIndex + 1;
      if (state.questionCount === undefined || nextIndex >= state.questionCount)
        return state;

      return {
        ...state,
        currentQuestionIndex: nextIndex,
        currentQuestion: state.currentQuestionList
          ? state.currentQuestionList[nextIndex]
          : undefined,
      };
    });
  },
  addLevelSubmitResults: (
    levelSubmitData: LevelSubmitData,
    student: UserWithPinDataResponse,
    isUpload: boolean = false,
    adminId?: string | null,
  ) => {
    const uniqueId = student.school_code + '_' + student.student_id;
    const newLevelSubmitData = {
      ...levelSubmitData,
      ...(adminId === undefined || adminId === null ? {} : { admin_id: adminId }),
    };

    const existingData =
      storeSecure.getState().levelSubmitResults?.[uniqueId]?.results || [];
    const updatedResults = [...existingData, newLevelSubmitData];

    const newLevelSubmitResults: LevelSubmitDataWithLevelId = {
      ...storeSecure.getState().levelSubmitResults,
      [uniqueId]: {
        results: updatedResults,
        user: student,
        lastestLogin: new Date().toISOString(),
        isUpload: isUpload,
      },
    };

    storeSecure.setState({ levelSubmitResults: newLevelSubmitResults });
  },
  getLevelSubmitResults: () => {
    return storeSecure.getState().levelSubmitResults;
  },
  updateLevelSubmitResults: (levelSubmitResults: LevelSubmitDataResponse) => {
    storeSecure.setState((state) => {
      const newLevelSubmitResults = { ...state.levelSubmitResults };

      for (const key in levelSubmitResults) {
        if (newLevelSubmitResults[key]) {
          for (const result of levelSubmitResults[key].result) {
            if (newLevelSubmitResults[key].results) {
              const index = newLevelSubmitResults[key].results.findIndex(
                (r) => r.uniqueId === result.uniqueId,
              );
              if (index !== -1) {
                newLevelSubmitResults[key].results[index].status = {
                  status_code: result.status_code,
                  message: result.message,
                };
              }
            }
          }
          // if all status 200, then set isUpload to true
          const isUpload = newLevelSubmitResults[key].results?.every((r) => {
            return r.status?.status_code === 200;
          });

          if (isUpload !== undefined) {
            newLevelSubmitResults[key].isUpload = isUpload;
          }
        }
      }

      return { levelSubmitResults: newLevelSubmitResults };
    });
  },
  setQueryId: (queryId: QueryId) => {
    store.setState({ queryId });
  },
  setHomeworkId: (homeworkId: number | undefined) => {
    store.setState({ homeworkId });
  },
  setInputValue: (inputValue: string) => {
    store.setState({ inputValue });
  },
  clearAll: () => {
    store.setState(initialState);
  },
  clearSelectedLevel: () => {
    store.setState((state) => {
      return {
        ...state,
        // selectedLevelId: undefined,
        // currentLevel: undefined,
        // currentQuestionList: undefined,
        // currentQuestion: undefined,
        currentQuestionIndex: -1,
        // questionCount: 0,
        // currentScore: { correct: 0, wrong: 0, total: 0 },
        // levelSubmitResults: [],
      };
    });
  },
  hasLevels: (sublessonId: string) => {
    const levels = store.getState().levels;
    return Object.values(levels).some(
      (level) => level?.sub_lesson_id === Number(sublessonId),
    );
  },
  isLevelComplete: (levelId: string) => {
    const level = store.getState().levels[levelId];
    return !!level && !!level.questionList && level.questionList.length > 0;
  },
  State: {
    levels: store.getState().levels,
    selectedLevelId: store.getState().selectedLevelId,
    currentLevel: store.getState().currentLevel,
    currentQuestionList: store.getState().currentQuestionList,
    currentQuestion: store.getState().currentQuestion,
    currentQuestionIndex: store.getState().currentQuestionIndex,
    questionCount: store.getState().questionCount,
    currentScore: store.getState().currentScore,
    levelSubmitResults: store.getState().levelSubmitResults,
  },
  getLevelsForSublesson: (sublessonId: string): LevelDetails[] => {
    const levels = store.getState().levels;
    return Object.values(levels).filter(
      (level): level is LevelDetails => level?.sub_lesson_id === Number(sublessonId),
    );
  },
  removeLevelsForSublesson: (sublessonId: string) => {
    store.setState((state) => {
      const newLevels = { ...state.levels };
      const sublessonIdNum = Number(sublessonId);
      let removedCount = 0;

      // Find and remove levels for this sublesson
      for (const [levelId, level] of Object.entries(newLevels)) {
        if (level?.sub_lesson_id === sublessonIdNum) {
          delete newLevels[levelId];
          removedCount++;
        }
      }

      debugLog(
        `🗑️ [StoreLevel.removeLevelsForSublesson] Removed ${removedCount} levels for sublesson ${sublessonId}`,
      );

      return { ...state, levels: newLevels };
    });
  },
  removeLevelsForLesson: async (lessonId: string) => {
    const lessonIdNum = Number(lessonId);

    // 🔥 STEP 1: Find level IDs to delete (read-only pass)
    const levelIdsToDelete: string[] = [];
    const currentLevels = store.getState().levels;

    for (const [levelId, level] of Object.entries(currentLevels)) {
      if (level?.lesson_id === lessonIdNum) {
        levelIdsToDelete.push(levelId);
      }
    }

    // Early exit if nothing to delete
    if (levelIdsToDelete.length === 0) {
      console.log(
        `🗑️ [StoreLevel.removeLevelsForLesson] No levels found for lesson ${lessonId}`,
      );
      return;
    }

    console.log(
      `🗑️ [StoreLevel.removeLevelsForLesson] Found ${levelIdsToDelete.length} levels to remove`,
    );
    console.log(`🐌 [StoreLevel] Using MEMORY-SAFE mode with minimal re-renders`);

    // 🔥 MEMORY-SAFE APPROACH:
    // 1. Clear questionLists in small chunks (frees 80% memory)
    // 2. Build new object by filtering (avoids repeated copies)
    // 3. Single setState at the end

    const CLEAR_CHUNK_SIZE = 2; // Clear only 2 at a time (ultra-conservative)
    const DELAY_MS = 200; // Longer delay

    // PHASE 1: Clear questionLists in chunks
    console.log(`🧹 [StoreLevel] Phase 1/2: Clearing questionLists...`);
    for (let i = 0; i < levelIdsToDelete.length; i += CLEAR_CHUNK_SIZE) {
      const chunk = levelIdsToDelete.slice(i, i + CLEAR_CHUNK_SIZE);

      for (const levelId of chunk) {
        const level = currentLevels[levelId];
        if (level?.questionList && level.questionList.length > 0) {
          level.questionList = []; // Mutate in place - no allocation
        }
      }

      if ((i + CLEAR_CHUNK_SIZE) % 50 === 0) {
        console.log(
          `🧹 [StoreLevel] Cleared ${i + CLEAR_CHUNK_SIZE}/${levelIdsToDelete.length} questionLists`,
        );
      }

      // Give GC time
      if (i + CLEAR_CHUNK_SIZE < levelIdsToDelete.length) {
        await new Promise((resolve) => setTimeout(resolve, DELAY_MS));
      }
    }

    console.log(`✅ [StoreLevel] Phase 1/2: QuestionLists cleared`);

    // Extra GC pause after clearing
    await new Promise((resolve) => setTimeout(resolve, 200));

    // PHASE 2: Build new levels object ONE-BY-ONE (EXTREME MODE!)
    // Problem: Object.keys() creates array of 500 items → spike!
    // Solution: Process ONE level at a time with delay
    console.log(`🗑️ [StoreLevel] Phase 2/2: Building new levels object ONE-BY-ONE...`);
    console.log(`🐢 [StoreLevel] EXTREME SLOW MODE - this will take 1-2 minutes!`);

    const deleteSet = new Set(levelIdsToDelete);
    const newLevels: { [levelId: string]: LevelDetails | undefined } = {};
    let kept = 0;
    let processed = 0;

    // Process ONE level at a time via Object.entries iterator
    const entries = Object.entries(currentLevels);
    const totalLevels = entries.length;

    for (const [levelId, level] of entries) {
      if (!deleteSet.has(levelId)) {
        newLevels[levelId] = level;
        kept++;
      }
      processed++;

      // Log progress every 25 levels
      if (processed % 25 === 0) {
        console.log(
          `📋 [StoreLevel] Processed ${processed}/${totalLevels} levels (${Math.round((processed / totalLevels) * 100)}%) - Keeping ${kept} so far`,
        );
      }

      // CRITICAL: Delay EVERY 3 levels to prevent spike!
      if (processed % 3 === 0 && processed < totalLevels) {
        await new Promise((resolve) => setTimeout(resolve, 150)); // 150ms every 3 levels!
      }
    }

    console.log(
      `📊 [StoreLevel] Keeping ${kept} levels, removing ${levelIdsToDelete.length}`,
    );

    // CRITICAL: Extra long GC pause before setState
    console.log(`⏳ [StoreLevel] Extra long GC pause before final save...`);
    await new Promise((resolve) => setTimeout(resolve, 500)); // 500ms pause!

    // Single setState - triggers one re-render and one persist
    console.log(`💾 [StoreLevel] Saving to store...`);
    store.setState((state) => {
      return { ...state, levels: newLevels };
    });

    console.log(
      `✅ [StoreLevel.removeLevelsForLesson] Successfully removed ${levelIdsToDelete.length} levels`,
    );
  },
  clearQuestionList: (levelId: string) => {
    store.setState((state) => {
      const level = state.levels[levelId];
      if (!level) return state;

      // Clear questionList to free memory
      const updatedLevel = { ...level, questionList: [] };

      debugLog(
        `🧹 [StoreLevel.clearQuestionList] Cleared questionList for level ${levelId} (had ${level.questionList?.length || 0} questions)`,
      );

      return {
        ...state,
        levels: {
          ...state.levels,
          [levelId]: updatedLevel,
        },
      };
    });
  },
  addLevelsBatch: (levels: LevelDetails[]) => {
    store.setState((state) => {
      const newLevels = { ...state.levels };

      // Add all levels with their questionLists in one setState call
      for (const level of levels) {
        // 🔥 CRITICAL: Copy questionList to prevent external mutations
        // questionList should already exist in level (mapped from questions)
        const levelWithQuestions = {
          ...level,
          questionList: level.questionList ? [...level.questionList] : [],
        };
        newLevels[level.id] = levelWithQuestions;
      }

      const totalQuestions = levels.reduce(
        (sum, l) => sum + (l.questionList?.length || 0),
        0,
      );
      debugLog(
        `📦 [StoreLevel.addLevelsBatch] Added ${levels.length} levels with ${totalQuestions} total questions in one batch`,
      );

      return {
        ...state,
        levels: newLevels,
      };
    });
  },
};

// ============ Export ==============
export interface IStoreLevel {
  StateInterface: StateInterface;
  MethodInterface: MethodInterface;
}

const StoreLevel: {
  StateGet: (stateList: string[], shallowIs?: boolean) => IStoreLevel['StateInterface'];
  StateSet: (prop: Partial<IStoreLevel['StateInterface']>) => void;
  StateGetAllWithUnsubscribe: () => IStoreLevel['StateInterface'];
  MethodGet: () => IStoreLevel['MethodInterface'];
  StoreGet: () => UseBoundStore<StoreApi<IStoreLevel['StateInterface']>>;
} = HelperZustand.StoreExport<
  IStoreLevel['StateInterface'],
  IStoreLevel['MethodInterface']
>(store, method);

export default StoreLevel;
