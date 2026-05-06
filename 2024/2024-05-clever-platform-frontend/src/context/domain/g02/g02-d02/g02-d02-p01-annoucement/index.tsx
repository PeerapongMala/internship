import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import StoreGame from '@global/store/game';
import API from './api';
import ImageBGLogin from './assets/background.png';
// Components
import { DataAPIResponse } from '@core/helper/api-type';
import StoreGlobal from '@store/global';
import StoreSubjects from '@store/global/subjects';
import { useNavigate } from '@tanstack/react-router';
import { SubjectListItem } from '../local/type';
import AnnounceBody from './component/template/announce-body';
import AnnounceFooter from './component/template/announce-footer';
import AnnounceTab from './component/template/announce-tab';
import ConfigJson from './config/index.json';
import { AnnounceContent, AnnounceData, AnnounceMenuState } from './type';

import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import {
  Announcement,
  announcementDataResponseHelper,
} from '@component/web/organism/infodialog-body';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreGlobalPersist from '@store/global/persist';
import styles from './styles.module.css';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  // get initialized status, this should be true when we already enter main-menu once
  const { initializedIs } = StoreGlobal.StateGet(['initializedIs']);
  const { appVersion } = StoreGlobal.StateGet(['appVersion']);
  const { localAppVersion } = StoreGlobalPersist.StateGet(['localAppVersion']);
  // get subject for handle navigate logic flow
  const { currentSubject: subject } = StoreSubjects.StateGet(['currentSubject']) as {
    currentSubject: SubjectListItem;
  };

  const [InterfaceState, SetInterfaceState] = useState<AnnounceMenuState>({
    selectedAnnounce: 0,
    selectedTab: 0,
  });

  // Announce lists
  const [SchoolAnnounceData, setSchoolAnnounceData] = useState<
    Announcement<AnnounceContent>[]
  >([]);
  const [SystemAnnounceData, setSystemAnnounceData] = useState<
    Announcement<AnnounceContent>[]
  >([]);

  // Initial page state
  useEffect(() => {
    // Set local app version if not set or different from current app version
    if (localAppVersion === 'none' || localAppVersion !== appVersion) {
      StoreGlobalPersist.MethodGet().setLocalAppVersion(appVersion);
    }

    // Initial flow state
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(1);

    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_2');

    // Fetching data
    API.Global.Announcement.School.Get()
      .then((res: DataAPIResponse<AnnounceData[]>) => {
        if (res.status_code === 200) {
          // mapping data from API response to Announcement type
          const data = res.data.map(announcementDataResponseHelper<AnnounceContent>);
          setSchoolAnnounceData(data);
        }
      })
      .catch((err: string) => console.error(err));

    API.Global.Announcement.System.Get()
      .then((res: DataAPIResponse<AnnounceData[]>) => {
        if (res.status_code === 200) {
          // mapping data from API response to Announcement type
          const data = res.data.map(announcementDataResponseHelper<AnnounceContent>);
          setSystemAnnounceData(data);
        }
      })
      .catch((err: string) => console.error(err));
  }, [appVersion, localAppVersion]);

  // Mark as read first announcement on tab switch
  useEffect(() => {
    if (getAnnounceData().length > 0) handleAnnouncementRead(0);
  }, [InterfaceState.selectedTab]);

  // Functions
  const getAnnounceData = () => {
    if (InterfaceState.selectedTab === 0) return SchoolAnnounceData;
    else if (InterfaceState.selectedTab === 1) return SystemAnnounceData;
    return [];
  };

  const handleTabClick = (stateflow: number) => {
    SetInterfaceState({
      selectedAnnounce: 0,
      selectedTab: stateflow,
    });
  };

  const handleTabClose = () => {
    // if not, navigate to select subject
    if (!subject) {
      navigate({ to: '/subject-select', viewTransition: true });
    }
    // if we already initialized the content, no need to display loading scene
    else if (initializedIs) {
      navigate({ to: '/main-menu', replace: true, viewTransition: true });
    }
    // otherwise, navigate to initial scene
    else {
      // stop background music before enter loading scene
      StoreBackgroundMusic.MethodGet().stopSound();
      // if already select subject, navigate to main menu
      navigate({ to: '/initial', replace: true, viewTransition: true });
    }
  };

  const handleAnnouncementRead = (selectedIndex: number) => {
    const announcementTab = InterfaceState.selectedTab;
    SetInterfaceState({
      selectedAnnounce: selectedIndex,
      selectedTab: announcementTab,
    });

    // update read status
    const announcement = getAnnounceData()[selectedIndex];
    if (announcement && announcement.announcement_id && !announcement.is_read) {
      API.Global.Announcement.ReadById.Patch(announcement.announcement_id)
        .then(() => {
          if (announcementTab === 0) {
            setSchoolAnnounceData((prev) => {
              const newData = [...prev];
              newData[selectedIndex].is_read = true;
              return newData;
            });
          } else if (announcementTab === 1) {
            setSystemAnnounceData((prev) => {
              const newData = [...prev];
              newData[selectedIndex].is_read = true;
              return newData;
            });
          }
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const handleAllReadAnnouncement = () => {
    const announcementTab = InterfaceState.selectedTab;
    if (announcementTab === 0) {
      // Read all school announcement
      API.Global.Announcement.ReadAllSchool.Post()
        .then(() => {
          setSchoolAnnounceData((prev) => {
            return [...prev.map((item) => ({ ...item, is_read: true }))];
          });
        })
        .catch((err) => {
          console.error(err);
        });
    } else if (announcementTab === 1) {
      // Read all system announcement
      API.Global.Announcement.ReadAllSystem.Post()
        .then(() => {
          setSystemAnnounceData((prev) => {
            return [...prev.map((item) => ({ ...item, is_read: true }))];
          });
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  return (
    <ResponsiveScaler
      scenarioSize={{ width: 1280, height: 720 }}
      deBugVisibleIs={false}
      className="flex-1 bg-gray-800"
    >
      {/* Background Image */}
      <div
        // className="absolute inset-0 bg-contain bg-bottom bg-no-repeat"
        className="absolute inset-0 bg-cover bg-bottom"
        style={{ backgroundImage: `url(${ImageBGLogin})` }}
      ></div>
      {/* Safezone */}
      <SafezonePanel>
        {/*Announcement Container*/}
        <div className={`absolute inset-0 ${styles['AnnouncementContent']}`}>
          {/*Announcement TopBar*/}
          <AnnounceTab
            interfaceState={InterfaceState}
            onTabClick={handleTabClick}
            onTabClose={handleTabClose}
          />
          {/*Announcement Body*/}
          <AnnounceBody
            t={t}
            announcements={getAnnounceData()}
            noAnnouncementText={
              InterfaceState?.selectedTab === 0
                ? t('no_announcement_from_school')
                : t('no_announcement_from_system')
            }
            selectedIndex={InterfaceState?.selectedAnnounce}
            onSlotsClick={handleAnnouncementRead}
          />
          {/*Announcement Footer*/}
          <AnnounceFooter
            t={t}
            currentTabSelected={InterfaceState?.selectedTab}
            onAllReadClicked={handleAllReadAnnouncement}
          />
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
