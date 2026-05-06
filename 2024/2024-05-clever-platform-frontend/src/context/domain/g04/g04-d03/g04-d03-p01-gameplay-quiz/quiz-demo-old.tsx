import ModalCalculator from '@component/web/organism/wc-t-modal-calculator';
import ResponsiveScalerV2 from '@component/web/template/wc-t-responsive-scaler-v2';
import { CharacterResponse, Pet } from '@domain/g03/g03-d04/local/types';
import {
  LessonEntity,
  MonsterItemList,
  SublessonEntity,
} from '@domain/g04/g04-d01/local/type';
import GameplayStatusBar from '@global/component/web/molecule/wc-m-gameplay-statusbar';
import { extractYouTubeVideoId, isYouTubeUrl } from '@global/helper/youtube';
import { getYouTubeDuration } from '@global/hooks/useYouTubeDuration';
import StoreGame from '@global/store/game';
import StoreGlobal from '@store/global';
import { StoreModelFileMethods } from '@store/global/avatar-models';
import { useNavigate } from '@tanstack/react-router';
import { memo, useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Image108 from './assets/image-108.png';
import { handleUnSelect } from './component/web/templates/questions/wc-t-pairing';
import Debug from './component/web/templates/wc-a-debug';
import SafezonePanel from './component/web/templates/wc-a-safezone-panel';
import ModalGroup from './component/web/templates/wc-t-modal-group';
import ModalHint from './component/web/templates/wc-t-modal-hint';
import ModalInput from './component/web/templates/wc-t-modal-input';
import ModalTimeout from './component/web/templates/wc-t-modal-timeout';
import ModalZoomImage from './component/web/templates/wc-t-modal-zoom-image';
import PageAnswer from './component/web/templates/wc-t-page-answer';
import PageGameplay from './component/web/templates/wc-t-page-gameplay';
import ConfigJson from './config/index.json';
import {
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
  QuestionListProps,
  QuestionSubmitData,
  StateFlow,
} from './type';

const MemoizedModalGroup = memo(ModalGroup);
const MemoizedModalInput = memo(ModalInput);
const MemoizedModalCalculator = memo(ModalCalculator);
const MemoizedModalTimeout = memo(ModalTimeout);
const MemoizedPageGameplay = memo(PageGameplay);
const MemoizedPageAnswer = memo(PageAnswer);

const DemoQuiz = ({
  propsGameConfig,
  isTutorial,
}: {
  propsGameConfig?: GameConfig;
  isTutorial?: boolean;
}) => {
  const navigate = useNavigate();

  const { t } = useTranslation([ConfigJson.id]);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const [localGameConfig, setLocalGameConfig] = useState<GameConfig>({
    questionId: -1,
  });
  const [totalTime, setTotalTime] = useState<number>(1);
  const [timer, setTimer] = useState<number>(0);
  const [timerType, setTimerType] = useState<GameConfig['timerType']>();
  const [playedAt, setPlayedAt] = useState<string>('');
  const [answerIsCorrect, setAnswerIsCorrect] = useState<boolean>(true);
  const [showImage, setShowImage] = useState(false);
  const [image, setImage] = useState('');
  const [showHint, setShowHint] = useState(false);
  const [showGroup, setShowGroup] = useState(false);
  const [showInput, setShowInput] = useState(false);
  const [showReason, setShowReason] = useState(false);
  const [showTimeout, setShowTimeout] = useState(false);
  const [gameConfig, setGameConfig] = useState<GameConfig>({
    questionId: -1,
  });
  const [currentLesson, setCurrentLesson] = useState<LessonEntity | undefined>();
  const [currentSublesson, setCurrentSublesson] = useState<SublessonEntity | undefined>();
  const [answerCorrectText, setAnswerCorrectText] =
    useState<GameConfig['answerCorrectText']>('');
  const [answerWrongText, setAnswerWrongText] =
    useState<GameConfig['answerWrongText']>('');
  const [answerIsCorrectText, setAnswerIsCorrectText] = useState<string>('');

  // group type pairing
  const [selectedGroup, setSelectedGroup] = useState<number>(0);

  const [selectedAnswer, setSelectedAnswer] = useState<answerProps>();

  // group type sorting
  const [orderIndex, setOrderIndex] = useState<number[]>([]);

  // question type input
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionListProps>();
  const [selectedAnswerPlaceholder, setSelectedAnswerPlaceholder] =
    useState<AnswerPlaceholderProps>();
  const [showCalculator, setShowCalculator] = useState(false);
  const [showSomeModelIsNotFound, setShowSomeModelIsNotFound] = useState(false);
  const [currentMonster, setCurrentMonster] = useState<MonsterItemList[] | undefined>();
  const [currentEquippedAvatar, setCurrentEquippedAvatar] = useState<CharacterResponse>({
    inventory_id: -1,
    avatar_id: -1,
    is_equipped: true,
    model_id: 'set2_character1_level1',
    level: -1,
    buy: true,
  });
  const [currentEquippedPet, setCurrentEquippedPet] = useState<Pet | null>(null);

  // Learn mode state
  const [learnItems, setLearnItems] = useState<any[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);

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

  const handleClickCalculator = useCallback(() => {
    console.log('click calculator');
    setShowCalculator(true);
  }, []);

  const handleLearnItemClick = useCallback((index: number) => {
    console.log('📝 Learn item clicked:', index, 'current:', currentQuestionIndex);

    // If clicking on locked item (future items), do nothing
    if (index > currentQuestionIndex) {
      console.log('⚠️ Item is locked, cannot navigate');
      return;
    }

    // If clicking on previous item (completed), go back to that item
    if (index < currentQuestionIndex) {
      console.log('⬅️ Going back to completed item', index);
      setCurrentQuestionIndex(index);
      return;
    }

    // If clicking on current item (active), go to next item
    if (index === currentQuestionIndex) {
      const nextIndex = index + 1;
      if (nextIndex < learnItems.length) {
        console.log('➡️ Going to next item', nextIndex);
        setCurrentQuestionIndex(nextIndex);
      }
    }
  }, [currentQuestionIndex, learnItems.length]);

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
              return {
                ...answer,
                answerInput: value,
              };
            }
            return answer;
          }),
        };
      }
      return item;
    });

    setGameConfig({
      ...gameConfig,
      questionList: newQuestionList,
    });
    setShowInput(false);
  };

  const handleClickNext = useCallback(() => {
    console.log('click next');
    StoreGame.MethodGet().State.Flow.Set(StateFlow.Gameplay);
  }, []);

  const handleClickPlayAgain = useCallback(() => {
    console.log('click play again');
    window.location.reload();
  }, []);

  const handleClickHome = useCallback(() => {
    console.log('click home');
    navigate({ to: '/level', viewTransition: true });
  }, []);

  const handleClickPlayAgainWithNoTimer = useCallback(() => {
    console.log('click play again with no timer');
    setShowTimeout(false);
  }, []);

  const getMonstersByLevelType = useCallback(() => {
    if (!currentMonster || !gameConfig) return [];

    const monstersByLevelType = currentMonster.filter((monster) => {
      return monster.level_type === gameConfig?.levelType;
    });

    // console.log('monstersByLevelType: ', monstersByLevelType);

    return monstersByLevelType;
  }, [currentMonster, gameConfig]);

  const SubmitAnswer = useCallback(() => {
    if (stateFlow === StateFlow.Answer) return;

    // Learn mode doesn't need answer validation, just go to next question directly
    if (gameConfig.questionType === 'learn') {
      const nextIndex = currentQuestionIndex + 1;

      console.log('📚 Learn mode: Moving to next question', {
        currentIndex: currentQuestionIndex,
        nextIndex,
        total: learnItems.length
      });

      // Check if there's a next question
      if (nextIndex < learnItems.length) {
        // Move to next question immediately (no answer scene)
        setCurrentQuestionIndex(nextIndex);
        console.log('➡️ Moving to question', nextIndex + 1);
      } else {
        // Last question - just stay on last item
        console.log('🏁 Learn mode: Last question reached');
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
      answerCheck = SubmitOnSorting({ gameConfig, timer, orderIndex });
    } else if (gameConfig.questionType === 'placeholder') {
      answerCheck = SubmitOnPlaceholder({ gameConfig, timer });
    } else if (gameConfig.questionType === 'input') {
      answerCheck = SubmitOnFormInput({ gameConfig, timer });
    }

    setAnswerIsCorrectText(answerCheck.answerIsCorrectText);
    setAnswerIsCorrect(answerCheck.answerIsCorrect);
    console.log('answerCheck', answerCheck);
    StoreGame.MethodGet().State.Flow.Set(StateFlow.Answer);
  }, [gameConfig, timer, selectedAnswer, stateFlow, currentQuestionIndex, learnItems.length]);

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

  useEffect(() => {
    // if (gameState === 'start') {
    // }
    const timerType = gameConfig.timerType;
    const timerTime = gameConfig.timerTime || 1;

    // Learn mode should not have timer
    if (gameConfig.questionType === 'learn' || timerType === 'no') {
      setTotalTime(Infinity);
    } else {
      setTotalTime(timerTime);
    }
    setTimerType(timerType);
    setPlayedAt(new Date().toISOString());
    // setGameState('playing');
  }, [gameConfig.timerTime, gameConfig.timerType, gameConfig.questionType]);

  useEffect(() => {
    function whenTimeOut() {
      setShowTimeout(true);
    }

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev === totalTime) {
          // whenTimeOut();
        }
        return prev + 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [totalTime, timer]);

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

    if (
      localGameConfig.questionType === 'pairing' ||
      localGameConfig.questionType === 'multiple-choices' ||
      localGameConfig.questionType === 'placeholder' ||
      localGameConfig.questionType === 'learn'

    ) {
      const newAnswerList = localGameConfig.answerList
        ?.sort(() => (isTutorial ? 0 : Math.random() - 0.5))
        .map((item, index) => {
          return {
            ...item,
            choice: String.fromCharCode(65 + index),
          };
        });
      newLocalGameConfig = {
        ...localGameConfig,
        answerList: newAnswerList,
      };
    }

    if (localGameConfig.questionType === 'pairing') {
      const newGroupList = localGameConfig.groupList?.map((item, index) => {
        return {
          ...item,
          groupDetails: item?.groupDetails ?? [],
        };
      });
      newLocalGameConfig = {
        ...localGameConfig,
        answerList: newLocalGameConfig.answerList,
        groupList: newGroupList,
      };
    }
    setGameConfig(newLocalGameConfig);
  }, [localGameConfig, isTutorial]);

  useEffect(() => {
    let localGameConfig: GameConfig = JSON.parse(
      localStorage.getItem('game-config') || '{}',
    );
    let currentLesson: LessonEntity | undefined = JSON.parse(
      localStorage.getItem('lesson-data') || '{}',
    );
    let currentMonster: MonsterItemList[] | undefined = JSON.parse(
      localStorage.getItem('monsters-data') || '[]',
    );
    let currentSublesson: SublessonEntity | undefined = JSON.parse(
      localStorage.getItem('sublesson-data') || '{}',
    );

    if (propsGameConfig) {
      setLocalGameConfig(propsGameConfig);
    } else {
      setLocalGameConfig(localGameConfig);
      if (currentLesson && Object.keys(currentLesson).length > 0) {
        setCurrentLesson(currentLesson);
      }
      if (currentMonster && currentMonster.length > 0) {
        setCurrentMonster(currentMonster);
      }
      if (currentSublesson && Object.keys(currentSublesson).length > 0) {
        setCurrentSublesson(currentSublesson);
      }
    }

    const handleMessage = (event: MessageEvent) => {
      try {
        const localStorageData = JSON.parse(event.data);
        for (const key in localStorageData) {
          localStorage.setItem(key, localStorageData[key]);
          if (key === 'game-config') {
            const newConfig: GameConfig = JSON.parse(
              localStorage.getItem('game-config') || '{}',
            );
            setLocalGameConfig(newConfig);
          }
          if (key === 'lesson-data') {
            const newLessonData: LessonEntity = JSON.parse(
              localStorage.getItem('lesson-data') || '{}',
            );
            setCurrentLesson(newLessonData);
            if (newLessonData?.background_image_path) {
              StoreGlobal.MethodGet().imageBackgroundUrlSet(
                newLessonData?.background_image_path || '',
              );
            }
          }
          if (key === 'monsters-data') {
            const newMonstersData: MonsterItemList[] = JSON.parse(
              localStorage.getItem('monsters-data') || '[]',
            );
            setCurrentMonster(newMonstersData);
          }
          if (key === 'sublesson-data') {
            const sublessonData: SublessonEntity = JSON.parse(
              localStorage.getItem('sublesson-data') || '{}',
            );
            setCurrentSublesson(sublessonData);
          }
        }
        console.log('Local storage updated');
      } catch (error) {
        console.error('Error updating local storage:', error);
      }
    };

    window.addEventListener('message', handleMessage);

    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [propsGameConfig]);

  // Create learnItems with duration for learn mode
  useEffect(() => {
    if (gameConfig.questionType === 'learn' && gameConfig.url) {
      const fetchLearnItems = async () => {
        // For demo mode, we'll create a single learn item from the game config
        const items: any[] = [];

        // Try to get YouTube video duration if the URL is a YouTube video
        let duration: string | undefined;
        if (gameConfig.url && isYouTubeUrl(gameConfig.url)) {
          const videoId = extractYouTubeVideoId(gameConfig.url);
          if (videoId) {
            try {
              duration = await getYouTubeDuration(videoId);
            } catch (error) {
              console.error('Failed to get YouTube duration for video:', videoId, error);
              duration = undefined;
            }
          }
        }

        items.push({
          id: gameConfig.questionId || 1,
          title: gameConfig.text || 'Learn Item',
          duration: duration,
          status: 'active',
          type: gameConfig.url ? 'video' : 'article',
        });

        setLearnItems(items);
      };

      fetchLearnItems();
    }
  }, [gameConfig.questionType, gameConfig.url, gameConfig.text, gameConfig.questionId]);

  useEffect(() => {
    const checkModels = async (model_id: string) => {
      const cached = await StoreModelFileMethods.getItem(model_id);
      if (!cached) {
        console.log(`Model ${model_id} not found in cache.`);

        setShowSomeModelIsNotFound(true);
      }
    };

    if (currentEquippedAvatar) {
      checkModels(currentEquippedAvatar.model_id);
    }
    if (currentEquippedPet) {
      checkModels(currentEquippedPet.model_id);
    }
    if (currentMonster) {
      currentMonster.forEach((monster) => {
        checkModels(monster.image_path);
      });
    }
  }, [currentEquippedAvatar, currentEquippedPet, currentMonster]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(StateFlow.Gameplay);

    const header = document.querySelector('header');
    const footer = document.querySelector('footer');

    if (header) header.style.display = 'none';
    if (footer) footer.style.display = 'none';
  }, []);

  const isModalActive =
    showImage || showHint || showGroup || showInput || showTimeout || showCalculator;

  return (
    <div
      className="w-full h-full relative"
      style={{
        fontFamily: currentLesson?.font_name || 'Noto Sans Thai',
        fontSize: currentLesson?.font_size || '16pt',
      }}
    >
      {/* <BackgroudImage /> */}
      {!isTutorial && isModalActive && (
        <div className="absolute inset-0 bg-black opacity-70 z-10" />
      )}
      <ModalZoomImage setShowModal={setShowImage} showModal={showImage} image={image} />
      <ModalHint showModal={showHint} setShowModal={setShowHint}>
        <div className="flex flex-col items-center justify-center h-full w-full overflow-hidden">
          <div className="text-2xl font-medium">{gameConfig.hint}</div>
          {gameConfig.hintImage && (
            <img
              src={gameConfig.hintImage || Image108}
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
      />
      <MemoizedModalTimeout
        showModal={showTimeout}
        setShowModal={setShowTimeout}
        timerType={timerType}
        onClickPlayAgain={handleClickPlayAgain}
        onClickExit={handleClickHome}
        onClickPlayAgainWithNoTimer={handleClickPlayAgainWithNoTimer}
      />
      <MemoizedModalCalculator
        showModal={showCalculator}
        setShowModal={setShowCalculator}
      />
      <SafezonePanel className="flex items-center inset-0" debug={false}>
        <Debug />
        <div className="flex h-full w-full flex-col pl-16 pr-4 pb-6">
          <div className="h-[5.3rem] w-full">
            <GameplayStatusBar
              subLessonName={currentSublesson?.name || ''}
              levelType={gameConfig.levelType}
              levelNumber={gameConfig?.questionId?.toString() || ''}
              totalTime={isTutorial ? 60 : totalTime}
              timeLeft={isTutorial ? 30 : totalTime - timer}
              canSubmit={canSubmitAnswer()}
              onSubmit={SubmitAnswer}
              handleClickExit={() => { }}
              handleClickCalculator={handleClickCalculator}
              gameConfig={gameConfig}
              correctCount={
                gameConfig.questionType === 'learn'
                  ? currentQuestionIndex + 1
                  : undefined
              }
              totalQuestion={
                gameConfig.questionType === 'learn'
                  ? learnItems.length
                  : undefined
              }
              currentQuestionIndex={currentQuestionIndex}
            />
          </div>
          {stateFlow === StateFlow.Gameplay && (
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
              onSubmit={() => {
                if (gameConfig.questionType === 'learn') {
                  handleLearnItemClick(currentQuestionIndex);
                } else {
                  SubmitAnswer();
                }
              }}
            />
          )}

          {stateFlow === StateFlow.Answer && (
            <>
              {showSomeModelIsNotFound && (
                <div className="absolute top-20 left-0 w-full h-full z-10">
                  <div className="flex items-start justify-center h-full">
                    <p className="text-red-500">
                      ตรวจไม่พบโมเดลบางส่วน กรุณาเข้าสู่เกมเพื่อดาวน์โหลด
                    </p>
                  </div>
                </div>
              )}
              <MemoizedPageAnswer
                answerIsCorrect={answerIsCorrect}
                onClick={handleClickNext}
                setShowModal={setShowReason}
                showModal={showReason}
                answerCorrectText={answerCorrectText}
                answerWrongText={answerWrongText}
                answerIsCorrectText={answerIsCorrectText}
                monstersByLevelType={getMonstersByLevelType()}
                currentEquippedAvatar={currentEquippedAvatar}
                currentEquippedPet={currentEquippedPet}
              />
            </>
          )}
        </div>
      </SafezonePanel>
    </div>
  );
};

const DomainJSX = () => {
  return (
    <ResponsiveScalerV2
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 w-full h-full"
      deBugCursorIs={false}
    >
      <DemoQuiz />
    </ResponsiveScalerV2>
  );
};

export default DomainJSX;
export { DemoQuiz };

