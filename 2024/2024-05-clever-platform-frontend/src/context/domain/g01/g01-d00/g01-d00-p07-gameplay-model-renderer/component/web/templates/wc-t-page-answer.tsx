import ImageAnswerCorrect from '@context/domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/assets/answer-correct.png';
import ImageAnswerWrong from '@context/domain/g04/g04-d03/g04-d03-p01-gameplay-quiz/assets/answer-wrong.png';
import { CharacterResponse, Pet } from '@domain/g03/g03-d04/local/types';
import { MonsterItemList } from '@domain/g04/g04-d01/local/type';
import { createSoundController } from '@global/helper/sound';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreGlobalPersist from '@store/global/persist';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ConfigJson from '../../../config/index.json';
import { GCTFightScene } from '../../game/gc-t-fight-scene';

interface MonsterLesson {
  id: number;
  subject_id: number;
  name: string;
  font_name: string;
  font_size: string;
  background_image_path: string;
  index: number;
  status: 'enabled' | 'disabled'; // assuming it can be either
  created_at: string; // ISO date string
  created_by: string;
  updated_at: string;
  updated_by: string;
  admin_login_as: string | null;
  wizard_index: number;
  monsters: {
    'pre-post-test': string[];
    'sub-lesson-post-test': string[];
    test: string[];
  };
}

const PageAnswer = ({
  answerIsCorrect,
  onClick,
  showModal,
  setShowModal,
  answerCorrectText,
  answerWrongText,
  answerIsCorrectText,
  answerFromUserText,
  monstersByLevelType,
  currentEquippedAvatar,
  currentEquippedPet,
}: {
  answerIsCorrect: boolean;
  onClick: () => void;
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  answerCorrectText?: string;
  answerWrongText?: string;
  answerIsCorrectText?: string;
  answerFromUserText?: string;
  monstersByLevelType?: MonsterItemList[];
  currentEquippedAvatar?: CharacterResponse | null;
  currentEquippedPet?: Pet | null;
}) => {
  const [showAnswerFromUserText, setShowAnswerFromUserText] = useState(false);
  const [monsterName, setMonsterName] = useState<string | null>(null);

  // Sound
  const winningSound = createSoundController('winning', { loop: false, volume: 'sfx' });
  const gameOverSound = createSoundController('game_over', {
    loop: false,
    volume: 'sfx',
  });

  const { t } = useTranslation([ConfigJson.key]);
  const [delay, setDelay] = useState(5);

  const handleClickOk = () => {
    setShowModal(false);
    onClick();
    StoreGlobalPersist.MethodGet().updateSettings({
      enableParticle: true,
    });
  };

  const handleClickSkip = () => {
    setDelay(0);
  };

  useEffect(() => {
    if (monstersByLevelType && monstersByLevelType.length > 0 && !monsterName) {
      const randomIndex = Math.floor(Math.random() * monstersByLevelType.length);
      setMonsterName(monstersByLevelType[randomIndex].image_path || 'Target_Dummy');
    }
  }, [monstersByLevelType]);

  useEffect(() => {
    const playSoundEffects = () => {
      StoreBackgroundMusic.MethodGet().pauseSound();

      // Play result sound (win or lose)
      if (answerIsCorrect) {
        winningSound.play();
        setTimeout(() => {
          const whooshSound = createSoundController('fight_whoosh_1', {
            autoplay: true,
            loop: false,
            volume: 'sfx',
          });
          whooshSound.play();
        }, 1000);
      } else {
        gameOverSound.play();
        // TODO: Add get hit sound
        // setTimeout(() => {
        //   const getHitSound = createSoundController('get_hit_1', {
        //     autoplay: true,
        //     loop: false,
        //     volume: 'sfx',
        //   });
        //   getHitSound.play();
        // }, 1000);
      }

      // Resume background music after delay
      setTimeout(() => {
        StoreBackgroundMusic.MethodGet().playSound('puzzle_music');
      }, delay * 1000);
    };

    playSoundEffects();
  }, [answerIsCorrect]);

  useEffect(() => {
    const interval = setInterval(() => {
      setDelay((prev) => {
        if (prev === 0) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Show modal when delay reaches 0
    if (delay === 0) {
      setShowModal(true);
    }

    return () => clearInterval(interval);
  }, [delay, setShowModal, showModal]);

  const correctAnswerTitle = t('pageAnswer.correctAnswerTitle', 'คุณตอบถูก');
  const wrongAnswerTitle = t('pageAnswer.wrongAnswerTitle', 'คุณตอบผิด');
  const title = answerIsCorrect ? correctAnswerTitle : wrongAnswerTitle;

  const correctAnswerLabel = [
    t('pageAnswer.correctAnswerLabel', 'คำตอบที่ถูกต้องคือ'),
    answerIsCorrectText,
  ].join(' ');
  const understandButton = t('pageAnswer.understandButton', 'เข้าใจแล้ว');
  const userAnswerLabel = [
    t('pageAnswer.userAnswerLabel', 'คำตอบของคุณคือ'),
    answerFromUserText,
  ].join(' ');

  return (
    <>
      <div
        className="relative w-full h-full flex justify-center items-center"
        onClick={handleClickSkip}
      >
        <div className="absolute top-8 z-20">
          <img
            className="h-4 mr-5"
            src={answerIsCorrect ? ImageAnswerCorrect : ImageAnswerWrong}
            alt={
              answerIsCorrect
                ? t('pageAnswer.correctImage', 'ภาพคำตอบถูก')
                : t('pageAnswer.wrongImage', 'ภาพคำตอบผิด')
            }
          />
        </div>

        <GCTFightScene
          weaponId={currentEquippedAvatar?.model_id}
          monsterName={monsterName || 'Target_Dummy'}
          answerIsCorrect={answerIsCorrect}
        />
      </div>
      {/* {showModal ? (
        <Modal
          setShowModal={setShowModal}
          title={
            <Title title={title} setShowAnswerFromUserText={setShowAnswerFromUserText} />
          }
          rootClassName="absolute top-1/2 overflow-hidden"
          className="h-full w-full pb-0"
          childrenClassName=""
          disableClose
          customBody={
            <div className="flex flex-col items-center justify-center text-center h-full w-full gap-4 p-4">
              {showAnswerFromUserText && (
                <Latex>{userAnswerLabel?.toString() || ''}</Latex>
              )}
              <Latex>{correctAnswerLabel?.toString() || ''}</Latex>
              <Latex>
                {(answerIsCorrect ? answerCorrectText : answerWrongText)?.toString() ||
                  ''}
              </Latex>
            </div>
          }
          customFooter={
            <div className="w-full h-40 flex items-center justify-center border-t-2 border-dashed border-secondary">
              <Button
                onClick={handleClickOk}
                variant="primary"
                width="30rem"
                height="60px"
              >
                {understandButton}
              </Button>
            </div>
          }
        />
      ) : null} */}
    </>
  );
};

const Title = ({
  title,
  setShowAnswerFromUserText,
}: {
  title: string;
  setShowAnswerFromUserText: (value: boolean) => void;
}) => {
  const [clickCount, setClickCount] = useState(0);

  const handleClick = () => {
    setClickCount((prevCount) => prevCount + 1);
  };

  useEffect(() => {
    if (clickCount === 7) {
      setShowAnswerFromUserText(true);
    }
  }, [clickCount, setShowAnswerFromUserText]);

  useEffect(() => {
    const debugMode = localStorage.getItem('debugMode');

    if (debugMode === 'true') {
      setClickCount(7);
    }
  }, []);

  return <div onClick={handleClick}>{title}</div>;
};

export default PageAnswer;
