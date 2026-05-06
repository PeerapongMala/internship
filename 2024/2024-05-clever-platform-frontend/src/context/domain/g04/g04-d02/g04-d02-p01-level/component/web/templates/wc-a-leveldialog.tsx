import IconButton from '@component/web/atom/wc-a-icon-button';
import ScrollableContainer from '@component/web/atom/wc-a-scrollable-container';
import React, { useEffect, useState } from 'react';
import ImageIconClock from '../../../assets/level/icon-clock.svg';
import ImageIconGift from '../../../assets/level/icon-gift.svg';
import ImageIconPlay from '../../../assets/level/icon-play.svg';
import Redo from '../../../assets/level/icon-redo.png';
import Leaderboard from '../../../assets/level/Leaderboard.svg';
// import ImageCupCake from '../../../assets/level/item-cupcake.svg';
// import ImagePotion from '../../../assets/level/item-potion.svg';
import StarVector from '../../../assets/level/star-vector.png';
import Star from '../../../assets/level/star.png';
// import Dialog from './wc-a-dialog';
import ImageIconInfo from '@domain/g03/g03-d05/g03-d05-p01-shop/assets/icon-info.png';
import { GameRewardList } from '@domain/g04/g04-d01/local/type';
import Modal from '@global/component/web/molecule/wc-m-modal-overlay';
import { useOnlineStatus } from '@global/helper/online-status';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useTranslation } from 'react-i18next';
import CoinArcade from '../../../assets/level/coin-arcade.svg';
import KeyArcade from '../../../assets/level/key-arcade.svg';
import ConfigJson from '../../../config/index.json';
import '../../../index.css';
import ItemGame from '../atom/wc-a-item';
import WCAPillText from '../atom/wc-a-pill-text';

interface LevelDialogProps {
  isOpen: boolean;
  onClose: () => void;
  level: number;
  levelId: number | undefined;
  difficulty?: string;
  question_count?: number;
  stars?: number | null;
  duration?: string | null;
  game_reward?: any | null;
  gold_coin?: string | null;
  arcade_coin?: string | null;
  rewardDetail?: GameRewardList | null;
  setRewardDetail: (rewardDetail: GameRewardList | null) => void;
  setShowModal?: (showModal: boolean) => void;
}

interface DomainPathParams {
  sublessonId: string;
}

