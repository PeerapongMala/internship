import LeaderBoard from '@component/web/atom/wc-a-arcade-leaderboard';
import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import LeaderBoardHeader from '@global/component/web/atom/wc-a-leaderboard-header';
import StoreBackgroundMusic from '@store/global/background-music';
import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import API from './api';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import Debug from './component/web/templates/wc-a-debug';

import ModalOffLineWarning from '@component/web/molecule/wc-m-modal-offline-warning';
import { useOnlineStatus } from '@global/helper/online-status';
import StoreGlobal from '@store/global';
import StoreGlobalPersist from '@store/global/persist';
import StoreSubjects from '@store/global/subjects';
import { useTranslation } from 'react-i18next';
import { findArcadeGameById } from './config/arcade-games';
import ConfigJson from './config/index.json';
import { AccountList, MinigameList, StateTab, UserDetail } from './types';

interface DomainPathParams {
  gameId: string;
}

export enum DisplayMode {
  Event = 'event',
  Weekly = 'week',
  Monthly = 'month',
}
export interface EventTab {
  id: number;
  title: string;
}
const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const [stateFlow, setStateFlow] = useState<StateTab>(StateTab.ClassroomTab);
  const [gameInfo, setGameInfo] = useState<MinigameList | null>(null);
  const [account, setAccountInfo] = useState<AccountList[]>([]);
  const [records, setRecords] = useState<AccountList[]>([]);
  const [minigames, setMinigames] = useState<MinigameList[]>([]);
  const [accountDetail, setAccountDetail] = useState<UserDetail>();
  const [displayMode, setDisplayMode] = useState<DisplayMode>(DisplayMode.Weekly);
  const [hasEvent, setHasEvent] = useState<boolean>(false);
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [eventTitle, setEventTitle] = useState<string>('กิจกรรม');
  const [playToken, setPlayToken] = useState<string>('');

  const [eventTabs, setEventTabs] = useState<EventTab[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<number | undefined>();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);

  const { accessToken } = StoreGlobalPersist.StateGet(["accessToken"]);

  const [isOfflineModalVisible, setOfflineModalVisible] = useState(false);
  const isOnline = useOnlineStatus();

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  const handleTabChange = (newTab: StateTab) => {
    setStateFlow(newTab);
    fetchRecords({
      tab: newTab,
      displayMode: displayMode,
    });
  };
  const handleEventTabChange = (eventId: number) => {
    setSelectedEventId(eventId);
    fetchRecords({
      tab: stateFlow,
      displayMode: DisplayMode.Event,
      eventId: eventId,
    });
  };

  const handleDisplayModeChange = (newDisplayMode: DisplayMode) => {
    setDisplayMode(newDisplayMode);
    fetchRecords({
      tab: stateFlow,
      displayMode: newDisplayMode,
    });
  };

  const handleArcadeCoinCostClick = () => {
    if (!isOnline) {
      setOfflineModalVisible(true);
      return;
    }

    const gameIdNumber = gameId;
    const selectedGame = findArcadeGameById(gameIdNumber);

    const handleBuyToken = async () => {
      try {
        const res = await API.ArcadeLeaderBoardData.BuyToken.Get({ arcadeGameId: gameIdNumber });

        if (res.status_code === 200) {
          return res.data.play_token;
        } else {
          console.log(res.message);
          return null;
        }
      } catch (err) {
        alert(err instanceof Error ? err.message : 'Failed to buy token');
        return null;
      }
    };

    const authorizeAndStart = async () => {
      try {
        const res = await API.ArcadeLeaderBoardData.CheckSession.Get({ arcadeGameId: gameIdNumber });
        if (res.status_code !== 200) {
          throw new Error('ไม่มีสิทธิ์เข้าเล่นเกม');
        }

        let playToken = '';

        if (res.data.play_id_exist === false) {
          // ยังไม่มี ต้องซื้อ token
          playToken = (await handleBuyToken()) || '';
        } else {
          // มี playid อยู่แล้ว ใช้อันเดิม
          playToken = res.data.play_token || '';
        }

        if (playToken && selectedGame) {
          setPlayToken(playToken); // เก็บ state เผื่อใช้ภายหลัง

          const url = new URL(selectedGame.link_game);
          url.searchParams.set("id", gameIdNumber.toString());
          url.searchParams.set("playToken", playToken);

          window.open(url.toString(), "_self", "noopener,noreferrer");
        } else {
          console.error(`ไม่พบเกมที่ตรงกับ ID: ${gameId}`);
        }
      } catch (error) {
        console.error('Authorization failed:', error);
      }
    };

    authorizeAndStart();
  };


  const handleRetryOffline = () => {
    StoreGlobal.MethodGet().loadingSet(true);
    new Promise((resolve) => {
      // wait for a sec for given a feedback
      // that we are retrying to connect
      setTimeout(
        () => {
          // if the user back to online, hide the offline warning modal
          if (isOnline) setOfflineModalVisible(false);
          resolve(true);
        },
        500 + (-250 + Math.random() * 500),
      );
    }).finally(() => {
      StoreGlobal.MethodGet().loadingSet(false);
    });
  };

  const { gameId } = useParams({ strict: false }) as DomainPathParams;
  console.log({ gameId: gameId });
  const navigate = useNavigate();

  // const { currentSubject: subject } = StoreSubjects.StateGet(['currentSubject']) as {
  //   currentSubject: SubjectListItem;
  // };
  // const subjectId = subject.subject_id;

  const handleClickBack = () => {
    navigate({ to: '/arcade-game', viewTransition: true });
  };
  interface EventTab {
    id: number;
    title: string;
  }

  const fetchEventTitle = async (eventId: number): Promise<string> => {
    try {
      const response = await API.ArcadeLeaderBoardData.ArcadeLeaderBoard.Get({
        arcadeGameId: gameId,
        displayMode: DisplayMode.Event,
        eventId: eventId,
      });

      if (response.data && Array.isArray(response.data) && response.data[1]?.title) {
        return response.data[1].title;
      }
      return `Activity ${eventId}`; // Fallback title
    } catch (error) {
      console.error(`Error fetching event ${eventId} title:`, error);
      return `Activity ${eventId}`;
    }
  };
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const response = await API.ArcadeLeaderBoardData.ArcadeLeaderBoard.Get({
          arcadeGameId: gameId,
          displayMode: DisplayMode.Event,
        });

        if (response.data && Array.isArray(response.data)) {
          const eventInfo = response.data[0]; // { event_total, event_ids }

          // ดึงชื่อกิจกรรมสำหรับแต่ละ event_id
          const tabsPromises = eventInfo.event_ids.map(async (id: any) => {
            const title = await fetchEventTitle(id);
            return { id, title };
          });

          const tabs = await Promise.all(tabsPromises);
          setEventTabs(tabs);

          if (tabs.length > 0) {
            setSelectedEventId(tabs[0].id);
          }
        }
      } catch (error) {
        console.error('Error fetching initial event data:', error);
      }
    };

    fetchInitialData();
  }, []);

  useEffect(() => {
    const fetchMinigames = async () => {
      try {
        const res = await API.ArcadeLeaderBoardData.ArcadeInfo.Get();
        const response: any = res;

        if (response.status_code === 200 && Array.isArray(response.data)) {
          setMinigames(response.data);
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchMinigames();
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await API.ArcadeLeaderBoardData.AccountInfo.Get();
        const response: any = res;
        if (response.status_code === 200) {
          console.log('Account Info:', response.data);
          setAccountDetail(response.data);
        } else {
          console.error('Invalid response format:', response);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchUser();
  }, []);

  const checkEventAvailability = async () => {
    try {
      const response = await API.ArcadeLeaderBoardData.ArcadeLeaderBoard.Get({
        arcadeGameId: gameId,
        tab: stateFlow,
        displayMode: DisplayMode.Event,
      });

      if (response.data && Array.isArray(response.data) && response.data[0]?.event_ids) {
        const eventIds = response.data[0].event_ids;
        const eventTitle = response.data[1]?.title || t('event');

        // สร้างแท็บจาก event_ids และใช้ title เดียวกันทั้งหมด
        const tabs = eventIds.map((id: any) => ({
          id,
          title: eventTitle,
        }));

        setEventTabs(tabs);
        setHasEvent(true);
        setEventTitle(eventTitle);

        // เลือกแท็บแรกโดยอัตโนมัติ
        if (eventIds.length > 0) {
          setSelectedEventId(eventIds[0]);
        }

        return true;
      }

      setHasEvent(false);
      return false;
    } catch (error) {
      console.log('No active event found');
      setHasEvent(false);
      return false;
    }
  };

  const fetchRecords = async ({
    tab = stateFlow,
    displayMode: displayModeParam = displayMode,
    eventId = selectedEventId,
  }) => {
    try {
      setIsLoading(true);
      const response = await API.ArcadeLeaderBoardData.ArcadeLeaderBoard.Get({
        arcadeGameId: gameId,
        tab: tab,
        displayMode: displayModeParam,
        eventId: displayModeParam === DisplayMode.Event ? eventId : undefined,
      });

      const result = response;

      if (result.status_code === 200 && result.data && result.data.length > 0) {
        const transformedData: AccountList[] =
          result.data[2]?.map(
            (entry: {
              no: number;
              student_image: string;
              student_name: string;
              total_score: number;
              total_time: number;
              me_flag: boolean;
            }) => ({
              index: entry.no,
              avatarImage: entry.student_image,
              username: entry.student_name,
              score: entry.total_score,
              time: `${entry.total_time}s`,
            }),
          ) || [];

        setRecords(transformedData);
        const myRecord = result.data[2]?.find(
          (entry: { me_flag: boolean }) => entry.me_flag,
        );
        if (myRecord) {
          setAccountInfo([
            {
              index: myRecord.no,
              avatarImage: myRecord.student_image,
              username: myRecord.student_name,
              score: myRecord.total_score,
              time: `${myRecord.total_time}s`,
            },
          ]);
        } else {
          setAccountInfo([]);
        }
        const timeInfo = result.data[1];
        if (timeInfo && timeInfo.start_date && timeInfo.end_date) {
          setStartDate(timeInfo.start_date);
          setEndDate(timeInfo.end_date);
        }
      } else {
        setRecords([]);
        setAccountInfo([]);
        throw new Error(result.message || 'No data available');
      }
    } catch (error) {
      console.error('Error fetching leaderboard records:', error);
      setRecords([]);
      setAccountInfo([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (gameId) {
      const initData = async () => {
        const eventAvailable = await checkEventAvailability();
        const initialDisplayMode = eventAvailable
          ? DisplayMode.Event
          : DisplayMode.Weekly;
        setDisplayMode(initialDisplayMode);

        fetchRecords({
          tab: stateFlow,
          displayMode: initialDisplayMode,
        });
      };
      initData();
    }
  }, [gameId]);

  useEffect(() => {
    if (gameId && minigames.length > 0) {
      const gameIdNumber = parseInt(gameId, 10);
      const foundGame = minigames.find((game) => game.id === gameIdNumber);

      if (foundGame) {
        setGameInfo({
          id: foundGame.id,
          name: foundGame.name,
          image_url: foundGame.image_url,
          arcade_coin_cost: foundGame.arcade_coin_cost,
        });
      } else {
        setGameInfo(null);
      }
    }
  }, [gameId, minigames]);

  return (
    <>
      <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
        {/* Safezone */}
        <SafezonePanel className="flex absolute items-start inset-0 bg-white bg-opacity-0">
          <Debug />
          <ButtonBack
            className="absolute left-10 top-3 w-[64px] h-[64px]"
            onClick={handleClickBack}
          />
          <LeaderBoardHeader
            info={gameInfo}
            account={account}
            userDetail={accountDetail}
            onBackClick={handleClickBack}
            onArcadeCoinCostClick={handleArcadeCoinCostClick}
          />

          <LeaderBoard
            records={records}
            activeTab={stateFlow}
            onTabChange={handleTabChange}
            account={account}
            scoreStar={true}
            size="full"
            startDate={startDate}
            endDate={endDate}
            hasEvent={hasEvent}
            displayMode={displayMode}
            onDisplayModeChange={handleDisplayModeChange}
            isLoading={isLoading}
            eventTitle={eventTitle}
            eventIds={eventTabs}
            selectedEventId={selectedEventId}
            onEventTabChange={handleEventTabChange}
          />
        </SafezonePanel>
      </ResponsiveScaler>
      <ModalOffLineWarning
        overlay={true}
        enablePlayOffline={false}
        isVisible={isOfflineModalVisible}
        setVisible={setOfflineModalVisible}
        onOk={handleRetryOffline}
      />
    </>
  );
};

export default DomainJSX;
