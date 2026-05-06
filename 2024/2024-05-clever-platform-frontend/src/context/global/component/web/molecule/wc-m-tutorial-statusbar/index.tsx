import ButtonBack from '@component/web/atom/wc-a-button-back';
import ConfigJson from '@domain/g03/g03-d02/g03-d02-p02-tutorial-multichoice/config/index.json';
import {
  GameConfig,
  LevelTypeEnum,
} from '@domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/type';
import Button from '@global/component/web/atom/wc-a-button';
import IconGamplayCorrect from '@global/component/web/atom/wc-a-gameplay-correct';
import GameplayTimer from '@global/component/web/atom/wc-a-gameplay-timer';
import { useRouter } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import ImageIconSword from '../../../../assets/icon-sword.png';

const GameplayStatusBar = ({
  totalTime = 60,
  timeLeft = 30,
  onSubmit,
  levelNumber,
  subLessonName,
  correctCount = 2,
  incorrectCount = 2,
  totalQuestion = 4,
  levelType = 'test',
}: {
  totalTime?: number;
  timeLeft?: number;
  onSubmit?: () => void;
  levelNumber: string;
  subLessonName: string;
  correctCount?: number;
  incorrectCount?: number;
  totalQuestion?: number;
  levelType?: GameConfig['levelType'];
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  const router = useRouter();

  const handleNavigation = () => {
    router.navigate({ to: '/main-menu/tutorial', replace: true });
  };

  return (
    <div className="flex h-full gap-4 pt-2 pb-3">
      <div className="w-16 h-full">
        <ButtonBack
          className="absolute w-14 h-14 left-[4.8rem] cursor-pointer top-2"
          onClick={handleNavigation}
        />
      </div>

      <div className="w-[363px] h-full">
        <div className="flex justify-between items-center w-full h-full bg-white/60 border-2 border-white rounded-3xl p-4 font-bold">
          <div className="text-xl text-nowrap">{subLessonName}</div>
          <div
            className={`text-xl border-2 border-white p-[1px] px-2 rounded-full text-nowrap
            ${levelType === 'test' ? 'bg-secondary' : ''}
            ${levelType === 'sub-lesson-post-test' ? 'bg-danger' : ''}
            ${levelType === 'pre-post-test' ? 'bg-success' : ''}
            ${levelType === 'pre-test' ? 'bg-success' : ''}
            ${levelType === 'post-test' ? 'bg-danger' : ''}
              `}
          >
            {t(LevelTypeEnum[levelType])}
          </div>
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
          variant="success"
          className="pt-4 border-4 border-white"
          onClick={onSubmit}
        >
          <img src={ImageIconSword} alt="setting" width="69px" height="69px" />
        </Button>
      </div>
    </div>
  );
};

export default GameplayStatusBar;
