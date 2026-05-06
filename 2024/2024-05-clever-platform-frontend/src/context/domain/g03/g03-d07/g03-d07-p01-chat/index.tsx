import ModalOffLineWarning from '@component/web/molecule/wc-m-modal-offline-warning';
import { UserData } from '@domain/g02/g02-d01/local/type';
import Refresh from '@global/assets/change.svg';
import Button from '@global/component/web/atom/wc-a-button';
import { useOnlineStatus } from '@global/helper/online-status';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreGlobalPersist from '@store/global/persist';
import StoreSubjects from '@store/global/subjects';
import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';
import { TRoom } from '../local/types/room';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import ChatPanel from './components/web/template/cw-t-chat-panel';
import Header from './components/web/template/cw-t-header';
import SideMenu from './components/web/template/cw-t-side-menu';
import ConfigJson from './config/index.json';
import './index.css';

const DomainJSX = () => {
  const [roomList, setRoomList] = useState<TRoom[]>([]);
  const [selectedRoomID, setSelectedRoomID] = useState<string>();
  const [selectedRoomIndex, setSelectedRoomIndex] = useState<number>();
  const [isSessionExpired, setIsSessionExpired] = useState<boolean>(false);
  const { t, i18n } = useTranslation([ConfigJson.key]);

  const [isOfflineModalVisible, setOfflineModalVisible] = useState(false);
  const [observerReconnectKey, setObserverReconnectKey] = useState(0);
  const isOnline = useOnlineStatus();

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  const { userData } = StoreGlobalPersist.StateGet(['userData']) as {
    userData: UserData;
  };
  const schoolID: string = userData.school_id;
  const currentUserID = userData.id;

  useEffect(() => {
    // set partical play to false
    StoreGlobalPersist.MethodGet().updateSettings({
      enableParticle: false,
    });
    // set background music
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []);

  useEffect(() => {
    // if the user is offline, show the offline warning modal
    if (!isOnline) {
      setOfflineModalVisible(true);
    }
  }, [isOnline]);

  const handleRetryOffline = () => {
    StoreGlobal.MethodGet().loadingSet(true);
    new Promise((resolve) => {
      // wait for a sec for given a feedback
      // that we are retrying to connect
      setTimeout(
        () => {
          // if the user back to online, hide the offline warning modal
          if (isOnline) {
            setOfflineModalVisible(false);
            setObserverReconnectKey((prev) => prev + 1)
          }
          resolve(true);
        },
        500 + (-250 + Math.random() * 500),
      );
    }).finally(() => {
      StoreGlobal.MethodGet().loadingSet(false);
    });
  };

  const handleSetRooms = (rooms: TRoom[]) => {
    // Set room to first element when roomType change or first load.
    if (rooms.length > 0) {
      setSelectedRoomID(rooms[0].id);
      setSelectedRoomIndex(0);
    }

    setRoomList(rooms);
  };

  const handleSelectRoom = (id: string) => {
    setSelectedRoomID(id);

    for (let i = 0; i < roomList.length; i++) {
      if (roomList[i].id === id) {
        setSelectedRoomIndex(i);
        break;
      }
    }
  };

  const handleClickRefresh = useCallback(() => {
    location.reload();
  }, []);

  return (
    <>
      <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
        {isSessionExpired ? (
          <div className="w-full h-full flex items-center justify-center">
            <div className="w-full flex items-center justify-center">
              <div className="flex flex-col w-[32rem] h-full items-center justify-between gap-6 border-t-2 bg-gray-100 py-5 rounded-[62px]">
                <div className="flex flex-col items-center justify-center gap-2 w-full">
                  <p className="text-3xl font-semibold">{t('session_expired')}</p>
                  <div className="border-y-2 text-xl border-dashed border-secondary flex items-center justify-center my-4 w-full h-20">
                    {t('please_try_again')}
                  </div>
                  <Button
                    prefix={<img src={Refresh} className="h-11 w-15 p-[1px] pl-1" />}
                    variant="tertiary"
                    width="15rem"
                    height="65px"
                    onClick={handleClickRefresh}
                    textClassName="justify-center items-center text-[22px] pr-4"
                  >
                    {t('btn_try_again')}
                  </Button>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <SafezonePanel className="flex p-8 w-full h-full gap-4">
            <div className="flex h-full w-full items-center justify-center p-7 drop-shadow-sm">
              <div className="flex h-full w-full flex-col overflow-hidden rounded-[32px] bg-white font-noto drop-shadow-sm">
                <Header />
                <div className="flex h-full flex-row overflow-hidden">
                  <SideMenu
                    schoolID={schoolID}
                    roomList={roomList}
                    setRoomList={handleSetRooms}
                    selectedRoomID={selectedRoomID}
                    handleSelectRoomID={handleSelectRoom}
                  />

                  {selectedRoomIndex !== undefined && roomList[selectedRoomIndex] && (
                    <ChatPanel
                      observerReconnectKey={observerReconnectKey}
                      setIsSessionExpired={setIsSessionExpired}
                      schoolID={schoolID}
                      className="flex-1"
                      room={roomList[selectedRoomIndex]}
                      currentUserID={currentUserID}
                      onMessageObserve={(msg) => {
                        setRoomList((prev) => prev.map((room) => {
                          if (room.id === msg.room_id) {
                            return { ...room, created_at: msg.timestamp, content: msg.content }
                          }
                          return room
                        }))
                      }}
                    />
                  )}
                </div>
              </div>
            </div>
          </SafezonePanel>
        )}
        <ModalOffLineWarning
          overlay={true}
          enablePlayOffline={false}
          isVisible={isOfflineModalVisible}
          setVisible={setOfflineModalVisible}
          onOk={handleRetryOffline}
        />
      </ResponsiveScaler>
    </>
  );
};

export default DomainJSX;