const LevelDialog: React.FC<LevelDialogProps> = ({
  isOpen,
  onClose,
  level,
  levelId,
  difficulty = 'easy',
  question_count = 3,
  stars = 0,
  duration = '00:00',
  gold_coin,
  arcade_coin,
  game_reward,
  rewardDetail,
  setRewardDetail,
  setShowModal,
}) => {
  const isOnline = useOnlineStatus();
  const navigate = useNavigate();
  const { sublessonId } = useParams({ strict: false }) as DomainPathParams;

  const goldCoinConvert = gold_coin || '0/0';
  const keyCoinConvert = arcade_coin || '0/0';
  const gameRewards = Array.isArray(game_reward) ? game_reward : [];
  const [goldCoin, goldCoinTotal] = goldCoinConvert.split('/').map(Number);
  const [keyCoin, keyCoinTotal] = keyCoinConvert.split('/').map(Number);
  // const [rewardDetail, setRewardDetail] = useState<GameRewardList>(null as any);
  // const [showModal, setShowModal] = useState(false);
  const [isModalActive, setIsModalActive] = useState(true);

  const [isVisible, setIsVisible] = useState(false);
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const handleClickLevel = () => {
    navigate({ to: `/quiz/${levelId}`, viewTransition: true });
  };

  const handleLeaderBoard = () => {
    navigate({ to: `/level-leaderboard/${sublessonId}`, viewTransition: true });
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

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        setIsVisible(true);
      }, 10);
    } else {
      setIsVisible(false);
      setRewardDetail(null as any);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <>
      <Modal
        title={t('level.dialog.title', { level: level })} // ด่านที่ {level}
        isVisible={isVisible}
        onClose={onClose}
        className="w-4/5 h-4/5"
        setVisibleModal={setIsVisible}
        openOnLoad={false}
        overlay={true}
        zIndex={10}
        customBody={
          <div className="p-6 flex flex-col h-full">
            <div className="flex gap-6 flex-grow">
              <div className="w-5/12 flex flex-col">
                <ScrollableContainer className="space-y-5 pr-4 h-full">
                  <h3 className="font-bold text-2xl">{t('level.dialog.exercise')}</h3>{' '}
                  {/* แบบฝึกหัด */}
                  <div className="space-y-2 text-xl">
                    <div className="flex items-center justify-between">
                      <span>{t('level.dialog.difficulty')}:</span> {/* ระดับความยาก */}
                      <WCAPillText
                        text={t(`level.difficulty.${difficulty.toLowerCase()}`)}
                        variant={difficulty.toLowerCase()}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t('level.dialog.timeLimit')}:</span> {/* กำหนดเวลา */}
                      <div className="flex items-center gap-1">
                        <img src={ImageIconClock} className="w-6 h-6 pb-[2px]" />
                        <span className="text-gray-500">
                          {t('level.dialog.noTimeLimit')}
                        </span>{' '}
                        {/* ไม่มีกำหนด */}
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span>{t('level.dialog.questionCount')}:</span> {/* จำนวนข้อ */}
                      <span>{question_count}</span>
                    </div>
                  </div>
                </ScrollableContainer>
                <div className="mt-auto flex gap-6 bg-white rounded-[48px] justify-center items-center p-2 w-11/12">
                  <IconButton
                    className="p-[3px]"
                    iconSrc={Leaderboard}
                    variant="primary"
                    onClick={handleLeaderBoard}
                  />
                  <IconButton
                    className={duration === '--:--' ? '' : 'p-[5px] pr-[6px]'}
                    iconSrc={duration === '--:--' ? ImageIconPlay : Redo}
                    variant="success"
                    onClick={handleClickLevel}
                  />
                </div>
              </div>

              {/* Right Section */}
              <div className="w-7/12">
                <div className="flex flex-col h-full bg-slate-100 rounded-3xl p-6 shadow-md">
                  <h3 className="font-bold text-2xl mb-6 text-center">
                    {t('level.dialog.yourPlay')}:
                  </h3>{' '}
                  {/* การเล่นของคุณ */}
                  <div className="flex flex-col h-full space-y-6">
                    <div className="flex items-center justify-between text-xl gap-4">
                      <div className="flex items-center justify-between w-full">
                        <span className="mr-1">{t('level.dialog.score')}:</span>{' '}
                        {/* คะแนน */}
                        <div className="flex gap-1 bg-white p-2 rounded-3xl">
                          {[...Array(3)].map((_, i) => (
                            <img
                              key={i}
                              src={i < (stars || 0) ? Star : StarVector}
                              alt={
                                i < (stars || 0)
                                  ? t('level.dialog.star')
                                  : t('level.dialog.emptyStar')
                              }
                              className="w-8 h-8"
                            />
                          ))}
                        </div>
                      </div>
                      <div className="flex items-center justify-between w-full gap-2">
                        <span>{t('level.dialog.timeUsed')}:</span> {/* เวลาที่ใช้ */}
                        <span>{duration}</span>
                      </div>
                    </div>
                    {/* {isOnline && (
                    <div className="flex items-center justify-between w-full text-xl">
                      <span>{t('level.dialog.honor')}:</span>
                      <img
                        src={ImageHonor3}
                        alt={t('level.dialog.honorAlt')}
                        className="h-12"
                      />{' '}
                    </div>
                  )} */}

                    {isOnline && (
                      <div className="flex justify-center items-center h-3/5">
                        <div className="w-10/12">
                          <div
                            className="flex gap-4 overflow-x-auto pb-2 custom-scrollbar-horizontal"
                            style={{
                              scrollbarWidth: 'thin',
                              scrollbarColor: '#FF6B00 #f1f1f1',
                            }}
                          >
                            <ItemGame
                              image={CoinArcade}
                              count={goldCoinTotal}
                              remaining={goldCoin}
                              style={{
                                background: `linear-gradient(180deg, #FCA726 0%, #FF6B00 50%, #CC0000 150%)`,
                              }}
                            />
                            <ItemGame
                              image={KeyArcade}
                              count={keyCoinTotal}
                              remaining={keyCoin}
                              style={{
                                background: `linear-gradient(180deg, #C403C8 0%, #6E18FB 75.5%, #4E04C8 150%)`,
                              }}
                            />
                            {gameRewards.length > 0 &&
                              gameRewards.map((reward: GameRewardList) => {
                                const [remaining, total] = (reward.amount || '0/0')
                                  .split('/')
                                  .map(Number);
                                return (
                                  <button
                                    onClick={() => {
                                      setRewardDetail(reward);
                                    }}
                                    key={reward.id}
                                  >
                                    <ItemGame
                                      key={reward.id}
                                      image={reward.image_url}
                                      count={total}
                                      remaining={remaining}
                                      style={{
                                        background: `linear-gradient(180deg, #FDEB36 0%, #78EC00 50%, #079017 150%)`,
                                      }}
                                    />
                                  </button>
                                );
                              })}
                            {/* {gameRewards.length > 0 ? (
                            gameRewards.map((reward: GameRewardList) => {
                              const [remaining, total] = (reward.amount || '0/0')
                                .split('/')
                                .map(Number);
                              return (
                                <ItemGame
                                  key={reward.id}
                                  image={reward.image_url}
                                  count={total}
                                  remaining={remaining}
                                  style={{
                                    background: `linear-gradient(180deg, #FDEB36 0%, #78EC00 50%, #079017 150%)`,
                                  }}
                                />
                              );
                            })
                          ) : (
                            <ItemGame
                              image={ImageGift}
                              count={50}
                              remaining={1}
                              style={{
                                background: `linear-gradient(180deg, #FDEB36 0%, #78EC00 50%, #079017 150%)`,
                              }}
                            />
                          )} */}
                          </div>
                        </div>
                      </div>
                    )}
                    {rewardDetail && (
                      <div className="flex items-center gap-3 bg-white rounded-2xl p-4 shadow-md w-full">
                        <img
                          src={rewardDetail.image_url}
                          alt={rewardDetail.name}
                          className="h-10 w-10"
                        />
                        <span className="text-md text-black">{rewardDetail.name}</span>
                        <div className="ml-auto">
                          <img
                            className="h-10 cursor-pointer"
                            src={ImageIconInfo}
                            onClick={() => {
                              setShowModal && setShowModal(true);
                            }}
                          />
                        </div>
                      </div>
                    )}

                    {!isOnline && (
                      <div className="flex flex-col w-full items-center justify-between gap-6 p-4 pt-6 border-t-2 border-dashed border-secondary">
                        <IconButton
                          height={60}
                          width={60}
                          iconSrc={ImageIconGift}
                          variant="success"
                        />

                        <div className="flex flex-col items-center justify-center gap-2 text-3xl font-semibold">
                          <p>{t('level.dialog.offline.status')}</p> {/* คุณออฟไลน์อยู่ */}
                          <p>{t('level.dialog.offline.savedHistory')}</p>{' '}
                          {/* ประวัติการเล่นจะถูกบันทึกไว้ จากนั้น */}
                          <p>{t('level.dialog.offline.rewardsWhenOnline')}</p>{' '}
                          {/* จะได้รับรางวัลเมื่อกลับมาออนไลน์อีกครั้ง */}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        }
      />
    </>
  );
};

export default LevelDialog;
