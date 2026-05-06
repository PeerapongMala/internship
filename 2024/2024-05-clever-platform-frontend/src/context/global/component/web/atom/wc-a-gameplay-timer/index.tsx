import ConfigJson from '@domain/g03/g03-d02/g03-d02-p02-tutorial-multichoice/config/index.json';
import { useTranslation } from 'react-i18next';
import ImageIconClock from '../../../../assets/icon-clock.svg';

const IconTimer = ({ totalTime, timeLeft }: { totalTime: number; timeLeft: number }) => {
  const { t } = useTranslation([ConfigJson.key]);

  const isInfiniteTime = totalTime === Infinity;

  return (
    <div className="flex">
      <div
        className="relative flex justify-center items-center text-xl font-bold rounded-full select-none border-[3px] border-white
      w-11 h-11 bg-no-repeat bg-secondary-gradient-timer z-10"
      >
        <img src={ImageIconClock} alt="correcticon" width="23px" />
      </div>

      <div className="flex gap-2 items-center">
        <div className="relative w-32 h-[18px] -ml-1 rounded-full rounded-l-none border-[3px] border-white bg-white">
          <div
            className="absolute h-full bg-secondary-gradient-timer rounded-full rounded-l-none transition-all duration-1000 ease-linear"
            style={{
              width: isInfiniteTime ? '100%' : `${(timeLeft / totalTime) * 100}%`,
            }}
          />
        </div>
        <div className="text-2xl w-7 whitespace-nowrap">
          {isInfiniteTime ? '∞' : timeLeft < 0 ? 0 : timeLeft}
          {!isInfiniteTime && (
            <span className="text-base">{t('timer_second_prefix')}</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default IconTimer;
