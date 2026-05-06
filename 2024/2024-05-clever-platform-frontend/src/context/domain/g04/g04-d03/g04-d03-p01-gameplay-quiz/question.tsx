import ImageLessonLocal from '@component/web/atom/wc-a-image-lesson-local';
import { UserData, UserWithPinDataResponse } from '@domain/g02/g02-d01/local/type';
import { SettingsData } from '@domain/g03/g03-d10/g03-d10-p01-setting/type';
import {
  LessonEntity,
  MonsterItemList,
  SublessonEntity,
} from '@domain/g04/g04-d01/local/type';
// import {
//   CreateG04D03LearningGameplaySubmitResult,
//   GetG02D05A29LevelListQuestion,
//   GetG02D05A40LevelGet,
// } from '@domain/g04/g04-d03/local/api/group/academic-level/';
import { GCMainCanvasProvider } from '@component/game/canvas/gc-main-canvas';
import ResponsiveScalerV2 from '@component/web/template/wc-t-responsive-scaler-v2';
import API from '@domain/g04/g04-d03/local/api/index.ts';
import GameplayStatusBar from '@global/component/web/molecule/wc-m-gameplay-statusbar';
import ModalCalculator from '@global/component/web/organism/wc-t-modal-calculator';
import { useOnlineStatus } from '@global/helper/online-status';
import { extractYouTubeVideoId, isYouTubeUrl } from '@global/helper/youtube';
import { getYouTubeDuration } from '@global/hooks/useYouTubeDuration';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreLessons from '@store/global/lessons';
import StoreLevel from '@store/global/level';
import StoreGlobalPersist from '@store/global/persist';
import StoreSublessons from '@store/global/sublessons';
import { SecureStorage } from '@store/storage';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Language, LevelDetails, QueryId, QuestionDetails } from '../local/type';
import Image108 from './assets/image-108.png';
import ButtonSoundOn from './component/web/atoms/wc-a-button-sound-on';
import { handleUnSelect } from './component/web/templates/questions/wc-t-pairing';
import Debug from './component/web/templates/wc-a-debug';
import SafezonePanel from './component/web/templates/wc-a-safezone-panel';
import ModalGroup from './component/web/templates/wc-t-modal-group';
import ModalHint from './component/web/templates/wc-t-modal-hint';
import ModalInput from './component/web/templates/wc-t-modal-input';
import ModalNotFound from './component/web/templates/wc-t-modal-not-found';
import ModalTimeout from './component/web/templates/wc-t-modal-timeout';
import ModalZoomImage from './component/web/templates/wc-t-modal-zoom-image';
import PageAnswer from './component/web/templates/wc-t-page-answer';
import PageFinish from './component/web/templates/wc-t-page-finish';
import PageGameplay from './component/web/templates/wc-t-page-gameplay';
import ConfigJson from './config/index.json';
import {
  calculateStars,
  loadGameConfig,
  SubmitOnFormInput,
  SubmitOnMultipleChoices,
  SubmitOnPairing,
  SubmitOnPlaceholder,
  SubmitOnSorting,
} from './functions';
import {
  AnswerPlaceholderProps,
  answerProps,
  GameConfig,
  LevelSubmitData,
  QuestionListProps,
  QuestionSubmitData,
  StateFlow,
} from './type';

const MemoizedModalGroup = memo(ModalGroup);
const MemoizedModalInput = memo(ModalInput);
const MemoizedModalTimeout = memo(ModalTimeout);
const MemoizedModalNotFound = memo(ModalNotFound);
const MemoizedModalCalculator = memo(ModalCalculator);
const MemoizedPageGameplay = memo(PageGameplay);
const MemoizedPageAnswer = memo(PageAnswer);
const MemoizedPageFinish = memo(PageFinish);
const MemoizedImageLessonLocal = memo(ImageLessonLocal);

interface DomainPathParams {
  levelId: string;
}

