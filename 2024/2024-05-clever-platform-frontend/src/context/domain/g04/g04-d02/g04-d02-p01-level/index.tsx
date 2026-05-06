import './index.css';

import ButtonBack from '@component/web/atom/wc-a-button-back';
import LevelTab from '@component/web/organism/wc-o-level-tab';
import ImageCancelCircle from '@domain/g03/g03-d05/g03-d05-p01-shop/assets/cancel-circle.png';
import StoreGame from '@global/store/game';
import { MouseEvent, useCallback, useEffect, useRef, useState, WheelEvent } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import IconBook from './assets/level/icon-book.png';
import Debug from './component/web/templates/wc-a-debug';
import ConfigJson from './config/index.json';
// import styles from './index.module.css';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import { UserData } from '@domain/g02/g02-d01/local/type';
import { GameRewardList } from '@domain/g04/g04-d01/local/type';
import { LevelDetails } from '@domain/g04/g04-d03/local/type';
import { useOnlineStatus } from '@global/helper/online-status';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreLessons from '@store/global/lessons';
import StoreLevel from '@store/global/level';
import { useLevelUpdate } from '@store/global/level/use-level-update';
import StoreGlobalPersist from '@store/global/persist';
import StoreSubjects from '@store/global/subjects';
import StoreSublessons from '@store/global/sublessons';
import { useNavigate, useParams } from '@tanstack/react-router';
import LevelDialog from './component/web/templates/wc-a-leveldialog';
import LevelBox from './component/web/templates/wc-t-levelbox';
import { LevelList } from './type';

interface DomainPathParams {
  sublessonId: string;
}

type CombinedLevelType = LevelList & Omit<LevelDetails, 'status'>;

