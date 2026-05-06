import { useNavigate, useParams } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import Button from '@global/component/web/atom/wc-a-button';
import StoreGame from '@global/store/game';
import StoreLessons from '@store/global/lessons/index.ts';
import StoreGlobalPersist from '@store/global/persist.ts';
import StoreSubjects from '@store/global/subjects/index.ts';
import StoreSublessons from '@store/global/sublessons/index.ts';
import ThreeModelRenderer from '../../../../global/component/game/model-renderer/character-model-renderer-mainmenu.tsx';
import PetModelRenderer from '../../../../global/component/game/model-renderer/pet-blob-model-renderer-no-spin.tsx';
// import API from './api/index';
import { Avatar } from '@component/web/molecule/wc-m-avatar/index.tsx';
import ModalLogout from '@component/web/molecule/wc-modal-logout/index.tsx';
import API from '@domain/g03/g03-d01/local/api/index.ts';
import APICustomAvatar from '@domain/g03/g03-d04/local/api';
import { PetSrcURLs } from '@domain/g03/g03-d05/local/helper/mapDataPet.ts';
import ImageIconHanger from '@global/assets/icon-hanger.svg';
import ImageIconLetter from '@global/assets/icon-letter.svg';
import { handleLogout } from '@global/helper/auth.ts';
import { getCurrentWeekDates, fromDateToYYYYMMDD } from '@global/helper/date.ts';
import { LeaderboardEntry } from '@domain/g04/g04-d02/g04-d02-p05-level-leaderboard/types.ts';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreGlobal from '@store/global/index.ts';
import { Achievement, InventoryInfo } from '../local/type.ts';
import ImageIconArrowRight from './assets/icon-arrow-right.svg';
import ImageIconCalendar from './assets/icon-calendar.svg';
import ImageIconChat from './assets/icon-chat.svg';
import ImageIconGame from './assets/icon-game.svg';
import ImageIconGift from './assets/icon-gift.svg';
import ImageIconLogout from './assets/icon-logout.svg';
import ImageIconNewsBlack from './assets/icon-news-black.svg';
import ImageIconSettings from './assets/icon-settings.svg';
import ImageIconShareAlt from './assets/icon-share-alt.svg';
import ImageIconShoppingCart from './assets/icon-shopping-cart.svg';
import ImageIconTeacher from './assets/icon-teacher.svg';
import ImageIconTrophy from './assets/icon-trophy.svg';
import ImageIconLeaderboard from './assets/icon-leaderboard.svg';
import Container from './component/web/atoms/wc-a-container';
import { Icon, IconSmall } from './component/web/atoms/wc-a-icon';
import IconButton from './component/web/atoms/wc-a-icon-button';
import IconButtonWithNotification from './component/web/atoms/wc-a-icon-button-with-notification';
import SafezonePanel from './component/web/atoms/wc-a-safezone-panel';
import { TextNormal } from './component/web/atoms/wc-a-text';
import GhostButtonWithLabel from './component/web/molecules/wc-a-ghost-button-with-text';
import CurrencyStatBox from './component/web/organisms/wc-a-currency-stat-box';
import SubjectBox from './component/web/organisms/wc-a-subject-box';
import ConfigJson from './config/index.json';
import { Character, IProfile, MainMenuState, StateFlow } from './type';

