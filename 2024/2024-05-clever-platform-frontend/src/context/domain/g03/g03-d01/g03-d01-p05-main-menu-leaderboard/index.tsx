import WCAGuardedRoute from '@component/web/atom/wc-a-guarded-route';
import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import LeaderBoard from '@global/component/web/atom/wc-a-leaderboard';
import LeaderBoardHeader from '@global/component/web/atom/wc-a-leaderboard-header';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreSubjects from '@store/global/subjects';
import { useParams } from '@tanstack/react-router';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import API from './api';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import Debug from './component/web/templates/wc-a-debug';
import { AccountList, StateTab } from './types';

interface DomainPathParams {
  gameId: number;
}

const DomainJSX = () => {
  const [stateFlow, setStateFlow] = useState<StateTab>(StateTab.ClassroomTab);
  //const [gameInfo, setGameInfo] = useState<MenuLeaderboardData | null>(null);
  const [account, setAccountInfo] = useState<AccountList[]>([]);
  const [records, setRecords] = useState<AccountList[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const { currentSubject: subject } = StoreSubjects.StateGet(['currentSubject']);
  useEffect(() => {
    // set background image by subject group id
    if (subject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        subject.seed_subject_group_id,
      );
    }
  }, [subject]);

  const handleTabChange = (newTab: StateTab) => {
    setStateFlow(newTab);
  };

  const { gameId } = useParams({ strict: false }) as DomainPathParams;

  const gameInfo = {
    name: `ระดับชั้น ${subject?.year_short_name || ''} > ${subject?.subject_name || ''}`,
  };

  const getStartOfWeek = () => {
    const today = new Date();
    const day = today.getDay();

    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);

    return monday;
  };
  const getEndOfWeek = () => {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    return endOfWeek;
  };

  const formatDate = (date: Date): string => {
    const year = date.getFullYear();
    const month = `${date.getMonth() + 1}`.padStart(2, '0');
    const day = `${date.getDate()}`.padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(formatDate(getStartOfWeek()));
  const [endDate, setEndDate] = useState(formatDate(getEndOfWeek()));

  const fetchRecords = useCallback(
    async (tab: StateTab) => {
      setLoading(true);
      try {
        if (subject) {
          const response = await API.MenuLeaderBoard.MenuLeaderBoard.Get(
            subject.subject_id,
            tab,
            startDate,
            endDate,
          );

          const result = await response.json();

          if (result.status_code === 200 && result.data && result.data.length > 0) {
            const transformedData: AccountList[] = result.data.map(
              (entry: {
                no: any;
                user_image_url: any;
                user_name: any;
                star: any;
                time_used: any;
              }) => ({
                index: entry.no,
                avatarImage: entry.user_image_url,
                username: entry.user_name,
                score: entry.star,
                time: `${entry.time_used}s`,
              }),
            );

            setRecords(transformedData);

            const myRecord = result.data.find((entry: { me_flag: any }) => entry.me_flag);
            if (myRecord) {
              setAccountInfo([
                {
                  index: myRecord.no,
                  avatarImage: myRecord.user_image_url,
                  username: myRecord.user_name,
                  score: myRecord.star,
                  time: `${myRecord.time_used}s`,
                },
              ]);
            } else {
              setAccountInfo([]);
            }
          } else {
            setRecords([]);
            setAccountInfo([]);
            throw new Error(result.message || 'No data available');
          }
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setRecords([]);
        setAccountInfo([]);
      } finally {
        setLoading(false);
      }
    },
    [subject, startDate, endDate],
  );

  useEffect(() => {
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []);

  useEffect(() => {
    fetchRecords(stateFlow);
  }, [fetchRecords, stateFlow]);

  // Fetch Header
  // useEffect(() => {
  //   API.MenuLeaderBoard.MenuInfo.Get()
  //     .then((res: { json: () => any }) => res.json())
  //     .then((data: MenuLeaderboardData) => {
  //       setGameInfo(data);
  //     })
  //     .catch((error: any) => console.error('Error fetching game info:', error));
  // }, [gameId]);

  // Fetch Account
  // useEffect(() => {
  //   API.MenuLeaderBoard.AccountInfo.Get()
  //     .then((res: { json: () => any }) => res.json())
  //     .then((data: AccountList[]) => {
  //       setAccountInfo(data);
  //     })
  //     .catch((error: any) => console.error('Error fetching account info:', error));
  // }, []);

  // Fetch Tab
  // useEffect(() => {
  //   fetchRecords(stateFlow);
  // }, [gameId, stateFlow]);

  return (
    <WCAGuardedRoute redirectPath="/main-menu-leaderboard">
      <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
        {/* Safezone */}
        <SafezonePanel className="flex absolute items-start inset-0 bg-white bg-opacity-0">
          <Debug />
          <ButtonBack className="absolute left-10 top-3 w-[64px] h-[64px]" />
          <LeaderBoardHeader info={gameInfo} />

          <LeaderBoard
            records={records}
            activeTab={stateFlow}
            onTabChange={handleTabChange}
            account={account}
            scoreStar={true}
            size="full"
            startDate={startDate}
            endDate={endDate}
            loading={loading}
            onDateChange={(
              newStartDate: SetStateAction<string>,
              newEndDate: SetStateAction<string>,
            ) => {
              setStartDate(newStartDate);
              setEndDate(newEndDate);
            }}
          />
        </SafezonePanel>
      </ResponsiveScaler>
    </WCAGuardedRoute>
  );
};

export default DomainJSX;
