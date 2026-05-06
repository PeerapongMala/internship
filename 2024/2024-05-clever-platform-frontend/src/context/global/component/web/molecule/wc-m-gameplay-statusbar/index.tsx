import AutoScroll from '@component/web/atom/wc-a-auto-scroll';
import ButtonBack from '@component/web/atom/wc-a-button-back';
import ConfigJson from '@domain/g03/g03-d02/g03-d02-p02-tutorial-multichoice/config/index.json';
import {
  GameConfig,
  LevelTypeEnum,
  StateFlow,
} from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import ImageIconCalculator from '@global/assets/icon-calculator.svg';
import ImageIconEdit from '@global/assets/icon-edit.svg';
import ImageIconHelp from '@global/assets/icon-help.svg';
import ImageIconSoundOff from '@global/assets/icon-sound-off-white.svg';
import ImageIconSoundOn from '@global/assets/icon-sound-on-white.svg';
import Button from '@global/component/web/atom/wc-a-button';
import IconGamplayCorrect from '@global/component/web/atom/wc-a-gameplay-correct';
import GameplayTimer from '@global/component/web/atom/wc-a-gameplay-timer';
import { useLessonLocal } from '@global/helper/lesson-local-file';
import { createSoundController, SoundController } from '@global/helper/sound';
import StoreGame from '@store/game';
import StoreGlobal from '@store/global';
import StoreLevel from '@store/global/level';
import StoreGlobalPersist from '@store/global/persist';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ImageIconSetting from '../../../../assets/icon-setting.svg';
import ImageIconSword from '../../../../assets/icon-sword.png';
import './auto-scroll-animation.css';

import ImageIconArrowLeft from '@global/assets/icon-arrow-left.svg';


