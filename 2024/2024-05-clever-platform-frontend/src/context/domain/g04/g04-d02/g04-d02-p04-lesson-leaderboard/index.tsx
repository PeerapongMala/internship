import LevelTab from '@component/web/organism/wc-o-level-tab';
import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import LeaderBoard from '@global/component/web/atom/wc-a-leaderboard';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreLessons from '@store/global/lessons';
import StoreSubjects from '@store/global/subjects';
import StoreSublessons from '@store/global/sublessons';
import { useParams } from '@tanstack/react-router';
import { SetStateAction, useCallback, useEffect, useState } from 'react';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import API from './api';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import Debug from './component/web/templates/wc-a-debug';
import { AccountList, StateTab } from './types';

interface DomainPathParams {
  lessonId: number;
}

const DomainJSX = () => {
  const [stateFlow, setStateFlow] = useState<StateTab>(StateTab.ClassroomTab);

  const { sublessonId } = useParams({ strict: false });
  const { isReady: lessonStoreIsReady } = StoreLessons.StateGet(['isReady']);
  const { isReady: sublessonStoreIsReady } = StoreSublessons.StateGet(['isReady']);
  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);

  //const [gameInfo, setGameInfo] = useState<MenuLeaderboardData | null>(null);
  const [account, setAccountInfo] = useState<AccountList[]>([]);
  const [records, setRecords] = useState<AccountList[]>([]);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  console.log({ currentSubject: currentSubject });
  const handleTabChange = (newTab: StateTab) => {
    setStateFlow(newTab);
    fetchRecords(newTab);
  };

  useEffect(() => {
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
  }, []);

  const { lessonId } = useParams({ strict: false }) as DomainPathParams;

  const gameInfo: any = {
    title:
      'ระดับชั้น ป.4  >  วิชา คณิตศาตร์  >  บทที่ 1: จำนวนนับ  >  บทเรียนย่อยที่ 1: rore ',
  };
  useEffect(() => {
    if (lessonStoreIsReady && sublessonStoreIsReady) {
      const loadedSublesson = StoreSublessons.MethodGet().get(sublessonId);
      StoreSublessons.MethodGet().sublessonSelect(loadedSublesson);
      const loadedLesson = StoreLessons.MethodGet().get(loadedSublesson?.lesson_id);
      const newBreadcrumbs = [];

      if (currentSubject) {
        newBreadcrumbs.push(`ระดับชั้น ${currentSubject.year_short_name}`);
        newBreadcrumbs.push(`วิชา${currentSubject.subject_name}`);
      }

      if (loadedLesson) {
        newBreadcrumbs.push(loadedLesson.name);
      }

      if (loadedSublesson) {
        newBreadcrumbs.push(loadedSublesson.name);
      }

      setBreadcrumbs(newBreadcrumbs);
    }
  }, [currentSubject, lessonStoreIsReady, sublessonStoreIsReady]);

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

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
  const [loading, setLoading] = useState<boolean>(false);

  const fetchRecords = useCallback(
    async (tab: StateTab) => {
      setLoading(true);
      try {
        const response = await API.LessonLeaderBoardData.LessonLeaderBoard.Get(
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
      } finally {
        setLoading(false);
      }
    },
    [sublessonId, startDate, endDate],
  );

  useEffect(() => {
    fetchRecords(stateFlow);
  }, [lessonId, stateFlow, startDate, endDate]);

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1 ">
      {/* Safezone */}
      <SafezonePanel className="flex inset-0">
        <Debug />
        <div className="flex gap-3 absolute w-full my-5 px-5">
          <ButtonBack className="w-[68px] h-[64px]" />
          {/* <LeaderBoardHeader info={gameInfo} /> */}
          <div className="w-full flex justify-start items-center rounded-[20px]  border-4 border-white bg-white bg-opacity-80 px-5 ">
            <h1 className="text-lg py-2">{breadcrumbs.join(' > ')}</h1>
          </div>
        </div>

        <div className="px-10 pt-40">
          <LevelTab activeTabName="Leaderboard" id={sublessonId} />
        </div>

        <div className=" mt-[120px] px-10">
          <LeaderBoard
            className="w-full h-[560px]"
            records={records}
            activeTab={stateFlow}
            onTabChange={handleTabChange}
            account={account}
            scoreStar={true}
            size="mid"
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
            loading={loading}
          />
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
