import './index.module.css';

import StoreGame from '@global/store/game';
import { useNavigate } from '@tanstack/react-router';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import Character from './assets/character.svg';
import CharacterSortQuestion from './assets/charaterQuestion.png';
import SelectButton from './assets/SelectButton.svg';
import ImageStep5 from './assets/step5.png';
import ConfigJson from './config/index.json';
// import styles from './index.module.css';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import { DemoQuiz } from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/quiz-demo-old';
import { GameConfig } from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import { cn } from '@global/helper/cn';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreSubjects from '@store/global/subjects';

enum STATEFLOW {
  Input = 0,
  Success = 1,
  Fail = 2,
}

const gameConfigDefault: GameConfig = {
  questionType: 'sorting',
  questionId: 1,
  questionList: [
    {
      id: 1,
      index: 1,
      text: '',
      answers: [],
    },
  ],
  questionImage: CharacterSortQuestion,
  timerType: 'warn',
  timerTime: 30,
  layout: '1:1',
  position: '2',
  patternAnswer: '1-row',
  patternGroup: '2-col',
  answerType: 'text-speech',
  canReuseChoice: true,
  inputType: 'text',
  question: '',
  topic: '',
  hintType: 'none',
  hint: 'asd',
  answerList: [
    {
      id: 1,
      index: 1,
      answer: 'boy',
    },
    {
      id: 2,
      index: 2,
      answer: 'a',
    },
    {
      id: 3,
      index: 3,
      answer: 'milk',
    },
    {
      id: 4,
      index: 4,
      answer: 'everyday',
    },
    {
      id: 5,
      index: 5,
      answer: 'drinks',
    },
  ],
  groupList: [],
};

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [stepTutorial, setStepTutorial] = useState(0);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const [autoProgress, setAutoProgress] = useState(true);
  const [classNameStep, setClassNameStep] = useState('hidden');
  const [classNameTextArea, setClassNameTextArea] = useState('hidden');
  const [classNameAvatar, setClassNameAvatar] = useState('');
  const [classNameSelected, setClassNameSelected] = useState('hidden');
  const [description, setDescription] = useState('');
  const [gameConfig, setGameConfig] = useState<GameConfig>(gameConfigDefault);

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const navigate = useNavigate();

  const handleNextStep = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (stepTutorial < 8) {
      setStepTutorial((prevStep) => prevStep + 1);
    } else {
      setStepTutorial(8);
      setAutoProgress(false); // Stop auto-progression
    }
  };

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  useEffect(() => {
    setGameConfig((prevConfig) => ({
      ...prevConfig,
      topic: `Q1. ${t('tutorial_sort_question_body')}`,
    }));
    handleResetPositions(); // Set initial positions when the component mounts
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []);

  useEffect(() => {
    if (autoProgress) {
      // Only run the switch and timeout if autoProgress is true
      switch (stepTutorial) {
        case 1:
          handleSetPositionsStep1();
          break;
        case 2:
          handleSetPositionsStep2();
          break;
        case 3:
          handleSetPositionsStep3();
          break;
        case 4:
          handleSetPositionsStep4();
          break;
        case 5:
          handleSetPositionsStep5();
          break;
        case 6:
          handleSetPositionsStep6();
          break;
        case 7:
          handleSetPositionsStep7();
          break;
        case 8:
          handleSetPositionsStep8();
          break;
        default: // Includes case 0
          handleResetPositions();
      }

      // Clear previous timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }

      if (stepTutorial < 1) {
        timeoutRef.current = setTimeout(() => {
          setStepTutorial((prevStep) => prevStep + 1);
          // }, 3000);
        }, 100);
      }
    }
  }, [stepTutorial, autoProgress]); // Add autoProgress to the dependency array

  useEffect(() => {
    if (stepTutorial == 8) {
      // setHighlight('hidden');
    }
  }, [stepTutorial]);

  const handleSetPositionsStep1 = () => {
    setClassNameStep('w-[36rem] h-[25rem] top-[6.5rem] left-[5rem]');
    setDescription(t('question_box'));
    setClassNameTextArea('w-full top-[60%] left-[0%]');
    setClassNameAvatar('right-[7%]');
  };

  const handleSetPositionsStep2 = () => {
    setClassNameStep('w-[15rem] h-[4rem] top-[0.3rem] right-[8rem]');
    setDescription(t('countdown_timer'));
    setClassNameTextArea('w-full top-[60%] left-[0%]');
    setClassNameAvatar('right-[7%]');
  };

  const handleSetPositionsStep3 = () => {
    setClassNameStep('w-[5rem] h-[5rem] top-[6.7rem] left-[35.5rem]');
    setDescription(t('click_use_hint'));
    setClassNameTextArea('w-full top-[60%] left-[0%]');
    setClassNameAvatar('right-[7%]');
  };

  const handleSetPositionsStep4 = () => {
    setClassNameStep('w-[59rem] h-[4rem] top-[0.4rem] right-[7.5rem]');
    setDescription(t('stage_status_bar'));
    setClassNameTextArea('w-[37rem] top-[30%] right-[5%]');
    setClassNameAvatar('right-[7%]');
  };

  const handleSetPositionsStep5 = () => {
    setClassNameStep('w-[35.5rem] h-[27.5rem] top-[6.4rem] right-[2rem]');
    setDescription(t('drag_n_drop_to_answer_box'));
    setClassNameTextArea('w-[50%] top-[30%] left-[3%]');
    setClassNameAvatar('left-[35%]');
    setClassNameSelected('top-[80%] right-[20rem]');
  };

  const handleSetPositionsStep6 = () => {
    // set 2 selected
    setGameConfig((prevConfig) => ({
      ...prevConfig,
      itemsInDrop: [
        {
          id: 0,
          index: 2,
          answer: 'a',
          chosen: false,
          selected: false,
        },
        {
          id: 1,
          index: 1,
          answer: 'boy',
          chosen: false,
          selected: false,
        },
        {
          id: 2,
          index: 5,
          answer: 'drinks',
          chosen: false,
          selected: false,
        },
      ],
    }));
    setClassNameSelected('');
  };

  const handleSetPositionsStep7 = () => {
    setClassNameStep('w-[5.5rem] h-[5.5rem] top-[0.2rem] right-[1.5rem]');
    setDescription(t('click_fight_to_check_answer'));
    setClassNameTextArea('w-[37rem] top-[60%] left-[0%]');
    setClassNameAvatar('left-[7%]');
    setClassNameSelected('hidden');
  };

  const handleSetPositionsStep8 = () => {
    navigate({
      to: '/main-menu/tutorial/',
    });
  };

  const handleResetPositions = () => { };

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Input);
  }, []); // Make sure to provide an appropriate dependency array

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 overflow-hidden"
    >
      <SafezonePanel
        // debug
        className="absolute inset-0 text-black z-10"
        style={{
          fontSize: '1.5rem',
        }}
      >
        <div
          className={cn(
            'absolute z-40 cursor-pointer transition-all duration-300',
            classNameStep,
          )}
          style={{
            outline: stepTutorial == 5 ? '' : '9999rem solid rgba(0, 0, 0, 0.7)',
          }}
          onClick={handleNextStep}
        />

        {stepTutorial == 5 && (
          <>
            <img
              src={ImageStep5}
              alt="Selected"
              className={cn('absolute w-full h-full z-30')}
              style={{
                outline: '9999rem solid rgba(0, 0, 0, 0.7)',
              }}
            />
            <div
              className={cn(
                'absolute z-40 cursor-pointer transition-all duration-300',
                'w-[90%] h-[5.5rem] bottom-[13%] right-[2rem]',
              )}
              style={{
                outline: stepTutorial == 5 ? '' : '9999rem solid rgba(0, 0, 0, 0.7)',
              }}
              onClick={handleNextStep}
            />
          </>
        )}

        <img
          src={SelectButton}
          alt="Selected"
          className={cn(
            'absolute top-[18rem] right-[2%] w-[4rem] z-40',
            classNameSelected,
          )}
        />
        <div className='absolute w-full h-full overflow-hidden'>
          <DemoQuiz propsGameConfig={gameConfig} isTutorial />
        </div>
        <div className={`absolute w-full h-full overflow-hidden`}>
          <div
            className={cn(
              `absolute h-[40%] z-50 transition-all duration-300`,
              classNameTextArea,
            )}
          >
            <img
              src={Character}
              alt="Character"
              width="200px"
              height="170px"
              className={cn(`absolute`, classNameAvatar)}
            />
            <div
              className="absolute w-[90%] h-[30%] left-[5%] bottom-[25%] bg-white rounded-[25px] p-2 cursor-pointer"
              onClick={handleNextStep}
            >
              <div className="bg-[#d7d8d6] rounded-[25px] w-full h-full flex justify-center items-center font-[Noto Sans Thai] font-[300] text-[28px] text-[#333333]">
                {description}
              </div>
            </div>
          </div>
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
