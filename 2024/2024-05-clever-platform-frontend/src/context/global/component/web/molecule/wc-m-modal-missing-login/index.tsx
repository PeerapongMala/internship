import Button from '@component/web/atom/wc-a-button';
import ConfigJson from '@domain/g02/g02-d03/g02-d03-p01-streak-login/config/index.json';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import CoinIcon from '../../../../../domain/g02/g02-d03/g02-d03-p01-streak-login/assets/coin-arcade.svg';
import HeartBreak from '../../../../../domain/g02/g02-d03/g02-d03-p01-streak-login/assets/heart-break.svg';
import ArrowLeft from '../../../../../domain/g02/g02-d03/g02-d03-p01-streak-login/assets/LeftVector.svg';
import Portion from '../../../../../domain/g02/g02-d03/g02-d03-p01-streak-login/assets/portion-2.svg';
import ArrowRight from '../../../../assets/arrow-glyph-right.svg';
import Gift from '../../../../assets/gift.svg';
import styles from './index.module.css';

interface MissedMissionDialogProps {
  isOpen: boolean;
  dialogStyle?: React.CSSProperties;
  onUseCoin: () => void;
  onUseItem: () => void;
  onGiveUp: () => void;
  lastCheckin?: string;
  current_streak?: number;
  gold_coin?: number;
  arcade_coin?: number;
  isOnline?: boolean;
}

const MissedMissionDialog: React.FC<MissedMissionDialogProps> = ({
  isOpen,
  dialogStyle,
  onUseCoin,
  onUseItem,
  onGiveUp,
  lastCheckin,
  current_streak,
  gold_coin = 0,
  arcade_coin = 0,
  isOnline = true,
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const [isVisible, setIsVisible] = useState(false);
  const [isBouncing, setIsBouncing] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
      setIsBouncing(false);
    }
  }, [isOpen]);

  const handleTransitionEnd = useCallback(
    (e: React.TransitionEvent) => {
      if (e.propertyName === 'transform' && isVisible && !isBouncing) {
        setIsBouncing(true);
      }
    },
    [isVisible, isBouncing],
  );

  const diffInHours = useMemo(() => {
    if (!lastCheckin) return 24;
    // Calculate the difference in hours between now and the last check-in date
    const lastCheckinDate = new Date(lastCheckin);
    const now = new Date();
    return (now.getTime() - lastCheckinDate.getTime()) / (1000 * 60 * 60);
  }, [lastCheckin]);

  const missedDaysText = useMemo(() => {
    if (diffInHours > 72) return t('missed_login_mission_3_days');
    if (diffInHours > 48) return t('missed_login_mission_2_days');
    if (diffInHours > 24) return t('missed_login_mission_1_day');
    return t('congrats_daily_reward_received');
  }, [diffInHours, t]);

  const retryText = useMemo(() => {
    if (diffInHours > 48) return t('life_extension_x_20');
    if (diffInHours > 24) return t('life_extension_x_10');
    return t('close');
  }, [diffInHours, t]);

  const titleText = useMemo(() => {
    if (diffInHours > 72) {
      return (
        <>
          {t('use_coin_or_item_to_retry')}
          <br />
          {t('max_continuous_days', { days: 2 })}
        </>
      );
    }
    if (diffInHours > 48) return t('use_20_coins_or_item_to_retry');
    if (diffInHours > 24) return t('use_10_coins_or_item_to_retry');
    return t('successful_consecutive_login_day', { day: current_streak });
  }, [diffInHours, current_streak, t]);

  const itemRetryText = useMemo(() => {
    if (diffInHours > 48) return t('use_life_extension_item_2');
    if (diffInHours > 24) return t('use_life_extension_item');
    return t('item_storage');
  }, [diffInHours, t]);

  const isCoinButtonDisabled = useMemo(() => {
    if (diffInHours <= 24) return false;
    if (diffInHours > 48) return gold_coin < 20;
    return gold_coin < 10;
  }, [diffInHours, gold_coin, isOnline]);

  const isItemButtonDisabled = useMemo(() => {
    if (diffInHours <= 24) return false;
    if (diffInHours > 48) return arcade_coin < 2;
    return arcade_coin < 1;
  }, [diffInHours, arcade_coin, isOnline]);

  if (!isOpen) return null;

  return (
    <div
      id="modal-root"
      className={`justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none 
        ${styles['modal-transition']} 
        ${isVisible ? styles['transition-top-to-center-loaded'] : styles['transition-top-to-center']} 
        ${isBouncing ? styles['bounce-animation'] : ''}`}
      onTransitionEnd={handleTransitionEnd}
    >
      <div
        className="font-[Noto Sans Thai] font-medium w-[760px] min-h-[400px] relative border-8 border-white bg-white/80 rounded-[64px] shadow-[0px_4px_0px_0px_#dfdede,0px_8px_4px_0px_rgba(0,0,0,0.15)] flex flex-col"
        style={dialogStyle}
      >
        <div className="flex flex-col items-center justify-center self-stretch border-b border-dashed border-[#fcd401] px-4 pb-4">
          <div className="h-16 w-16">
            <Button
              className="h-full w-full"
              variant={diffInHours <= 24 ? 'success' : 'danger'}
            >
              <img
                className="h-10 w-10"
                src={diffInHours <= 24 ? Gift : HeartBreak}
                alt={diffInHours <= 24 ? t('gift') : t('heart_break')}
              />
            </Button>
          </div>
          <div className="text-3xl font-bold mt-5">{missedDaysText}</div>
        </div>
        <div className="flex-1 flex items-center justify-center px-6 mx-auto">
          {' '}
          <div className="flex flex-col items-center text-2xl text-center">
            {' '}
            {titleText}
          </div>
        </div>
        <div className="flex flex-wrap gap-4 p-10 w-full border-t border-dashed border-[#fcd401]">
          {diffInHours <= 72 && (
            <>
              <div className="w-[calc(50%-8px)]">
                <Button
                  className="w-full"
                  variant={diffInHours <= 24 ? 'danger' : 'primary'}
                  prefix={
                    diffInHours <= 24 ? null : (
                      <img src={CoinIcon} alt={t('coin_icon')} className="w-10 h-10" />
                    )
                  }
                  onClick={onUseCoin}
                  disabled={isCoinButtonDisabled}
                >
                  {retryText}
                </Button>
              </div>
              <div className="w-[calc(50%-8px)]">
                <Button
                  className="w-full"
                  variant="primary"
                  prefix={
                    <img
                      src={diffInHours <= 24 ? ArrowRight : Portion}
                      alt={diffInHours <= 24 ? t('arrow_right') : t('portion')}
                      className="w-20 h-20"
                    />
                  }
                  onClick={onUseItem}
                  disabled={isItemButtonDisabled}
                >
                  {itemRetryText}
                </Button>
              </div>
            </>
          )}
          {diffInHours >= 24 && (
            <div className="w-full mt-4">
              <Button
                className="w-full"
                variant="danger"
                prefix={
                  <img src={ArrowLeft} alt={t('arrow_left')} className="w-10 h-10" />
                }
                onClick={onGiveUp}
              >
                {t('give_up_and_restart')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MissedMissionDialog;