const DomainJSX = () => {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const isOnline = useOnlineStatus();

  const layoutRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);
  const [selectedLevel, setSelectedLevel] = useState<number | null>(null);
  const { sublessonId } = useParams({ strict: false }) as DomainPathParams;

  const { isReady: lessonStoreIsReady } = StoreLessons.StateGet(['isReady']);
  const { isReady: sublessonStoreIsReady } = StoreSublessons.StateGet(['isReady']);
  const { updateLevelToStore, isLevelUpdating } = useLevelUpdate();

  const { stateFlow } = StoreGame.StateGet(['stateFlow']);

  const [levelData, setLevelData] = useState<CombinedLevelType[]>([]);
  const [rewardDetail, setRewardDetail] = useState<GameRewardList | null>(null);
  const handleRewardDetailChange = useCallback(
    (newRewardDetail: GameRewardList | null) => {
      setRewardDetail(newRewardDetail);
    },
    [],
  );
  const [showModal, setShowModal] = useState(false);
  const handleShowModal = useCallback(() => {
    setShowModal(true);
  }, []);

  const [preTestData, setPreTestData] = useState<LevelList | null>(null);
  const [postTestData, setPostTestData] = useState<LevelList | null>(null);
  const [endTestData, setEndTestData] = useState<LevelList | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lineWidth, setLineWidth] = useState(0);
  const [selectedLevelData, setSelectedLevelData] = useState<
    LevelDetails | any | undefined
  >();
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);
  const { userData } = StoreGlobalPersist.StateGet(['userData']) as {
    userData: UserData;
  };

  const handlePreTestClick = () => {
    if (preTestData) {
      setSelectedLevel(preTestData.level);
    }
  };

  const convertTime = (time: number | string | undefined | null) => {
    if (!time) return '--:--';
    const minutes = Math.floor(Number(time) / 60);
    const seconds = Number(time) % 60;
    return `${minutes < 10 ? `0${minutes}` : minutes}:${seconds < 10 ? `0${seconds}` : seconds}`;
  };

  const handleLevelClick = (level: number, isPreTest: boolean = false) => {
    setSelectedLevel(level);
  };

  const handleCloseDialog = () => {
    setSelectedLevel(null);
  };

  const handleMouseDown = (e: MouseEvent<HTMLDivElement>) => {
    if (layoutRef.current) {
      setIsDragging(true);
      setStartX(e.pageX - layoutRef.current.offsetLeft);
      setScrollLeft(layoutRef.current.scrollLeft);
      layoutRef.current.classList.add('active');
    }
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
    if (layoutRef.current) {
      layoutRef.current.classList.remove('active');
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    if (layoutRef.current) {
      layoutRef.current.classList.remove('active');
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !layoutRef.current) return;
    e.preventDefault();
    const x = e.pageX - layoutRef.current.offsetLeft;
    const walk = (x - startX) * 2; // ความเร็วในการเลื่อน
    layoutRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleWheel = (e: WheelEvent<HTMLDivElement>) => {
    if (layoutRef.current) {
      e.preventDefault();
      layoutRef.current.scrollLeft += e.deltaY; // ใช้ deltaY เพื่อเลื่อนในแนวนอน
    }
  };

  const handleBackClick = () => {
    const loadedSublesson = StoreSublessons.MethodGet().get(sublessonId);
    const lessonId = loadedSublesson?.lesson_id;
    navigate({ to: `/sublesson/${lessonId}`, replace: true });
  };

  useEffect(() => {
    if (sublessonStoreIsReady && !isLevelUpdating) {
      StoreGlobal.MethodGet().loadingSet(true);
      try {
        const levelStoreSublesson = StoreSublessons.MethodGet().getLevelsByStudent(
          sublessonId,
          userData.id,
        ) as LevelList[];
        const levelStoreLevel = StoreLevel.MethodGet().getLevels();

        const newLevelData = levelStoreSublesson?.map((level) => {
          const levelDetails = levelStoreLevel[level.id] ?? ({} as LevelDetails);
          return { ...levelDetails, ...level };
        }) as CombinedLevelType[];

        setLevelData(newLevelData);
      } finally {
        StoreGlobal.MethodGet().loadingSet(false);
      }
    }
  }, [sublessonId, sublessonStoreIsReady, isLevelUpdating]);

  useEffect(() => {
    const findLevel = levelData.find((data) => data.level === selectedLevel);
    setSelectedLevelData(findLevel);

    if (!findLevel) return;
    StoreLevel.MethodGet().setQueryId({
      lessonId: findLevel?.lesson_id.toString(),
      sublessonId: findLevel?.sub_lesson_id.toString(),
      levelId: findLevel?.id.toString(),
      questionId: '',
    });
    StoreLevel.MethodGet().setHomeworkId(undefined);
  }, [selectedLevel]);

  useEffect(() => {
    if (lessonStoreIsReady && sublessonStoreIsReady) {
      StoreGlobal.MethodGet().loadingSet(true);
      try {
        const loadedSublesson = StoreSublessons.MethodGet().get(sublessonId);
        if (!loadedSublesson) {
          navigate({ to: '/main-menu', replace: true });
          return;
        }

        StoreSublessons.MethodGet().sublessonSelect(loadedSublesson);
        const loadedLesson = StoreLessons.MethodGet().get(loadedSublesson?.lesson_id);

        const newBreadcrumbs = [];
        if (currentSubject) {
          newBreadcrumbs.push(`ระดับชั้น ${currentSubject.year_short_name}`);
          newBreadcrumbs.push(`วิชา${currentSubject.subject_name}`);
        }
        if (loadedLesson) newBreadcrumbs.push(loadedLesson.name);
        if (loadedSublesson) newBreadcrumbs.push(loadedSublesson.name);

        setBreadcrumbs(newBreadcrumbs);
      } finally {
        StoreGlobal.MethodGet().loadingSet(false);
      }
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

  useEffect(() => {
    setLineWidth(layoutRef.current?.scrollWidth ?? 0);
  }, [layoutRef.current]);

  useEffect(() => {
    const fetchLevels = async () => {
      if (isOnline) {
        StoreGlobal.MethodGet().loadingSet(true);
        try {
          await updateLevelToStore(sublessonId);
        } finally {
          StoreGlobal.MethodGet().loadingSet(false);
        }
      }
    };
    fetchLevels();
  }, [sublessonId, isOnline]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(0);
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_4');
  }, []);

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      {/* Safezone */}
      <SafezonePanel className="w-full">
        <Debug />
        {stateFlow == 0 && (
          <div className="w-full">
            <div className="flex gap-3 absolute w-full my-5 px-5 ">
              <ButtonBack className="w-[68px] h-[64px]" onClick={handleBackClick} />
              <div className="w-full flex justify-start items-center rounded-[20px]  border-4 border-white bg-white bg-opacity-80 px-5 ">
                <img src={IconBook} width={32} />
                <h1 className="text-lg py-2">{breadcrumbs.join(' > ')}</h1>
              </div>
            </div>

            {/* <div className="coin-tab">
              <div className="avatar">
                <img style={{ width: '48px', height: '48px' }} src={Avatar} />
              </div>
              <div className="coin">
                <div className="coins">
                  <img width={32} src={Coin} />
                  99,000
                </div>
                <div>
                  <img width={32} src={Key} />
                  99,123k
                </div>
              </div>
            </div> */}

            <div className="main">
              {/* <div className="tab"> */}
              <div className="relative top-14 left-2.5">
                <LevelTab activeTabName="Level" id={sublessonId} />
                {/* <NavLeft
                  onTabChange={(tabName) => {
                    console.log(tabName);
                  }}
                /> */}
              </div>

              <div
                ref={layoutRef}
                className="main-layout !px-4 !mr-6"
                onMouseDown={handleMouseDown}
                onMouseLeave={handleMouseLeave}
                onMouseUp={handleMouseUp}
                onMouseMove={handleMouseMove}
                onWheel={handleWheel}
              >
                <div className="line" style={{ width: `${lineWidth}px` }} />
                {levelData?.map((data) => (
                  <LevelBox
                    key={data.id}
                    id={data.id}
                    level={data.level}
                    levelType={data.level_type}
                    difficulty={data.difficulty}
                    status={data.status}
                    star={data.star}
                    isOdd={(data.level - 1) % 2 === 0}
                    onClick={() => handleLevelClick(data.level)}
                  />
                ))}
              </div>
            </div>
          </div>
        )}
      </SafezonePanel>
      {showModal && (
        <div>
          <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="bg-white h-[70%] w-[70%] rounded-[60px] p-2">
              <div className="flex flex-col bg-[#DADADA] h-full w-full rounded-[55px]">
                <div className="flex relative w-full justify-center border-b-2 border-dashed border-secondary py-4">
                  <div className="text-3xl font-bold">{rewardDetail?.name}</div>
                  <img
                    className="absolute h-8 right-11 cursor-pointer"
                    src={ImageCancelCircle}
                    onClick={() => setShowModal(false)}
                  />
                </div>
                <div className="grid grid-cols-7 h-full z-50">
                  <img
                    className="relative top-[-7%] h-80 col-span-3 self-center justify-self-center"
                    src={rewardDetail?.image_url}
                  />
                  <div className="col-span-4 pt-10 pr-10 text-3xl font-light leading-relaxed right-[35%] top-[30%]">
                    {rewardDetail?.description}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="opacity-70 absolute inset-0 z-40 w-[100000%] h-[100000%] top-[-1000%] left-[-1000%] bg-black"></div>
        </div>
      )}

      <LevelDialog
        isOpen={selectedLevel ? true : false}
        onClose={handleCloseDialog}
        levelId={selectedLevelData?.id}
        level={selectedLevelData?.level ?? 0}
        difficulty={selectedLevelData?.difficulty}
        question_count={selectedLevelData?.question_count}
        stars={levelData.find((data) => data.level === selectedLevel)?.star}
        duration={convertTime(
          levelData.find((data) => data.level === selectedLevel)?.time_used,
        )}
        game_reward={selectedLevelData?.game_reward}
        gold_coin={selectedLevelData?.gold_coin}
        arcade_coin={selectedLevelData?.arcade_coin}
        setRewardDetail={handleRewardDetailChange}
        rewardDetail={rewardDetail}
        setShowModal={handleShowModal}
      />
    </ResponsiveScaler>
  );
};

export default DomainJSX;
