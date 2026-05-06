import { useEffect, useRef, useState } from 'react';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import API from '@domain/g03/g03-d01/local/api/index.ts';
import ShopAPI from '@domain/g03/g03-d05/local/api/index.ts';
import { FrameSrcURLs } from '@domain/g03/g03-d05/local/helper/mapDataFrame.ts';
import { PetSrcURLs } from '@domain/g03/g03-d05/local/helper/mapDataPet.ts';
import {
  AvatarResponse,
  BadgeResponse,
  FrameResponse,
  PetResponse,
} from '@domain/g03/g03-d05/local/type.ts';
import StoreGame from '@global/store/game';
//import TModel from 'public/assets/model/M05.fbx';
import { UserData } from '@domain/g02/g02-d01/local/type';
import SafezonePanel from '@domain/g03/g03-d01/g03-d01-p04-profile-share/component/web/atoms/wc-a-safezone-panel';
import ShareMenu from '@domain/g03/g03-d01/g03-d01-p04-profile-share/component/web/organisms/wc-a-share-menu';
import Debug from '@domain/g03/g03-d01/g03-d01-p04-profile-share/component/web/templates/wc-a-debug.tsx';
import { DefaultImageFrames } from '@domain/g03/g03-d05/g03-d05-p01-shop/mockup/default-image-characters';
import ButtonBack from '@global/component/web/atom/wc-a-button-back';
import StoreGlobalPersist from '@store/global/persist';
import StoreSubjects from '@store/global/subjects';
import { useNavigate } from '@tanstack/react-router';
import html2canvas from 'html2canvas-pro';
import { useTranslation } from 'react-i18next';
//import { mapBadgeData, mapPetData } from '../../g03-d04/local/helper/mapData';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreGlobal from '@store/global/index.ts';
import { BadgeOutput, CharacterOutput, PetOutput } from '../../g03-d04/local/types';
import { Achievement, InventoryInfo } from '../local/type';
import MainFrame from './component/web/templates/wc-t-main-frame.tsx';
import ConfigJson from './config/index.json';
import { AllEquipped, IProfile, StateFlow } from './type';

// Updated AllEquipped interface to store a string (or null) per category.

const DomainJSX = () => {
  const [showBackground, setShowBackground] = useState<boolean>(false);
  const [profile, setProfile] = useState<IProfile | undefined>(undefined);
  const refComponent = useRef<HTMLDivElement>(null);

  const [allEquipped, setAllEquipped] = useState<AllEquipped>({
    characters: null,
    badges: null,
    pets: null,
    frame: null,
  });

  const { userData } = StoreGlobalPersist.StateGet(['userData']) as {
    userData: UserData;
  };

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);
    StoreGame.MethodGet().State.Flow.Set(StateFlow.Default);
  }, []);

  return (
    <>
      <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1">
        <SafezonePanel className="flex items-center inset-0 relative">
          <DomainProfileShare
            showBackground={showBackground}
            setShowBackground={setShowBackground}
            allEquipped={allEquipped}
            setAllEquipped={setAllEquipped}
            profile={profile}
            setProfile={setProfile}
            refComponent={refComponent}
            userData={userData}
          />
        </SafezonePanel>
      </ResponsiveScaler>
      {showBackground && (
        <div className="relative w-full h-full">
          <MainFrame
            isCapture={true}
            allEquipped={allEquipped}
            refComponent={refComponent}
            userData={userData}
            profile={profile}
          />
        </div>
      )}
    </>
  );
};

