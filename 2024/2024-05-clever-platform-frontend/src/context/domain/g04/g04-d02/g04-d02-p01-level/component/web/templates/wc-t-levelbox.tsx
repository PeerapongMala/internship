import Button from '@component/web/atom/wc-a-button';
import { LevelDetails } from '@domain/g04/g04-d03/local/type';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ButtonLockBoss from '../../../assets/level/button-lock.png';
import NumberBox from '../../../assets/level/button.png';
import Flower from '../../../assets/level/flower.png';
import Circle from '../../../assets/level/frame-circle.png';
import ImageIconForwardBlack from '../../../assets/level/icon-forward-black.svg';
import ButtonLock from '../../../assets/level/Lock.svg';
import StarVector from '../../../assets/level/star-vector.png';
import Star from '../../../assets/level/star.png';
import ConfigJson from '../../../config/index.json';
import WCAPillText from '../atom/wc-a-pill-text';

interface LevelBoxProps {
  id: number;
  level: number;
  difficulty: string;
  status: 'unlock' | 'lock';
  star: number | null;
  isOdd?: boolean;
  onClick?: () => void;
  levelType: LevelDetails['level_type'];
}

type Difficulty = 'easy' | 'medium' | 'hard';

const isValidDifficulty = (value: string): value is Difficulty => {
  return ['easy', 'medium', 'hard'].includes(value.toLowerCase());
};

const getDifficultyText = (
  difficulty: string,
  t: ReturnType<typeof useTranslation>['t'],
) => {
  switch (difficulty.toLowerCase()) {
    case 'easy':
      return [t('level.difficulty.easy'), 'easy'];
    case 'medium':
      return [t('level.difficulty.medium'), 'medium'];
    case 'hard':
      return [t('level.difficulty.hard'), 'hard'];
    default:
      return [t('level.difficulty.easy'), 'easy'];
  }
};

const getStars = (star: number | null) => {
  const stars = [];
  if (star === null) {
    // If level hasn't been played yet, show empty stars
    for (let i = 0; i < 3; i++) {
      stars.push({ src: StarVector, alt: 'empty star' });
    }
  } else {
    // Show achieved stars
    for (let i = 0; i < 3; i++) {
      stars.push({
        src: i < star ? Star : StarVector,
        alt: i < star ? 'filled star' : 'empty star',
      });
    }
  }
  return stars;
};

const LevelBox: React.FC<LevelBoxProps> = ({
  level,
  difficulty,
  status,
  star,
  isOdd = false,
  onClick,
  levelType,
}) => {
  return (
    <>
      {levelType === 'test' && (
        <LevelBoxTest
          level={level}
          levelType={levelType}
          difficulty={difficulty}
          status={status}
          star={star}
          isOdd={isOdd}
          onClick={onClick}
        />
      )}
      {(levelType === 'sub-lesson-post-test' || levelType === 'pre-post-test') && (
        <LevelBoxBoss
          level={level}
          levelType={levelType}
          difficulty={difficulty}
          status={status}
          star={star}
          isOdd={isOdd}
          onClick={onClick}
        />
      )}
    </>
  );
};

const LevelBoxTest: React.FC<Omit<LevelBoxProps, 'id'>> = ({
  level,
  difficulty,
  status,
  star,
  isOdd = false,
  onClick,
  levelType,
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const stars = getStars(star);
  const [difficultyText, difficultyNorm] = getDifficultyText(difficulty, t);
  return (
    <div className="box" onClick={status === 'unlock' ? onClick : undefined}>
      <div
        className={`level-box ${isOdd ? 'odd' : 'even'} ${status === 'lock' ? 'locked' : ''}`}
      >
        <div className={status === 'lock' ? 'lock-container' : 'star-container-level'}>
          {status === 'lock' ? (
            <img src={ButtonLock} alt="locked" />
          ) : (
            stars.map((star, index) => <img key={index} src={star.src} alt={star.alt} />)
          )}
        </div>
        <div className="white-tab"></div>
        <img className="numberbox" src={NumberBox} alt="number box" />
        <div className="number">{level}</div>
        <WCAPillText
          key={`difficulty-${level}-${difficultyNorm}`}
          text={difficultyText}
          variant={difficultyNorm}
          className="level-button"
        />
      </div>
    </div>
  );
};

const LevelBoxBoss: React.FC<Omit<LevelBoxProps, 'id'>> = ({
  difficulty,
  status,
  star,
  onClick,
  levelType,
}) => {
  const { t } = useTranslation([ConfigJson.key]);

  const stars = getStars(star);
  return (
    <div className="test" onClick={status === 'unlock' ? onClick : undefined}>
      <img className="circle" src={Circle} />

      <img className="flower" src={Flower} />
      <div className="star-container">
        {stars.map((star, index) => (
          <img key={index} src={star.src} alt={star.alt} />
        ))}
      </div>
      <div className="text items-center !top-[200px]">{t('test')}</div>
      {status === 'lock' ? (
        <img className="button-lock" src={ButtonLockBoss} />
      ) : (
        <div className="w-full">
          <p className="absolute mt-10 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-center z-[9999] font-semibold">
            {t('level_type.' + levelType)}
          </p>
          <div className="absolute top-[268px] left-[68px]">
            <Button variant="white" size="circle" className="!h-[68px] !w-[68px]">
              <img src={ImageIconForwardBlack} className="h-9" />
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LevelBox;
