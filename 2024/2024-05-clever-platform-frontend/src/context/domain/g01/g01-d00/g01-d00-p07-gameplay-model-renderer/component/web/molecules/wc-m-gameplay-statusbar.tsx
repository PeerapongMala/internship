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
import ImageIconSetting from '@global/assets/icon-setting.svg';
import ImageIconSoundOff from '@global/assets/icon-sound-off-white.svg';
import ImageIconSoundOn from '@global/assets/icon-sound-on-white.svg';
import ImageIconSword from '@global/assets/icon-sword.png';
import Button from '@global/component/web/atom/wc-a-button';
import IconGamplayCorrect from '@global/component/web/atom/wc-a-gameplay-correct';
import GameplayTimer from '@global/component/web/atom/wc-a-gameplay-timer';
import StoreGame from '@store/game';
import StoreGlobal from '@store/global';
import StoreGlobalPersist from '@store/global/persist';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import './auto-scroll-animation.css';

const GameplayStatusBar = ({
  totalTime = 60,
  timeLeft = 30,
  onSubmit,
  levelNumber = '004',
  subLessonName = '1-1) การอ่านจำนวนนับ',
  correctCount = 2,
  incorrectCount = 2,
  totalQuestion = 4,
  levelType = 'test',
  handleClickCalculator,
  handleClickExit,
}: {
  totalTime?: number;
  timeLeft?: number;
  onSubmit?: () => void;
  levelNumber?: string;
  subLessonName?: string;
  correctCount?: number;
  incorrectCount?: number;
  totalQuestion?: number;
  levelType?: GameConfig['levelType'];
  handleClickCalculator?: () => void;
  handleClickExit?: () => void;
}) => {
  const refHelp = useRef<HTMLDivElement>(null);
  const refSetting = useRef<HTMLDivElement>(null);
  const { t } = useTranslation([ConfigJson.key]);
  const { settings } = StoreGlobalPersist.StateGet(['settings']);
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const [soundOn, setSoundOn] = useState<boolean | null>(null);
  const [showHelp, setShowHelp] = useState<boolean>(false);
  const [showSetting, setShowSetting] = useState<boolean>(false);

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
    let submittingTimeout = null;
    // always set isSubmitting to false after 1000ms, if state
    if (isSubmitting === true) {
      submittingTimeout = setTimeout(() => {
        setIsSubmitting(false);
      }, 1000);
    }
    return () => {
      if (submittingTimeout) clearTimeout(submittingTimeout);
    };
  }, [isSubmitting]);

  useEffect(() => {
    if (stateFlow === StateFlow.Answer) setIsSubmitting(true);
    else if (stateFlow === StateFlow.Gameplay) setIsSubmitting(false);
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
            setShowSetting?.(!showSetting);
            setShowHelp?.(false);
          }}
        >
          <img src={ImageIconSetting} alt="setting" width="40px" height="40px" />
        </Button>
        {showSetting && (
          <div
            className="absolute top-[4.5rem] left-0 w-full h-[123px] bg-gray-300 border-4 border-white p-[5px] rounded-full z-50"
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
              {/* <img src={ImageIconSoundOn} alt="setting" width="26px" height="26px" /> */}
              {soundOn ? (
                <img src={ImageIconSoundOn} alt="setting" width="26px" height="26px" />
              ) : (
                <img src={ImageIconSoundOff} alt="setting" width="26px" height="26px" />
              )}
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
            setShowHelp?.(!showHelp);
            setShowSetting?.(false);
          }}
        >
          <img src={ImageIconHelp} alt="setting" width="40px" height="40px" />
        </Button>
        {showHelp && (
          <div
            className="absolute top-[4.5rem] left-0 w-full h-[123px] bg-gray-300 border-4 border-white p-[5px] rounded-full z-50"
            ref={refHelp}
          >
            <Button
              width="46px"
              height="46px"
              variant="tertiary"
              className=""
              onClick={handleClickCalculator}
            >
              <img src={ImageIconCalculator} alt="setting" width="26px" height="26px" />
            </Button>

            <Button
              width="46px"
              height="46px"
              variant="tertiary"
              className="mt-2"
              onClick={handleClickCanvas}
            >
              <img src={ImageIconEdit} alt="setting" width="26px" height="26px" />
            </Button>
          </div>
        )}
      </div>
      <div className="w-[363px] h-full">
        <div className="flex justify-between items-center w-auto h-full bg-white/60 border-2 border-white rounded-3xl p-4 font-bold relative overflow-x-hidden overflow-y-hidden">
          <AutoScroll>
            <div className="relative text-xl text-nowrap mr-4">{subLessonName}</div>
            <div
              className={`relative text-xl border-2 border-white p-[1px] px-2 rounded-full text-nowrap
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
      <div className="flex w-[549px] h-full">
        <div className="flex justify-between items-center w-[310px] h-full bg-white/60 border-2 border-r-0 border-white rounded-l-3xl p-4 font-bold text-xl">
          <div className="">
            {t('stage')}: {levelNumber}
          </div>
          <IconGamplayCorrect count={correctCount} total={totalQuestion} type="correct" />
          <IconGamplayCorrect
            count={incorrectCount}
            total={totalQuestion}
            type="incorrect"
          />
        </div>
        <div className="flex items-center flex-grow h-full bg-white/60 border-2 border-white rounded-r-3xl p-4 font-bold">
          <div className="flex gap-2 items-center">
            <GameplayTimer totalTime={totalTime} timeLeft={timeLeft} />
          </div>
        </div>
      </div>
      <div className="w-[87px] h-full -mt-1">
        <Button
          width="87px"
          height="87px"
          variant={isSubmitting ? 'danger' : 'success'}
          className="pt-4 border-4 border-white"
          onClick={handleSubmit}
          disabled={isSubmitting}
        >
          <img src={ImageIconSword} alt="setting" width="69px" height="69px" />
        </Button>
      </div>
    </div>
  );
};

export default GameplayStatusBar;
