import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import StoreGame from '@global/store/game';
// Components
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import {
  Announcement,
  announcementDataResponseHelper,
} from '@component/web/organism/infodialog-body';
import { BaseAPIResponse } from '@core/helper/api-type';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreSubjects from '@store/global/subjects';
import { useNavigate } from '@tanstack/react-router';
import API from '../local/api';
import {
  ActivityContent,
  AnnounceMenuState,
  GiftContent,
  MailboxContent,
  NotificationContent,
} from '../local/type';
import AnnounceBody from './component/web/templates/wc-t-announce-body';
import AnnounceFooter from './component/web/templates/wc-t-announce-footer';
import AnnounceTab from './component/web/templates/wc-t-announce-tab';
import ConfigJson from './config/index.json';
// import styles from './index.module.css';

const DomainJSX = () => {
  const { t, i18n } = useTranslation([ConfigJson.key]);
  const navigate = useNavigate();

  const { currentSubject: subject } = StoreSubjects.StateGet(['currentSubject']);

  const [InterfaceState, SetInterfaceState] = useState<AnnounceMenuState>({
    selectedAnnounce: -1,
    selectedTab: 0,
  });

  // Announce lists
  const [ActivityAnnounceData, setActivityAnnounceData] = useState<
    Announcement<ActivityContent>[]
  >([]);
  const [MailboxAnnounceData, setMailboxAnnounceData] = useState<
    Announcement<MailboxContent>[]
  >([]);
  const [GiftAnnounceData, setGiftAnnounceData] = useState<Announcement<GiftContent>[]>(
    [],
  );
  const [NotificationAnnounceData, setNotificationAnnounceData] = useState<
    Announcement<NotificationContent>[]
  >([]);

  const [isAnnouncementLoaded, setAnnouncementLoad] = useState(false);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(1);

    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []);

  useEffect(() => {
    if (subject && subject.subject_id) {
      Promise.all([
        API.Global.Acivities.Get(subject.subject_id),
        API.Global.Mailboxes.Get(subject.subject_id),
        API.Global.Gifts.Get(subject.subject_id),
        API.Global.Notification.Get(subject.subject_id),
      ]).then(([activityRes, mailboxRes, giftRes, notificationRes]) => {
        if (activityRes.status_code === 200) {
          const data = activityRes.data.map(
            announcementDataResponseHelper<ActivityContent>,
          );
          setActivityAnnounceData(data);
        }
        if (mailboxRes.status_code === 200) {
          const data = mailboxRes.data.map(
            announcementDataResponseHelper<MailboxContent>,
          );
          setMailboxAnnounceData(data);
        }
        if (giftRes.status_code === 200) {
          const data = giftRes.data.map(announcementDataResponseHelper<GiftContent>);
          setGiftAnnounceData(data);
        }
        if (notificationRes.status_code === 200) {
          const data = notificationRes.data.map(
            announcementDataResponseHelper<NotificationContent>,
          );
          setNotificationAnnounceData(data);
        }

        setAnnouncementLoad(true);
      });

      // set background image by subject group id
      if (subject?.seed_subject_group_id) {
        StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
          subject.seed_subject_group_id,
        );
      }
    }
  }, [subject]);

  useEffect(() => {
    if (isAnnouncementLoaded && getAnnounceData().length > 0) {
      // read the first announcement
      handleAnnouncementRead();
    }
  }, [isAnnouncementLoaded]);

  const noAnnouncementText = useMemo(() => {
    switch (InterfaceState.selectedTab) {
      case 0:
        return t('no_announcement_text.activity');
      case 1:
        return t('no_announcement_text.mailbox');
      case 2:
        return t('no_announcement_text.teacher_rewards');
      case 3:
        return t('no_announcement_text.notifications');
      default:
        return '';
    }
  }, [InterfaceState.selectedTab]);

  // Functions
  const getAnnounceData = () => {
    return getAnnounceDataByTab(InterfaceState.selectedTab);
  };

  const getAnnounceDataByTab = (tabIndex: number) => {
    switch (tabIndex) {
      case 0:
        return ActivityAnnounceData;
      case 1:
        return MailboxAnnounceData;
      case 2:
        return GiftAnnounceData;
      case 3:
        return NotificationAnnounceData;
      default:
        return [];
    }
  };

  const updateAnnounceState = () => {
    switch (InterfaceState.selectedTab) {
      case 0:
        return setActivityAnnounceData([...ActivityAnnounceData]);
      case 1:
        return setMailboxAnnounceData([...MailboxAnnounceData]);
      case 2:
        return setGiftAnnounceData([...GiftAnnounceData]);
      case 3:
        return setNotificationAnnounceData([...NotificationAnnounceData]);
      default:
        break;
    }
  };
  // Events
  const handleTabClick = (stateflow: number) => {
    const initialSelectedAnnounceIndex = 0;
    SetInterfaceState({
      selectedAnnounce: initialSelectedAnnounceIndex,
      selectedTab: stateflow,
    });

    // alway mark as read first announcement on tab switch
    getAnnounceDataByTab(stateflow)[initialSelectedAnnounceIndex].is_read = true;
    updateAnnounceState();
  };

  const handleAnnouncementRead = (selectedIndex: number = 0) => {
    const { selectedTab } = InterfaceState;
    const announcement = getAnnounceData()[selectedIndex];

    // update slot
    SetInterfaceState((prev) => ({ ...prev, selectedAnnounce: selectedIndex }));

    // if announcement is already read or selectedTab is teacher gift,
    // do not call API and return
    if (announcement.is_read || selectedTab === 2) return;

    // determine which API to call
    let apiCall: () => Promise<BaseAPIResponse>;
    if (selectedTab === 0) {
      apiCall = () => API.Global['Acivities'].Read(`${announcement.announcement_id}`);
    } else if (selectedTab === 1) {
      apiCall = () => API.Global['Mailboxes'].Read(`${announcement.announcement_id}`);
    } else if (selectedTab === 3) {
      apiCall = () => API.Global['Notification'].Read(`${announcement.announcement_id}`);
    } else {
      // if selectedTab is teacher gift, do not call API
      return;
    }

    // call the API
    if (apiCall) {
      apiCall().finally(() => {
        getAnnounceData()[selectedIndex].is_read = true;
        updateAnnounceState();
      });
    }
  };

  const handleDeleteAnnounce = () => {
    const { selectedTab, selectedAnnounce } = InterfaceState;
    const currentAnnouncement = getAnnounceData()[selectedAnnounce];
    // determine which API to call
    let apiCall: () => Promise<BaseAPIResponse | void>;
    if (selectedTab === 1) {
      apiCall = () =>
        API.Global['Mailboxes'].Delete(`${currentAnnouncement.announcement_id}`);
    } else if (selectedTab === 2) {
      let announce = currentAnnouncement as Announcement<GiftContent>;
      apiCall = () => {
        if (subject)
          return API.Global['Gifts'].Delete(
            subject.subject_id,
            `${announce.announceContent.reward_id}`,
          );
        return Promise.resolve();
      };
    } else if (selectedTab === 3) {
      apiCall = () =>
        API.Global['Notification'].Delete(`${currentAnnouncement.announcement_id}`);
    } else {
      return;
    }

    // call the API
    apiCall().then(() => {
      getAnnounceData().splice(selectedAnnounce, 1);
      SetInterfaceState((prev) => ({
        selectedAnnounce: selectedAnnounce - 1,
        selectedTab: selectedTab,
      }));
      updateAnnounceState();
    });
  };

  const handleReadAllAnnounce = () => {
    const announcements = getAnnounceData();
    const { selectedTab } = InterfaceState;

    // determine which API to call
    if (subject) {
      let apiCall: () => Promise<BaseAPIResponse> = () =>
        API.Global.Acivities.ReadAll(subject.subject_id);

      if (selectedTab === 1) {
        apiCall = () => API.Global['Mailboxes'].ReadAll(subject.subject_id);
      } else if (selectedTab === 2) {
        apiCall = () => API.Global['Gifts'].ReadAll(subject.subject_id);
      } else if (selectedTab === 3) {
        apiCall = () => API.Global['Notification'].ReadAll(subject.subject_id);
      }

      // call API
      apiCall()
        .then(() => {
          announcements?.forEach((element, index) => {
            element.is_read = true;
          });
          updateAnnounceState();
        })
        .catch((err) => console.error(err));
    }
  };

  const handleDeleteAllReadAnnounce = () => {
    const { selectedTab } = InterfaceState;
    // determine which API to call
    if (subject) {
      let apiCall: () => Promise<BaseAPIResponse>;
      if (selectedTab === 1) {
        apiCall = () => API.Global['Mailboxes'].DeleteAllRead(subject.subject_id);
      } else if (selectedTab === 2) {
        apiCall = () => API.Global['Gifts'].DeleteAllRead(subject.subject_id);
      } else if (selectedTab === 3) {
        apiCall = () => API.Global['Notification'].DeleteAllRead(subject.subject_id);
      } else {
        return;
      }

      // if apiCall is not undefined, call the API
      if (apiCall) {
        apiCall().then(() => {
          const announcements = getAnnounceData();
          announcements?.forEach((element) => {
            // mailbox
            if (selectedTab === 1) {
              const content = element.announceContent as MailboxContent;
              if (content.is_received === true) {
                element.is_deleted = true;
              }
            } else if (selectedTab === 2) {
              const content = element.announceContent as GiftContent;
              if (content.status === 'received') {
                element.is_deleted = true;
              }
            } else {
              element.is_deleted = element.is_read;
            }
          });
          SetInterfaceState({
            selectedAnnounce: 0,
            selectedTab: InterfaceState.selectedTab,
          });
          updateAnnounceState();
        });
      }
    }
  };

  const handleJoinActivity = () => {
    const currentAnnouncement = getAnnounceData()[
      InterfaceState.selectedAnnounce
    ] as Announcement<ActivityContent>;
    if (currentAnnouncement) {
      const arcadeGameId = currentAnnouncement?.announceContent?.arcade_game_id;
      if (arcadeGameId) {
        navigate({ to: `/arcade-leaderboard/${arcadeGameId}`, viewTransition: true });
      }
    }
  };

  const handleReceiveAnnounce = () => {
    const { selectedAnnounce } = InterfaceState;
    const currentAnnouncement = getAnnounceData()[selectedAnnounce];
    if (!currentAnnouncement) return;

    // mailbox
    if (InterfaceState.selectedTab === 1) {
      const content = currentAnnouncement.announceContent as MailboxContent;

      if (content.is_received) {
        // goto avatar custom page
        return navigate({ to: '/avatar-custom', viewTransition: true });
      }

      if (!subject) return;
      API.Global.Mailboxes.ReceiveItem(
        subject.subject_id,
        `${currentAnnouncement.announcement_id}`,
      )
        .then(() => {
          content.is_received = true;
          currentAnnouncement.announceContent = content;
          updateAnnounceState();
        })
        .catch((err) => {
          console.error(err);
        });
    }
    // teacher gift
    else if (InterfaceState.selectedTab === 2) {
      const content = currentAnnouncement.announceContent as GiftContent;

      if (content.status === 'received') {
        // goto avatar custom page
        return navigate({ to: '/avatar-custom', viewTransition: true });
      }

      if (!subject) return;
      API.Global.Gifts.ReceiveItem(subject.subject_id, `${content.reward_id}`)
        .then(() => {
          content.status = 'received';
          currentAnnouncement.announceContent = content;
          currentAnnouncement.is_read = true;
          updateAnnounceState();
        })
        .catch((err) => {
          console.error(err);
        });
    }
  };

  const AnnouncementContent: React.CSSProperties = {
    transform: 'translate(-50%, -50%)',
    left: '50%',
    top: '50%',
    position: 'absolute',

    width: 580 * 2, // Remove 'px'
    height: 300 * 2,
    display: `flex`,
    flexDirection: `column`,
    justifyContent: 'space-between',
    alignItems: `flex-start`,

    border: '4px solid var(--white, #ffffff)', // Fix the syntax error
    borderRadius: '32px',
    boxShadow:
      '0px 4px 8px 0px rgba(0, 0, 0, 0.30), 0px 8px 32px 0px rgba(0, 0, 0, 0.15)', // Fix the syntax error
    overflow: 'hidden',
    background: `rgba(255, 255, 255, 0.2)`, // Added alpha channel value (0.8) for transparency
  };

  const isItemReceived =
    // mailbox
    (InterfaceState.selectedTab === 1 &&
      MailboxAnnounceData[InterfaceState.selectedAnnounce]?.announceContent
        .is_received) ||
    // teacher gift
    (InterfaceState.selectedTab === 2 &&
      GiftAnnounceData[InterfaceState.selectedAnnounce]?.announceContent.status ===
        'received');

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
      {/* Safezone */}
      <SafezonePanel>
        {/*Announcement Container*/}
        <div className="absolute inset-0" style={AnnouncementContent}>
          {/*Announcement TopBar*/}
          <AnnounceTab interfaceState={InterfaceState} onTabClick={handleTabClick} />
          {/*Announcement Body*/}
          <AnnounceBody
            t={t}
            announcements={getAnnounceData()}
            noAnnouncementText={noAnnouncementText}
            onSlotsClick={handleAnnouncementRead}
            selectedIndex={InterfaceState?.selectedAnnounce}
            currentTabSelected={InterfaceState.selectedTab}
          />
          {/*Announcement Footer*/}
          <AnnounceFooter
            t={t}
            onAllReadClicked={handleReadAllAnnounce}
            onDeleteReadClicked={handleDeleteAllReadAnnounce}
            onDeleteClick={handleDeleteAnnounce}
            onJoinActivityClick={handleJoinActivity}
            onReceiveClick={handleReceiveAnnounce}
            currentTabSelected={InterfaceState?.selectedTab}
            isItemReceived={isItemReceived}
          />
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};
export default DomainJSX;