const DomainJSX = () => {
  const { t } = useTranslation([ConfigJson.key]);
  const [user, setUser] = useState<IProfile>();
  const [uiState, setUIState] = useState<MainMenuState>();

  const [currentWeekDates, setCurrentWeekDates] = useState<Date[]>(getCurrentWeekDates());
  const [inventoryInfo, setInventoryInfo] = useState<InventoryInfo>();
  const [streakLogin, setStreakLogin] = useState<number>(0);
  const [unreadAnnouncement, setUnreadAnnouncement] = useState<number>();
  const [achievement, setAchievement] = useState<Achievement>();
  const [leaderboardNo, setLeaderboardNo] = useState<number>();
  const [equippedCharacterKey, setEquippedCharacterKey] = useState<string>('');
  const [equippedPet, setEquippedPetKey] = useState<string>('');
  const navigate = useNavigate();

  const { userData } = StoreGlobalPersist.StateGet(['userData']);
  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);
  const { sublessonId } = useParams({ strict: false });
  const { isReady: lessonStoreIsReady } = StoreLessons.StateGet(['isReady']);
  const { isReady: sublessonStoreIsReady } = StoreSublessons.StateGet(['isReady']);

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [breadcrumbs, setBreadcrumbs] = useState<string[]>([]);

  useEffect(() => {
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []);

  useEffect(() => {
    if (lessonStoreIsReady && sublessonStoreIsReady) {
      const loadedSublesson = StoreSublessons.MethodGet().get(sublessonId);
      // redirect to 404 if sublesson not found

      StoreSublessons.MethodGet().sublessonSelect(loadedSublesson);

      const loadedLesson = StoreLessons.MethodGet().get(loadedSublesson?.lesson_id);

      const newBreadcrumbs = [];

      if (currentSubject) {
        newBreadcrumbs.push(currentSubject.year_short_name);
        newBreadcrumbs.push(currentSubject.subject_name);
      }

      if (loadedLesson) {
        newBreadcrumbs.push(loadedLesson.name);
      }

      if (loadedSublesson) {
        newBreadcrumbs.push(loadedSublesson.name);
      }

      setBreadcrumbs(newBreadcrumbs);
      // updateLevelToStore();
    }
  }, [currentSubject, lessonStoreIsReady, sublessonStoreIsReady]);

  const getRandomLetter = (): string => {
    const letters = [
      'public/assets/model/M05.fbx',
      'public/assets/model/M02.fbx',
      'public/assets/model/ExportedF05.fbx',
      'public/assets/model/M04.fbx',
      'public/assets/model/F02.fbx',
    ];
    const randomIndex = Math.floor(Math.random() * letters.length);
    return letters[randomIndex];
  };

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(StateFlow.Default);
    // console.log(API); // Log the whole API object to check its structure
    // console.log(API.Character); // Specifically check if API.Character is available

    // fetch character
    // if (API && API.Character && API.Character.CharacterAll) {
    //   API.Character.CharacterAll.Get()
    //     .then((res) => {
    //       console.log('Character data:', res);
    //     })
    //     .catch((error) => {
    //       console.error('Error fetching CharacterAll:', error);
    //     });
    // } else {
    //   console.error('API.Character or API.Character.CharacterAll is undefined');
    // }

    const fetchInitialData = async () => {
      try {
        const response = await API.mainMenu.GetInventoryInfo();
        const data = response.data;
        setInventoryInfo(data);
      } catch (error) {
        console.error('Error fetching inventory info:', error);
      }

      try {
        const response = await API.mainMenu.GetCountUnreadAnnouncement();
        const data = response.data;
        setUnreadAnnouncement(data.count);
      } catch (error) {
        console.error('Error fetching unread announcement count:', error);
      }
    };

    fetchInitialData();

    StoreGlobal.MethodGet().loadingSet(true);
    setTimeout(() => {
      StoreGlobal.MethodGet().loadingSet(false);
    }, 1000);
  }, []);

  useEffect(() => {
    const fetchSubjectData = async () => {
      if (currentSubject?.subject_id) {
        // get check-in streak by subject's id
        try {
          const response = await API.mainMenu.GetCountCheckIn(currentSubject.subject_id);
          const data = response.data;
          setStreakLogin(data.count);
        } catch (error) {
          console.error('Error fetching check-in count:', error);
        }

        // get achivements by subject's id
        try {
          const response = await API.mainMenu.GetAchievement(currentSubject.subject_id);
          const data = response.data as Achievement[];
          if (data.length > 0) {
            setAchievement(data[0]);
          }
        } catch (error) {
          console.error('Error fetching achievements:', error);
        }
      }

      // set background image by subject group id
      if (currentSubject?.seed_subject_group_id) {
        StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
          currentSubject.seed_subject_group_id,
        );
      }
    };

    fetchSubjectData();
  }, [currentSubject]);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      if (userData?.id && currentSubject?.subject_id) {
        try {
          const response = await API.mainMenu.GetLeaderBoard(
            currentSubject?.subject_id,
            'all',
            fromDateToYYYYMMDD(currentWeekDates[0]),
            fromDateToYYYYMMDD(currentWeekDates[1]),
          );
          const data = response.data as LeaderboardEntry[];
          if (data.length > 0) {
            for (let i = 0; i < data.length; i++) {
              if (data[i].user_id === userData.id) {
                setLeaderboardNo(data[i].no);
                break;
              }
            }
          }
        } catch (error) {
          console.error('Error fetching leaderboard:', error);
        }
      }
    };

    fetchLeaderboard();
  }, [userData, currentSubject]);

  useEffect(() => {
    const fetchCharacterAndPet = async () => {
      // Fetch character data
      if (API && API.character && API.character.CharacterAll) {
        try {
          const res = await API.character.CharacterAll.Get();
          if (res && Array.isArray(res.data)) {
            // Ensure res.data is an array and filter where is_equipped is true
            const filtered = res.data.filter(
              (character: Character) => character.is_equipped,
            );
            if (filtered.length > 0) {
              // For the first equipped character, create the formatted string
              const character = filtered[0]; // You can choose any character here
              const formattedKey = character.model_id;
              console.log('Formatted character key:', character);
              setEquippedCharacterKey(formattedKey); // Update the state with the formatted string
              // setUserAvatar
              StoreGlobalPersist.MethodGet().setUserAvatar(character);
            } else {
              console.log('No equipped characters found.');
            }
          } else {
            console.error('Expected data to be an array, but got:', res.data);
          }
        } catch (error) {
          console.error('Error fetching CharacterAll:', error);
        }
      } else {
        console.error('API.Character or API.Character.CharacterAll is undefined');
      }

      // Fetch pet data
      try {
        const res = await APICustomAvatar.Pet.petAll.Get();
        if (res && Array.isArray(res.data)) {
          const filtered = res.data.filter(
            (Pet: { is_equipped: boolean; model_id: string }) => Pet.is_equipped,
          ); // Explicitly type Pet
          if (filtered.length > 0) {
            const pet = filtered[0];
            const modelId = pet?.model_name; // Use model_id as the key
            const formattedKey = PetSrcURLs[modelId];
            setEquippedPetKey(pet.model_id);
            StoreGlobalPersist.MethodGet().setUserPet(pet);

            console.log('Pet data: ', pet);
            console.log('Pet model ID:', modelId);
            const petIdLastChar = modelId?.slice(-1) || null;
            console.log('Pet ID Last Char:', petIdLastChar); // '1'
            if (formattedKey) {
              console.log('Formatted pet key:', formattedKey);
              //setEquippedPetKey(pet.model_id);
            } else {
              console.log('model_id not found in PetSrcURLs:', modelId);
            }
          } else {
            console.log('No equipped characters found.');
          }
        } else {
          console.error('Expected data to be an array, but got:', res.data);
        }
      } catch (error) {
        console.error('Error fetching petAll:', error);
      }
    };

    fetchCharacterAndPet();
  }, [API]); // Ensure this is run when the API is ready

  useEffect(() => {
    if (!user) {
      return;
    }

    // Promise.all([
    //   API.Global.Statistic.Get(user.id),
    //   API.Global.Notifications.Get(user.id),
    //   API.Global.Announcement.Get(),
    // ])
    //   .then(([statisticResponse, notificationResponse, announcementResponse]) => {
    //     const statistic = statisticResponse.json();
    //     const notification = notificationResponse.json();
    //     const announcement = announcementResponse.json();
    //     return {
    //       menu: statistic,
    //       notification: notification,
    //       footer: announcement,
    //     };
    //   })
    //   .then((data) => {
    //     setUIState(data);
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //   });
  }, [user]);

  useEffect(() => {
    if (!currentSubject && userData) {
      navigate({
        to: '/subject-select',
        viewTransition: true,
      });
    }
  }, [currentSubject, userData]);

  const handledLogout = () => {
    handleLogout();
  };

  {
    console.log('Current equipped avatar: ', equippedCharacterKey);
  }
  {
    console.log('Current equipped pet: ', equippedPet);
  }
  const isModalActive = isModalOpen;
  return (
    <>
      <ResponsiveScaler
        scenarioSize={{ width: 1280, height: 720 }}
        className="flex-1 w-full h-full overflow-visible"
      >
        {isModalActive && <div className="absolute inset-0 bg-black opacity-70 z-10" />}
        <ModalLogout
          setShowModal={setIsModalOpen}
          showModal={isModalOpen}
          onOK={handledLogout}
        />
        {/* Safezone */}
        <SafezonePanel className="flex p-8 w-full h-full gap-4" style={{ overflow: 'visible' }}>
          <div className="flex flex-col justify-end gap-4">
            <IconButtonWithNotification
              width={80}
              height={80}
              buttonStyle={{
                backgroundColor: 'hsla(209, 100%, 53%, 1)',
                borderBottomColor: 'hsla(209, 100%, 80%, 1)',
              }}
              iconSrc={ImageIconShoppingCart}
              onClick={() => {
                navigate({ to: '/shop', viewTransition: true });
              }}
            />
            <IconButtonWithNotification
              width={80}
              height={80}
              variant="tertiary"
              iconSrc={ImageIconHanger}
              onClick={() => {
                navigate({ to: '/avatar-custom', viewTransition: true });
              }}
            />
            <IconButtonWithNotification
              width={80}
              height={80}
              notification={unreadAnnouncement || undefined}
              variant="success"
              iconSrc={ImageIconLetter}
              onClick={() => {
                navigate({ to: '/mailbox', viewTransition: true });
              }}
            />
            <IconButtonWithNotification
              width={80}
              height={80}
              variant="warning"
              iconSrc={ImageIconGame}
              onClick={() => {
                navigate({ to: '/arcade-game', viewTransition: true });
              }}
            />
          </div>

          <div className="relative flex-[2]">
            <ThreeModelRenderer modelSrc={equippedCharacterKey} />
            {/* <ThreeModelRenderer modelSrc={'set4_character2_level4'} /> */}
            <PetModelRenderer
              modelSrc={equippedPet}
              className="h-full w-full -bottom-[25%] -right-[52%] bg-transparent translate-x-[58%] translate-y-[24%]"
            />
            <>{console.log('equippedPet: ', equippedPet)}</>

            <div className="absolute -top-4 left-0 h-24 w-full flex justify-center items-center">
              <Container className="px-4 py-2">
                <CurrencyStatBox
                  currency={{
                    coin: inventoryInfo?.gold_coin,
                    key: inventoryInfo?.arcade_coin,
                    stars: inventoryInfo?.stars
                  }}
                />
              </Container>
            </div>
          </div>
          <div className="flex flex-col justify-between flex-[3]">
            {/* top right nav menu */}
            <div className="flex justify-end items-center gap-4">
              <div
                className="px-0 pr-1 cursor-pointer w-full max-w-[300px]"
                onClick={() => {
                  navigate({ to: '/setting?tab=account', viewTransition: true });
                }}
              >
                <Container className="w-full">
                  <Avatar
                    user={userData}
                    className="w-[48px] h-[48px] bg-secondary border-2 border-solid border-white"
                  />
                  <TextNormal className="tracking-tighter truncate ">
                    {`${userData?.first_name} ${userData?.last_name}`}
                  </TextNormal>
                </Container>
              </div>
              <div className="flex gap-4">
                <IconButton
                  iconSrc={ImageIconNewsBlack}
                  variant="secondary"
                  onClick={() => {
                    navigate({
                      to: '/annoucement',
                      viewTransition: true,
                    });
                  }}
                />
                <IconButton
                  iconSrc={ImageIconGift}
                  variant="secondary"
                  onClick={() => {
                    navigate({ to: '/redeem', viewTransition: true });
                  }}
                />
                <IconButton
                  iconSrc={ImageIconTeacher}
                  variant="secondary"
                  onClick={() => {
                    console.log('teacher icon clicked');
                    navigate({ to: '/main-menu/tutorial', viewTransition: true });
                  }}
                />
                <IconButton
                  iconSrc={ImageIconSettings}
                  variant="secondary"
                  onClick={() => {
                    navigate({ to: '/setting', viewTransition: true });
                  }}
                />
                <IconButton
                  iconSrc={ImageIconLogout}
                  variant="secondary"
                  onClick={() => {
                    setIsModalOpen(true);
                  }}
                />
              </div>
            </div>
            {/* container center */}
            <div className="flex justify-end gap-8">
              <div className="flex flex-col gap-4">
                <GhostButtonWithLabel
                  btnClass="bg-white border-white"
                  icon={ImageIconShareAlt}
                  onClick={() => {
                    navigate({ to: '/profile-share', viewTransition: true });
                  }}
                />
                <GhostButtonWithLabel
                  btnClass="bg-white border-white"
                  icon={ImageIconCalendar}
                  text={
                    streakLogin && streakLogin > 0
                      ? t('menu_btn_label_consecutive_days', {
                        consecutiveDays: streakLogin,
                      })
                      : undefined
                  }
                  onClick={() => {
                    navigate({ to: '/streak-login', viewTransition: true });
                  }}
                />
                <GhostButtonWithLabel
                  btnClass="bg-white border-white"
                  icon={ImageIconTrophy}
                  text={
                    achievement?.amount && achievement.amount > 0
                      ? t('menu_btn_label_trophy', {
                        trophy: achievement.amount,
                      })
                      : undefined
                  }
                  onClick={() => {
                    navigate({ to: '/achievement-level', viewTransition: true });
                  }}
                />
                <GhostButtonWithLabel
                  btnClass="bg-white border-white"
                  icon={ImageIconLeaderboard}
                  text={
                    leaderboardNo && leaderboardNo > 0
                      ? t('menu_btn_label_placed_leaderboard', {
                        leaderboard: leaderboardNo,
                      })
                      : undefined
                  }
                  onClick={() => {
                    navigate({ to: '/main-menu-leaderboard', viewTransition: true });
                  }}
                />
              </div>
              <div className="flex flex-col gap-4 bg-white rounded-[2rem] p-4 min-w-[400px] h-auto">
                <SubjectBox
                  subject={currentSubject ? currentSubject?.subject_name : '...'}
                  school={{
                    fullname: userData?.school_name ?? '',
                    avatar: userData?.school_image,
                  }}
                  onClick={() => {
                    navigate({ to: '/subject-select', viewTransition: true });
                  }}
                />
                <Button
                  suffix={<Icon src={ImageIconArrowRight} className="mr-2" />}
                  className="w-full"
                  textClassName="text-xl justify-center items-center"
                  onClick={() => {
                    const subjectId = currentSubject?.subject_id;
                    if (subjectId) {
                      navigate({
                        to: `/lesson-state/${subjectId}`,
                        viewTransition: true,
                      });
                    }
                  }}
                >
                  {t('label_all_lessons')}
                </Button>
                <Button
                  suffix={<Icon src={ImageIconArrowRight} className="mr-2" />}
                  className="w-full"
                  textClassName="text-xl justify-center items-center"
                  onClick={() => {
                    navigate({ to: '/homework-level', viewTransition: true });
                  }}
                >
                  {t('label_all_homeworks')}
                </Button>
              </div>
            </div>
            {/* top bottom menu */}
            <div className="flex relative justify-end gap-12">
              {uiState?.footer.announcement && (
                <div className="relative">
                  <div
                    className="absolute bottom-0 h-[48px] w-[514px] bg-white bg-opacity-80 rounded-full flex items-center px-4 gap-2"
                    style={{
                      translate: '-100% 0',
                      boxShadow: '0px 4px 8px 0px rgba(255, 255, 255, 0.25)',
                    }}
                  >
                    <IconSmall src={ImageIconCalendar} />
                    <TextNormal className="truncate text-lg leading-normal tracking-tight">
                      {uiState?.footer.announcement}
                    </TextNormal>
                  </div>
                </div>
              )}
              <IconButton
                width={80}
                height={80}
                style={{
                  backgroundColor: 'hsla(256, 100%, 65%, 1)',
                  borderBottomColor: 'hsla(256, 97%, 70%, 1)',
                }}
                iconSrc={ImageIconChat}
                onClick={() => {
                  navigate({ to: '/chat' });
                }}
              />
            </div>
          </div>
        </SafezonePanel>
      </ResponsiveScaler>
    </>
  );
};

export default DomainJSX;