const DomainProfileShare = ({
  showFrame,
  showLogo,
  showBackground,
  setShowBackground,
  allEquipped,
  setAllEquipped,
  profile,
  setProfile,
  refComponent,
  userData,
  frameUrl,
}: {
  showFrame?: boolean;
  showLogo?: boolean;
  showBackground?: boolean;
  setShowBackground?: (showBackground: boolean) => void;
  allEquipped: AllEquipped;
  setAllEquipped: (allEquipped: AllEquipped) => void;
  profile: IProfile | undefined;
  setProfile: (profile: IProfile) => void;
  refComponent?: React.RefObject<HTMLDivElement>;
  userData: UserData;
  frameUrl?: string;
}) => {
  const { t } = useTranslation([ConfigJson.key]);
  const { settings } = StoreGlobalPersist.StateGet(['settings']);
  const navigate = useNavigate();

  // Declare state with explicit types:
  const [imageList, setImageList] = useState<CharacterOutput[]>([]);
  const [imageCharactersList, setImageCharactersList] = useState<CharacterOutput[]>([]);
  const [imageBadgesList, setImageBadgesList] = useState<BadgeOutput[]>([]);
  const [imagePetsList, setImagePetsList] = useState<PetOutput[]>([]);
  const [selectedHoner, setSelectedHoner] = useState<BadgeOutput | null>(null);
  const [selectedPet, setSelectedPet] = useState<PetOutput | null>(null);
  const [streakLogin, setStreakLogin] = useState<number>();
  const [achievement, setAchievement] = useState<Achievement>();
  const [inventoryInfo, setInventoryInfo] = useState<InventoryInfo>();
  const [unreadAnnouncement, setUnreadAnnouncement] = useState<number>();
  const [image, setImage] = useState<string>('');
  const [originalParticlesSetting, setOriginalParticlesSetting] = useState<boolean>(true);

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);

  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  const downloadImage = (imageSrc: string, name: string) => {
    const a = document.createElement('a');
    a.href = imageSrc;
    a.download = name;
    a.click();
  };

  const getImage = (isShare?: boolean) => {
    if (!refComponent?.current) {
      return;
    }

    refComponent.current.querySelectorAll('slot').forEach((slot) => {
      slot.assignedNodes = () => [...slot.childNodes];
    });

    html2canvas(refComponent.current, { scale: 2 })
      .then((canvas) => {
        const image = canvas.toDataURL('image/png');
        setImage(image);
        if (isShare) {
          handleNativeShare(image);
        } else {
          downloadImage(image, 'screenshot.png');
        }
      })
      .catch((error) => {
        console.error('Error:', error);
      })
      .finally(() => {
        setTimeout(() => {
          setShowBackground?.(false);
          StoreGlobalPersist.MethodGet().updateSettings({
            enableParticle: originalParticlesSetting,
          });
        }, 2000);
      });
  };

  const handleCapture = () => {
    setOriginalParticlesSetting(settings.enableParticle);
    setShowBackground?.(true);
    StoreGlobalPersist.MethodGet().updateSettings({
      enableParticle: false,
    });
    setTimeout(() => {
      getImage();
    }, 1000);
  };

  const handleBack = () => {
    navigate({ to: '/main-menu' });
  };

  const handleShare = () => {
    setOriginalParticlesSetting(settings.enableParticle);
    setShowBackground?.(true);
    StoreGlobalPersist.MethodGet().updateSettings({
      enableParticle: false,
    });
    setTimeout(() => {
      getImage(true);
    }, 1000);
  };

  const handleNativeShare = async (image: string) => {
    if (navigator.share) {
      try {
        const response = await fetch(image);
        const blob = await response.blob();
        const filesArray = [
          new File([blob], 'screenshot.png', {
            type: blob.type,
          }),
        ];

        await navigator.share({
          title: 'Clever Platform',
          text: 'Check out my profile!',
          url: 'https://clever.co.id',
          files: filesArray,
        });
        console.log('Share successful');
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      console.log('Web Share API not supported in this browser');
    }
  };

  useEffect(() => {
    const fetchEquippedData = async () => {
      try {
        // Perform all API calls in parallel
        const [
          avatarResponse,
          petResponse,
          badgeResponse,
          frameResponse,
          inventoryInfoResponse,
          unreadAnnouncementResponse,
        ] = await Promise.all([
          ShopAPI.Avatar.AvatarAll.Get(),
          ShopAPI.Pet.PetAll.Get(),
          ShopAPI.Badge.BadgeAll.Get(currentSubject?.subject_id as string),
          ShopAPI.Frame.FrameAll.Get(currentSubject?.subject_id as string),
          API.mainMenu.GetInventoryInfo(),
          API.mainMenu.GetCountUnreadAnnouncement(),
        ]);

        // Process Avatar data
        const equippedAvatars = (avatarResponse.data as AvatarResponse[]).filter(
          (item) => item.is_equipped === true,
        );
        const characterModelId =
          equippedAvatars.find((item) => item.is_equipped === true)?.model_id || null;

        // Process Pet data
        const equippedPets = (petResponse.data as PetResponse[]).filter(
          (item) => item.is_equipped === true,
        );
        const petModelId =
          equippedPets.find((item) => item.is_equipped === true)?.model_id || null;
        const petSrc = petModelId ? PetSrcURLs[petModelId] : null;
        console.log('Pet ID: ', petModelId);
        const petIdLastChar = petModelId?.slice(-1) || null;
        console.log('Pet ID Last Char:', petIdLastChar); // '1'

        // Process Badge data and store the full badge object
        const equippedBadge = (badgeResponse.data as BadgeResponse[]).find(
          (item) => item.is_equipped === true,
        );
        const badgeData = equippedBadge || null; // Store the full badge object

        // Process Frame data
        const equippedFrames = (frameResponse.data as FrameResponse[]).filter(
          (item) => item.is_equipped === true,
        );
        const frameModelId =
          equippedFrames.find((item) => item.is_equipped === true)?.name || null;
        const frameSrc = frameModelId ? FrameSrcURLs[frameModelId] : null;

        // Set all equipped data in one state update
        setAllEquipped({
          characters: characterModelId,
          pets: petModelId || null,
          badges: badgeData, // Store the full BadgeData object
          frame: frameSrc || null,
        });

        // Set other data
        setInventoryInfo(inventoryInfoResponse.data);
        setUnreadAnnouncement(unreadAnnouncementResponse.data.count);

        console.log('Equipped Characters: ', characterModelId);
        console.log('Equipped Pets Source: ', petSrc);
        console.log('Equipped Badge: ', badgeData);
        console.log('Equipped Frame Source: ', frameSrc);
      } catch (error) {
        console.error('Error fetching equipped data: ', error);
      }
    };

    fetchEquippedData();
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []);

  useEffect(() => {
    if (currentSubject?.subject_id) {
      API.mainMenu.GetCountCheckIn(currentSubject.subject_id).then((response) => {
        const data = response.data;
        setStreakLogin(data.count);
      });

      API.mainMenu.GetAchievement(currentSubject.subject_id).then((response) => {
        const data = response.data as Achievement[];
        if (data.length > 0) {
          setAchievement(data[0]);
        }
      });
    }
  }, [currentSubject]);

  useEffect(() => {
    const newProfile: IProfile = {
      ...profile,
      account: {
        currency: {
          coin: inventoryInfo?.gold_coin || 0,
          key: inventoryInfo?.arcade_coin || 0,
        },
        fullname: userData.first_name + ' ' + userData.last_name,
        uuid: userData.id,
        avatar: userData?.image_url ?? userData?.temp_image ?? '',
        role: '',
        frame: DefaultImageFrames[0].src,
      },
      award: {
        consecutiveDays: streakLogin || 0,
        subject: currentSubject?.subject_name || '',
        trophy: achievement?.amount || 0,
      },
    };
    setProfile(newProfile);
  }, [streakLogin, achievement, userData, inventoryInfo, unreadAnnouncement]);

  useEffect(() => {
    if (image && showBackground) {
      setTimeout(() => {
        setImage('');
      }, 3000);
    }
  }, [image, showBackground]);

  const isModalActive = image && showBackground;

  return (
    <>
      {/* Safezone */}
      {!showFrame && (
        <>
          <Debug />
          <ButtonBack
            className="absolute top-[4.5rem] left-[6.5rem] w-16 h-16 z-10"
            buttonClassName="p-2"
            onClick={handleBack}
          />
        </>
      )}
      <div className="relative w-full h-full">
        <MainFrame
          showLogo={showLogo}
          allEquipped={allEquipped}
          refComponent={refComponent}
          userData={userData}
          profile={profile}
          frameUrl={frameUrl}
        />
      </div>
      {!showFrame && !isModalActive && (
        <div className="absolute bottom-[1rem] left-[11.5rem] w-[59rem] h-[6.5rem] z-50">
          <ShareMenu onClickPhoto={handleCapture} onClickShare={handleShare} />
        </div>
      )}
      <img
        src={image}
        alt={''}
        className={`absolute h-[90%] top-1/2 left-1/2 transform z-10 -translate-x-1/2 -translate-y-1/2 transition-all duration-500 ${
          isModalActive ? 'opacity-100 z-50' : 'opacity-0 -z-10'
        }`}
        style={{
          outline: isModalActive ? '9999rem solid rgba(0, 0, 0, 0.7)' : '',
        }}
      />
    </>
  );
};

export default DomainJSX;
export { DomainProfileShare as DomainProfileShare };
