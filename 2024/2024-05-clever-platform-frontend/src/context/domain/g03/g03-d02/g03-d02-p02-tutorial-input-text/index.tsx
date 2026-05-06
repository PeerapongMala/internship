import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
// import ImageStep5 from './assets/step5.png';
import StoreGame from '@global/store/game';
import { useNavigate } from '@tanstack/react-router';
import Character from './assets/character.svg';
import Image from './assets/image.png';
import SelectButton from './assets/SelectButton.svg';
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
  questionType: 'input',
  questionId: 1,
  questionImage: Image,
  timerType: 'warn',
  timerTime: 30,
  layout: '1:1',
  position: '1',
  patternAnswer: '2-col',
  patternGroup: '2-col',
  answerType: 'text-speech',
  canReuseChoice: false,
  inputType: 'text',
  question: '',
  topic: '',
  hintType: 'none',
  hint: 'asd',
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

    setStepTutorial((prevStep) => prevStep + 1);
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
      topic: `Q1. ${t('question')}`,
      questionList: [
        {
          id: 1,
          index: 1,
          text: 'Susan: "It is very {Ans1} of you."',
          answers: [
            {
              id: 1,
              index: 1,
              type: 'normal',
              answerInput: '',
              text: [
                {
                  id: 1,
                  index: 1,
                  text: 'aaaa',
                  choice_index: 1,
                },
              ],
            },
          ],
          speechUrl: 'a',
        },
      ],
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
        case 9:
          handleSetPositionsStep9();
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

  const handleSetPositionsStep1 = () => {
    setClassNameStep('w-[91%] h-[36rem] top-[6.5rem] left-[5rem]');
    setDescription(t('question_box'));
    setClassNameTextArea('w-full top-[64%] left-[2%]');
    setClassNameAvatar('right-[7%]');
  };

  const handleSetPositionsStep2 = () => {
    setClassNameStep('w-[15rem] h-[4rem] top-[0.3rem] right-[8rem]');
    setDescription(t('countdown_timer'));
    setClassNameTextArea('w-full top-[60%] left-[2%]');
    setClassNameAvatar('right-[7%]');
  };

  const handleSetPositionsStep3 = () => {
    setClassNameStep('w-[5rem] h-[5rem] top-[6.7rem] right-[2rem]');
    setDescription(t('click_use_hint'));
    setClassNameTextArea('w-full top-[60%] left-[2%]');
    setClassNameAvatar('right-[7%]');
  };

  const handleSetPositionsStep4 = () => {
    setClassNameStep('w-[59rem] h-[4rem] top-[0.4rem] right-[7.5rem]');
    setDescription(t('stage_status_bar'));
    setClassNameTextArea('w-[37rem] top-[30%] right-[5%]');
    setClassNameAvatar('right-[7%]');
  };

  const handleSetPositionsStep5 = () => {
    setClassNameStep('w-[91%] h-[5rem] bottom-[8rem] left-[5rem]');
    setDescription(t('dialog_1'));
    setClassNameTextArea('w-full top-[30%] left-[2%]');
    setClassNameAvatar('left-[7%]');
    setClassNameSelected('bottom-[15%] left-[27rem]');
  };

  const handleSetPositionsStep6 = () => {
    const element = document.getElementById('answer_input_0_1');
    if (element) {
      element.click();
    } else {
      console.log('Element with ID "answer_input_0_1" not found.');
    }
    setDescription(t('dialog_2'));
    setClassNameStep('w-[75%] h-[27.5rem] top-[7rem] right-[10rem] z-[51]');
    setClassNameSelected('top-[50%] right-[37%] z-[52]');
    setClassNameTextArea('w-full top-[60%] left-[0%] z-[53]');
    setClassNameAvatar('right-[7%]');
  };

  const handleSetPositionsStep7 = () => {
    const element = document.getElementById('modal_root_close');
    if (element) {
      element.click();
    } else {
      console.log('Element with ID "answer_input_0_1" not found.');
    }
    setDescription(t('click_fight_to_check_answer'));
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

  const handleSetPositionsStep9 = () => {
    //
  };

  const handleSetPositionsStep10 = () => {
    //
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
            outline: '9999rem solid rgba(0, 0, 0, 0.7)',
          }}
          onClick={handleNextStep}
        />
        <img
          src={SelectButton}
          alt="Selected"
          className={cn('absolute w-[4rem] z-40', classNameSelected)}
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
