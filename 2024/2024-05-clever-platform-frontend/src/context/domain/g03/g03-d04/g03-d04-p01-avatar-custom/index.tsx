import { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import ResponsiveScaler from 'skillvir-architecture-helper/library/game-core/helper/responsive-scaler';

import InventoryAPI from '@domain/g03/g03-d01/local/api/index.ts';
import {
  mapPetResponseToOutput,
  noSelectedPet,
  createPetMapper,
} from '@domain/g03/g03-d04/local/helper/mapPet';
import StoreGame from '@global/store/game';
import { useNavigate, useSearch } from '@tanstack/react-router';
import API from '../local/api';
//import { mapBadgeData } from '../local/helper/mapData';
import ButtonBack from '@component/web/atom/wc-a-button-back';
import SafezonePanel from '@component/web/atom/wc-a-safezone-panel';
import { UserData } from '@domain/g02/g02-d01/local/type';
import { DomainProfileShare } from '@domain/g03/g03-d01/g03-d01-p04-profile-share';
import {
  AllEquipped,
  IProfile,
} from '@domain/g03/g03-d01/g03-d01-p04-profile-share/type';
import StoreGlobal from '@store/global';
import StoreBackgroundMusic from '@store/global/background-music';
import StoreGlobalPersist from '@store/global/persist';
import StoreSubjects from '@store/global/subjects';
import { mapCouponResponseToOutput } from '../local/helper/mapCoupon';
import { createAvatarMapper } from '../local/helper/mapDataByGroup';
import { mapFrameResponseToOutput, noSelectedFrame } from '../local/helper/mapFrame';
import {
  AvatarOutput,
  BadgeOutput,
  BadgeResponse,
  CharacterOutput,
  CouponOutput,
  CouponResponse,
  FrameOutput,
  FrameResponse,
  InventoryInfo,
  PetOutput,
  RewardItem,
} from '../local/types';
import Avatar from './component/web/templates/wc-a-avatar';
import Debug from './component/web/templates/wc-a-debug';
import ModalAvatar from './component/web/templates/wc-a-modal-avatar';
import ModalGift from './component/web/templates/wc-a-modal-gift';
import Shop from './component/web/templates/wc-a-shop';
import ConfigJson from './config/index.json';
import ModalItem from './component/web/templates/wc-a-modal-avatar';
import { STATEFLOW } from './interfaces/stateflow.interface';
import {
  DefaultImageGift,
  DefaultImageGiftHistory,
} from './mockup/default-image-characters';
// import styles from './index.module.css';

const DomainJSX = () => {
  // searchs query
  const searchs = useSearch({ strict: false });
  // state flow
  const { stateFlow } = StoreGame.StateGet(['stateFlow']);
  const { userData } = StoreGlobalPersist.StateGet(['userData']) as {
    userData: UserData;
  };

  const { t, i18n } = useTranslation([ConfigJson.key]);
  const [imageList, setImageList] = useState<CharacterOutput[]>([]);
  const [imageCharactersList, setImageCharactersList] = useState<CharacterOutput[]>([]);
  const [imagePetsList, setImagePetsList] = useState<PetOutput[]>([]);
  const [imageFramesList, setImageFramesList] = useState<FrameOutput[]>([]);

  const [imageBadgesList, setImageBadgesList] = useState<BadgeOutput[]>([]);
  const [imageGiftList, setImageGiftList] = useState(DefaultImageGift);
  const [imageGiftHistoryList, setImageGiftHistoryList] = useState(
    DefaultImageGiftHistory,
  );
  const [selectedMenu, setSelectedMenu] = useState({});
  const [selectedCharacter, setSelectedCharacter] = useState<CharacterOutput | {}>({});
  const [selectedPet, setSelectedPet] = useState({});
  const [selectedFrame, setSelectedFrame] = useState<FrameOutput | null>(null);
  const [selectedHoner, setSelectedHoner] = useState({});
  const [selectedGift, setSelectedGift] = useState({});
  const [selectedRewardHistory, setSelectedRewardHistory] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [showModalGift, setShowModalGift] = useState(false);
  //const [isFrameActive, setIsFrameActive] = useState(false);

  //const [imageCouponList, setImageCouponList] = useState<CouponOutput[]>([]);
  const [avatarData, setAvatarData] = useState<AvatarOutput[]>([]);
  const [petData, setPetData] = useState<PetOutput[]>([]);
  const [frameData, setFrameData] = useState<FrameOutput[]>([]);
  const [badgeData, setBadgeData] = useState<BadgeOutput[]>([]);
  const [couponData, setCouponData] = useState<CouponOutput[]>([]);
  const [rewardHistoryData, SetRewardHistoryData] = useState<RewardItem[]>([]);

  const [imageAvatarList, setImageAvatarList] = useState<AvatarOutput[]>([]);
  const [imagePetList, setImagePetList] = useState<PetOutput[]>([]);
  const [imageFrameList, setImageFrameList] = useState<FrameOutput[]>([]);
  const [imageBadgeList, setImageBadgeList] = useState<BadgeOutput[]>([]);
  const [imageCouponList, setImageCouponList] = useState<CouponOutput[]>([]);
  const [imageRewardHistory, setImageRewardHistory] = useState<RewardItem[]>([]);

  const [inventoryInfo, setInventoryInfo] = useState<InventoryInfo>();
  // State definition ONLY for the array
  // State to hold only the array of log items
  const [logItems, setLogItems] = useState<RewardItem[] | null>(null);
  // Loading state
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Error state
  const [error, setError] = useState<string | null>(null);

  const [profile, setProfile] = useState<IProfile | undefined>(undefined);

  const [allEquipped, setAllEquipped] = useState<AllEquipped>({
    characters: null,
    badges: null,
    pets: null,
    frame: null,
  });

  const [showProfileShare, setShowProfileShare] = useState(false);

  // useEffect(() => {
  //   switch (stateFlow) {
  //     case STATEFLOW.Avatar:
  //       setSelectedItem(selectedCharacter, imageCharactersList, setSelectedCharacter);
  //       break;
  //     case STATEFLOW.Pet:
  //       setSelectedItem(selectedPet, imagePetsList, setSelectedPet);
  //       break;
  //     case STATEFLOW.Frame:
  //       setSelectedItem(selectedFrame, imageFramesList, setSelectedFrame);
  //       break;
  //     case STATEFLOW.Honer:
  //       setSelectedItem(selectedHoner, imageBadgesList, setSelectedHoner);
  //       break;
  //     case STATEFLOW.Gift:
  //       setSelectedMenu(selectedGift);
  //       break;
  //     default:
  //       setSelectedMenu({});
  //       break;
  //   }
  // }, [
  //   imageCharactersList,
  //   imageFramesList,
  //   imageBadgesList,
  //   imageList,
  //   imagePetsList,
  //   selectedCharacter,
  //   selectedFrame,
  //   selectedGift,
  //   selectedHoner,
  //   selectedPet,
  //   stateFlow,
  // ]);
  //
  // Add this sorting function to your code

  // Sort function for Pet API data
  const sortPetData = (petList: PetOutput[]): PetOutput[] => {
    // First element is often the "noSelectedPet", so we need to handle it separately
    const noSelected = petList.find((pet) => pet.name === 'NoSelected');
    const petsToSort = petList.filter((pet) => pet.name !== 'NoSelected');

    // Sort pets by pet_id
    const sortedPets = [...petsToSort].sort((a, b) => a.pet_id - b.pet_id);

    // Return with noSelected at the beginning if it exists
    return noSelected ? [noSelected, ...sortedPets] : sortedPets;
  };

  // Sort function for Frame and Badge API data
  const sortItemData = <T extends { item_id: number; name: string }>(
    itemList: T[],
  ): T[] => {
    // First element is often the "noSelected" item, so we need to handle it separately
    const noSelected = itemList.find((item) => item.name === 'NoSelected');
    const itemsToSort = itemList.filter((item) => item.name !== 'NoSelected');

    // Sort items by item_id
    const sortedItems = [...itemsToSort].sort((a, b) => a.item_id - b.item_id);

    // Return with noSelected at the beginning if it exists
    return noSelected ? [noSelected, ...sortedItems] : sortedItems;
  };

  const { currentSubject } = StoreSubjects.StateGet(['currentSubject']);
  useEffect(() => {
    // set background image by subject group id
    if (currentSubject?.seed_subject_group_id) {
      StoreGlobal.MethodGet().imageBackgroundUrlBySubjectGroupSet(
        currentSubject.seed_subject_group_id,
      );
    }
  }, [currentSubject]);

  useEffect(() => {
    console.log('image list: ', imageAvatarList);
    console.log('avatar data: ', avatarData);

    const characterSelected = avatarData.find((avatar) => avatar.selected);
    if (characterSelected) {
      console.log('Selected character found:', characterSelected);
      setSelectedCharacter(characterSelected);
    } else {
      console.log('No selected character found in avatarData');
    }

    const petSelected = petData.find((image) => image.selected);
    if (petSelected) setSelectedPet(petSelected);

    const frameSelected = imageFrameList.find((image) => image.selected);
    if (frameSelected) setSelectedFrame(frameSelected);

    const badgeSelected = imageBadgeList.find((image) => image.selected);
    if (badgeSelected) setSelectedHoner(badgeSelected);

    const couponSelected = imageCouponList.find((image) => image.selected);
    if (couponSelected) setSelectedGift(couponSelected);
  }, [avatarData, petData, frameData, badgeData, couponData, rewardHistoryData]);

  useEffect(() => {
    StoreGame.MethodGet().GameCanvasEnableSet(false);

    // set state flow directly to each tab if page query is available
    const { tab = '' } = searchs;
    switch (tab.toLowerCase()) {
      case 'pet':
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Pet);
        break;
      case 'frame':
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Frame);
        break;
      case 'honer':
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Honer);
        break;
      case 'gift':
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Gift);
        break;
      case 'gift-history':
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.GiftHistory);
        break;
      default:
        StoreGame.MethodGet().State.Flow.Set(STATEFLOW.Avatar);
    }

    InventoryAPI.mainMenu.GetInventoryInfo().then((response) => {
      const data = response.data;
      setInventoryInfo(data);
      console.log('Inventory info: ', data);
    });

    const mapAvatarWithTranslation = createAvatarMapper(t);

    // fetch character
    API.Character.CharacterAll.Get().then(async (res) => {
      if (res.status_code === 200) {
        try {
          // Map the response data to the desired structure using the translation-enabled mapper
          const mappedCharacter = res.data.map(mapAvatarWithTranslation);

          console.log('Mapped Character:', mappedCharacter);

          // Update the state or list with the mapped character data
          setImageAvatarList(mappedCharacter);
          setAvatarData(mappedCharacter);

          const selected = mappedCharacter.find((char) => char.selected);
          if (selected) {
            console.log('Initially selected character:', selected);
            setSelectedCharacter(selected);
          }
        } catch (error) {
          console.error('Error mapping character data:', error);
        }
      } else {
        console.error('Unexpected status code:', res.status_code);
      }
    });

    // fetch item pet
    API.Pet.petAll.Get().then((res) => {
      console.log('pet res', res);
      if (res.status_code === 200) {
        if (res.data === null) {
          setImagePetList([]);
          setPetData([]);
        } else {
          // Create mapper with translation support and full array of pets
          const mapPetWithTranslation = createPetMapper(t, res.data);

          // Map the response data with i18n support
          const mappedPet = res.data.map(mapPetWithTranslation);

          console.log('mappedPet with i18n: ', mappedPet);

          // Find the pet that should be selected

          // Prepend the noSelectedPet to the mapped pets
          const petList = [noSelectedPet, ...mappedPet];

          // Sort the pet list
          const sortedPetList = sortPetData(petList);
          console.log('sortedPetList: ', sortedPetList);

          setImagePetList(sortedPetList);
          setPetData(sortedPetList);
        }
      }
    });

    API.Frame.frameAll.Get().then(async (res) => {
      if (res.status_code === 200) {
        if (res.data === null) {
          setImageFrameList([]);
          setFrameData([]);
        } else {
          try {
            // Map the response data to the desired structure
            const mappedFrame = res.data.map((frame: FrameResponse) =>
              mapFrameResponseToOutput(frame),
            );

            const frameList = [noSelectedFrame, ...mappedFrame];

            // Sort the frame list
            const sortedFrameList = sortItemData(frameList);

            console.log('Mapped frame:', frameList);

            // Update the state or list with the mapped character data
            setImageFrameList(sortedFrameList);
            setFrameData(sortedFrameList); // Update the state with the updated data
          } catch (error) {
            console.error('Error mapping character data:', error);
          }
        }
      } else {
        console.error('Unexpected status code:', res.status_code);
      }
    });

    API.ItemBadge.ItemBadgeAll.Get().then(async (res) => {
      if (res.status_code === 200) {
        if (res.data === null) {
          setImageBadgeList([]);
          setBadgeData([]);
        } else {
          try {
            // Map the response data to the desired structure
            const mappedBadge = res.data.map((badge: BadgeResponse) =>
              mapFrameResponseToOutput(badge),
            );

            const badgeList = [noSelectedFrame, ...mappedBadge];

            // Sort the badge list
            const sortedBadgeList = sortItemData(badgeList);

            console.log('Mapped frame:', sortedBadgeList);

            // Update the state or list with the mapped character data
            setImageBadgeList(sortedBadgeList);
            setBadgeData(sortedBadgeList);
          } catch (error) {
            console.error('Error mapping character data:', error);
          }
        }
      } else {
        console.error('Unexpected status code:', res.status_code);
      }
    });

    API.Coupon.couponAll.Get().then(async (res) => {
      if (res.status_code === 200) {
        if (res.data === null) {
          setImageCouponList([]);
          setCouponData([]);
        } else {
          try {
            // Map the response data to the desired structure
            const mappedCoupon = res.data.map((coupon: CouponResponse) =>
              mapCouponResponseToOutput(coupon),
            );

            console.log('Mapped frame:', mappedCoupon);

            // Update the state or list with the mapped character data
            setImageCouponList(mappedCoupon);
            setCouponData(mappedCoupon); // Update the state with the updated data
          } catch (error) {
            console.error('Error mapping character data:', error);
          }
        }
      } else {
        console.error('Unexpected status code:', res.status_code);
      }
    });

    API.Log.logsAll
      .Get()
      .then((res) => {
        // 'res' is the raw response from your API wrapper
        console.log('Raw Logs API response:', res);

        // --- Success Check ---
        // **IMPORTANT**: Adapt this check based on how YOUR API signals success.
        // Does it return a specific status_code? A 'success: true' boolean?
        // The `res === true` part seems unusual unless the API literally returns boolean true.
        // Using a status code check is more standard. Add Array.isArray for safety.
        if (
          res &&
          /* res.success === true || */ res.status_code >= 200 &&
          res.status_code < 300 &&
          res.data &&
          Array.isArray(res.data)
        ) {
          // If successful and data is an array, proceed

          console.log('Logs api response successful, extracting data: ', res.data);
          // Set the state with JUST the array of items.
          // We assume here that res.data contains items matching RewardItem[].
          // You might need a type assertion if 'res' type is 'any'
          SetRewardHistoryData(res.data as RewardItem[]);
          setImageRewardHistory(res.data as RewardItem[]);
          setLogItems(res.data as RewardItem[]);
        } else {
          // Handle cases where the API call technically succeeded (e.g., status 200 OK)
          // but the response body indicates an application-level failure or unexpected structure.
          const errorMessage =
            (res as any)?.message || 'API request failed or returned unexpected data.'; // Attempt to get a message from the response
          console.error(
            'API indicated failure or bad data:',
            errorMessage,
            'Response:',
            res,
          );
          setError(errorMessage);
          setLogItems(null); // Ensure state is null on logical error
        }
      })
      .catch((err) => {
        // Handle network errors or other exceptions during the fetch/promise chain
        console.error('Error fetching logs:', err);
        // Safely get error message
        setError(
          err instanceof Error ? err.message : 'An unknown network error occurred.',
        );
        setLogItems(null); // Clear data state in case of network error
      })
      .finally(() => {
        // This runs regardless of success or failure
        setIsLoading(false);
        console.log('Finished fetching logs attempt.');
      });
    StoreBackgroundMusic.MethodGet().playSound('cartoon_intro_3');
  }, []); // Make sure to provide an appropriate dependency array

  console.log('Reward History Item: ', rewardHistoryData);

  const setSelectedItem = (state: any, defaultItems: any, setSelected: any) => {
    // setSelected(state);
    setSelectedMenu(state);
    if (Object.keys(state).length === 0) {
      const item = defaultItems.find((item: { selected: any }) => item.selected);
      if (item) setSelected(item);
    }
  };

  const onHandleClickMenu = (menu: number) => {
    StoreGame.MethodGet().State.Flow.Set(menu);
    switch (menu) {
      case STATEFLOW.Avatar:
        setImageAvatarList(avatarData);
        break;
      case STATEFLOW.Pet:
        setImagePetList(petData);
        break;
      case STATEFLOW.Frame:
        setImageFrameList(frameData);
        break;
      case STATEFLOW.Honer:
        setImageBadgeList(badgeData);
        break;
      case STATEFLOW.Gift:
        setImageCouponList(couponData);
        break;
      case STATEFLOW.GiftHistory:
        setImageCouponList(couponData);
        break;
      default:
        break;
    }
  };

  // Add these refresh functions to your component
  const refreshData = async (updateInfo: any) => {
    console.log('Refreshing data based on update:', updateInfo);

    // Start loading state
    setIsLoading(true);

    try {
      const { stateFlow, action } = updateInfo;

      // Refresh inventory info first
      await InventoryAPI.mainMenu.GetInventoryInfo().then((response) => {
        const data = response.data;
        setInventoryInfo(data);
        console.log('Updated Inventory info: ', data);
      });

      // Then refresh the specific data based on stateFlow
      switch (stateFlow) {
        case STATEFLOW.Avatar:
          console.log('Refreshing Avatar data...');
          await refreshAvatarData();
          break;
        case STATEFLOW.Pet:
          console.log('Refreshing Pet data...');
          await refreshPetData();
          break;
        case STATEFLOW.Frame:
          console.log('Refreshing Frame data...');
          await refreshFrameData();
          break;
        case STATEFLOW.Honer:
          console.log('Refreshing Badge data...');
          await refreshBadgeData();
          break;
        case STATEFLOW.Gift:
          console.log('Refreshing Coupon data...');
          await refreshCouponData();
          break;
        case STATEFLOW.GiftHistory:
          console.log('Refreshing Reward History data...');
          await refreshRewardHistoryData();
          break;
      }

      console.log('All data refreshed successfully');
      return true;
    } catch (error) {
      console.error('Error during data refresh:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Add these refresh functions for each type of data
  const refreshAvatarData = async () => {
    try {
      const res = await API.Character.CharacterAll.Get();
      if (res.status_code === 200) {
        const mapAvatarWithTranslation = createAvatarMapper(t);
        const mappedCharacter = res.data.map(mapAvatarWithTranslation);

        setImageAvatarList(mappedCharacter);
        setAvatarData(mappedCharacter);

        const selected = mappedCharacter.find((char) => char.selected);
        if (selected) {
          console.log('Updated selected character:', selected);
          setSelectedCharacter(selected);
        }

        return mappedCharacter;
      }
    } catch (error) {
      console.error('Error refreshing avatar data:', error);
    }
    return null;
  };

  const refreshPetData = async () => {
    try {
      const res = await API.Pet.petAll.Get();
      if (res.status_code === 200) {
        // Create mapper with translation support and full array of pets
        const mapPetWithTranslation = createPetMapper(t, res.data);

        // Map the response data with i18n support
        const mappedPet = res.data.map(mapPetWithTranslation);
        const petList = [noSelectedPet, ...mappedPet];

        // Apply sorting to ensure stable order
        const sortedPetList = sortPetData(petList);

        setImagePetList(sortedPetList);
        setPetData(sortedPetList);

        // Update selected pet if needed
        const petSelected = sortedPetList.find((pet) => pet.selected);
        if (petSelected) setSelectedPet(petSelected);

        return sortedPetList;
      }
    } catch (error) {
      console.error('Error refreshing pet data:', error);
    }
    return null;
  };

  const refreshFrameData = async () => {
    try {
      const res = await API.Frame.frameAll.Get();
      if (res.status_code === 200) {
        const mappedFrame = res.data.map((frame: FrameResponse) =>
          mapFrameResponseToOutput(frame),
        );
        const frameList = [noSelectedFrame, ...mappedFrame];

        // Apply sorting to ensure stable order
        const sortedFrameList = sortItemData(frameList);

        setImageFrameList(sortedFrameList);
        setFrameData(sortedFrameList);

        // Update selected frame if needed
        const frameSelected = sortedFrameList.find((frame) => frame.selected);
        if (frameSelected) setSelectedFrame(frameSelected);

        return sortedFrameList;
      }
    } catch (error) {
      console.error('Error refreshing frame data:', error);
    }
    return null;
  };

  const refreshBadgeData = async () => {
    try {
      const res = await API.ItemBadge.ItemBadgeAll.Get();
      if (res.status_code === 200) {
        const mappedBadge = res.data.map((badge: BadgeResponse) =>
          mapFrameResponseToOutput(badge),
        );
        const badgeList = [noSelectedFrame, ...mappedBadge];

        // Apply sorting to ensure stable order
        const sortedBadgeList = sortItemData(badgeList);

        setImageBadgeList(sortedBadgeList);
        setBadgeData(sortedBadgeList);

        // Update selected badge if needed
        const badgeSelected = sortedBadgeList.find((badge) => badge.selected);
        if (badgeSelected) setSelectedHoner(badgeSelected);

        return sortedBadgeList;
      }
    } catch (error) {
      console.error('Error refreshing badge data:', error);
    }
    return null;
  };

  const refreshCouponData = async () => {
    try {
      const res = await API.Coupon.couponAll.Get();
      if (res.status_code === 200) {
        if (res.data === null) {
          setImageCouponList([]);
          setCouponData([]);
          return [];
        } else {
          const mappedCoupon = res.data.map((coupon: CouponResponse) =>
            mapCouponResponseToOutput(coupon),
          );

          setImageCouponList(mappedCoupon);
          setCouponData(mappedCoupon);

          // Update selected coupon if needed
          const couponSelected = mappedCoupon.find((coupon) => coupon.selected);
          if (couponSelected) setSelectedGift(couponSelected);

          return mappedCoupon;
        }
      }
    } catch (error) {
      console.error('Error refreshing coupon data:', error);
    }
    return null;
  };

  const refreshRewardHistoryData = async () => {
    try {
      const res = await API.Log.logsAll.Get();
      if (
        res &&
        res.status_code >= 200 &&
        res.status_code < 300 &&
        res.data &&
        Array.isArray(res.data)
      ) {
        SetRewardHistoryData(res.data as RewardItem[]);
        setImageRewardHistory(res.data as RewardItem[]);
        setLogItems(res.data as RewardItem[]);
        return res.data;
      }
    } catch (error) {
      console.error('Error refreshing reward history data:', error);
    }
    return null;
  };

  // Update the handleSave function to return a Promise
  const handleSaveAsync = async () => {
    console.log('Handling save operation');

    try {
      let response;

      switch (stateFlow) {
        case STATEFLOW.Avatar:
          console.log('Saving character:', selectedCharacter);
          const selectedCharacterTyped = selectedCharacter as CharacterOutput;
          response = await API.Character.UpdateCharacter.Patch(
            selectedCharacterTyped.id,
            true,
          );
          break;
        case STATEFLOW.Pet:
          console.log('Saving pet:', selectedPet);
          const selectedPetTyped = selectedPet as PetOutput;
          response = await API.Pet.UpdatePet.Patch(selectedPetTyped.pet_id, true);
          break;
        case STATEFLOW.Frame:
          console.log('Saving frame:', selectedFrame);
          if (!selectedFrame) {
            return null;
          }
          const selectedFrameTyped = selectedFrame as FrameOutput;
          response = await API.Frame.UpdateFrame.Patch(selectedFrameTyped.item_id, true);
          break;
        case STATEFLOW.Honer:
          console.log('Saving badge:', selectedHoner);
          const selectedHonerTyped = selectedHoner as BadgeOutput;
          response = await API.ItemBadge.UpdateItemBadge.Patch(
            selectedHonerTyped.item_id,
            true,
          );
          break;
        case STATEFLOW.Gift:
          console.log('Saving coupon:', selectedGift);
          if (!selectedGift) {
            return null;
          }
          const selectedCouponTyped = selectedGift as CouponOutput;
          response = await API.Coupon.UpdateCoupon.Patch(
            selectedCouponTyped.item_id,
            true,
          );
          break;
        default:
          return null;
      }

      console.log('Save response:', response);
      return response;
    } catch (error) {
      console.error('Error in handleSave:', error);
      return null;
    }
  };

  const onSetSelectedCharacter = (character: any) => {
    setSelectedCharacter(character);
    //setIsFrameActive(false); // Deactivate frame when selecting character
  };

  const onSetSelectedPet = (pet: any) => {
    setSelectedPet(pet);
    //setIsFrameActive(false); // Deactivate frame when selecting pet
  };

  const onSetSelectedFrame = (frame: any) => {
    setSelectedFrame(frame);
    //setIsFrameActive(true); // Activate frame when selecting frame
  };

  const onSetSelectedBadge = (badge: any) => {
    setSelectedHoner(badge);
    //setIsFrameActive(false); // Activate frame when selecting frame
  };

  const onSetSelectedCoupon = (coupon: any) => {
    setShowModalGift(true);

    setSelectedGift(coupon);
    //setIsFrameActive(false); // Activate frame when selecting frame
  };

  const onSetSelectedRewardHistory = (rewardLogs: any) => {
    setSelectedRewardHistory(rewardLogs);
    //setIsFrameActive(false); // Activate frame when selecting frame
  };

  const handleSelect = (item: any) => {
    if (stateFlow === STATEFLOW.Avatar) {
      onSetSelectedCharacter(item);
    } else if (stateFlow === STATEFLOW.Pet) {
      onSetSelectedPet(item);
    } else if (stateFlow === STATEFLOW.Frame) {
      onSetSelectedFrame(item);
    } else if (stateFlow === STATEFLOW.Honer) {
      onSetSelectedBadge(item);
    } else if (stateFlow === STATEFLOW.Gift) {
      onSetSelectedCoupon(item);
    } else if (stateFlow === STATEFLOW.GiftHistory) {
      onSetSelectedRewardHistory(item);
    }
    console.log('handleSelect: ', item);
  };

  const onSetSelected = (item: any) => {
    switch (stateFlow) {
      case STATEFLOW.Avatar:
        setSelectedCharacter(item);
        break;
      case STATEFLOW.Pet:
        setSelectedPet(item);
        break;
      case STATEFLOW.Frame:
        setSelectedFrame(item);
        break;
      case STATEFLOW.Honer:
        setSelectedHoner(item);
        break;
      case STATEFLOW.Gift:
        setShowModalGift(true);
        setSelectedGift(item);
        break;
      default:
        break;
    }
    setSelectedMenu(item);
  };

  const navigate = useNavigate();

  const handleBack = () => {
    // const state = stateFlow == STATEFLOW.Avatar ? 1 : 2;
    // if (state <= 1) return;
    // StoreGame.MethodGet().State.Flow.Set(stateFlow - 1);
    navigate({ to: '/main-menu', viewTransition: true });
  };

  const handleSave = async () => {
    // on save
    switch (stateFlow) {
      case STATEFLOW.Avatar:
        console.log('selectedCharacter: ', selectedCharacter);
        const selectedCharacterTyped = selectedCharacter as CharacterOutput;
        await API.Character.UpdateCharacter.Patch(selectedCharacterTyped.id, true);
        break;
      case STATEFLOW.Pet:
        console.log('selectedPet: ', selectedPet);
        const selectedPetTyped = selectedPet as PetOutput;
        await API.Pet.UpdatePet.Patch(selectedPetTyped.pet_id, true);
        break;
      case STATEFLOW.Frame:
        console.log('Selected Frame:', selectedFrame);

        // Validate selectedFrame and item_id
        if (!selectedFrame || !selectedFrame) {
          console.error('Invalid selectedFrame or item_id is missing:', selectedFrame);
          alert('Please select a valid frame before proceeding.');
          break;
        }

        // Properly typecast selectedFrame
        const selectedFrameTyped: FrameOutput = selectedFrame as FrameOutput;

        // Call the API with the valid item_id
        await API.Frame.UpdateFrame.Patch(selectedFrameTyped.item_id, true);
        break;

      case STATEFLOW.Honer:
        // console.log('selectedHoner: ', selectedHoner);
        const selectedHonerTyped = selectedHoner as BadgeOutput;
        // let tempId: number | undefined;
        // if (selectedHonerTyped.name != 'NoSelected') tempId = selectedHonerTyped.id;
        // else tempId = imageBadgesList.find((item) => item.selected)?.id;
        // await API.ItemBadge.UpdateItemBadge.Patch(
        //   tempId,
        //   selectedHonerTyped.name != 'NoSelected',
        // );
        await API.ItemBadge.UpdateItemBadge.Patch(selectedHonerTyped.item_id, true);
        break;
      case STATEFLOW.Gift:
        console.log('Selected Coupon:', selectedGift);

        // Validate selectedFrame and item_id
        if (!selectedGift || !selectedGift) {
          console.error('Invalid selectedFrame or item_id is missing:', selectedGift);
          alert('Please select a valid frame before proceeding.');
          break;
        }

        // Properly typecast selectedFrame
        const selectedCouponTyped: CouponOutput = selectedGift as CouponOutput;

        // Call the API with the valid item_id
        await API.Coupon.UpdateCoupon.Patch(selectedCouponTyped.item_id, true);
        break;
      default:
        break;
    }

    //handleBack();
  };

  const handleBuy = () => {
    // on buy
    handleBack();
  };

  const selectedItem =
    stateFlow === STATEFLOW.Avatar
      ? selectedCharacter
      : stateFlow === STATEFLOW.Pet
        ? selectedPet
        : stateFlow === STATEFLOW.Frame
          ? selectedFrame
          : stateFlow === STATEFLOW.Honer
            ? selectedHoner // Assuming `selectedHoner` exists
            : stateFlow === STATEFLOW.Gift
              ? selectedGift // Assuming `selectedGift` exists
              : stateFlow === STATEFLOW.GiftHistory
                ? selectedRewardHistory // Assuming `selectedGift` exists
                : null; // Default to null

  const handleUseItem = () => {
    console.log('handleUseItem', selectedGift);
  };

  const isModalActive = showModal || showModalGift || showProfileShare;

  const isFrameActive = stateFlow === STATEFLOW.Frame;

  const itemType =
    stateFlow === STATEFLOW.Avatar
      ? 'character'
      : stateFlow === STATEFLOW.Pet
        ? 'pet'
        : stateFlow === STATEFLOW.Frame
          ? 'frame'
          : stateFlow === STATEFLOW.Honer
            ? 'badge'
            : stateFlow === STATEFLOW.Gift
              ? 'coupon'
              : ''; // Default to an empty string

  return (
    <ResponsiveScaler scenarioSize={{ width: 1280, height: 720 }} className="flex-1 body">
      {/* overlay modal */}
      {isModalActive && <div className="absolute inset-0 bg-black opacity-70 z-10"></div>}

      <SafezonePanel
        id="main-modal"
        className={`relative inset-0 h-full w-full ${isModalActive ? 'z-50' : ''}`}
      >
        <ModalItem
          setShowModal={setShowModal}
          showModal={showModal}
          selectedItem={selectedItem} // Pass the currently selected item (character, pet, frame, etc.)
          itemType={itemType} // Pass the type of the selected item ('character', 'pet', 'frame', etc.)
        />
        <ModalGift
          setShowModal={setShowModalGift}
          showModal={showModalGift}
          selectedGift={selectedGift}
          handleUseItem={handleUseItem}
          onOk={undefined}
          couponData={couponData}
          selected={selectedItem}
        />
        {showProfileShare && (
          <div className="">
            <ButtonBack
              className="absolute top-[4.5rem] left-[6.5rem] w-16 h-16 z-10"
              buttonClassName="p-2"
              onClick={() => setShowProfileShare(false)}
            />
            <DomainProfileShare
              showLogo={true}
              showFrame={true}
              frameUrl={
                selectedFrame?.name !== 'NoSelected'
                  ? selectedFrame?.image_url
                  : 'NoSelected'
              }
              allEquipped={allEquipped}
              setAllEquipped={setAllEquipped}
              profile={profile}
              setProfile={setProfile}
              userData={userData}
            />
          </div>
        )}
      </SafezonePanel>

      <SafezonePanel className="inset-0 text-black">
        <Debug />
        <div
          className={`absolute h-[calc(100%-120px)] w-[calc(100%-790px)] top-[68px] left-[5.5rem]`}
        >
          <Avatar
            selectedCharacter={selectedCharacter}
            selectedPet={selectedPet}
            selectedFrame={selectedFrame}
            selectedBadge={selectedHoner}
            handleBack={handleBack}
            isFrameActive={isFrameActive}
            avatarData={avatarData}
            petData={petData}
            onUpdate={async (updateInfo) => {
              console.log('Update requested from Avatar component:', updateInfo);

              // If this is a save action, handle it first
              if (updateInfo.action === 'save') {
                const item = updateInfo.item;
                if (!item) return false;

                try {
                  let response;

                  switch (stateFlow) {
                    case STATEFLOW.Avatar:
                      response = await API.Character.UpdateCharacter.Patch(item.id, true);
                      break;
                    case STATEFLOW.Pet:
                      response = await API.Pet.UpdatePet.Patch(item.pet_id, true);
                      break;
                    case STATEFLOW.Frame:
                      response = await API.Frame.UpdateFrame.Patch(item.item_id, true);
                      break;
                    case STATEFLOW.Honer:
                      response = await API.ItemBadge.UpdateItemBadge.Patch(
                        item.item_id,
                        true,
                      );
                      break;
                    case STATEFLOW.Gift:
                      response = await API.Coupon.UpdateCoupon.Patch(item.item_id, true);
                      break;
                  }

                  console.log('Save action response:', response);

                  // If save was successful, refresh the data
                  if (response && response.status_code === 200) {
                    await refreshData(updateInfo);
                    return true;
                  }

                  return false;
                } catch (error) {
                  console.error('Error handling save action:', error);
                  return false;
                }
              }

              // For other update types, just refresh the data
              return await refreshData(updateInfo);
            }}
          />
        </div>
        <div
          className={`absolute h-[calc(100%-110px)] w-[calc(100%-625px)] top-[50px] left-[36.5rem]`}
        >
          <Shop
            STATEFLOW={STATEFLOW}
            onHandleClickMenu={onHandleClickMenu}
            stateFlow={stateFlow}
            imageList={
              stateFlow === STATEFLOW.Avatar
                ? imageAvatarList
                : stateFlow === STATEFLOW.Pet
                  ? imagePetList
                  : stateFlow === STATEFLOW.Frame
                    ? imageFrameList
                    : stateFlow === STATEFLOW.Honer
                      ? imageBadgeList
                      : stateFlow === STATEFLOW.Gift
                        ? imageCouponList
                        : stateFlow === STATEFLOW.GiftHistory
                          ? imageRewardHistory
                          : [] // Default empty array for unexpected values
            }
            onSelect={handleSelect}
            selected={selectedItem}
            setShowModal={setShowModal}
            inventory={inventoryInfo}
            rewardLogs={rewardHistoryData}
            petData={petData}
            setShowProfileShare={setShowProfileShare}
          />
        </div>
      </SafezonePanel>
    </ResponsiveScaler>
  );
};

export default DomainJSX;