const DomainJSX = () => {
  const navigate = useNavigate();
  const isOnline = useOnlineStatus();
  const { levelId } = useParams({ strict: false }) as DomainPathParams;
  const { id: questionId } = useSearch({ strict: false });

  const { t, i18n } = useTranslation([ConfigJson.key]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const { levels }: { levels: { [levelId: string]: LevelDetails | undefined } } =
    StoreLevel.StateGet(['levels']);

  const { queryId } = StoreLevel.StateGet(['queryId']) as { queryId: QueryId };
  const { homeworkId } = StoreLevel.StateGet(['homeworkId']) as { homeworkId: number };
  const { userData } = StoreGlobalPersist.StateGet(['userData']) as {
    userData: UserData;
  };
  const { userAvatar, userPet } = StoreGlobalPersist.StateGet(['userAvatar', 'userPet']);
  const { settings } = StoreGlobalPersist.StateGet(['settings']) as {
    settings: SettingsData;
  };
  const { loadingIs } = StoreGlobal.StateGet(['loadingIs']);
  const { currentSublesson } = StoreSublessons.StateGet(['currentSublesson']) as {
    currentSublesson: SublessonEntity;
  };
  const { isReady: lessonStoreIsReady } = StoreLessons.StateGet(['isReady']);
  const [debugMode] = useState(localStorage.getItem('debugMode') === 'true');

  const [currentLevel, setCurrentLevel] = useState<LevelDetails | undefined>();
  const [currentQuestionList, setCurrentQuestionList] = useState<
    QuestionDetails[] | null
  >(null);
  const [currentQuestion, setCurrentQuestion] = useState<QuestionDetails | undefined>();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [currentScore, setCurrentScore] = useState<{
    correct: number;
    wrong: number;
    total: number;
  }>({
    correct: 0,
    wrong: 0,
    total: 0,
  });
  const [currentLesson, setCurrentLesson] = useState<LessonEntity | undefined>();
  const [currentMonster, setCurrentMonster] = useState<MonsterItemList[] | undefined>();
  const [localGameConfig, setLocalGameConfig] = useState<GameConfig>({ questionId: -1 });
  const [totalTime, setTotalTime] = useState<number>(1);
  const [timer, setTimer] = useState<number>(0);
  const [timerType, setTimerType] = useState<GameConfig['timerType']>();
  const [isPaused, setIsPaused] = useState(false);
  const [playedAt, setPlayedAt] = useState<string>('');
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>(true);
  const [showImage, setShowImage] = useState(false);
  const [image, setImage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [showNotFound, setShowNotFound] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig>({ questionId: -1 });
  const [answerCorrectText, setAnswerCorrectText] =
    useState<GameConfig['answerCorrectText']>('');
  const [answerWrongText, setAnswerWrongText] =
    useState<GameConfig['answerWrongText']>('');
  const [answerIsCorrectText, setAnswerIsCorrectText] = useState<string>('');
  const [answerFromUserText, setAnswerFromUserText] = useState<string>('');

  // Learn mode state
  const [learnItems, setLearnItems] = useState<any[]>([]);

  // group type pairing
  const [selectedGroup, setSelectedGroup] = useState<number>(0);

  const [selectedAnswer, setSelectedAnswer] = useState<answerProps>();

  // group type sorting
  const [orderIndex, setOrderIndex] = useState<number[]>([]);

  // question type input
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionListProps>();
  const [selectedAnswerPlaceholder, setSelectedAnswerPlaceholder] =
    useState<AnswerPlaceholderProps>();

  // const [submitResult, setSubmitResult] = useState<LevelSubmitData>();
  const [submitResultQuestion, setSubmitResultQuestion] = useState<
    LevelSubmitData['questions']
  >([]);

  // const [newConfig, setNewConfig] = useState<GameConfig>({});

  const handleZoom = useCallback((img: string) => {
    setImage(img);
    setShowImage(true);
  }, []);

  const handleHint = useCallback((question: string) => {
    setShowHint(true);
  }, []);

  const handleGroup = useCallback((groupIndex: number) => {
    setShowGroup(true);
    setSelectedGroup(groupIndex);
  }, []);

  const handleCanceled = (groupIndex: number, answerIndex: number) => {
    handleUnSelect(groupIndex, answerIndex, gameConfig, setGameConfig);
  };

  const handleShowInput = useCallback(
    (question: QuestionListProps, answer: AnswerPlaceholderProps) => {
      setShowInput(true);
      setSelectedAnswerPlaceholder(answer);
      setSelectedQuestion(question);
    },
    [],
  );

  const handleInputConfirm = (value: string) => {
    const newQuestionList = gameConfig.questionList?.map((item) => {
      if (item.index === selectedQuestion?.index) {
        return {
          ...item,
          answers: item.answers?.map((answer) => {
            if (answer.index === selectedAnswerPlaceholder?.index) {
              return { ...answer, answerInput: value };
            }
            return answer;
          }),
        };
      }
      return item;
    });

    setGameConfig({ ...gameConfig, questionList: newQuestionList });
    setShowInput(false);
  };

  const handleClickNext = useCallback(() => {
    console.log('click next');
    StoreGame.MethodGet().State.Flow.Set(StateFlow.Gameplay);
    StoreLevel.MethodGet().nextQuestion();
    setIsPaused(false);
    setTimer(0);
    if (currentScore?.total <= currentScore?.correct + currentScore?.wrong) {
      StoreGame.MethodGet().State.Flow.Set(StateFlow.Finish);
      SubmitLevel();
    }
    setSelectedAnswer(undefined);
  }, [currentScore]);

  const handleClickPlayAgain = useCallback(() => {
    console.log('click play again');
    window.location.reload();
  }, []);

  const handleClickHome = useCallback(() => {
    console.log('click home');
    if (!queryId?.lessonId) {
      console.log('Not found: queryId.lessonId');
      navigate({ to: '/main-menu', viewTransition: true });
      return;
    }

    if (homeworkId) {
      navigate({ to: '/homework-level', viewTransition: true });
    } else {
      const subLessonId = queryId.sublessonId;
      navigate({ to: `/level/${subLessonId}`, viewTransition: true });
    }
  }, [queryId, homeworkId]);

  const handleClickPlayAgainWithNoTimer = useCallback(() => {
    console.log('click play again with no timer');
    setShowTimeout(false);
  }, []);

  const handleClickExit = useCallback(() => {
    console.log('click exit');
    if (homeworkId) {
      navigate({ to: '/homework-level', viewTransition: true });
    } else {
      const subLessonId = levels[levelId]?.sub_lesson_id;
      navigate({ to: `/level/${subLessonId}`, viewTransition: true });
    }
  }, []);

  const handleClickRefresh = useCallback(() => {
    console.log('click refresh');
    location.reload();
  }, []);

  const handleClickCalculator = useCallback(() => {
    console.log('click calculator');
    setShowCalculator(true);
  }, []);

  const handleLearnItemClick = useCallback((index: number) => {
    console.log('📝 Learn item clicked:', index, 'current:', currentQuestionIndex);

    if (!currentQuestionList) return;

    // If clicking on locked item (future items), do nothing
    if (index > currentQuestionIndex) {
      console.log('⚠️ Item is locked, cannot navigate');
      return;
    }

    // If clicking on previous item (completed), go back to that item
    if (index < currentQuestionIndex) {
      console.log('⬅️ Going back to completed item', index);
      setCurrentQuestionIndex(index);
      setCurrentQuestion(currentQuestionList[index]);
      return;
    }

    // If clicking on current item (active), go to next item
    if (index === currentQuestionIndex) {
      const nextIndex = index + 1;
      if (nextIndex < currentQuestionList.length) {
        console.log('➡️ Going to next item', nextIndex);
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestion(currentQuestionList[nextIndex]);
      }
    }
  }, [currentQuestionList, currentQuestionIndex]);

  const getMonstersByLevelType = useCallback(() => {
    if (!currentMonster || !currentLevel) return [];

    const monstersByLevelType = currentMonster.filter((monster) => {
      return monster.level_type === currentLevel?.level_type;
    });

    return monstersByLevelType;
  }, [currentMonster, currentLevel]);

  const randomQuestions = (
    level: LevelDetails | undefined,
    count: number,
    questionId?: number,
  ) => {
    if (!level || !level.questionList) return [];

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

    setCurrentScore({
      correct: 0,
      wrong: 0,
      total: totalCount,
    });
    return selectedQuestions;
  };

  const SubmitAnswer = useCallback((currentOrderIndex: number[] = []) => {
    if (stateFlow === StateFlow.Answer) return;

    // Learn mode doesn't need answer validation, just go to next question directly
    if (gameConfig.questionType === 'learn') {
      const nextIndex = currentQuestionIndex + 1;

      console.log('📚 Learn mode: Moving to next question', { currentIndex: currentQuestionIndex, nextIndex, total: currentQuestionList?.length });

      // Check if there's a next question
      if (currentQuestionList && nextIndex < currentQuestionList.length) {
        // Move to next question immediately (no answer scene)
        setCurrentQuestionIndex(nextIndex);
        setCurrentQuestion(currentQuestionList[nextIndex]);
        setTimer(0);
        console.log('➡️ Moving to question', nextIndex + 1);
      } else {
        // Last question - go to finish and submit
        console.log('🏁 Learn mode: Last question, going to Finish');

        // Submit for learn mode
        const userSecure = SecureStorage.getItem('user') as UserWithPinDataResponse;
        const { adminId } = StoreGlobalPersist.StateGetAllWithUnsubscribe();
        const subLessonId = levels[levelId]?.sub_lesson_id;

        // For learn mode, we don't track correct/wrong answers
        const star = 3; // Give full stars for completing learn mode
        const uniqueId = `${userData.id}-${levelId}-${new Date().getTime()}`;
        const submitResult: LevelSubmitData = {
          star: star,
          played_at: playedAt,
          time_used: 0,
          questions: [],
          level_id: parseInt(levelId),
          uniqueId: uniqueId,
        };

        if (homeworkId) {
          submitResult.homework_id = homeworkId;
        }

        console.log('📝 Learn mode submit data:', submitResult);

        async function callSubmitAPI(userSecure: UserWithPinDataResponse) {
          console.log('🚀 Calling submit API...');
          StoreSublessons.MethodGet().setLevelStar(
            subLessonId,
            levelId,
            star,
            0,
            userData.id,
          );

          if (!isOnline) {
            console.log('📴 Offline mode: saving locally');
            StoreLevel.MethodGet().addLevelSubmitResults(
              submitResult,
              userSecure,
              false,
              adminId,
            );
          } else {
            console.log('🌐 Online mode: calling API...');
            const response = await API.Level.CreateG04D03LearningGameplaySubmitResult(
              levelId,
              submitResult,
            );
            console.log('✅ API response:', response);
            if (response.status_code === 200) {
              StoreLevel.MethodGet().addLevelSubmitResults(submitResult, userSecure, true);
            } else {
              StoreLevel.MethodGet().addLevelSubmitResults(
                submitResult,
                userSecure,
                false,
                adminId,
              );
            }
          }
        }

        callSubmitAPI(userSecure);

        // Go to finish page
        StoreGame.MethodGet().State.Flow.Set(StateFlow.Finish);
      }
      return;
    }

    let answerCheck: {
      answerIsCorrect: boolean;
      answerIsCorrectText: string;
      answerFromUserText: string;
      answerObject: QuestionSubmitData | undefined;
    } = {
      answerIsCorrect: false,
      answerIsCorrectText: '',
      answerFromUserText: '',
      answerObject: undefined,
    };

    if (gameConfig.questionType === 'multiple-choices') {
      answerCheck = SubmitOnMultipleChoices({
        gameConfig,
        answer: selectedAnswer,
        timer,
      });
    } else if (gameConfig.questionType === 'pairing') {
      answerCheck = SubmitOnPairing({ gameConfig, timer });
    } else if (gameConfig.questionType === 'sorting') {
      answerCheck = SubmitOnSorting({ gameConfig, timer, orderIndex: currentOrderIndex });
    } else if (gameConfig.questionType === 'placeholder') {
      answerCheck = SubmitOnPlaceholder({ gameConfig, timer });
    } else if (gameConfig.questionType === 'input') {
      answerCheck = SubmitOnFormInput({ gameConfig, timer });
    }

    const newQuestionSubmitData: LevelSubmitData['questions'] = [
      ...(submitResultQuestion || []),
    ];

    if (answerCheck.answerObject) {
      newQuestionSubmitData.push(answerCheck.answerObject);
    }
    setSubmitResultQuestion(newQuestionSubmitData);

    console.log('answerCheck', answerCheck);

    setAnswerIsCorrectText(answerCheck.answerIsCorrectText);
    setAnswerIsCorrect(answerCheck.answerIsCorrect);
    setAnswerFromUserText(answerCheck.answerFromUserText);

    StoreGame.MethodGet().State.Flow.Set(StateFlow.Answer);
    setIsPaused(true);

    const newQuestionList = currentQuestionList?.map((item) => {
      if (item.id === currentQuestion?.id) {
        return {
          ...item,
          isCorrect: answerCheck.answerIsCorrect,
        };
      }
      return item;
    });
    const newCurrentQuestion = newQuestionList?.[currentQuestionIndex + 1];

    setCurrentQuestionIndex((prev) => prev + 1);
    setCurrentQuestion(newCurrentQuestion);
    setCurrentScore((prev) => {
      return {
        ...prev,
        correct: prev.correct + (answerCheck.answerIsCorrect ? 1 : 0),
        wrong: prev.wrong + (!answerCheck.answerIsCorrect ? 1 : 0),
      };
    });
  }, [
    gameConfig,
    timer,
    selectedAnswer,
    stateFlow,
    currentScore,
    currentQuestionIndex,
    currentQuestionList,
    levels,
    levelId,
    userData,
    playedAt,
    homeworkId,
    isOnline,
  ]);

  const canSubmitAnswer = useCallback(() => {
    if (stateFlow !== StateFlow.Gameplay) return false;

    switch (gameConfig.questionType) {
      //  (multiple choices) — ต้องเลือกคำตอบอย่างน้อย 1 ข้อ
      case 'multiple-choices':
        return !!selectedAnswer;
      //  (pairing) — ต้องลากคำตอบไปใส่ในกลุ่มอย่างน้อย 1 คู่
      case 'pairing':
        return gameConfig.groupList?.some(group => group.groupDetails.length > 0);
      //  (sorting) — ต้องเรียงครบทุกตัวเลือก (จำนวนที่เรียง = จำนวนคำตอบทั้งหมด)
      case 'sorting':
        return orderIndex.length > 0 && orderIndex.length === gameConfig.answerList?.length;
      //  (placeholder) — ต้องกรอกช่องว่างอย่างน้อย 1 ช่อง
      case 'placeholder':
        return gameConfig.questionList?.some(q =>
          q.answers?.some(a => a.answerInput?.trim())
        );
      //  (input) —  กรอกอย่างน้อย 1 ช่อง
      case 'input':
        return gameConfig.questionList?.some(q =>
          q.answers?.some(a => a.answerInput?.trim())
        );
      //  (learn) — ไม่ต้องตรวจสอบคำตอบ สามารถกดต่อไปได้เลย
      case 'learn':
        return true;
      default:
        return false;
    }
  }, [stateFlow, gameConfig, selectedAnswer, orderIndex]);

  const SubmitLevel = useCallback(() => {
    const userSecure = SecureStorage.getItem('user') as UserWithPinDataResponse;
    const { adminId } = StoreGlobalPersist.StateGetAllWithUnsubscribe();
    const subLessonId = levels[levelId]?.sub_lesson_id;

    const totalTimeUsed = submitResultQuestion.reduce((acc, item) => {
      return acc + item.time_used;
    }, 0);

    const star = calculateStars(
      currentScore?.correct ?? 0,
      currentQuestionList?.length ?? 0,
    );

    const uniqueId = `${userData.id}-${levelId}-${new Date().getTime()}`;
    const submitResult: LevelSubmitData = {
      star: star,
      played_at: playedAt,
      time_used: totalTimeUsed,
      questions: submitResultQuestion,
      level_id: parseInt(levelId),
      uniqueId: uniqueId,
    };
    if (homeworkId) {
      // is found homework
      submitResult.homework_id = homeworkId;
    }

    async function callSubmitAPI(userSecure: UserWithPinDataResponse) {
      if (submitResultQuestion.length === 0) return;

      StoreSublessons.MethodGet().setLevelStar(
        subLessonId,
        levelId,
        star,
        totalTimeUsed,
        userData.id,
      );

      if (!isOnline) {
        StoreLevel.MethodGet().addLevelSubmitResults(
          submitResult,
          userSecure,
          false,
          adminId,
        );
      } else {
        const response = await SubmitLevelAPI(submitResult);
        if (response.status_code === 200) {
          StoreLevel.MethodGet().addLevelSubmitResults(submitResult, userSecure, true);
        } else {
          StoreLevel.MethodGet().addLevelSubmitResults(
            submitResult,
            userSecure,
            false,
            adminId,
          );
        }
      }
    }

    callSubmitAPI(userSecure);
  }, [submitResultQuestion, currentScore, levels, selectedAnswer, isOnline, userData]);

  const SubmitLevelAPI = async (submitResult: LevelSubmitData) => {
    const response = await API.Level.CreateG04D03LearningGameplaySubmitResult(
      levelId,
      submitResult,
    );

    return response;
  };

  useEffect(() => {
    // if (gameState === 'start') {
    // }
    const timerType = gameConfig.timerType;
    const timerTime = gameConfig.timerTime || 1;

    // Learn mode should not have timer
    if (gameConfig.questionType === 'learn' || timerType === 'no' || !timerType) {
      setTotalTime(Infinity);
    } else {
      setTotalTime(timerTime);
    }
    setTimerType(timerType);
    setPlayedAt(new Date().toISOString());
    // setGameState('playing');
  }, [gameConfig.timerTime, gameConfig.timerType, gameConfig.questionType]);

  useEffect(() => {
    if (isPaused) return; // Don't start interval if paused

    function whenTimeOut() {
      setShowTimeout(true);
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === totalTime && stateFlow === StateFlow.Gameplay) {
          whenTimeOut();
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalTime, timer, isPaused, stateFlow]);

  useEffect(() => {
    if (gameConfig.answerCorrectText) {
      setAnswerCorrectText(gameConfig.answerCorrectText);
    }
    if (gameConfig.answerWrongText) {
      setAnswerWrongText(gameConfig.answerWrongText);
    }
  }, [gameConfig.answerCorrectText, gameConfig.answerWrongText]);

  useEffect(() => {
    let newLocalGameConfig = { ...localGameConfig };

    const shuffleAndAssignChoices = (answerList: answerProps[] | undefined) => {
      if (!answerList) return [];

      // Fisher-Yates shuffle algorithm
      const shuffledList = [...answerList];
      for (let i = shuffledList.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffledList[i], shuffledList[j]] = [shuffledList[j], shuffledList[i]];
      }

      return shuffledList.map((item, index) => {
        return { ...item, choice: String.fromCharCode(65 + index) };
      });
    };

    if (
      localGameConfig.questionType === 'pairing' ||
      localGameConfig.questionType === 'multiple-choices' ||
      localGameConfig.questionType === 'placeholder' ||
      localGameConfig.questionType === 'learn'
    ) {
      const newAnswerList = shuffleAndAssignChoices(localGameConfig.answerList);

      newLocalGameConfig = { ...localGameConfig, answerList: newAnswerList };
    }

    if (localGameConfig.questionType === 'pairing') {
      const newAnswerList = shuffleAndAssignChoices(localGameConfig.answerList);
      const newGroupList = localGameConfig.groupList?.map((item) => {
        return { ...item, groupDetails: [] };
      });
      newLocalGameConfig = {
        ...localGameConfig,
        groupList: newGroupList,
        answerList: newAnswerList,
      };
    }

    // console.log('newLocalGameConfig', newLocalGameConfig);
    StoreGlobal.MethodGet().loadingSet(false);
    setGameConfig(newLocalGameConfig);
  }, [localGameConfig]);

  useEffect(() => {
    if (currentQuestion) {
      const levelLanguage = currentLevel?.language?.language as Language;

      const newGameConfig = loadGameConfig(
        currentQuestion,
        settings.textLanguage as Language,
        settings.soundLanguage as Language,
        levelLanguage as Language,
      );
      console.log({ newGameConfig: newGameConfig });
      StoreGlobal.MethodGet().loadingSet(false);
      setLocalGameConfig(newGameConfig);
    }
    // 🔧 ใช้เฉพาะ settings ที่จำเป็น เพื่อไม่ให้ shuffle ใหม่เมื่อเปิด/ปิดเสียง
  }, [currentQuestion, settings.textLanguage, settings.soundLanguage, currentLevel]);

  useEffect(() => {
    if (currentLevel && currentSublesson) {
      StoreLevel.MethodGet().setQueryId({
        lessonId: currentSublesson.lesson_id.toString(),
        sublessonId: currentSublesson.id.toString(),
        levelId: currentLevel.id.toString(),
        questionId: currentQuestion?.id?.toString() || '',
      });
    }
  }, [currentSublesson, currentLevel, currentQuestion]);

  useEffect(() => {
    if (currentQuestionList !== null) return;
    if (levels[levelId]) {
      setCurrentLevel(levels[levelId]);
    }
    if ((levels[levelId]?.questionList?.length ?? 0) > 0) {
      const count =
        levels[levelId]?.level_type === 'pre-post-test'
          ? levels[levelId]?.questionList?.length
          : levels[levelId]?.level_type === 'sub-lesson-post-test'
            ? 15
            : 3;
      const selectedQuestions = randomQuestions(levels[levelId], count || 3, questionId);
      // console.log('selectedQuestions', selectedQuestions);
      if (selectedQuestions.length > 0) {
        setCurrentQuestionList(selectedQuestions);
        setCurrentQuestion(selectedQuestions[0]);
        setCurrentQuestionIndex(0);
        setShowNotFound(false);
      } else {
        StoreGlobal.MethodGet().loadingSet(false);
        setShowNotFound(true);
        console.log('Not found: questionList is []');
      }
    }
    if (levels[levelId] && !levels[levelId]?.questionList && !homeworkId) {
      setCurrentQuestionList([]);
      console.log('Not found: questionList is null or undefined');
    }
    if (!levels[levelId] && !homeworkId) {
      StoreGlobal.MethodGet().loadingSet(false);
      setShowNotFound(true);
      console.log('Not found: levelId is not found');
    }
  }, [levels, levelId, homeworkId, questionId]);

  useEffect(() => {
    if (homeworkId) {
      StoreGlobal.MethodGet().loadingSet(true);

      async function getLevel() {
        const response = await API.Level.GetG02D05A40LevelGet(levelId);
        if (response.status_code === 200) {
          const data = response.data as unknown as LevelDetails;
          StoreLevel.MethodGet().addLevel(data);
        } else {
          StoreGlobal.MethodGet().loadingSet(false);
          setShowNotFound(true);
        }
      }

      async function getQuestions() {
        const response = await API.Level.GetG02D05A29LevelListQuestion(levelId);
        if (response.status_code === 200) {
          const data = response.data;
          StoreLevel.MethodGet().addQuestionList(levelId, data);
        }
      }

      const getAll = async () => {
        await getLevel();
        await getQuestions();
        StoreGlobal.MethodGet().loadingSet(false);
      };
      getAll();
    }

    StoreLevel.MethodGet().clearSelectedLevel();
  }, [levelId, homeworkId]);

  useEffect(() => {
    console.log('currentQuestionList', currentQuestionList);
    if (currentQuestionList?.length === 0) {
      StoreGlobal.MethodGet().loadingSet(false);
      setShowNotFound(true);
    }
  }, [currentQuestionList]);

  // Create learnItems for learn mode
  useEffect(() => {
    if (currentQuestionList && currentQuestionList.length > 0 &&
      currentQuestionList[0]?.question_type === 'learn') {

      const fetchLearnItems = async () => {
        const items = await Promise.all(
          currentQuestionList.map(async (q, index) => {
            // Get topic from command_text translations
            const topicText = q.command_text?.translations?.[settings.textLanguage as Language]?.text ||
              q.command_text?.translations?.['th']?.text ||
              q.topic ||
              `รายการที่ ${index + 1}`;

            // Try to get YouTube video duration if the URL is a YouTube video
            let duration: string | undefined;
            if (q.url && isYouTubeUrl(q.url)) {
              const videoId = extractYouTubeVideoId(q.url);
              if (videoId) {
                try {
                  duration = await getYouTubeDuration(videoId);
                } catch (error) {
                  console.error('Failed to get YouTube duration for video:', videoId, error);
                  duration = undefined;
                }
              }
            }

            return {
              id: q.id,
              title: topicText,
              duration: duration,
              status: index < currentQuestionIndex ? 'completed' :
                index === currentQuestionIndex ? 'active' : 'locked',
              type: index === currentQuestionList.length - 1 ? 'end' :
                q.url ? 'video' : 'article',
            };
          })
        );
        setLearnItems(items);
      };

      fetchLearnItems();
    }
  }, [currentQuestionList, currentQuestionIndex, settings.textLanguage]);

  useEffect(() => {
    if (lessonStoreIsReady) {
      const lesson = StoreLessons.MethodGet().get(queryId?.lessonId);
      const monsters = StoreLessons.MethodGet().getMonsters(queryId?.lessonId);

      setCurrentLesson(lesson);
      setCurrentMonster(monsters);

      StoreGlobal.MethodGet().imageBackgroundUrlSet(lesson?.background_image_path || '');
    }
  }, [lessonStoreIsReady]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(StateFlow.Gameplay);
    StoreBackgroundMusic.MethodGet().playSound('puzzle_music');

    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
  }, []);

  const isModalActive =
    showImage ||
    showHint ||
    showGroup ||
    showInput ||
    showTimeout ||
    showNotFound ||
    showCalculator;

  return (
    <ResponsiveScalerV2
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 w-full h-full"
    // onScaleChange={(newScale) => {
    //   setScale(newScale);
    // }}
    >
      <div
        className="w-full h-full relative"
        style={{
          fontFamily: currentLesson?.font_name || 'Noto Sans Thai',
          fontSize: currentLesson?.font_size || '16pt',
        }}
      >
        {/* <div className={`absolute inset-0 bg-cover bg-bottom bg-background3`} /> */}
        {/* <BackgroudImage src={currentLesson?.background_image_path} /> */}
        {isModalActive && <div className="absolute inset-0 bg-black opacity-70 z-10" />}
        <ModalZoomImage setShowModal={setShowImage} showModal={showImage} image={image} />
        <ModalHint showModal={showHint} setShowModal={setShowHint}>
          <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden">
            <div className="flex gap-2 items-center text-2xl font-medium">
              <ButtonSoundOn
                className="w-10 h-10"
                sound={gameConfig.hintSound ?? ''}
                isPlaying={showHint}
              />
              {gameConfig.hint}
            </div>
            {gameConfig.hintImage && (
              <MemoizedImageLessonLocal
                alt="hint_image"
                src={gameConfig.hintImage || Image108}
                query={{
                  lessonId: queryId?.lessonId,
                  sublessonId: queryId?.sublessonId,
                  levelId: queryId?.levelId,
                  questionId: queryId?.questionId,
                }}
                className="inline-block my-[6px] max-h-96 pt-[2px]"
              />
            )}
          </div>
        </ModalHint>
        <MemoizedModalGroup
          showModal={showGroup}
          setShowModal={setShowGroup}
          groupIndex={selectedGroup}
          gameConfig={gameConfig}
          onCanceled={handleCanceled}
          handleZoom={handleZoom}
        />
        <MemoizedModalInput
          showModal={showInput}
          setShowModal={setShowInput}
          answer={selectedAnswerPlaceholder}
          inputType={gameConfig.inputType}
          onConfirm={handleInputConfirm}
          hintType={gameConfig.hintType}
        />
        <MemoizedModalTimeout
          showModal={showTimeout}
          setShowModal={setShowTimeout}
          timerType={timerType}
          onClickPlayAgain={handleClickPlayAgain}
          onClickExit={handleClickHome}
          onClickPlayAgainWithNoTimer={handleClickPlayAgainWithNoTimer}
        />
        <MemoizedModalNotFound
          showModal={showNotFound}
          setShowModal={setShowNotFound}
          onClickRefresh={handleClickRefresh}
          onClickExit={handleClickHome}
        />
        <MemoizedModalCalculator
          showModal={showCalculator}
          setShowModal={setShowCalculator}
        />
        <SafezonePanel className="flex items-center inset-0">
          <GCMainCanvasProvider>
            <Debug />
            <div className="flex h-full w-full flex-col pl-16 pr-4 pb-6">
              <div className="h-[5.3rem] w-full">
                <GameplayStatusBar
                  totalTime={totalTime}
                  timeLeft={totalTime - timer}
                  canSubmit={canSubmitAnswer()}
                  onSubmit={() => SubmitAnswer(orderIndex)}
                  levelNumber={
                    currentQuestion?.id ? currentQuestion.id.toString() : undefined
                  }
                  correctCount={
                    gameConfig.questionType === 'learn'
                      ? currentQuestionIndex + 1
                      : currentScore?.correct ?? 0
                  }
                  incorrectCount={currentScore?.wrong ?? 0}
                  totalQuestion={currentScore?.total ?? 0}
                  subLessonName={currentLevel?.sub_lesson_name || ''}
                  levelType={currentLevel?.level_type}
                  handleClickCalculator={handleClickCalculator}
                  handleClickExit={handleClickExit}
                  commandSound={gameConfig.questionSound ?? undefined}
                  gameConfig={gameConfig}
                  currentQuestionIndex={currentQuestionIndex}
                />
              </div>
              {stateFlow === StateFlow.Gameplay && !loadingIs && (
                <MemoizedPageGameplay
                  gameConfig={gameConfig}
                  setGameConfig={setGameConfig}
                  setSelectedAnswer={setSelectedAnswer}
                  setOrderIndex={setOrderIndex}
                  handleZoom={handleZoom}
                  handleHint={handleHint}
                  handleGroup={handleGroup}
                  handleShowInput={handleShowInput}
                  learnItems={learnItems}
                  currentLearnIndex={currentQuestionIndex}
                  onLearnItemClick={handleLearnItemClick}
                  onSubmit={() => SubmitAnswer(orderIndex)}
                />
              )}

              {stateFlow === StateFlow.Answer && (
                <MemoizedPageAnswer
                  answerIsCorrect={answerIsCorrect}
                  onClick={handleClickNext}
                  setShowModal={setShowReason}
                  showModal={showReason}
                  answerCorrectText={answerCorrectText}
                  answerWrongText={answerWrongText}
                  answerIsCorrectText={answerIsCorrectText}
                  answerFromUserText={answerFromUserText}
                  monstersByLevelType={getMonstersByLevelType()}
                  currentEquippedAvatar={userAvatar || null}
                  currentEquippedPet={userPet || null}
                />
              )}

              {stateFlow === StateFlow.Finish && (
                <MemoizedPageFinish onClick={handleClickExit} setShowModal={() => { }} />
              )}
            </div>
          </GCMainCanvasProvider>
        </SafezonePanel>
      </div>
    </ResponsiveScalerV2>
  );
};

export default DomainJSX;