const GameplayStatusBar = ({
  totalTime = 60,
  timeLeft = 30,
  canSubmit = false,
  onSubmit,
  levelNumber = '004',
  subLessonName = '1-1) การอ่านจำนวนนับ',
  correctCount = 2,
  incorrectCount = 2,
  totalQuestion = 4,
  levelType = 'test',
  handleClickCalculator,
  handleClickExit,
  commandSound,
  gameConfig,
  currentQuestionIndex,
}: {
  totalTime?: number;
  timeLeft?: number;
  canSubmit?: boolean;
  onSubmit?: () => void;
  levelNumber?: string;
  subLessonName?: string;
  correctCount?: number;
  incorrectCount?: number;
  totalQuestion?: number;
  levelType?: GameConfig['levelType'];
  handleClickCalculator?: () => void;
  handleClickExit?: () => void;
  commandSound?: string;
  gameConfig?: GameConfig;
  currentQuestionIndex?: number;
}) => {
  const refHelp = useRef<HTMLDivElement>(null);
  const refSetting = useRef<HTMLDivElement>(null);
  const commandAudioRef = useRef<HTMLAudioElement | null>(null);
  const fallbackSoundRef = useRef<SoundController | null>(null);
  const { t } = useTranslation([ConfigJson.key]);
  const { settings } = StoreGlobalPersist.StateGet(['settings']);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const { queryId } = StoreLevel.StateGet(['queryId']);
  const [soundOn, setSoundOn] = useState<boolean | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showSetting, setShowSetting] = useState<boolean>(false);

  // 🆕 ดึง URL ของ command sound จาก local storage
  const commandSoundUrl = useLessonLocal({
    query: queryId,
    src: commandSound || '',
  });

  // 🆕 สร้าง audio element สำหรับ command sound
  useEffect(() => {
    if (commandSoundUrl) {
      commandAudioRef.current = new Audio(commandSoundUrl);
    }
  }, [commandSoundUrl]);

  // 🆕 สร้าง fallback sfx
  useEffect(() => {
    fallbackSoundRef.current = createSoundController('button_click', {
      loop: false,
      volume: 'sfx',
    });
    return () => {
      fallbackSoundRef.current?.destory();
    };
  }, []);

  const handleClickCanvas = useCallback(() => {
    setShowHelp?.(false);
    StoreGlobal.MethodGet().activeCanvasSet(true);
  }, []);

  useEffect(() => {
    setSoundOn(!!(settings.enableBackgroundMusic || settings.enableSFXMusic));
  }, [settings.enableBackgroundMusic, settings.enableSFXMusic]);

  const handleClickSound = useCallback(() => {
    const newSoundState = !soundOn;
    setSoundOn(newSoundState);

    StoreGlobalPersist.MethodGet().updateSettings({
      enableBackgroundMusic: newSoundState,
      enableSFXMusic: newSoundState,
    });

    // 🆕 เมื่อเปิดเสียง (จาก off → on) ให้เล่นเสียงคำสั่งหรือ fallback sfx
    if (newSoundState) {
      if (commandAudioRef.current) {
        console.log('🔊 Sound enabled, playing command audio...');
        commandAudioRef.current.currentTime = 0;
        commandAudioRef.current.play().catch((e) => {
          console.warn('⚠️ Failed to play command audio:', e);
          fallbackSoundRef.current?.play();
        });
      } else {
        console.log('🔊 Sound enabled, playing fallback sfx...');
        fallbackSoundRef.current?.play();
      }
    }
  }, [soundOn]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (refHelp.current && !refHelp.current.contains(event.target as Node)) {
        setShowHelp(false);
      }
      if (refSetting.current && !refSetting.current.contains(event.target as Node)) {
        setShowSetting(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    // setIsSubmitting(true);
    try {
      onSubmit?.();
    } finally {
      // setTimeout(() => setIsSubmitting(false), 1500);
    }
  }, [onSubmit, isSubmitting]);

  useEffect(() => {
    if (stateFlow === StateFlow.Answer) {
      setIsSubmitting(true);
    } else if (stateFlow === StateFlow.Gameplay) {
      setIsSubmitting(false);
    }
  }, [stateFlow]);

  return (
    <div className="flex h-full gap-4 pt-2 pb-3">
      <div className="w-16 h-full relative">
        <Button
          width="64px"
          height="64px"
          variant="white"
          className="pt-1"
          onClick={() => {
            setShowSetting(!showSetting);
            setShowHelp(false);
          }}
        >
          <img src={ImageIconSetting} alt="setting" width="40" height="40" />
        </Button>
        {showSetting && (
          <div
            className="absolute top-[4.5rem] left-0 w-16 h-[123px] bg-gray-300 border-4 border-white p-[5px] rounded-full z-50"
            ref={refSetting}
          >
            <ButtonBack
              className="w-[46px] h-[46px]"
              buttonClassName="p-2"
              onClick={handleClickExit}
            />
            <Button
              width="46px"
              height="46px"
              variant={soundOn ? 'tertiary' : 'danger'}
              className="mt-2"
              onClick={handleClickSound}
            >
              <img
                src={soundOn ? ImageIconSoundOn : ImageIconSoundOff}
                alt="sound toggle"
                width="26"
                height="26"
              />
            </Button>
          </div>
        )}
      </div>
      <div className="w-16 h-full relative">
        <Button
          width="64px"
          height="64px"
          variant="white"
          className="pt-1"
          onClick={() => {
            setShowHelp(!showHelp);
            setShowSetting(false);
          }}
        >
          <img src={ImageIconHelp} alt="help" width="40" height="40" />
        </Button>
        {showHelp && (
          <div
            className="absolute top-[4.5rem] left-0 w-16 h-[123px] bg-gray-300 border-4 border-white p-[5px] rounded-full z-50"
            ref={refHelp}
          >
            <Button
              width="46px"
              height="46px"
              variant="tertiary"
              onClick={handleClickCalculator}
            >
              <img src={ImageIconCalculator} alt="calculator" width="26" height="26" />
            </Button>
            <Button
              width="46px"
              height="46px"
              variant="tertiary"
              className="mt-2"
              onClick={handleClickCanvas}
            >
              <img src={ImageIconEdit} alt="edit" width="26" height="26" />
            </Button>
          </div>
        )}
      </div>

      {/* ข้อความบทเรียน + ประเภท */}
      <div className="flex-1 min-w-0">
        <div className="flex justify-between items-center w-full h-full bg-white/60 border-2 border-white rounded-3xl p-4 font-bold relative overflow-hidden">
          <AutoScroll>
            <div className="text-xl text-nowrap mr-4 truncate">{subLessonName}</div>

            <div
              className={` text-xl border-2 border-white py-0.5 px-3 rounded-full text-nowrap whitespace-nowrap
            ${levelType === 'test' ? 'bg-secondary' : ''}
            ${levelType === 'sub-lesson-post-test' ? 'bg-danger' : ''}
            ${levelType === 'pre-post-test' ? 'bg-success' : ''}
            ${levelType === 'pre-test' ? 'bg-success' : ''}
            ${levelType === 'post-test' ? 'bg-danger' : ''}

          `}
            >
              {t(LevelTypeEnum[levelType])}
            </div>
          </AutoScroll>
        </div>
      </div>

      {/* ส่วนคะแนน / เวลา */}
      <div className="flex-shrink-0 w-auto">
        <div className="flex h-full">
          <div
            className={`flex items-center justify-between gap-5 bg-white/60 border-2 border-white py-4 px-4 font-bold text-xl whitespace-nowrap ${gameConfig?.questionType === 'learn' ? 'rounded-3xl' : 'rounded-l-3xl'
              }`}
          >            <span>
              {t('stage')}: {levelNumber}
            </span>
            <IconGamplayCorrect count={correctCount} total={totalQuestion} type="correct" />
            {gameConfig && gameConfig.questionType !== 'learn' && (
              <IconGamplayCorrect
                count={incorrectCount}
                total={totalQuestion}
                type="incorrect"
              />
            )}
          </div>
          {gameConfig && gameConfig.questionType !== 'learn' && (
            <div className="flex items-center bg-white/60 border-r-2 border-y-2 border-white rounded-r-3xl py-4 px-4 font-bold">
              <GameplayTimer totalTime={totalTime} timeLeft={timeLeft} />
            </div>
          )}
        </div>
      </div>
      <div className="w-[87px] h-full -mt-1">
        {gameConfig && gameConfig.questionType === 'learn' ? (
          // Learn mode: show next arrow until last question, then show submit
          currentQuestionIndex !== undefined && currentQuestionIndex < totalQuestion - 1 ? (
            <Button
              width="87px"
              height="87px"
              variant="success"
              className=" border-4 border-white"
              onClick={handleSubmit}
              disabled={!canSubmit}
            >
              <img src={ImageIconArrowLeft} alt="next" className='flex justify-center items-center size-[50px] rotate-180' />
            </Button>
          ) : (
            <Button
              width="87px"
              height="87px"
              variant={isSubmitting ? 'danger' : 'success'}
              className="pt-4 border-4 border-white"
              onClick={handleSubmit}
              disabled={isSubmitting || !canSubmit}
            >
              <img src={ImageIconSword} alt="submit" width="69px" height="69px" />
            </Button>
          )
        ) : (
          <Button
            width="87px"
            height="87px"
            variant={isSubmitting ? 'danger' : 'success'}
            className="pt-4 border-4 border-white"
            onClick={handleSubmit}
            disabled={isSubmitting || !canSubmit}
          >
            <img src={ImageIconSword} alt="submit" width="69px" height="69px" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default GameplayStatusBar;
