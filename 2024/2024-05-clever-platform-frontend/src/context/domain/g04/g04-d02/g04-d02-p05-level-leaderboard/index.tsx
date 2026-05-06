import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import LeaderBoard from '@global/component/web/atom/wc-a-leaderboard';
import { LeaderBoardHeader } from '@global/component/web/atom/wc-a-leaderboard-header';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreLessons from '@store/global/lessons';
import StoreSubjects from '@store/global/subjects';
import StoreSublessons from '@store/global/sublessons';
import { useNavigate, useParams } from '@tanstack/react-router';
import { SetStateAction, useEffect, useMemo, useState } from 'react';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import API from './api';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import Debug from './component/web/templates/wc-a-debug';
import { AccountList, StateTab } from './types';

interface DomainPathParams {
  sublessonId: number;
}

const DomainJSX = () => {
  const [stateFlow, setStateFlow] = useState<StateTab>(StateTab.ClassroomTab);
  //const [gameInfo, setGameInfo] = useState<MenuLeaderboardData | null>(null);
  const [account, setAccountInfo] = useState<AccountList[]>([]);
  const [records, setRecords] = useState<AccountList[]>([]);

  const getFilterType = (tab: StateTab): string => {
    switch (tab) {
      case StateTab.CountryTab:
        return 'all';
      case StateTab.AffiliationTab:
        return 'affiliation';
      case StateTab.YearTab:
        return 'school';
      case StateTab.ClassroomTab:
        return 'class';
      default:
        return 'all';
    }
  };

  const handleTabChange = (newTab: StateTab) => {
    setStateFlow(newTab);
    fetchRecords(newTab);
  };

  const { sublessonId } = useParams({ strict: false }) as DomainPathParams;
  const { isReady: lessonStoreIsReady } = StoreLessons.StateGet(['isReady']);
  const { isReady: sublessonStoreIsReady } = StoreSublessons.StateGet(['isReady']);
  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);
  const navigate = useNavigate();

  const handleClickBack = (sublessonId: number) => {
    navigate({ to: `/level/${sublessonId}`, viewTransition: true });
  };

  const gameInfo = useMemo(() => {
    const breadcrumbs = [];
    if (lessonStoreIsReady && sublessonStoreIsReady) {
      const loadedSublesson = StoreSublessons.MethodGet().get(sublessonId);
      // redirect to 404 if sublesson not found
      if (!loadedSublesson) {
        navigate({ to: '/main-menu', replace: true });
      }
      StoreSublessons.MethodGet().sublessonSelect(loadedSublesson);

      const loadedLesson = StoreLessons.MethodGet().get(loadedSublesson?.lesson_id);

      if (currentSubject) {
        breadcrumbs.push(`ระดับชั้น ${currentSubject.year_short_name}`);
        breadcrumbs.push(`วิชา${currentSubject.subject_name}`);
      }

      if (loadedLesson) {
        breadcrumbs.push(loadedLesson.name);
      }

      if (loadedSublesson) {
        breadcrumbs.push(loadedSublesson.name);
      }
    }
    return { name: breadcrumbs.length > 0 ? breadcrumbs.join(' > ') : '' };
  }, [currentSubject, lessonStoreIsReady, sublessonStoreIsReady]);

  const getStartOfWeek = () => {
    const today = new Date();
    const day = today.getDay();

    const mondayOffset = day === 0 ? -6 : 1 - day;
    const monday = new Date(today);
    monday.setDate(today.getDate() + mondayOffset);
    monday.setHours(0, 0, 0, 0);

    return monday;
  };
  const getEndOfWeek = () => {
    const startOfWeek = getStartOfWeek();
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);
    endOfWeek.setHours(23, 59, 59, 999);

    return endOfWeek;
  };

  const formatDate = (date: {
    getFullYear: () => any;
    getMonth: () => number;
    getDate: () => any;
  }) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  const [startDate, setStartDate] = useState(formatDate(getStartOfWeek()));
  const [endDate, setEndDate] = useState(formatDate(getEndOfWeek()));

  const fetchRecords = async (tab: StateTab) => {
    try {
      const response = await API.LevelLeaderBoardData.LevelLeaderBoard.Get(
        sublessonId,
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
    } catch (error) {
      console.error('Error fetching data:', error);
      setRecords([]);
      setAccountInfo([]);
    }
  };

  useEffect(() => {
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
  }, []);

  useEffect(() => {
    fetchRecords(stateFlow);
  }, [sublessonId, stateFlow, startDate, endDate]);

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
  //   API.LevelLeaderBoardData.AccountInfo.Get()
  //     .then((res: { json: () => any }) => res.json())
  //     .then((data: LevelLeaderboardData[]) => {
  //       setAccountInfo(data);
  //     })
  //     .catch((error: any) => console.error('Error fetching account info:', error));
  // }, []);

  // Fetch Tab
  useEffect(() => {
    fetchRecords(stateFlow);
  }, [sublessonId, stateFlow]);

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      {/* Safezone */}
      <SafezonePanel className="flex absolute items-start inset-0">
        <Debug />
        <ButtonBack
          className="absolute left-10 top-3 w-[64px] h-[64px]"
          onClick={() => handleClickBack(sublessonId)}
        />

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
          onDateChange={(
            newStartDate: SetStateAction<string>,
            newEndDate: SetStateAction<string>,
          ) => {
            setStartDate(newStartDate);
            setEndDate(newEndDate);
            fetchRecords(stateFlow);
          }}
        />
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
