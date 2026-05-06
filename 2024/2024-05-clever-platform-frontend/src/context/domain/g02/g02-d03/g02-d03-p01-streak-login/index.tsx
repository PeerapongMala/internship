import ButtonBack from '@component/web/atom/wc-a-button-back';
import { Link, useNavigate } from '@tanstack/react-router';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import Button from '../../../../global/component/web/atom/wc-a-button';
import API from './api';
import CheckConfirm from './assets/VectorConfirm.svg';
import ArrowLightLeft from './assets/arrow-line-left.svg';
import ArrowLightRight from './assets/arrow-line-right.svg';
import Check from './assets/check.svg';
import Day5 from './assets/coin-1.svg';
import Day6 from './assets/coin-2.svg';
import ImageCoinArcade from './assets/coin-arcade.svg';
import Coin from './assets/coin-game.svg';
import BigPrize from './assets/coinbigprize.png';
// import Day1 from './assets/day1.svg';
import Day1 from './assets/coin-1.svg';
import Day2 from './assets/day2.svg';
import Day3 from './assets/day3.svg';
import Day4 from './assets/day4.svg';
import Ice from './assets/image 8.png';
import './index.css';
import { RewardList, UserStat } from './type';

import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import MissedMissionDialog from '@component/web/molecule/wc-m-modal-missing-login';
import ModalOffLineWarning from '@component/web/molecule/wc-m-modal-offline-warning';
import { convertToMonetarySuffix } from '@global/helper/convert';
import { useOnlineStatus } from '@global/helper/online-status';
import StoreGlobal from '@store/global';
import StoreSubjects from '@store/global/subjects';
import ConfigJson from './config/index.json';

