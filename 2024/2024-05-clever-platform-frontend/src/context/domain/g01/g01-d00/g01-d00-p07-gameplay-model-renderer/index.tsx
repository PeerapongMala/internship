import { GCMainCanvasProvider } from '@component/game/canvas/gc-main-canvas';
import ImageLessonLocal from '@component/web/atom/wc-a-image-lesson-local';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import { LessonEntity, MonsterItemList } from '@domain/g04/g04-d01/local/type';
import ModalCalculator from '@global/component/web/organism/wc-t-modal-calculator';
import { useOnlineStatus } from '@global/helper/online-status';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreLessons from '@store/global/lessons';
import StoreLevel from '@store/global/level';
import StoreGlobalPersist from '@store/global/persist';
import StoreSublessons from '@store/global/sublessons';
import { useNavigate } from '@tanstack/react-router';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import ButtonSoundOn from './component/web/atoms/wc-a-button-sound-on';
import GameplayStatusBar from './component/web/molecules/wc-m-gameplay-statusbar';
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
  AnswerPlaceholderProps,
  AnswerProps,
  GameConfig,
  LevelDetails,
  QuestionDetails,
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

// interface DomainPathParams {
//   levelId: string;
// }

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();

  // const { levelId } = useParams({ strict: false }) as DomainPathParams;
  // const { id: questionId } = useSearch({ strict: false });

  // global store
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  // const { loadingIs } = StoreGlobal.StateGet(['loadingIs']);
  const { userData, userAvatar, userPet, settings } = StoreGlobalPersist.StateGet([
    'userData',
    'userAvatar',
    'userPet',
    'settings',
  ]);

  // lessons and sublessons store
  const { currentSublesson } = StoreSublessons.StateGet(['currentSublesson']);
  const { isReady: lessonStoreIsReady } = StoreLessons.StateGet(['isReady']);
  const { queryId, homeworkId, levels } = StoreLevel.StateGet([
    'queryId',
    'homeworkId',
    'levels',
  ]);

  // page state
  const [currentScore, setCurrentScore] = useState<{
    correct: number;
    wrong: number;
    total: number;
  }>({
    correct: 0,
    wrong: 0,
    total: 10,
  });
  const [currentLesson, setCurrentLesson] = useState<LessonEntity | undefined>();
  const [currentMonster, setCurrentMonster] = useState<MonsterItemList[] | undefined>();
  const [totalTime, setTotalTime] = useState<number>(180); // default 3 minutes
  const [timer, setTimer] = useState<number>(0);
  const [timerType, setTimerType] = useState<GameConfig['timerType']>('warn');
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
  // const [gameConfig, setGameConfig] = useState<GameConfig>({ questionId: -1 });
  const [answerCorrectText, setAnswerCorrectText] =
    useState<GameConfig['answerCorrectText']>('');
  const [answerWrongText, setAnswerWrongText] =
    useState<GameConfig['answerWrongText']>('');
  const [answerIsCorrectText, setAnswerIsCorrectText] = useState<string>('');
  const [answerFromUserText, setAnswerFromUserText] = useState<string>('');

  // group type pairing
  const [selectedGroup, setSelectedGroup] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<AnswerProps>();

  // group type sorting
  const [orderIndex, setOrderIndex] = useState<number[]>([]);

  // question type input
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionListProps>();
  const [selectedAnswerPlaceholder, setSelectedAnswerPlaceholder] =
    useState<AnswerPlaceholderProps>();

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
    console.log('handleCanceled', groupIndex, answerIndex);
    // handleUnSelect(groupIndex, answerIndex, gameConfig, setGameConfig);
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
    setShowInput(false);
  };

  const handleClickNext = useCallback(() => {
    console.log('click next');
    StoreGame.MethodGet().State.Flow.Set(StateFlow.Gameplay);
    // StoreLevel.MethodGet().nextQuestion();
    setIsPaused(false);
    setTimer(0);
    if (currentScore?.total <= currentScore?.correct + currentScore?.wrong) {
      StoreGame.MethodGet().State.Flow.Set(StateFlow.Finish);
    }
  }, [currentScore]);

  const handleClickPlayAgain = useCallback(() => {
    console.log('click play again');
    window.location.reload();
  }, []);

  const handleClickHome = useCallback(() => {
    console.log('click home');
    navigate({
      to: '/main-menu',
    });
  }, []);

  const handleClickPlayAgainWithNoTimer = useCallback(() => {
    console.log('click play again with no timer');
    setShowTimeout(false);
  }, []);

  const handleClickExit = useCallback(() => {
    console.log('click exit');
    location.reload();
  }, []);

  const handleClickRefresh = useCallback(() => {
    console.log('click refresh');
    location.reload();
  }, []);

  const handleClickCalculator = useCallback(() => {
    console.log('click calculator');
    setShowCalculator(true);
  }, []);

  const getMonstersByLevelType = useCallback(() => {
    if (!currentMonster) return [];
    return currentMonster;
  }, [currentMonster]);

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

  const SubmitAnswer = useCallback(() => {
    if (stateFlow === StateFlow.Answer) {
      handleClickNext();
      return;
    }

    // random answer checking
    const shouldCorrect = Math.random() > 0.5; // Randomly set correct or wrong
    let answerCheck: {
      answerIsCorrect: boolean;
      answerIsCorrectText: string;
      answerFromUserText: string;
      answerObject: QuestionSubmitData | undefined;
    } = {
      answerIsCorrect: shouldCorrect,
      answerIsCorrectText: shouldCorrect ? 'correct' : 'wrong',
      answerFromUserText: 'dummy answer',
      answerObject: undefined,
    };

    setAnswerIsCorrectText(answerCheck.answerIsCorrectText);
    setAnswerIsCorrect(answerCheck.answerIsCorrect);
    setAnswerFromUserText(answerCheck.answerFromUserText);

    StoreGame.MethodGet().State.Flow.Set(StateFlow.Answer);
    setIsPaused(true);

    setCurrentScore((prev) => {
      return {
        ...prev,
        correct: prev.correct + (answerCheck.answerIsCorrect ? 1 : 0),
        wrong: prev.wrong + (!answerCheck.answerIsCorrect ? 1 : 0),
      };
    });
  }, [timer, selectedAnswer, stateFlow]);

  useEffect(() => {
    // if (gameState === 'start') {
    // }
    const timerType = 'warn';
    const timerTime = 180; // 3 minutes in seconds

    // if (timerType === 'no') {
    //   setTotalTime(Infinity);
    // } else {
    //   setTotalTime(timerTime);
    // }
    setTotalTime(timerTime);
    setTimerType(timerType);
    setPlayedAt(new Date().toISOString());
    // setGameState('playing');
  }, []);

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
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 w-full h-full"
    >
      <div
        className="w-full h-full relative"
        style={{
          fontFamily: currentLesson?.font_name || 'Noto Sans Thai',
          fontSize: currentLesson?.font_size || '16pt',
        }}
      >
        {isModalActive && <div className="absolute inset-0 bg-black opacity-70 z-10" />}
        <ModalZoomImage setShowModal={setShowImage} showModal={showImage} image={image} />
        <ModalHint showModal={showHint} setShowModal={setShowHint}>
          <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden">
            <div className="flex gap-2 items-center text-2xl font-medium">
              <ButtonSoundOn
                className="w-10 h-10"
                // sound={gameConfig.hintSound ?? ''}
                isPlaying={showHint}
              />
              Hint text
            </div>
            {/* {gameConfig.hintImage && (
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
            )} */}
          </div>
        </ModalHint>
        {/* <MemoizedModalGroup
          showModal={showGroup}
          setShowModal={setShowGroup}
          groupIndex={selectedGroup}
          gameConfig={gameConfig}
          onCanceled={handleCanceled}
        /> */}
        <MemoizedModalInput
          showModal={showInput}
          setShowModal={setShowInput}
          answer={selectedAnswerPlaceholder}
          inputType={'text'}
          onConfirm={handleInputConfirm}
          hintType={'none'}
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
            <div className="flex h-full w-full flex-col pb-6">
              <div className="h-[5.3rem] w-full pl-16 pr-4">
                <GameplayStatusBar
                  totalTime={totalTime}
                  timeLeft={totalTime - timer}
                  onSubmit={SubmitAnswer}
                  levelNumber={'dummy'}
                  correctCount={currentScore?.correct ?? 0}
                  incorrectCount={currentScore?.wrong ?? 0}
                  totalQuestion={currentScore?.total ?? 0}
                  subLessonName={'model renderer'}
                  levelType={'test'}
                  handleClickCalculator={handleClickCalculator}
                  handleClickExit={handleClickExit}
                />
              </div>
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
                <MemoizedPageFinish onClick={handleClickExit} setShowModal={() => {}} />
              )}
            </div>
          </GCMainCanvasProvider>
        </SafezonePanel>
      </div>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