const DomainJSX = () => {
  type TierType = 'normal' | 'bronze' | 'silver' | 'gold';
  const mapTierToType = (tier: any): TierType => {
    switch (tier) {
      case 1:
        return 'normal';
      case 2:
        return 'bronze';
      case 3:
        return 'silver';
      case 4:
        return 'gold';
      default:
        return 'normal';
    }
  };

  const getIconForReward = (reward: any): string => {
    if (reward.image_url) {
      return reward.image_url;
    }
    return Day1;
  };

  type TierColorsType = {
    [key in TierType]: {
      background: string;
      border: string;
    };
  };

  const isOnline = useOnlineStatus();

  const [isDialogOpen, setIsDialogOpen] = useState(true);
  const [userStat, setUserStat] = useState<UserStat | null>(null);
  const [coins, setCoins] = useState({ gold_coin: 0, arcade_coin: 0, ice: 0 });

  const [hasCheckedInToday, setHasCheckedInToday] = useState(false);
  const [showOfflineModal, setShowOfflineModal] = useState(false);
  const [showMissedMissionDialog, setShowMissedMissionDialog] = useState(true)

  const now = new Date();
  const formattedDate = now.toISOString().split('T')[0];
  const navigate = useNavigate();

  const handleRetryOffline = () => {
    StoreGlobal.MethodGet().loadingSet(true);
    new Promise((resolve) => {

      setTimeout(
        () => {
          if (isOnline) {
            setShowOfflineModal(false);
          }
          resolve(true);
        },
        500 + (-250 + Math.random() * 500),
      );
    }).finally(() => {
      StoreGlobal.MethodGet().loadingSet(false);
    });
  };

  useEffect(() => {
    console.log('Online status', isOnline);
    if (!isOnline) {
      setShowOfflineModal(true);
      setShowMissedMissionDialog(false);
    } else {
      setShowOfflineModal(false);
      setShowMissedMissionDialog(!checkIfCheckedInToday(userStat?.last_checkin));
    }
  }, [isOnline, userStat?.last_checkin]);

  // fucn recheck Checkedin today
  const checkIfCheckedInToday = (lastCheckin: string | undefined) => {
    if (!lastCheckin) return false;

    const today = new Date().toISOString().split('T')[0];
    // const today = '2025-07-03';
    const lastCheckinDate = lastCheckin.split('T')[0];

    return lastCheckinDate === today;
  };

  const handleGiveUp = async () => {
    if (!isOnline) {
      setShowOfflineModal(true);
      return
    }
    try {
      const newCheckIn = {
        subject_id: Number(subjectId),
        check_in_date: formattedDate,
        reset_flag: true,
        is_check_in: false,
      };
      const storageKey = `bulk_edit_list_${subjectId}_${userStat?.student_id}`;
      localStorage.removeItem(storageKey);
      const bulk_edit_list = [newCheckIn];

      const requestBody = {
        bulk_edit_list: bulk_edit_list,
      };
      localStorage.setItem(storageKey, JSON.stringify(requestBody));
      const response = await API.RewardList.Checkin.Post(requestBody);
      console.log('API Response:', response);

      setShowStreakLoginPage(true);
    } catch (error) {
      console.error('Error in handleGiveUp:', error);
      setShowStreakLoginPage(true);
    }
  };

  const iconMapping: { [key: string]: string } = {
    Day1: Day1,
    Day2: Day2,
    Day3: Day3,
    Day4: Day4,
    Day5: Day5,
    Day6: Day6,
    BigPrize: BigPrize,
  };

  const tierColors: TierColorsType = {
    normal: {
      background: 'rgba(255, 254, 236, 1)',
      border: '#fcd401',
    },
    bronze: {
      background: 'rgba(255, 234, 217, 1)',
      border: 'rgba(211, 133, 101, 1)',
    },
    silver: {
      background: 'rgba(192, 192, 192, 1)',
      border: 'rgba(172, 172, 172, 1)',
    },
    gold: {
      background: 'rgba(249, 229, 142, 1)',
      border: 'rgba(215, 178, 112, 1)',
    },
  };

  const [reward, setRewardList] = useState<RewardList[]>(() => {
    const savedRewards = localStorage.getItem('rewards');
    return savedRewards ? JSON.parse(savedRewards) : [];
  });
  const { isReady: subjectStoreIsReady, currentSubject } = StoreSubjects.StateGet([
    'isReady',
    'currentSubject',
  ]);

  const subjectId = currentSubject?.subject_id ?? '';
  const subjectName = currentSubject?.subject_name ?? '';

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  useEffect(() => {
    const fetchData = async () => {
      if (!subjectId) return;
      try {
        const res = await API.RewardList.UserStat.Get(subjectId);
        const response: any = await res;
        if (response.status_code === 200) {
          // const modifiedData = {
          //   ...response.data,
          //   last_checkin: new Date(Date.now() - 48 * 60 * 60 * 1000).toISOString() // 48 ชม.ที่แล้ว
          // };
          // setUserStat(modifiedData);
          setUserStat(response.data);
          const checkedIn = checkIfCheckedInToday(response.data.last_checkin);
          // const checkedIn = checkIfCheckedInToday('2025-07-02T00:00:00Z');
          setHasCheckedInToday(checkedIn);
          setShowStreakLoginPage(checkedIn);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [subjectId]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await API.RewardList.GoldCoin.Get();
        const response: any = await res;
        console.log('API Response:', response);

        if (response.status_code === 200) {
          setCoins({
            gold_coin: response.data.gold_coin,
            arcade_coin: response.data.arcade_coin,
            ice: response.data.ice
          });
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, []);
  useEffect(() => {
    const fetchDataReward = async () => {
      if (!subjectId) return;
      try {
        const res = await API.RewardList.Reward.Get(subjectId);
        const response: any = await res;
        if (response.status_code === 200) {
          console.log({ response: response })
          setRewardList(response.data)
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchDataReward();
  }, [subjectId]);

  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [showStreakLoginPage, setShowStreakLoginPage] = useState(false);
  const [currentDay, setCurrentDay] = useState(1);


  useEffect(() => {
    if (reward && reward.length > 0) {
      // console.log('Processing reward data:', reward);
      const sortedRewards = [...reward].sort((a, b) => a.day - b.day);
      let lastCheckinDay = 0;
      for (const item of sortedRewards) {
        if (item.status === 'non-checkin') {
          break;
        }
        lastCheckinDay = item.day;
      }

      // console.log('Setting currentDay to:', lastCheckinDay || 1);
      setCurrentDay(lastCheckinDay || 1);
    }
  }, [reward]);

  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 7;

  const { initializedIs } = StoreGlobal.StateGet(['initializedIs']);

  const getFilteredRewards = () => {
    const startDay = Math.max(1, currentDay - 3);
    const endDay = startDay + 13;

    const getRewardForDay = (day: number) => {
      const existingReward = reward.find((r) => r.day === day);
      if (existingReward) {
        return {
          ...existingReward,
          displayDay: day,
        };
      }
      const templateIndex = (day - 1) % Math.max(1, reward.length);
      const templateReward = reward[templateIndex] || {
        subject_id: 1,
        day: 1,
        item_id: 0,
        gold_coin_amount: null,
        arcade_coin_amount: null,
        ice_amount: null,
        item_amount: 1,
        tier: 1,
        type: 'default',
        name: `Day 1`,
        description: '',
        image_url: null,
        status: 'non-checkin',
      };

      return {
        ...templateReward,
        day: day,
        displayDay: day,
        name: `Day ${day}`,
        status: day <= currentDay ? 'checkin' : 'non-checkin',
      };
    };

    const filteredRewards = [];
    for (let day = startDay; day <= endDay; day++) {
      filteredRewards.push(getRewardForDay(day));
    }

    return filteredRewards;
  };

  const isLastPage = () => {
    const filteredRewards = getFilteredRewards();
    const totalPages = Math.ceil(filteredRewards.length / itemsPerPage);
    return currentPage >= totalPages - 1;
  };

  const getCurrentPageRewards = () => {
    const filteredRewards = getFilteredRewards();
    const startIndex = currentPage * itemsPerPage;
    return filteredRewards.slice(startIndex, startIndex + itemsPerPage);
  };

  useEffect(() => {
    if (userStat) {
      StoreGlobal.MethodGet().loadingSet(false);
    }
  }, [userStat])

  useEffect(() => {
    setCurrentPage(0);
  }, [currentDay]);

  const handlePrevPage = () => {
    setCurrentPage((prev) => Math.max(0, prev - 1));
  };

  const handleNextPage = () => {
    const filteredRewards = getFilteredRewards();
    const maxPage = Math.ceil(filteredRewards.length / itemsPerPage) - 1;
    if (currentPage < maxPage) {
      setCurrentPage((prev) => prev + 1);
    }
  };

  const handleModalPage = () => {
    setShowStreakLoginPage(false);
  };

  const handleUseCoin = async () => {
    if (!isOnline) {
      setShowOfflineModal(true);
      return;
    }
    try {
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0];
      let shouldUseCoins = false;
      let coinAmount = 0;

      if (userStat?.last_checkin) {
        const lastCheckinDate = new Date(userStat.last_checkin);
        const timeDifference = today.getTime() - lastCheckinDate.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference <= 24) {
          shouldUseCoins = false;
          coinAmount = 0;
        } else if (hoursDifference > 24 && hoursDifference <= 48) {
          shouldUseCoins = true;
          coinAmount = 10;
        } else if (hoursDifference > 48 && hoursDifference <= 72) {
          shouldUseCoins = true;
          coinAmount = 20;
        } else {
          shouldUseCoins = false;
          coinAmount = 0;
        }
      }
      try {
        if (shouldUseCoins && coinAmount > 0) {
          const response = await API.RewardList.UseItem.Post({
            subject_id: parseInt(subjectId),
            use_coin_flag: true,
            gold_coin_amount: coinAmount,
            use_item_flag: false,
          });
        }
      } catch (error) {
        console.error('Error:', error);
      }

      const newCheckIn = {
        subject_id: Number(subjectId),
        check_in_date: formattedToday,
        reset_flag: false,
        is_check_in: true,
      };

      const storageKey = `bulk_edit_list_${subjectId}_${userStat?.student_id}`;
      const existingData = localStorage.getItem(storageKey);
      let bulk_edit_list = [];

      if (existingData) {
        const parsed = JSON.parse(existingData);
        bulk_edit_list = parsed.bulk_edit_list || [];

        const hasDuplicateDate = bulk_edit_list.some(
          (item: { check_in_date: string }) =>
            item.check_in_date === newCheckIn.check_in_date,
        );

        if (!hasDuplicateDate) {
          const lastCheckInDate = bulk_edit_list[bulk_edit_list.length - 1].check_in_date;
          const startDate = new Date(lastCheckInDate);
          const endDate = new Date(newCheckIn.check_in_date);

          for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().split('T')[0];
            if (
              !bulk_edit_list.some(
                (item: { check_in_date: string }) => item.check_in_date === dateString,
              )
            ) {
              bulk_edit_list.push({
                subject_id: Number(subjectId),
                check_in_date: dateString,
                reset_flag: false,
                is_check_in: false,
              });
            }
          }
          bulk_edit_list.push(newCheckIn);
        }
      } else {
        bulk_edit_list = [newCheckIn];
      }

      const requestBody = {
        bulk_edit_list: bulk_edit_list,
      };

      localStorage.setItem(storageKey, JSON.stringify(requestBody));
      const response = await API.RewardList.Checkin.Post(requestBody);
      // console.log('Checkin API Response:', response);
      const updatedRequestBody = {
        bulk_edit_list: [bulk_edit_list[bulk_edit_list.length - 1]],
      };
      localStorage.setItem(storageKey, JSON.stringify(updatedRequestBody));

      try {
        const userStatRes = await API.RewardList.UserStat.Get(subjectId);
        const userStatResponse: any = await userStatRes;
        if (userStatResponse.status_code === 200) {
          setUserStat(userStatResponse.data);
          setHasCheckedInToday(true);
          // console.log('Updated user stats:', userStatResponse.data);
          try {
            const rewardRes = await API.RewardList.Reward.Get(subjectId);
            const rewardResponse: any = await rewardRes;
            // console.log('Reward response after login:', rewardResponse);

            if (
              rewardResponse.status_code === 200 &&
              Array.isArray(rewardResponse.data)
            ) {
              // console.log('Setting reward data after login:', rewardResponse.data);
              let extendedRewards = [...rewardResponse.data];

              if (rewardResponse.data.length > 0) {
                const maxDayInResponse = Math.max(
                  ...rewardResponse.data.map((item: { day: any }) => item.day),
                );
                if (userStatResponse.data.current_streak > maxDayInResponse) {
                  console.log(
                    `Extending rewards from day ${maxDayInResponse + 1} to day ${userStatResponse.data.current_streak}`,
                  );

                  for (
                    let day = maxDayInResponse + 1;
                    day <= userStatResponse.data.current_streak;
                    day++
                  ) {
                    const templateIndex = (day - 1) % rewardResponse.data.length;
                    const templateReward = rewardResponse.data[templateIndex];

                    const newReward = {
                      ...templateReward,
                      day: day,
                      status: 'checkin',
                    };

                    extendedRewards.push(newReward);
                  }
                  extendedRewards.sort((a, b) => a.day - b.day);
                }
              }

              setRewardList(extendedRewards);
              localStorage.setItem('rewards', JSON.stringify(extendedRewards));
            }
          } catch (rewardError) {
            console.error('Error fetching rewards after login:', rewardError);
          }
        }
      } catch (statError) {
        console.error('Error fetching user stats after login:', statError);
      }

      setShowStreakLoginPage(true);
      setCurrentPage(0);
    } catch (error) {
      console.error('Error in handleLoginPage:', error);
      setShowStreakLoginPage(true);
    }
  };

  const handleUseItem = async () => {
    if (!isOnline) {
      setShowOfflineModal(true);
      return;
    }
    try {
      const today = new Date();
      const formattedToday = today.toISOString().split('T')[0];
      let shouldUseCoins = false;
      let coinAmount = 0;

      if (userStat?.last_checkin) {
        const lastCheckinDate = new Date(userStat.last_checkin);
        const timeDifference = today.getTime() - lastCheckinDate.getTime();
        const hoursDifference = timeDifference / (1000 * 60 * 60);

        if (hoursDifference <= 24) {
          shouldUseCoins = false;
          coinAmount = 0;
        } else if (hoursDifference > 24 && hoursDifference <= 48) {
          shouldUseCoins = true;
          coinAmount = 1;
        } else if (hoursDifference > 48 && hoursDifference <= 72) {
          shouldUseCoins = true;
          coinAmount = 2;
        } else {
          shouldUseCoins = false;
          coinAmount = 0;
        }
      }

      // if lose streak login and want to continue the streak by pay coin
      if (shouldUseCoins && coinAmount > 0) {
        try {
          const response = await API.RewardList.UseItem.Post({
            subject_id: parseInt(subjectId),
            use_coin_flag: true,
            gold_coin_amount: coinAmount,
            use_item_flag: false,
          });
        } catch (error) {
          console.error('Error:', error);
        }
      }

      // create a new latest checkin date
      const newCheckIn = {
        subject_id: Number(subjectId),
        check_in_date: formattedToday,
        reset_flag: false,
        is_check_in: true,
      };

      const storageKey = `bulk_edit_list_${subjectId}_${userStat?.student_id}`;
      const existingData = localStorage.getItem(storageKey);
      let bulk_edit_list = [];

      // add new checkin date to bulk_edit_list (if existing) 
      // or create a new one (if not existing)
      if (existingData) {
        const parsed = JSON.parse(existingData);
        bulk_edit_list = parsed.bulk_edit_list || [];

        const hasDuplicateDate = bulk_edit_list.some(
          (item: { check_in_date: string }) =>
            item.check_in_date === newCheckIn.check_in_date,
        );

        if (!hasDuplicateDate) {
          const lastCheckInDate = bulk_edit_list[bulk_edit_list.length - 1].check_in_date;
          const startDate = new Date(lastCheckInDate);
          const endDate = new Date(newCheckIn.check_in_date);

          for (let d = new Date(startDate); d < endDate; d.setDate(d.getDate() + 1)) {
            const dateString = d.toISOString().split('T')[0];
            if (
              !bulk_edit_list.some(
                (item: { check_in_date: string }) => item.check_in_date === dateString,
              )
            ) {
              bulk_edit_list.push({
                subject_id: Number(subjectId),
                check_in_date: dateString,
                reset_flag: false,
                is_check_in: false,
              });
            }
          }
          bulk_edit_list.push(newCheckIn);
        }
      } else {
        bulk_edit_list = [newCheckIn];
      }

      // make API call to update checkin date
      const requestBody = {
        bulk_edit_list: bulk_edit_list,
      };

      localStorage.setItem(storageKey, JSON.stringify(requestBody));
      const response = await API.RewardList.Checkin.Post(requestBody);
      // console.log('Checkin API Response:', response);
      const updatedRequestBody = {
        bulk_edit_list: [bulk_edit_list[bulk_edit_list.length - 1]],
      };
      localStorage.setItem(storageKey, JSON.stringify(updatedRequestBody));

      try {
        const userStatRes = await API.RewardList.UserStat.Get(subjectId);
        const userStatResponse: any = await userStatRes;
        if (userStatResponse.status_code === 200) {
          setUserStat(userStatResponse.data);
          // console.log('Updated user stats:', userStatResponse.data);
          try {
            const rewardRes = await API.RewardList.Reward.Get(subjectId);
            const rewardResponse: any = await rewardRes;
            console.log('Reward response after login:', rewardResponse);

            if (
              rewardResponse.status_code === 200 &&
              Array.isArray(rewardResponse.data)
            ) {
              // console.log('Setting reward data after login:', rewardResponse.data);
              let extendedRewards = [...rewardResponse.data];

              if (rewardResponse.data.length > 0) {
                const maxDayInResponse = Math.max(
                  ...rewardResponse.data.map((item: { day: any }) => item.day),
                );
                if (userStatResponse.data.current_streak > maxDayInResponse) {
                  console.log(
                    `Extending rewards from day ${maxDayInResponse + 1} to day ${userStatResponse.data.current_streak}`,
                  );

                  for (
                    let day = maxDayInResponse + 1;
                    day <= userStatResponse.data.current_streak;
                    day++
                  ) {
                    const templateIndex = (day - 1) % rewardResponse.data.length;
                    const templateReward = rewardResponse.data[templateIndex];

                    const newReward = {
                      ...templateReward,
                      day: day,
                      status: 'checkin',
                    };

                    extendedRewards.push(newReward);
                  }
                  extendedRewards.sort((a, b) => a.day - b.day);
                }
              }

              setRewardList(extendedRewards);
              localStorage.setItem('rewards', JSON.stringify(extendedRewards));
            }
          } catch (rewardError) {
            console.error('Error fetching rewards after login:', rewardError);
          }
        }
      } catch (statError) {
        console.error('Error fetching user stats after login:', statError);
      }

      // if was lose streak login, continue flow with streak page
      if (shouldUseCoins) {
        setShowStreakLoginPage(true);
        setCurrentPage(0);
      } else {
        // if not, we redirect to /avatar-custom page
        // on gift history tab instead
        navigate({
          to: "/avatar-custom",
          search: {
            tab: "gift-history"
          },
          viewTransition: true
        })
      }
    } catch (error) {
      console.error('Error in handleLoginPage:', error);
      setShowStreakLoginPage(true);
    }
  };

  const dialogStyle: React.CSSProperties = {
    display: 'flex',
    margin: 'auto',
    flexDirection: 'column',
    alignItems: 'flex-start',
    gap: '20px',
  };

  // if (!userStat) return <></>

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      <SafezonePanel className="absolute inset-0">

        {checkIfCheckedInToday(userStat?.last_checkin) || showStreakLoginPage ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <ButtonBack className="absolute left-10 top-10 w-16 h-16 z-10" />
            <div className="absolute top-[50px] right-[45px] w-fit h-[50px] px-4 flex items-center bg-white bg-center bg-contain gap-1 rounded-full">
              <div className="flex items-center">
                <img className="w-6 h-6 rounded-full" src={Coin}></img>
                <span className="coin-text text-white ml-2">{convertToMonetarySuffix(coins.gold_coin)}</span>
              </div>
              <div className="text-yellow-400">|</div>
              <div className="flex items-center">
                <img className="w-6 h-6 rounded-full" src={ImageCoinArcade}></img>
                <span className="key-text text-white ml-2">{convertToMonetarySuffix(coins.arcade_coin)}</span>
              </div>
              <div className="text-yellow-400">|</div>
              <div className="flex items-center">
                <img className="w-6 h-6 rounded-full" src={Ice}></img>
                <span className="key-text text-white ml-2">{convertToMonetarySuffix(coins.ice)}</span>
              </div>
            </div>

            <div className="w-full relative top-10">
              <div className="flex items-center justify-between w-3/4 m-auto mb-10 ">
                <div className="flex items-center">
                  <img src={BigPrize} alt="BigPrize" />
                  <div className="ml-5">
                    <div className="font-['Noto_Sans_Thai'] text-[40px] font-bold text-[#333] leading-normal">
                      {t('consecutive_login')}
                    </div>
                    <div className="font-['Noto_Sans_Thai'] text-[40px] font-bold text-[#333] leading-normal">
                      {t('to_collect_rewards')}
                    </div>
                    <div className="inline-block whitespace-nowrap font-['Noto_Sans_Thai']">
                      {t('consecutive_login_mission')}{' '}
                      <span className="font-bold text-[#333]">
                        {t('subject')} {subjectName}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <div
                    className="bg-white p-4 border-2 rounded-2xl bg-opacity-80 text-center w-[250px] h-[150px]"
                    style={{
                      boxShadow:
                        '0px 8px 0px 0px #DFDEDE, 0px 16px 8px 0px rgba(0, 0, 0, 0.15)',
                      opacity: 0.8,
                    }}
                  >
                    <div className="font-['Noto_Sans_Thai'] text-[#333] text-[50px] font-bold">
                      {userStat?.current_streak}
                    </div>
                    <div className="font-['Noto_Sans_Thai'] text-[30px] font-bold text-[#333]">
                      {t('consecutive_days')}
                    </div>
                  </div>
                  <div className="text-[20px] text-[#333] text-center font-['Noto_Sans_Thai'] mt-5">
                    {t('highest_streak')}{' '}
                    <span className="font-bold">{userStat?.highest_streak}</span>{' '}
                    {t('consecutive_days')}
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-center mx-12 relative pt-5">
                <Button
                  className={`h-[64px] w-[64px]`}
                  variant="success"
                  onClick={handlePrevPage}
                  disabled={currentPage === 0}
                >
                  <img className="h-10 w-10" src={ArrowLightLeft} />
                </Button>

                <div
                  className="absolute h-0.5 bg-gray-300"
                  style={{
                    top: '50%',
                    zIndex: 0,
                    left: '115px',
                    right: '115px',
                  }}
                />

                {getCurrentPageRewards().map((item, index) => (
                  <div
                    key={item.day}
                    className="flex flex-col items-center p-1"
                    style={{
                      height: '200px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'flex-start',
                      width: '140px',
                    }}
                  >
                    <div className="text-[20px] font-normal leading-normal text-[#333] text-center h-[40px] flex items-center justify-center">
                      {t('day')} {item.displayDay || item.day}
                    </div>
                    <div
                      className="relative"
                      style={{
                        height: '200px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <div
                        className={`rounded-full flex items-center justify-center overflow-hidden border-2 absolute`}
                        style={{
                          backgroundColor:
                            tierColors[mapTierToType(item.tier)].background,
                          borderColor: tierColors[mapTierToType(item.tier)].border,
                          boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                          transition: 'all 0.3s ease',
                          width:
                            item.displayDay === currentDay || item.day === currentDay
                              ? '160px'
                              : '110px',
                          height:
                            item.displayDay === currentDay || item.day === currentDay
                              ? '160px'
                              : '110px',
                          top: '50%',
                          left: '50%',
                          transform: 'translate(-50%, -50%)',
                        }}
                      >
                        <img
                          src={getIconForReward(item)}
                          alt={`Day ${item.day} reward`}
                          className="w-full h-full object-cover"
                          style={{
                            transition: 'all 0.3s ease',
                          }}
                        />
                        {(item.displayDay || item.day) <= currentDay &&
                          item.status !== 'non-checkin' && (
                            <img
                              src={item.status === 'ice' ? Ice : Check}
                              alt={item.status === 'ice' ? 'Ice Used' : 'Completed'}
                              className="absolute top-1/2 left-1/2 w-12 h-12 transform -translate-x-1/2 -translate-y-1/2"
                            />
                          )}
                      </div>
                    </div>
                  </div>
                ))}

                <Button
                  className={`h-[64px] w-[64px]`}
                  variant="success"
                  onClick={handleNextPage}
                  disabled={isLastPage()}
                >
                  <img className="h-10 w-10" src={ArrowLightRight} />
                </Button>
              </div>



              <div className="flex items-center justify-center mt-8">
                <div className="flex items-center gap-2 bg-[#FFF5D9] px-4 py-2 rounded-full min-w-[300px] min-h-[40px]">
                  <div className="flex items-center gap-2">
                    <img className="h-5 w-5" src={CheckConfirm} />
                    <span className="font-['Noto_Sans_Thai'] text-[20px]  text-[#333]">
                      {t('login_success')}
                    </span>
                  </div>
                  <Link
                    to={"/avatar-custom"}
                    search={{ tab: "gift-history" }}
                    className="underline font-['Noto_Sans_Thai'] text-[20px] font-bold text-[#333]"
                    viewTransition={true}
                  >
                    {t('go_to_rewards_page')}
                  </Link>
                </div>
              </div>
            </div>
          </div>



        ) : (
          <>
            {showMissedMissionDialog && isOnline && (
              <MissedMissionDialog
                isOpen={showMissedMissionDialog}
                dialogStyle={dialogStyle}
                onUseCoin={handleUseCoin}
                onUseItem={handleUseItem}
                onGiveUp={handleGiveUp}
                lastCheckin={userStat?.last_checkin}
                current_streak={userStat?.current_streak}
                gold_coin={coins.gold_coin}
                arcade_coin={coins.arcade_coin}
                isOnline={isOnline}
              />
            )}
          </>
        )}
        <ModalOffLineWarning
          overlay={true}
          isVisible={showOfflineModal}
          setVisible={setShowOfflineModal}
          onOk={() => {
            handleRetryOffline()
          }}
        />
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
